import {
  BackSide,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  FrontSide,
  Group,
  HemisphereLight,
  LineDashedMaterial,
  LineSegments,
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
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// The framing box (world units on the view plane). The CSS still image is rendered
// at exactly this aspect and shown with object-fit: contain, so the still and the
// live canvas line up at every stage size.
export const FRAME = { width: 3.4, height: 2.8 };

const BOARD = { width: 1.46, depth: 2.06, thickness: 0.05 };
const BLOCK = { width: 1.4, depth: 1.98, thickness: 0.09 };
const PAGE = { width: 1.38, depth: 1.96, inset: 0.03 };
const SURFACE = BOARD.thickness + BLOCK.thickness;
const HINGE_Y = SURFACE + 0.006;
const LEAF_GAP = 0.0014;
const LEAF_SEGMENTS = 40;
const TEXTURE = { width: 900, height: 1280 };

function cssValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadImage(src) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  return image.decode().then(() => image);
}

function canvas2d(width, height) {
  const element = document.createElement('canvas');
  element.width = width;
  element.height = height;
  const context = element.getContext('2d', { alpha: false });
  if (!context) throw new Error('2D canvas unavailable');
  return [element, context];
}

// Draws an image to fill a box, cropped around a focus point and optionally zoomed.
function drawCover(context, image, x, y, width, height, focus = [0.5, 0.5], zoom = 1) {
  const scale = Math.max(width / image.width, height / image.height) * zoom;
  const sw = width / scale;
  const sh = height / scale;
  const sx = MathUtils.clamp(focus[0] * image.width - sw / 2, 0, image.width - sw);
  const sy = MathUtils.clamp(focus[1] * image.height - sh / 2, 0, image.height - sh);
  context.drawImage(image, sx, sy, sw, sh, x, y, width, height);
}

function blankPage() {
  const [page, context] = canvas2d(TEXTURE.width, TEXTURE.height);
  context.fillStyle = cssValue('--page-paper');
  context.fillRect(0, 0, page.width, page.height);
  return [page, context];
}

// One page of a spread, in one of the album layouts named in content.js.
function paintPage(spec, images) {
  const [page, context] = blankPage();
  const { width, height } = page;
  const margin = Math.round(width * 0.1);
  const frame = (x, y, w, h, item) => {
    drawCover(context, images.get(item.src), x, y, w, h, item.focus, item.zoom);
    context.strokeStyle = cssValue('--border');
    context.lineWidth = 2;
    context.strokeRect(x, y, w, h);
  };
  if (spec.layout === 'full') {
    drawCover(context, images.get(spec.src), 0, 0, width, height, spec.focus, spec.zoom);
  } else if (spec.layout === 'framed') {
    frame(margin, margin * 1.4, width - margin * 2, height - margin * 2.8, spec);
  } else if (spec.layout === 'pair') {
    const gap = Math.round(width * 0.06);
    const h = (height - margin * 2.4 - gap) / 2;
    frame(margin, margin * 1.2, width - margin * 2, h, spec.items[0]);
    frame(margin, margin * 1.2 + h + gap, width - margin * 2, h, spec.items[1]);
  }
  return page;
}

// [left page, right page] canvases for one spread.
function paintSpread(spread, images) {
  if (!spread.pano) return [paintPage(spread.left, images), paintPage(spread.right, images)];
  const [wide, context] = canvas2d(TEXTURE.width * 2, TEXTURE.height);
  drawCover(context, images.get(spread.pano.src), 0, 0, wide.width, wide.height, spread.pano.focus, spread.pano.zoom);
  return [0, 1].map((half) => {
    const [page, pageContext] = blankPage();
    pageContext.drawImage(wide, half * TEXTURE.width, 0, TEXTURE.width, TEXTURE.height, 0, 0, TEXTURE.width, TEXTURE.height);
    return page;
  });
}

function toTexture(canvas, { mirrored = false } = {}) {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  if (mirrored) {
    // The back of a turned leaf is seen from behind, so its image is flipped.
    texture.wrapS = RepeatWrapping;
    texture.repeat.x = -1;
    texture.offset.x = 1;
  }
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
    pixels.data.fill(value, index, index + 3);
    pixels.data[index + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const texture = new CanvasTexture(bump);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 4);
  return texture;
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

// A page that can bend. Built flat on the right with its inner edge at the spine.
function leafGeometry() {
  const geometry = new PlaneGeometry(PAGE.width, PAGE.depth, LEAF_SEGMENTS, 1);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(PAGE.width / 2 + PAGE.inset, 0, 0);
  geometry.userData.rest = Float32Array.from(geometry.attributes.position.array);
  return geometry;
}

// Bends a leaf to `angle` about the spine hinge (0 = flat on the right, PI = flat on
// the left). `curl` (radians) makes the outer edge lead the fold, as when a hand lifts
// the corner; arc length is preserved, so the page never stretches. `offset` is the
// leaf's height above (or below) the hinge line, rotated with it.
const ARC_STEPS = 64;
const arcX = new Float32Array(ARC_STEPS + 1);
const arcY = new Float32Array(ARC_STEPS + 1);
function bendLeaf(geometry, angle, offset, curl) {
  const length = PAGE.width + PAGE.inset;
  const baseX = -offset * Math.sin(angle);
  const baseY = HINGE_Y + offset * Math.cos(angle);
  const step = length / ARC_STEPS;
  for (let i = 1; i <= ARC_STEPS; i += 1) {
    const phi = angle + curl * ((i - 0.5) / ARC_STEPS) ** 1.3;
    arcX[i] = arcX[i - 1] + Math.cos(phi) * step;
    arcY[i] = arcY[i - 1] + Math.sin(phi) * step;
  }
  const rest = geometry.userData.rest;
  const position = geometry.attributes.position;
  for (let v = 0; v < position.count; v += 1) {
    const s = rest[v * 3] / step;
    const i = Math.min(Math.floor(s), ARC_STEPS - 1);
    const f = s - i;
    position.setXYZ(v, baseX + arcX[i] + (arcX[i + 1] - arcX[i]) * f, baseY + arcY[i] + (arcY[i + 1] - arcY[i]) * f, rest[v * 3 + 2]);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

/**
 * Opens a hinged album with turnable leaves. The cover (setOpen 0..1) and the pages
 * (setSpread 0..spreads.length - 1) move independently.
 */
export async function openAlbumScene(canvas, spreads, { reducedMotion = false, onReady = () => {} } = {}) {
  const stage = canvas.parentElement;
  const sources = new Set();
  for (const spread of spreads) {
    for (const part of [spread.left, spread.right, spread.pano]) {
      if (!part) continue;
      if (part.src) sources.add(part.src);
      for (const item of part.items ?? []) sources.add(item.src);
    }
  }
  const images = new Map(await Promise.all([...sources].map(async (src) => [src, await loadImage(src)])));
  const pages = spreads.map((spread) => paintSpread(spread, images));

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
  camera.lookAt(0, 0.12, -0.22);

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
  const leather = new MeshStandardMaterial({
    color: new Color(cssValue('--cover-leather')), roughness: 0.78, metalness: 0, bumpMap: bump, bumpScale: 0.6,
  });
  const paper = new MeshStandardMaterial({ color: new Color(cssValue('--page-paper')), roughness: 0.95 });
  const edge = new MeshStandardMaterial({ color: new Color(cssValue('--surface')), map: pageEdgeTexture(), roughness: 0.95 });
  // BoxGeometry material order: +x, -x, +y, -y, +z, -z.
  const blockMaterials = [edge, edge, paper, paper, edge, edge];
  const print = (canvasImage, options = {}) => new MeshStandardMaterial({
    map: toTexture(canvasImage, options), roughness: 0.6, metalness: 0, side: options.mirrored ? BackSide : FrontSide,
  });

  const boardGeometry = new RoundedBoxGeometry(BOARD.width, BOARD.thickness, BOARD.depth, 3, 0.018);
  const blockGeometry = new RoundedBoxGeometry(BLOCK.width, BLOCK.thickness, BLOCK.depth, 2, 0.006);
  const pageGeometry = new PlaneGeometry(PAGE.width, PAGE.depth);
  const spineHeight = HINGE_Y * 2;
  const spineGeometry = new RoundedBoxGeometry(0.12, spineHeight, BOARD.depth, 3, 0.04);
  spineGeometry.translate(0, spineHeight / 2, 0);

  const shade = (mesh) => { mesh.castShadow = true; mesh.receiveShadow = true; return mesh; };

  const album = new Group();
  album.rotation.y = -0.1;
  scene.add(album);

  // Back half: rests on the table. Its top page is the last spread's right page.
  const backBoard = shade(new Mesh(boardGeometry, leather));
  backBoard.position.set(BOARD.width / 2, BOARD.thickness / 2, 0);
  const backBlock = shade(new Mesh(blockGeometry, blockMaterials));
  backBlock.position.set(BLOCK.width / 2 + 0.02, BOARD.thickness + BLOCK.thickness / 2, 0);
  const lastPage = shade(new Mesh(pageGeometry, print(pages.at(-1)[1])));
  lastPage.rotation.x = -Math.PI / 2;
  lastPage.position.set(PAGE.width / 2 + PAGE.inset, SURFACE + 0.0005, 0);
  const spine = shade(new Mesh(spineGeometry, leather));
  album.add(backBoard, backBlock, lastPage, spine);

  // Leaves: leaf k carries spread k's right page on its front and spread k+1's
  // left page on its back. They stack on the right and land on the left in order.
  const leaves = pages.slice(0, -1).map((spreadPages, k) => {
    const geometry = leafGeometry();
    const front = shade(new Mesh(geometry, print(spreadPages[1])));
    const back = new Mesh(geometry, print(pages[k + 1][0], { mirrored: true }));
    back.receiveShadow = true;
    front.frustumCulled = false;
    back.frustumCulled = false;
    album.add(front, back);
    return { geometry, rightLift: SURFACE + LEAF_GAP * (pages.length - 1 - k), leftLift: SURFACE + LEAF_GAP * (k + 1) };
  });

  // Front half: hinged at the spine. rotation.z = -PI is closed (lying on the back
  // half, cover up); 0 is open (lying flat to the left).
  const front = new Group();
  front.position.y = HINGE_Y;
  const frontBoard = shade(new Mesh(boardGeometry, leather));
  frontBoard.position.set(-BOARD.width / 2, BOARD.thickness / 2 - HINGE_Y, 0);
  const frontBlock = shade(new Mesh(blockGeometry, blockMaterials));
  frontBlock.position.set(-BLOCK.width / 2 - 0.02, BOARD.thickness + BLOCK.thickness / 2 - HINGE_Y, 0);
  const firstPage = shade(new Mesh(pageGeometry, print(pages[0][0])));
  firstPage.rotation.x = -Math.PI / 2;
  firstPage.position.set(-PAGE.width / 2 - PAGE.inset, SURFACE + 0.0005 - HINGE_Y, 0);
  front.add(frontBoard, frontBlock, firstPage, coverStitching(-HINGE_Y - 0.002));
  album.add(front);

  const lastSpread = spreads.length - 1;

  // Fit the FRAME box inside the stage (contain), matching the still image.
  const fit = () => {
    const { width, height } = stage.getBoundingClientRect();
    const aspect = Math.max(1, width) / Math.max(1, height);
    const frameAspect = FRAME.width / FRAME.height;
    const viewHeight = aspect > frameAspect ? FRAME.height : FRAME.width / aspect;
    const viewWidth = viewHeight * aspect;
    Object.assign(camera, { left: -viewWidth / 2, right: viewWidth / 2, top: viewHeight / 2, bottom: -viewHeight / 2 });
    camera.updateProjectionMatrix();
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    renderer.render(scene, camera);
  };

  // Two independent motions: the cover (0 closed, 1 open) and the pages (0 at the
  // first spread, n at the last). Turned leaves lie on the front half, so when the
  // cover closes they ride with it instead of turning back.
  const springs = {
    cover: { value: 0, velocity: 0, target: 0, omega: 9 },
    pages: { value: 0, velocity: 0, target: 0, omega: 8 },
  };

  const pose = () => {
    const opened = ease(MathUtils.clamp(springs.cover.value, 0, 1));
    const closing = Math.PI * (1 - opened);
    front.rotation.z = -closing;
    // Closed, the book sits centred; it slides by half a board as it opens so the
    // open spread ends centred too. The spine drops below the page line when open.
    album.position.x = -(BOARD.width / 2) * (1 - opened);
    spine.scale.y = MathUtils.lerp(1, 0.45, opened);
    leaves.forEach((leaf, k) => {
      const turned = ease(MathUtils.clamp(springs.pages.value - k, 0, 1));
      const offset = MathUtils.lerp(leaf.rightLift - HINGE_Y, HINGE_Y - leaf.leftLift, turned);
      bendLeaf(leaf.geometry, Math.PI * turned - closing * turned, offset, 0.5 * Math.sin(Math.PI * turned));
    });
    renderer.render(scene, camera);
  };

  fit();
  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(stage);

  // Critically damped springs: each starts from its current value and velocity, so
  // any input can grab and reverse it mid-motion, with no overshoot. Under reduced
  // motion every change is immediate.
  let frame = 0;
  let last = 0;
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    let moving = false;
    for (const spring of Object.values(springs)) {
      const force = -(spring.omega ** 2) * (spring.value - spring.target) - 2 * spring.omega * spring.velocity;
      spring.velocity += force * dt;
      spring.value += spring.velocity * dt;
      if (Math.abs(spring.value - spring.target) < 1e-4 && Math.abs(spring.velocity) < 1e-3) {
        spring.value = spring.target;
        spring.velocity = 0;
      } else {
        moving = true;
      }
    }
    frame = moving ? requestAnimationFrame(tick) : 0;
    pose();
  };

  const drive = (spring, value, max, { immediate = reducedMotion, velocity } = {}) => {
    spring.target = MathUtils.clamp(value, 0, max);
    if (velocity !== undefined) spring.velocity = velocity;
    if (immediate) {
      spring.value = spring.target;
      spring.velocity = 0;
      if (!frame) pose();
      return;
    }
    if (!frame) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  const controller = {
    lastSpread,
    get opened() { return springs.cover.target; },
    get spread() { return springs.pages.target; },
    get pagePosition() { return springs.pages.value; },
    setOpen(value, options) { drive(springs.cover, value, 1, options); },
    setSpread(value, options) { drive(springs.pages, value, lastSpread, options); },
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

  pose();
  onReady();
  return controller;
}
