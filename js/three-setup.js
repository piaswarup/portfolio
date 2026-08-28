// ============================================================
// Three.js 3D Models — procedural wireframe placeholders, and
// real GLTF/GLB models (e.g. exported from CAD) when a modelPath
// is provided.
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();

const COLORS = {
  wireframe:  0xffffff,
  wireAlpha:  0.30,
  innerFill:  0x4a6fa5,
  innerAlpha: 0.12,
};

function buildScene(canvas, scroller) {
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
    autoTimer = setTimeout(() => { autoRotate = true; }, 500);
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

// ── Loaded GLTF/GLB models ───────────────────────────────────

// Centers and scales a loaded model to roughly match the footprint
// of the procedural placeholder shapes (radius ~1), so lighting,
// camera distance, and drag/rotate speed all feel consistent.
function fitModelToView(THREE, root) {
  const box = new THREE.Box3().setFromObject(root);
  const size   = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  root.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  root.scale.setScalar(1.8 / maxDim);

  // CAD exports (Onshape, SolidWorks, ...) are typically Z-up; tip the
  // model 90° about X so it faces the camera instead of lying flat.
  root.rotation.x = -Math.PI / 2;
}

function disposeObject3D(root) {
  root.traverse(node => {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      mats.forEach(mat => {
        Object.values(mat).forEach(v => v?.isTexture && v.dispose());
        mat.dispose();
      });
    }
  });
}

// ── Public factory ───────────────────────────────────────────

export function createModel(canvas, opts, scroller) {
  const { shape = 'icosahedron', modelPath = null } =
    typeof opts === 'string' ? { shape: opts } : (opts || {});

  const ctx = buildScene(canvas, scroller);
  if (!ctx) return;

  const { THREE, renderer, scene, camera, ro } = ctx;
  const disposables = [];
  let rotatables = [];  // objects the drag handler rotates
  let spins = [];        // { obj, y, x } per-object auto-rotate speeds
  let dragCtrl;

  if (modelPath) {
    // Real GLTF/GLB models use PBR materials, which need actual lights
    // (the wireframe placeholders use unlit MeshBasicMaterial instead).
    const hemi = new THREE.HemisphereLight(0xbfd3ff, 0x1a2d63, 1.2);
    const key  = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 4, 5);
    scene.add(hemi, key);

    const group = new THREE.Group();
    scene.add(group);
    rotatables = [group];
    spins = [{ obj: group, y: 0.004, x: 0.0015 }];
    dragCtrl = attachDrag(canvas, rotatables, scroller);

    gltfLoader.load(
      modelPath,
      gltf => {
        fitModelToView(THREE, gltf.scene);
        group.add(gltf.scene);
        disposables.push(() => disposeObject3D(gltf.scene));
      },
      undefined,
      err => {
        console.error(`Failed to load 3D model "${modelPath}":`, err);
        const geometry = buildGeometry(THREE, shape);
        const { wire, inner } = addWireframe(THREE, group, geometry);
        rotatables.push(wire, inner);
        spins.push({ obj: wire, y: 0.004, x: 0.0015 }, { obj: inner, y: -0.003, x: 0 });
        disposables.push(() => geometry.dispose());
      }
    );
  } else {
    const geometry = buildGeometry(THREE, shape);
    const { wire, inner } = addWireframe(THREE, scene, geometry);
    rotatables = [wire, inner];
    spins = [{ obj: wire, y: 0.004, x: 0.0015 }, { obj: inner, y: -0.003, x: 0 }];
    disposables.push(() => geometry.dispose());

    const pt = new THREE.PointLight(0x8faad4, 0.8, 10);
    pt.position.set(3, 3, 3);
    scene.add(pt);

    dragCtrl = attachDrag(canvas, rotatables, scroller);
  }

  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    if (dragCtrl.autoRotate) {
      for (const { obj, y, x } of spins) {
        obj.rotation.y += y;
        obj.rotation.x += x;
      }
    }
    renderer.render(scene, camera);
  }
  animate();

  return {
    dispose() {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      disposables.forEach(d => d());
      renderer.dispose();
    },
  };
}
