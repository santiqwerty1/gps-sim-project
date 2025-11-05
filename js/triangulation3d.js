(function(){
  let tri3d = null;
  window.toggleTriangulation3D = function(){
    const host = document.getElementById('triangulation-3d');
    const showing = host.style.display !== 'none';
    host.style.display = showing ? 'none' : 'block';
    if (!showing && !tri3d) initTriangulation3D();
  };

  function initTriangulation3D(){
    const host = document.getElementById('triangulation-3d');
    const W = host.clientWidth || 800, H = 300;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06121f);
    const camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 1000);
    camera.position.set(0, 80, 180);

    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(W,H);
    host.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(60,100,80);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Tierra
    const R = 50;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 32, 16),
      new THREE.MeshPhongMaterial({color:0x1b4ddb, emissive:0x001020, shininess:20})
  );
  scene.add(earth);

    // Receptor
    const recGeom = new THREE.SphereGeometry(2.5, 16, 12);
    const recMat = new THREE.MeshPhongMaterial({color:0xffcc00});
    const receiver = new THREE.Mesh(recGeom, recMat);
    scene.add(receiver);

    // Inicial: lat=0, lon=0
    let lat = 0, lon = 0;
    function updateReceiver(){
      const x = R * Math.cos(lat) * Math.cos(lon);
      const y = R * Math.sin(lat);
      const z = R * Math.cos(lat) * Math.sin(lon);
      receiver.position.set(x,y,z);
    }
    updateReceiver();

    // Drag para mover posición (lat/lon)
    let dragging=false, lastX=0, lastY=0;
    renderer.domElement.addEventListener('mousedown', (e)=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; });
    window.addEventListener('mouseup', ()=> dragging=false);
    window.addEventListener('mousemove', (e)=>{
      if(!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      lon += dx * 0.01;
      lat += dy * 0.01;
      lat = Math.max(-Math.PI/2, Math.min(Math.PI/2, lat));
      updateReceiver();
    });

    function animate(){
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      camera.lookAt(0,0,0);
      renderer.render(scene, camera);
    }
    animate();

    tri3d = {scene, camera, renderer, earth, receiver};
  }
})();