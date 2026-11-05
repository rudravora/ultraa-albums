import * as THREE from 'three';

function cssValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function loadPhoto(loader, path) {
  return new Promise((resolve, reject) => {
    loader.load(path, resolve, undefined, reject);
  });
}

async function pageTexture(loader, path) {
  const loadedPhoto = await loadPhoto(loader, path);
  const photo = loadedPhoto.image;
  const width = 768;
  const height = 1100;
  const page = document.createElement('canvas');
  page.width = width;
  page.height = height;
  const context = page.getContext('2d', { alpha: false });
  if (!context) throw new Error('The album page surface could not be drawn.');

  context.fillStyle = cssValue('--page-paper');
  context.fillRect(0, 0, width, height);

  const maxWidth = width * 0.86;
  const maxHeight = height * 0.54;
  const scale = Math.min(maxWidth / photo.width, maxHeight / photo.height);
  const photoWidth = photo.width * scale;
  const photoHeight = photo.height * scale;
  const x = (width - photoWidth) / 2;
  const y = (height - photoHeight) / 2;

  context.drawImage(photo, x, y, photoWidth, photoHeight);
  context.strokeStyle = cssValue('--border');
  context.lineWidth = 2;
  context.strokeRect(x, y, photoWidth, photoHeight);
  loadedPhoto.dispose();

  const output = new THREE.CanvasTexture(page);
  output.colorSpace = THREE.SRGBColorSpace;
  output.anisotropy = 4;
  return output;
}

function dashedStitching(coverMesh) {
  const left = -0.62;
  const right = 0.62;
  const near = -0.89;
  const far = 0.89;
  const top = 0.032;
  const points = [
    new THREE.Vector3(left, top, near), new THREE.Vector3(right, top, near),
    new THREE.Vector3(right, top, near), new THREE.Vector3(right, top, far),
    new THREE.Vector3(right, top, far), new THREE.Vector3(left, top, far),
    new THREE.Vector3(left, top, far), new THREE.Vector3(left, top, near),
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color: new THREE.Color(cssValue('--page-paper')),
    dashSize: 0.025,
    gapSize: 0.025,
    scale: 1,
    opacity: 0.68,
    transparent: true,
  });
  const line = new THREE.LineSegments(geometry, material);
  line.computeLineDistances();
  coverMesh.add(line);
  return line;
}

function bezierProgress(value) {
  const x1 = 0.4;
  const y1 = 0;
  const x2 = 0.2;
  const y2 = 1;
  const cubic = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  const derivative = (t, a, b) => 3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * (b - a) + 3 * t ** 2 * (1 - b);
  let parameter = value;
  for (let iteration = 0; iteration < 5; iteration += 1) {
    const error = cubic(parameter, x1, x2) - value;
    const slope = derivative(parameter, x1, x2);
    if (Math.abs(slope) < 1e-5) break;
    parameter -= error / slope;
    parameter = THREE.MathUtils.clamp(parameter, 0, 1);
  }
  return cubic(parameter, y1, y2);
}

export async function openAlbumScene(canvas, initialImages, { reducedMotion = false, onReady = () => {} } = {}) {
  const stage = canvas.parentElement;
  const root = document.documentElement;
  const paper = new THREE.Color(cssValue('--paper'));
  const coverColour = new THREE.Color(cssValue('--cover-leather'));
  const pageColour = new THREE.Color(cssValue('--page-paper'));
  const loader = new THREE.TextureLoader();
  const photos = await Promise.all(initialImages.map((path) => pageTexture(loader, path)));

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'low-power',
  });
  renderer.setClearColor(paper, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = paper;
  const camera = new THREE.OrthographicCamera(-2, 2, 1, -1, 0.1, 80);
  camera.position.set(0, 4.5, 3.9);
  camera.lookAt(0, 0.04, 0);

  const ambient = new THREE.AmbientLight(new THREE.Color(cssValue('--surface')), 1.4);
  scene.add(ambient);
  const keyLight = new THREE.DirectionalLight(new THREE.Color(cssValue('--surface')), 3.2);
  keyLight.position.set(-3, 6, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -4;
  keyLight.shadow.camera.right = 4;
  keyLight.shadow.camera.top = 4;
  keyLight.shadow.camera.bottom = -4;
  keyLight.shadow.bias = -0.0002;
  keyLight.shadow.radius = 6;
  scene.add(keyLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: paper, roughness: 1, metalness: 0 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.18;
  ground.receiveShadow = true;
  scene.add(ground);

  const album = new THREE.Group();
  album.rotation.y = -0.08;
  scene.add(album);

  const coverMaterial = new THREE.MeshStandardMaterial({ color: coverColour, roughness: 0.9, metalness: 0.02 });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: pageColour, roughness: 0.95 });
  const coverGeometry = new THREE.BoxGeometry(1.42, 0.06, 2.02);
  const pageBlockGeometry = new THREE.BoxGeometry(1.32, 0.105, 1.91);
  const leftBoard = new THREE.Mesh(coverGeometry, coverMaterial);
  leftBoard.position.set(-0.71, -0.085, 0);
  leftBoard.castShadow = true;
  leftBoard.receiveShadow = true;
  const rightBoard = new THREE.Mesh(coverGeometry, coverMaterial);
  rightBoard.position.set(0.71, -0.085, 0);
  rightBoard.castShadow = true;
  rightBoard.receiveShadow = true;
  album.add(leftBoard, rightBoard);

  const leftPages = new THREE.Mesh(pageBlockGeometry, edgeMaterial);
  leftPages.position.set(-0.68, -0.005, 0);
  leftPages.castShadow = true;
  const rightPages = new THREE.Mesh(pageBlockGeometry, edgeMaterial);
  rightPages.position.set(0.68, -0.005, 0);
  rightPages.castShadow = true;
  album.add(leftPages, rightPages);

  const pageMaterials = photos.map((map) => new THREE.MeshStandardMaterial({
    color: new THREE.Color(cssValue('--surface')),
    map,
    roughness: 0.93,
    metalness: 0,
  }));
  const pageGeometry = new THREE.PlaneGeometry(1.24, 1.79);
  const leftPageGroup = new THREE.Group();
  const rightPageGroup = new THREE.Group();
  leftPageGroup.position.set(0, 0.061, 0);
  rightPageGroup.position.set(0, 0.061, 0);
  leftPageGroup.rotation.z = -0.034;
  rightPageGroup.rotation.z = 0.034;
  const leftPage = new THREE.Mesh(pageGeometry, pageMaterials[0]);
  leftPage.position.x = -0.68;
  leftPage.rotation.x = -Math.PI / 2;
  leftPage.receiveShadow = true;
  const rightPage = new THREE.Mesh(pageGeometry, pageMaterials[1]);
  rightPage.position.x = 0.68;
  rightPage.rotation.x = -Math.PI / 2;
  rightPage.receiveShadow = true;
  leftPageGroup.add(leftPage);
  rightPageGroup.add(rightPage);
  album.add(leftPageGroup, rightPageGroup);

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.13, 1.96),
    coverMaterial,
  );
  spine.position.set(0, -0.005, 0);
  spine.castShadow = true;
  album.add(spine);

  const lid = new THREE.Group();
  lid.position.set(0, 0.095, 0);
  lid.rotation.z = 0;
  const coverMesh = new THREE.Mesh(coverGeometry, coverMaterial);
  coverMesh.position.x = 0.71;
  coverMesh.castShadow = true;
  coverMesh.receiveShadow = true;
  dashedStitching(coverMesh);
  lid.add(coverMesh);
  album.add(lid);

  const cameraFit = () => {
    const bounds = stage.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    const aspect = width / height;
    const viewHeight = aspect > 1.7 ? 4.6 / aspect : 3.1;
    const viewWidth = viewHeight * aspect;
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  cameraFit();
  const resizeObserver = new ResizeObserver(cameraFit);
  resizeObserver.observe(stage);

  function replacePage(mesh, oldMaterial, texture) {
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(cssValue('--surface')),
      map: texture,
      roughness: 0.93,
      metalness: 0,
    });
    mesh.material = material;
    oldMaterial.dispose();
  }

  const controller = {
    async setPageImages(paths) {
      try {
        const replacements = await Promise.all(paths.map((path) => pageTexture(loader, path)));
        replacePage(leftPage, leftPage.material, replacements[0]);
        replacePage(rightPage, rightPage.material, replacements[1]);
        renderer.render(scene, camera);
      } catch {
        // Keep the currently rendered spread if an optional audience image cannot load.
      }
    },
    dispose() {
      resizeObserver.disconnect();
      for (const texture of photos) texture.dispose();
      for (const material of pageMaterials) material.dispose();
      for (const material of [coverMaterial, edgeMaterial]) material.dispose();
      pageGeometry.dispose();
      pageBlockGeometry.dispose();
      coverGeometry.dispose();
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
    },
  };

  if (reducedMotion) {
    lid.rotation.z = Math.PI;
    lid.position.y = -0.105;
    leftPageGroup.rotation.z = 0;
    rightPageGroup.rotation.z = 0;
    renderer.render(scene, camera);
    onReady();
    return controller;
  }

  lid.rotation.z = 0;
  lid.position.y = 0.095;
  const start = performance.now();
  const duration = 600;
  const renderOpening = (now) => {
    const linear = THREE.MathUtils.clamp((now - start) / duration, 0, 1);
    const progress = bezierProgress(linear);
    lid.rotation.z = Math.PI * progress;
    lid.position.y = 0.095 - 0.2 * progress + Math.sin(progress * Math.PI) * 0.24;
    const fan = 1 - Math.min(linear / 0.4, 1);
    leftPageGroup.rotation.z = -0.034 * fan;
    rightPageGroup.rotation.z = 0.034 * fan;
    renderer.render(scene, camera);
    if (linear < 1) {
      requestAnimationFrame(renderOpening);
    } else {
      lid.rotation.z = Math.PI;
      lid.position.y = -0.105;
      leftPageGroup.rotation.z = 0;
      rightPageGroup.rotation.z = 0;
      renderer.render(scene, camera);
    }
  };

  renderer.render(scene, camera);
  onReady();
  requestAnimationFrame(renderOpening);
  return controller;
}
