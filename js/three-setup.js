// ============================================================
// Three.js Placeholder 3D Models
// Requires THREE to be loaded as a global (via <script> tag)
// ============================================================

const COLORS = {
  wireframe:  0xffffff,
  wireAlpha:  0.30,
  innerFill:  0x4a6fa5,
  innerAlpha: 0.12,
};

function buildScene(canvas, scroller) {
  if (!window.THREE) return null;
  const THREE = window.THREE;

  const w = canvas.clientWidth  || canvas.offsetWidth  || 300;
  const h = canvas.clientHeight || canvas.offsetHeight || 200;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha:     true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 3.5);

  // Handle resize
  const ro = new ResizeObserver(() => {
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  });
  ro.observe(canvas.parentElement);

  return { THREE, renderer, scene, camera, ro };
}

function buildGeometry(THREE, shape) {
  switch (shape) {
    case 'gear':
      return buildGear(THREE);
    case 'torus':
      return buildTorus(THREE);
    case 'cube':
      return buildCube(THREE);
    case 'icosahedron':
    default:
      return buildIcosahedron(THREE);
  }
}

function addWireframe(THREE, scene, geometry) {
  const wireMat = new THREE.MeshBasicMaterial({
    color:       COLORS.wireframe,
    wireframe:   true,
    transparent: true,
    opacity:     COLORS.wireAlpha,
  });
  const wire = new THREE.Mesh(geometry, wireMat);

  const innerMat = new THREE.MeshBasicMaterial({
    color:       COLORS.innerFill,
    transparent: true,
    opacity:     COLORS.innerAlpha,
    side:        THREE.BackSide,
  });
  const inner = new THREE.Mesh(geometry.clone(), innerMat);
  inner.scale.setScalar(0.92);

  scene.add(wire);
  scene.add(inner);
  return { wire, inner };
}

function buildIcosahedron(THREE) {
  return new THREE.IcosahedronGeometry(1, 2);
}

function buildGear(THREE) {
  // Approximate gear with TorusKnot (complex curved mesh = suggests mechanical)
  return new THREE.TorusKnotGeometry(0.8, 0.25, 120, 16, 2, 3);
}

function buildTorus(THREE) {
  return new THREE.TorusGeometry(0.85, 0.32, 20, 60);
}

function buildCube(THREE) {
  return new THREE.BoxGeometry(1.4, 1.4, 1.4, 3, 3, 3);
}

// ── Mouse drag to rotate ─────────────────────────────────────
function attachDrag(canvas, meshes, scroller) {
  let dragging = false;
  let prev = { x: 0, y: 0 };
  let autoRotate = true;
  let velocity   = { x: 0, y: 0 };
  let autoTimer  = null;

  canvas.style.cursor = 'grab';

  canvas.addEventListener('mousedown', e => {
    dragging = true;
    autoRotate = false;
    clearTimeout(autoTimer);
    prev = { x: e.clientX, y: e.clientY };
    canvas.style.cursor = 'grabbing';
    e.stopPropagation();
  });

  window.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    canvas.style.cursor = 'grab';
    autoTimer = setTimeout(() => { autoRotate = true; }, 2000);
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    velocity = { x: dy * 0.01, y: dx * 0.01 };
    for (const m of meshes) {
      m.rotation.x += velocity.x;
      m.rotation.y += velocity.y;
    }
    prev = { x: e.clientX, y: e.clientY };
  });

  // Prevent page scroll when pointer is over the canvas
  canvas.addEventListener('wheel', e => {
    e.stopPropagation();
  }, { passive: false });

  // Lock scroller while dragging
  canvas.addEventListener('mouseenter', () => {
    if (scroller) scroller.isLocked = false; // drag rotate, not lock scroll
  });

  return {
    get autoRotate() { return autoRotate; },
    velocity,
  };
}

// ── Public factory ───────────────────────────────────────────

export function createModel(canvas, shape, scroller) {
  const ctx = buildScene(canvas, scroller);
  if (!ctx) return;

  const { THREE, renderer, scene, camera, ro } = ctx;
  const geometry = buildGeometry(THREE, shape);
  const { wire, inner } = addWireframe(THREE, scene, geometry);

  const dragCtrl = attachDrag(canvas, [wire, inner], scroller);

  // Subtle point light
  const pt = new THREE.PointLight(0x8faad4, 0.8, 10);
  pt.position.set(3, 3, 3);
  scene.add(pt);

  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    if (dragCtrl.autoRotate) {
      wire.rotation.y  += 0.004;
      wire.rotation.x  += 0.0015;
      inner.rotation.y -= 0.003;
    }
    renderer.render(scene, camera);
  }
  animate();

  return {
    dispose() {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      geometry.dispose();
      renderer.dispose();
    },
  };
}
