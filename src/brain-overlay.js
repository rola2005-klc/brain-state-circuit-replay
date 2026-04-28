(function exposeBrainOverlay() {
  function createMaterial(color, opacity, emissiveIntensity) {
    return new THREE.MeshPhongMaterial({
      color,
      emissive: color,
      emissiveIntensity,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }

  function makeSphere(name, radius, position, scale, color) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 38, 24),
      createMaterial(color, 0.2, 0.25)
    );
    mesh.name = name;
    mesh.position.set(position.x, position.y, position.z);
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.userData.baseScale = mesh.scale.clone();
    return mesh;
  }

  function makeParticleField() {
    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = 72 + Math.random() * 90;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius * 0.62;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius * 0.72;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: '#8fb4ff',
        size: 2.4,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
  }

  function addBrainObject(scene) {
    const group = new THREE.Group();
    group.name = 'conceptual-brain-state';
    group.position.set(0, -14, -76);

    const zones = {
      sensory: makeSphere('sensory fragments', 42, { x: -48, y: 14, z: 0 }, { x: 1.25, y: 0.8, z: 0.72 }, '#79f2c9'),
      context: makeSphere('hippocampal/context binding', 34, { x: 10, y: -14, z: 16 }, { x: 1.15, y: 0.7, z: 0.62 }, '#8fb4ff'),
      salience: makeSphere('emotional salience', 28, { x: 46, y: -8, z: 12 }, { x: 0.9, y: 0.78, z: 0.7 }, '#ff9ec4'),
      integrated: makeSphere('integrated moment', 62, { x: 0, y: 10, z: -8 }, { x: 1.55, y: 0.86, z: 0.72 }, '#ffffff')
    };

    zones.integrated.material.opacity = 0.08;
    zones.integrated.material.emissiveIntensity = 0.1;

    Object.values(zones).forEach((mesh) => group.add(mesh));

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(86, 48, 32),
      createMaterial('#dce8ff', 0.055, 0.05)
    );
    shell.name = 'conceptual whole-state halo';
    shell.scale.set(1.45, 0.82, 0.66);
    shell.userData.baseScale = shell.scale.clone();
    group.add(shell);

    const particles = makeParticleField();
    group.add(particles);

    const light = new THREE.PointLight('#8fb4ff', 0.55, 480);
    light.position.set(0, 0, 140);
    group.add(light);

    group.userData = {
      zones,
      shell,
      particles,
      mode: null,
      pulse: 0.45,
      color: new THREE.Color('#79f2c9'),
      secondaryColor: new THREE.Color('#8fb4ff')
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

    data.zones.sensory.material.color.set(mode.id === 'cue' ? mode.color : '#79f2c9');
    data.zones.context.material.color.set(mode.id === 'tmr' || mode.id === 'guided' ? mode.color : '#8fb4ff');
    data.zones.salience.material.color.set(mode.id === 'direct' ? mode.color : '#ff9ec4');
    data.zones.integrated.material.color.set(mode.secondaryColor);

    Object.values(data.zones).forEach((zone) => {
      zone.material.emissive.copy(zone.material.color);
      zone.material.emissiveIntensity = 0.2 + mode.pulse * 0.35;
      zone.material.opacity = zone.name === 'integrated moment' ? 0.08 + mode.pulse * 0.08 : 0.17 + mode.pulse * 0.1;
    });

    data.shell.material.color.set(mode.secondaryColor);
    data.shell.material.emissive.set(mode.secondaryColor);
    data.particles.material.color.set(mode.color);
    data.particles.material.opacity = 0.3 + mode.pulse * 0.34;
  }

  function animateBrainObject(group, timeSeconds) {
    if (!group) return;

    const data = group.userData;
    const pulse = data.pulse || 0.45;
    group.rotation.y += 0.0016;
    group.rotation.x = Math.sin(timeSeconds * 0.25) * 0.045;

    Object.values(data.zones).forEach((zone, index) => {
      const phase = timeSeconds * (0.9 + pulse * 0.8) + index * 0.85;
      const amount = 1 + Math.sin(phase) * 0.035 * (0.5 + pulse);
      zone.scale.copy(zone.userData.baseScale).multiplyScalar(amount);
    });

    data.shell.scale.copy(data.shell.userData.baseScale).multiplyScalar(1 + Math.sin(timeSeconds * 0.8) * 0.025);
    data.particles.rotation.y -= 0.0012 + pulse * 0.0008;
    data.particles.rotation.z = Math.sin(timeSeconds * 0.18) * 0.08;
  }

  window.BRAIN_REPLAY_BRAIN = {
    addBrainObject,
    setReplayMode,
    animateBrainObject
  };
})();
