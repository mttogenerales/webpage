/* Hero: patio de operaciones low-poly (Three.js r128, global build) */
(function () {
  var canvas = document.getElementById('scene');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x161a1f, 60, 140);

  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 220);

  // ---- materials
  var M = {
    ground: new THREE.MeshStandardMaterial({ color: 0x1c2026, roughness: 1 }),
    steel:  new THREE.MeshStandardMaterial({ color: 0x3d434c, roughness: .7, metalness: .3 }),
    dark:   new THREE.MeshStandardMaterial({ color: 0x22272e, roughness: .8 }),
    red:    new THREE.MeshStandardMaterial({ color: 0xc4161c, roughness: .55, metalness: .1 }),
    bone:   new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: .6 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xf2b300, roughness: .6 }),
    tire:   new THREE.MeshStandardMaterial({ color: 0x0f1114, roughness: 1 }),
    glass:  new THREE.MeshStandardMaterial({ color: 0x6fb2d6, roughness: .2, metalness: .6 })
  };

  function box(w, h, d, mat, x, y, z, parent) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    (parent || scene).add(m);
    return m;
  }
  function cyl(rt, rb, h, mat, x, y, z, parent, seg) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 24), mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    (parent || scene).add(m);
    return m;
  }
  function wheel(x, y, z, parent, r) {
    r = r || .55;
    var w = cyl(r, r, .5, M.tire, x, y, z, parent, 16);
    w.rotation.z = Math.PI / 2;
    return w;
  }

  // ---- ground + grid
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), M.ground);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  var grid = new THREE.GridHelper(200, 50, 0x2b313a, 0x2b313a);
  grid.position.y = .02; grid.material.opacity = .35; grid.material.transparent = true; scene.add(grid);

  // road strip
  var road = new THREE.Mesh(new THREE.PlaneGeometry(200, 7), M.dark);
  road.rotation.x = -Math.PI / 2; road.position.set(0, .03, 12); road.receiveShadow = true; scene.add(road);
  for (var i = -95; i < 95; i += 8) {
    var dash = new THREE.Mesh(new THREE.PlaneGeometry(3, .3), M.yellow);
    dash.rotation.x = -Math.PI / 2; dash.position.set(i, .04, 12); scene.add(dash);
  }

  // ---- storage tanks (crude)
  function tank(x, z, r, h) {
    var g = new THREE.Group();
    cyl(r, r, h, M.bone, 0, h / 2, 0, g, 40);
    var band = cyl(r + .05, r + .05, .5, M.red, 0, h * .78, 0, g, 40);
    cyl(r, r, .15, M.steel, 0, h + .07, 0, g, 40);           // roof rim
    cyl(.6, .6, .6, M.red, 0, h + .4, 0, g, 16);              // manway
    // stairs
    var st = box(.5, h, .35, M.steel, r + .1, h / 2, 0, g); st.rotation.y = .3;
    g.position.set(x, 0, z);
    scene.add(g);
    return g;
  }
  tank(-22, -18, 5, 6);
  tank(-9, -22, 4.2, 5.5);
  tank(-28, -6, 3, 4.5);

  // ---- crane (all-terrain)
  var crane = new THREE.Group();
  box(7, 1.6, 3.2, M.red, 0, 1.6, 0, crane);                 // carrier
  box(2.4, 1.6, 2.4, M.red, -1.6, 3.2, 0, crane);            // cab / turret
  box(1.2, 1, 2.2, M.glass, -3.1, 3.3, 0, crane);            // windshield
  [-2.4, 2.4].forEach(function (x) { [-1.7, 1.7].forEach(function (z) { wheel(x, .85, z, crane, .85); }); });
  // outriggers
  [-3.2, 3.2].forEach(function (x) { [-2.6, 2.6].forEach(function (z) {
    box(.4, .3, 2, M.steel, x, 1.2, z / 2 * 1.1, crane);
    box(.7, .5, .7, M.bone, x, .25, z, crane);
  }); });
  var boomPivot = new THREE.Group(); boomPivot.position.set(0, 3.4, 0); crane.add(boomPivot);
  var boomLen = 20;
  var boom = box(boomLen, .9, .9, M.bone, boomLen / 2 - 1, 0, 0, boomPivot);
  box(boomLen * .55, .7, .7, M.steel, boomLen * .9 - 1, 0, 0, boomPivot);   // telescopic section
  boomPivot.rotation.z = .95;
  crane.position.set(14, 0, -6);
  crane.rotation.y = -.9;
  scene.add(crane);

  // load hanging from boom tip: lattice mast section
  var load = new THREE.Group();
  var mast = new THREE.Group();
  for (var k = 0; k < 4; k++) {
    var px = (k % 2 ? 1 : -1) * .9, pz = (k < 2 ? 1 : -1) * .9;
    box(.18, 9, .18, M.red, px, 0, pz, mast);
  }
  for (var y = -4; y <= 4; y += 2) {
    box(1.9, .14, .14, M.red, 0, y, .9, mast); box(1.9, .14, .14, M.red, 0, y, -.9, mast);
    box(.14, .14, 1.9, M.red, .9, y, 0, mast); box(.14, .14, 1.9, M.red, -.9, y, 0, mast);
  }
  mast.rotation.z = Math.PI / 2;
  load.add(mast);
  // cable
  var cableGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, -1, 0)]);
  var cable = new THREE.Line(cableGeo, new THREE.LineBasicMaterial({ color: 0xe8e4dc }));
  scene.add(cable); scene.add(load);

  // ---- lowboy truck with skid module (drives along road)
  var truck = new THREE.Group();
  box(2.4, 2.2, 2.6, M.red, 6.2, 2.1, 0, truck);              // cab
  box(.6, 1.2, 2.3, M.glass, 7.4, 2.4, 0, truck);
  box(1.6, .9, 2.4, M.red, 4.4, 1.3, 0, truck);               // sleeper / engine
  box(9, .4, 2.6, M.steel, -1.5, .8, 0, truck);               // deck
  box(2.4, .5, 2.6, M.steel, 4.2, 1.15, 0, truck);            // gooseneck
  box(6.2, 2.4, 2.2, M.dark, -1.6, 2.2, 0, truck);            // skid module
  box(6.2, .12, 2.2, M.yellow, -1.6, 3.5, 0, truck);
  box(6.4, .25, .25, M.yellow, -1.6, 1.12, 1.15, truck); box(6.4, .25, .25, M.yellow, -1.6, 1.12, -1.15, truck);
  [7, 5.2, -3.4, -4.6, -5.8].forEach(function (x) { wheel(x, .55, 1.25, truck); wheel(x, .55, -1.25, truck); });
  truck.position.set(-30, 0, 12);
  scene.add(truck);

  // ---- vacuum truck (static, near tanks)
  var vac = new THREE.Group();
  box(2.2, 2, 2.4, M.red, 3.3, 1.9, 0, vac);
  box(.5, 1.1, 2.1, M.glass, 4.4, 2.2, 0, vac);
  var vt = cyl(1.2, 1.2, 6, M.bone, -.5, 2.1, 0, vac, 28); vt.rotation.z = Math.PI / 2;
  box(6.6, .3, 2.2, M.steel, -.3, .8, 0, vac);
  [3.3, -1.5, -2.7].forEach(function (x) { wheel(x, .55, 1.15, vac); wheel(x, .55, -1.15, vac); });
  vac.position.set(-12, 0, -8); vac.rotation.y = .5;
  scene.add(vac);

  // ---- stacked skids / pipe rack (storage yard)
  [[22, -14], [26, -11], [24, -18]].forEach(function (p, i) {
    var s = box(5, 2, 2.4, i % 2 ? M.dark : M.steel, p[0], 1, p[1]); s.rotation.y = .3 * i;
    box(5, .12, 2.4, M.yellow, p[0], 2.07, p[1]).rotation.y = .3 * i;
  });
  var rack = new THREE.Group();
  for (var r = 0; r < 4; r++) { var pipe = cyl(.35, .35, 12, M.steel, 0, .4 + Math.floor(r / 2) * .75, (r % 2) * .8 - .4, rack, 12); pipe.rotation.z = Math.PI / 2; }
  rack.position.set(20, 0, 2); rack.rotation.y = .2; scene.add(rack);

  // ---- camp modules
  [[-34, 22], [-27, 22]].forEach(function (p) {
    box(6, 2.8, 2.6, M.bone, p[0], 1.4, p[1]);
    box(6.2, .1, 2.8, M.red, p[0], 2.85, p[1]);
  });

  // ---- lights
  scene.add(new THREE.HemisphereLight(0xdfe6ee, 0x1c2026, .75));
  var sun = new THREE.DirectionalLight(0xfff1dc, 1.35);
  sun.position.set(-25, 40, 20); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
  sun.shadow.camera.far = 120;
  scene.add(sun);
  var rim = new THREE.PointLight(0xc4161c, .8, 60); rim.position.set(20, 8, 10); scene.add(rim);

  // ---- camera control: slow orbit + mouse parallax
  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - .5) * 2;
    ty = (e.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
  }

  var visible = true, t0 = performance.now();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: .05 }).observe(canvas);
  }

  var tipLocal = new THREE.Vector3(boomLen - 1, 0, 0), tipWorld = new THREE.Vector3();

  function frame(now) {
    var t = (now - t0) / 1000;
    resize();
    if (visible) {
      mx += (tx - mx) * .04; my += (ty - my) * .04;

      var ang = reduce ? .6 : .6 + t * .045;
      var isNarrow = camera.aspect < 1, R = isNarrow ? 72 : 58;
      camera.position.set(Math.sin(ang) * R + mx * 6, (isNarrow ? 30 : 22) - my * 3, Math.cos(ang) * R + 10);
      camera.lookAt(4, 2, -2);

      if (!reduce) {
        boomPivot.rotation.z = .95 + Math.sin(t * .35) * .07;
        truck.position.x = -55 + ((t * 3.2) % 120);
        if (truck.position.x > 60) truck.position.x -= 120;
      }
      boomPivot.updateMatrixWorld();
      tipWorld.copy(tipLocal).applyMatrix4(boomPivot.matrixWorld);
      var hang = 6 + (reduce ? 0 : Math.sin(t * .35) * .6);
      load.position.set(tipWorld.x + (reduce ? 0 : Math.sin(t * .8) * .25), tipWorld.y - hang, tipWorld.z);
      load.rotation.y = -.9 + (reduce ? 0 : Math.sin(t * .5) * .08);
      var pos = cable.geometry.attributes.position;
      pos.setXYZ(0, tipWorld.x, tipWorld.y, tipWorld.z);
      pos.setXYZ(1, load.position.x, load.position.y + 1, load.position.z);
      pos.needsUpdate = true;

      renderer.render(scene, camera);
    }
    if (!reduce || t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
