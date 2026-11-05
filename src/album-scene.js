import {
  CanvasTexture,
  Color,
  DirectionalLight,
  BufferGeometry,
  Group,
  LineDashedMaterial,
  LineSegments,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  OrthographicCamera,
  PCFSoftShadowMap,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  ShadowMaterial,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// The framing box (world units on the view plane). The CSS still image is rendered
// at exactly this aspect and shown with object-fit: contain, so the still and the
// live canvas line up at every stage size.
export const FRAME = { width: 4.05, height: 2.4 };
// On portrait stages (phones) the frame is narrowed so the book reads larger. The
// CSS still is scaled by FRAME.width / NARROW_WIDTH there (--hero-still-scale).
const NARROW_WIDTH = 3.4;

const BOARD = { width: 1.46, depth: 2.06, thickness: 0.05 };
const BLOCK = { width: 1.4, depth: 1.98, thickness: 0.09 };
const PAGE = { width: 1.38, depth: 1.96 };
const HINGE_Y = BLOCK.thickness + BOARD.thickness / 2;

function cssValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadImage(loader, path) {
  return new Promise((resolve, reject) => {
    loader.load(path, (texture) => resolve(texture), undefined, reject);
  });
}

function canvas2d(width, height) {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  const context = element.getContext('2d', { alpha: false });
  if (!context) throw new Error('2D canvas unavailable');
  return [element, context];
}

// A full-bleed print, cover-fitted to the page like a flush-mount spread.
async function pageTexture(loader, path) {
  const loaded = await loadImage(loader, path);
  const photo = loaded.image;
  const [page, context] = canvas2d(690, 980);
  context.fillStyle = cssValue('--page-paper');
  context.fillRect(0, 0, page.width, page.height);
  const scale = Math.max(page.width / photo.width, page.height / photo.height);
  const width = photo.width * scale;
  const height = photo.height * scale;
  context.drawImage(photo, (page.width - width) / 2, (page.height - height) / 2, width, height);
  loaded.dispose();
  const texture = new CanvasTexture(page);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// Fine horizontal lines for the stacked page edges.
function pageEdgeTexture() {
  const [edge, context] = canvas2d(8, 128);
  context.fillStyle = cssValue('--page-paper');
  context.fillRect(0, 0, 8, 128);
  context.fillStyle = cssValue('--page-edge');
  for (let y = 0; y < 128; y += 4) context.fillRect(0, y, 8, 1);
  const texture = new CanvasTexture(edge);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

// Low-amplitude noise used as a bump map, so the leather catches light unevenly.
function leatherBump() {
  const [bump, context] = canvas2d(256, 256);
  const pixels = context.createImageData(256, 256);
  let seed = 7;
  for (let index = 0; index < pixels.data.length; index += 4) {
    seed = (seed * 16807) % 2147483647;
    const value = 118 + (seed % 20);
    pixels.data[index] = value;
    pixels.data[index + 1] = value;
    pixels.data[index + 2] = value;
    pixels.data[index + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(bump);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 4);
  return texture;
}

// Premium easing, cubic-bezier(0.4, 0, 0.2, 1), solved for x.
function ease(value) {
  const cubic = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  const slope = (t, a, b) => 3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t ** 2 * (1 - b);
  let t = value;
  for (let step = 0; step < 6; step += 1) {
    const d = slope(t, 0.4, 0.2);
    if (Math.abs(d) < 1e-6) break;
    t = MathUtils.clamp(t - (cubic(t, 0.4, 0.2) - value) / d, 0, 1);
  }
  return cubic(t, 0, 1);
}

// A stitched border inset from the cover edge, on the cover's outer face.
function coverStitching(y) {
  const inset = 0.09;
  const x0 = -BOARD.width + inset;
  const x1 = -inset - 0.06;
  const z0 = -BOARD.depth / 2 + inset;
  const z1 = BOARD.depth / 2 - inset;
  const corners = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => new Vector3(x, y, z));
  const points = corners.flatMap((point, index) => [point, corners[(index + 1) % 4]]);
  const line = new LineSegments(
    new BufferGeometry().setFromPoints(points),
    new LineDashedMaterial({ color: new Color(cssValue('--page-edge')), dashSize: 0.022, gapSize: 0.018, transparent: true, opacity: 0.55 }),
  );
  line.computeLineDistances();
  return line;
}

export async function openAlbumScene(canvas, initialImages, { reducedMotion = false, onReady = () => {} } = {}) {
  const stage = canvas.parentElement;
  const loader = new TextureLoader();
  const [leftPhoto, rightPhoto] = await Promise.all(initialImages.map((path) => pageTexture(loader, path)));

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 40);
  camera.position.set(0.2, 7, 3.2);
  camera.lookAt(0, 0.12, 0.02);

  scene.add(new HemisphereLight(new Color(cssValue('--surface')), new Color(cssValue('--border')), 2.1));
  const key = new DirectionalLight(new Color(cssValue('--surface')), 2.4);
  key.position.set(-2.6, 6.5, 2.2);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 14 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.01;
  scene.add(key);

  const ground = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.14 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const bump = leatherBump();
  const edges = pageEdgeTexture();
  const leather = new MeshStandardMaterial({
    color: new Color(cssValue('--cover-leather')), roughness: 0.78, metalness: 0, bumpMap: bump, bumpScale: 0.6,
  });
  const paper = new MeshStandardMaterial({ color: new Color(cssValue('--page-paper')), roughness: 0.95 });
  const edge = new MeshStandardMaterial({ color: new Color(cssValue('--surface')), map: edges, roughness: 0.95 });
  // BoxGeometry material order: +x, -x, +y, -y, +z, -z.
  const blockMaterials = [edge, edge, paper, paper, edge, edge];
  const printMaterial = (map) => new MeshStandardMaterial({ map, roughness: 0.6, metalness: 0 });

  const boardGeometry = new RoundedBoxGeometry(BOARD.width, BOARD.thickness, BOARD.depth, 3, 0.018);
  const blockGeometry = new RoundedBoxGeometry(BLOCK.width, BLOCK.thickness, BLOCK.depth, 2, 0.006);
  const pageGeometry = new PlaneGeometry(PAGE.width, PAGE.depth);
  const spineHeight = (BLOCK.thickness + BOARD.thickness) * 2;
  const spineGeometry = new RoundedBoxGeometry(0.12, spineHeight, BOARD.depth, 3, 0.04);
  spineGeometry.translate(0, spineHeight / 2, 0);

  const shade = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

  const album = new Group();
  album.rotation.y = -0.1;
  scene.add(album);

  // Back half: rests on the table, never moves.
  const backBoard = shade(new Mesh(boardGeometry, leather));
  backBoard.position.set(BOARD.width / 2, BOARD.thickness / 2, 0);
  const backBlock = shade(new Mesh(blockGeometry, blockMaterials));
  backBlock.position.set(BLOCK.width / 2 + 0.02, BOARD.thickness + BLOCK.thickness / 2, 0);
  // The top right-hand leaf is hinged at the spine so it can lift as the cover passes.
  const rightLeaf = new Group();
  rightLeaf.position.y = BOARD.thickness + BLOCK.thickness + 0.001;
  const rightPage = shade(new Mesh(pageGeometry, printMaterial(rightPhoto)));
  rightPage.rotation.x = -Math.PI / 2;
  rightPage.position.set(PAGE.width / 2 + 0.03, 0, 0);
  rightLeaf.add(rightPage);
  const spine = shade(new Mesh(spineGeometry, leather));
  spine.position.set(0, 0, 0);
  album.add(backBoard, backBlock, rightLeaf, spine);

  // Front half: hinged at the spine. rotation.z = -PI is closed (lying on the back
  // half, cover up); 0 is open (lying flat to the left).
  const front = new Group();
  front.position.y = HINGE_Y;
  const frontBoard = shade(new Mesh(boardGeometry, leather));
  frontBoard.position.set(-BOARD.width / 2, BOARD.thickness / 2 - HINGE_Y, 0);
  const frontBlock = shade(new Mesh(blockGeometry, blockMaterials));
  frontBlock.position.set(-BLOCK.width / 2 - 0.02, BOARD.thickness + BLOCK.thickness / 2 - HINGE_Y, 0);
  const leftPage = shade(new Mesh(pageGeometry, printMaterial(leftPhoto)));
  leftPage.rotation.x = -Math.PI / 2;
  leftPage.position.set(-PAGE.width / 2 - 0.03, BOARD.thickness + BLOCK.thickness + 0.001 - HINGE_Y, 0);
  front.add(frontBoard, frontBlock, leftPage, coverStitching(-HINGE_Y - 0.002));
  album.add(front);

  // Fit the FRAME box inside the stage (contain), matching the still image.
  const fit = () => {
    const { width, height } = stage.getBoundingClientRect();
    const aspect = Math.max(1, width) / Math.max(1, height);
    const frameWidth = aspect < 1 ? NARROW_WIDTH : FRAME.width;
    const frameAspect = frameWidth / FRAME.height;
    const viewHeight = aspect > frameAspect ? FRAME.height : frameWidth / aspect;
    const viewWidth = viewHeight * aspect;
    Object.assign(camera, { left: -viewWidth / 2, right: viewWidth / 2, top: viewHeight / 2, bottom: -viewHeight / 2 });
    camera.updateProjectionMatrix();
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    renderer.render(scene, camera);
  };

  const pose = (progress, settle) => {
    front.rotation.z = -Math.PI * (1 - progress);
    // Closed, the book sits centred; it slides by half a board as it opens so the
    // open spread ends centred too. The spine drops below the page line when open.
    album.position.x = -(BOARD.width / 2) * (1 - progress);
    spine.scale.y = MathUtils.lerp(1, 0.4, progress);
    // The top right-hand leaf lifts slightly as the cover passes, then settles flat.
    rightLeaf.rotation.z = 0.07 * Math.sin(settle * Math.PI);
  };

  fit();
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(stage);

  let frame = 0;
  const controller = {
    async setPageImages(paths) {
      try {
        const [left, right] = await Promise.all(paths.map((path) => pageTexture(loader, path)));
        for (const [mesh, map] of [[leftPage, left], [rightPage, right]]) {
          const old = mesh.material;
          mesh.material = printMaterial(map);
          old.map?.dispose();
          old.dispose();
        }
        renderer.render(scene, camera);
      } catch {
        // Keep the spread already on screen if an optional image fails to load.
      }
    },
    dispose() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        object.geometry?.dispose();
        for (const material of [].concat(object.material ?? [])) {
          material.map?.dispose();
          material.dispose();
        }
      });
      bump.dispose();
      renderer.dispose();
    },
  };

  if (reducedMotion) {
    pose(1, 0);
    renderer.render(scene, camera);
    onReady();
    return controller;
  }

  // Scroll-driven opening. The page reports a target (0 closed, 1 open) and two
  // critically damped springs follow it from their current value, so the motion is
  // interruptible and reversible with no overshoot. The leaf spring is softer than
  // the cover's, giving a little follow-through.
  const cover = { value: 0, velocity: 0, omega: 13 };
  const leaf = { value: 0, velocity: 0, omega: 8 };
  let target = 0;
  let last = 0;
  const step = (spring, dt) => {
    const force = -spring.omega * spring.omega * (spring.value - target) - 2 * spring.omega * spring.velocity;
    spring.velocity += force * dt;
    spring.value += spring.velocity * dt;
  };
  const settled = (spring) => Math.abs(spring.value - target) < 1e-4 && Math.abs(spring.velocity) < 1e-3;
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    step(cover, dt);
    step(leaf, dt);
    if (settled(cover) && settled(leaf)) {
      cover.value = leaf.value = target;
      cover.velocity = leaf.velocity = 0;
      frame = 0;
    } else {
      frame = requestAnimationFrame(tick);
    }
    pose(ease(MathUtils.clamp(cover.value, 0, 1)), MathUtils.clamp(leaf.value, 0, 1));
    renderer.render(scene, camera);
  };
  controller.setProgress = (value, { immediate = false } = {}) => {
    target = MathUtils.clamp(value, 0, 1);
    if (immediate) {
      cover.value = leaf.value = target;
      cover.velocity = leaf.velocity = 0;
      pose(ease(target), 0);
      renderer.render(scene, camera);
      return;
    }
    if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  pose(0, 0);
  renderer.render(scene, camera);
  onReady();
  return controller;
}
