(function exposeBrainOverlay() {
  const BASE_COLOR = '#dce8ff';
  const LEFT_BASE = '#79f2c9';
  const RIGHT_BASE = '#8fb4ff';
  const FOLD_BASE = '#f0f7ff';
  const STEM_BASE = '#a8bed6';

  function makeBrainMaterial(color, opacity, emissiveIntensity) {
    return new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });
  }

  function makeAdditiveMaterial(color, opacity, emissiveIntensity) {
    return new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }

  function setMaterialColor(material, color) {
    material.color.set(color);
    material.emissive.set(color);
  }

  function makeHemisphere(side) {
    const group = new THREE.Group();
    const color = side < 0 ? LEFT_BASE : RIGHT_BASE;

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(58, 54, 30),
      makeBrainMaterial(color, 0.24, 0.18)
    );
    mesh.name = side < 0 ? 'left conceptual hemisphere' : 'right conceptual hemisphere';
    mesh.position.set(side * 33, 7, 0);
    mesh.scale.set(0.82, 0.7, 0.54);
    mesh.userData.baseScale = mesh.scale.clone();
    group.add(mesh);

    const foldTubes = makeFoldTubes(side);
    foldTubes.forEach((tube) => group.add(tube));

    group.userData = { mesh, foldTubes };
    return group;
  }

  function makeFoldTubes(side) {
    const tubes = [];
    const folds = [
      { y: 35, z: -14, amp: 9, depth: 10, phase: 0.1 },
      { y: 24, z: 12, amp: 12, depth: 13, phase: 1.1 },
      { y: 12, z: -24, amp: 10, depth: 14, phase: 2.2 },
      { y: 3, z: 20, amp: 14, depth: 12, phase: 0.7 },
      { y: -10, z: -10, amp: 9, depth: 11, phase: 1.8 },
      { y: -21, z: 16, amp: 7, depth: 9, phase: 2.8 }
    ];

    folds.forEach((fold, index) => {
      const points = [];
      for (let i = 0; i < 7; i += 1) {
        const t = i / 6;
        const arc = (t - 0.5) * Math.PI;
        const x = side * (30 + Math.sin(t * Math.PI) * (18 + fold.amp));
        const y = fold.y - t * 16 + Math.sin(t * Math.PI * 2 + fold.phase) * 5;
        const z = fold.z + Math.cos(arc + fold.phase * 0.45) * fold.depth + Math.sin(t * Math.PI * 3) * 4;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 52, 1.45, 8, false);
      const tube = new THREE.Mesh(
        geometry,
        makeAdditiveMaterial(index % 2 ? BASE_COLOR : FOLD_BASE, 0.42, 0.35)
      );
      tube.name = side < 0 ? 'left cortical fold' : 'right cortical fold';
      tube.userData.phaseOffset = index * 0.55 + (side < 0 ? 0 : 0.28);
      tube.userData.baseOpacity = 0.42;
      tube.userData.baseEmissive = 0.35;
      tubes.push(tube);
    });

    return tubes;
  }

  function makeFissurePlane() {
    const fissure = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 86, 1, 1),
      new THREE.MeshBasicMaterial({
        color: '#020814',
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    fissure.name = 'central conceptual fissure';
    fissure.position.set(0, 9, 4);
    return fissure;
  }

  function makeBrainstem() {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 13, 34, 24, 1),
      makeBrainMaterial(STEM_BASE, 0.24, 0.12)
    );
    stem.name = 'subtle conceptual brainstem';
    stem.position.set(0, -44, 7);
    stem.rotation.x = -0.18;
    stem.userData.baseScale = stem.scale.clone();
    return stem;
  }

  function makeSurfaceParticles() {
    const count = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const row = Math.floor(i / 2);
      const theta = (row * 0.71) % (Math.PI * 2);
      const latitude = -0.58 + ((row * 0.17) % 1.16);
      const surface = 0.94 + ((i % 7) - 3) * 0.01;
      const x = side * (32 + Math.cos(theta) * Math.cos(latitude) * 36 * surface);
      const y = 6 + Math.sin(latitude) * 45 * surface;
      const z = Math.sin(theta) * Math.cos(latitude) * 34 * surface;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      phases[i] = theta + side * 0.7;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: '#dce8ff',
        size: 2.1,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    particles.name = 'near-surface state particles';
    particles.userData.basePositions = positions.slice();
    particles.userData.phases = phases;
    return particles;
  }

  function makeGlowShell() {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(66, 54, 30),
      makeAdditiveMaterial('#dce8ff', 0.07, 0.08)
    );
    shell.name = 'low opacity brain glow shell';
    shell.scale.set(1.42, 0.78, 0.58);
    shell.position.y = 7;
    shell.userData.baseScale = shell.scale.clone();
    return shell;
  }

  function addBrainObject(scene) {
    const group = new THREE.Group();
    group.name = 'conceptual-brain-state';
    group.position.set(16, 12, -82);
    group.rotation.x = -0.03;

    const left = makeHemisphere(-1);
    const right = makeHemisphere(1);
    const fissure = makeFissurePlane();
    const stem = makeBrainstem();
    const particles = makeSurfaceParticles();
    const shell = makeGlowShell();

    group.add(shell);
    group.add(left);
    group.add(right);
    group.add(fissure);
    group.add(stem);
    group.add(particles);

    const light = new THREE.PointLight('#8fb4ff', 0.62, 480);
    light.position.set(0, 18, 130);
    group.add(light);

    const foldTubes = [...left.userData.foldTubes, ...right.userData.foldTubes];

    group.userData = {
      left,
      right,
      fissure,
      foldTubes,
      particles,
      shell,
      stem,
      mode: null,
      pulse: 0.45,
      color: new THREE.Color(LEFT_BASE),
      secondaryColor: new THREE.Color(RIGHT_BASE)
    };

    scene.add(group);
    return group;
  }

  function setReplayMode(group, mode) {
    if (!group || !mode) return;

    const data = group.userData;
    data.mode = mode.id;
    data.pulse = mode.pulse;
    data.color.set(mode.color);
    data.secondaryColor.set(mode.secondaryColor);

    const primary = mode.color;
    const secondary = mode.secondaryColor;
    const leftColor = mode.id === 'cue' || mode.id === 'guided' ? primary : secondary;
    const rightColor = mode.id === 'tmr' || mode.id === 'direct' ? primary : secondary;

    [data.left.userData.mesh, data.right.userData.mesh].forEach((mesh, index) => {
      const target = index === 0 ? leftColor : rightColor;
      setMaterialColor(mesh.material, target);
      mesh.material.opacity = 0.2 + mode.pulse * 0.1;
      mesh.material.emissiveIntensity = 0.12 + mode.pulse * 0.2;
    });

    data.foldTubes.forEach((tube, index) => {
      setMaterialColor(tube.material, index % 2 === 0 ? primary : secondary);
      tube.material.opacity = 0.38 + mode.pulse * 0.18;
      tube.material.emissiveIntensity = 0.3 + mode.pulse * 0.35;
    });

    setMaterialColor(data.stem.material, mode.id === 'direct' ? secondary : STEM_BASE);
    data.stem.material.opacity = 0.2 + mode.pulse * 0.06;
    setMaterialColor(data.shell.material, secondary);
    data.shell.material.opacity = 0.055 + mode.pulse * 0.045;
    data.shell.material.emissiveIntensity = 0.08 + mode.pulse * 0.12;
    data.particles.material.color.set(primary);
    data.particles.material.opacity = 0.26 + mode.pulse * 0.24;
  }

  function animateSurfaceParticles(particles, timeSeconds, pulse, mode) {
    const positions = particles.geometry.attributes.position.array;
    const basePositions = particles.userData.basePositions;
    const phases = particles.userData.phases;
    const orbitSpeed = mode === 'guided' ? 0.9 : mode === 'tmr' ? 0.72 : 0.45;

    for (let i = 0; i < phases.length; i += 1) {
      const index = i * 3;
      const phase = phases[i] + timeSeconds * orbitSpeed;
      const drift = Math.sin(phase) * (0.65 + pulse * 0.8);
      positions[index] = basePositions[index] + Math.cos(phase * 0.7) * drift;
      positions[index + 1] = basePositions[index + 1] + Math.sin(phase * 0.6) * drift * 0.45;
      positions[index + 2] = basePositions[index + 2] + Math.sin(phase) * drift;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0007 + pulse * 0.00035;
  }

  function animateBrainObject(group, timeSeconds) {
    if (!group) return;

    const data = group.userData;
    const pulse = data.pulse || 0.45;
    const mode = data.mode || 'cue';
    const modeRate = mode === 'direct' ? 1.35 : mode === 'tmr' ? 1 : 0.72;
    const globalWave = Math.sin(timeSeconds * modeRate) * 0.5 + 0.5;
    const guidedSweep = mode === 'guided' ? Math.sin(timeSeconds * 1.1 + group.rotation.y * 4) * 0.5 + 0.5 : 0;
    const directFlicker = mode === 'direct' ? Math.sin(timeSeconds * 5.1) * Math.sin(timeSeconds * 2.4) * 0.08 : 0;

    group.rotation.y = Math.sin(timeSeconds * 0.12) * 0.13;
    group.rotation.x = -0.03 + Math.sin(timeSeconds * 0.22) * 0.025;

    [data.left.userData.mesh, data.right.userData.mesh].forEach((mesh, index) => {
      const offset = index === 0 ? 0 : 0.45;
      const breathe = 1 + Math.sin(timeSeconds * 0.8 + offset) * 0.018 * (0.7 + pulse);
      const modePulse = mode === 'direct' ? 1 + (globalWave * 0.035 + directFlicker) : breathe;
      mesh.scale.copy(mesh.userData.baseScale).multiplyScalar(modePulse);
      mesh.material.emissiveIntensity = 0.14 + pulse * 0.18 + globalWave * 0.08 + Math.max(0, directFlicker);
    });

    data.foldTubes.forEach((tube) => {
      const phase = timeSeconds * (0.9 + pulse * 0.55) + tube.userData.phaseOffset;
      const ripple = Math.sin(phase) * 0.5 + 0.5;
      const sweepBoost = mode === 'guided' ? Math.max(0, 1 - Math.abs(ripple - guidedSweep) * 2.2) * 0.22 : 0;
      const tmrRipple = mode === 'tmr' ? Math.sin(phase * 1.7) * 0.08 : 0;
      tube.material.opacity = tube.userData.baseOpacity + ripple * 0.18 + sweepBoost + Math.max(0, directFlicker);
      tube.material.emissiveIntensity = tube.userData.baseEmissive + ripple * (0.25 + pulse * 0.2) + sweepBoost + tmrRipple;
    });

    data.fissure.material.opacity = 0.44 + globalWave * 0.08;
    data.stem.scale.copy(data.stem.userData.baseScale).multiplyScalar(1 + Math.sin(timeSeconds * 0.65) * 0.012);
    data.shell.scale.copy(data.shell.userData.baseScale).multiplyScalar(1 + Math.sin(timeSeconds * 0.62) * 0.018 + globalWave * 0.012);
    animateSurfaceParticles(data.particles, timeSeconds, pulse, mode);
  }

  window.BRAIN_REPLAY_BRAIN = {
    addBrainObject,
    setReplayMode,
    animateBrainObject
  };
})();
