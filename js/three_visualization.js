// SIMULACIÓN 3D CON THREE.JS
// ============================================
function init3DVisualization() {
    const container = document.getElementById('three-container');
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a20);
    
    // Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
camera.position.set(0, 0, 500);

// Renderer
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    scene.add(directionalLight);
    
    // Earth
    const earthGeometry = new THREE.SphereGeometry(50, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
        shininess: 10
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // GPS Satellites
    const satellites3D = [];
    const orbitRadius = 200;
    
    for(let i = 0; i < 31; i++) {
        const satGeometry = new THREE.BoxGeometry(5, 5, 5);
        const satMaterial = new THREE.MeshPhongMaterial({
            color: 0xffaa00,
            emissive: 0xff5500
        });
        const satellite = new THREE.Mesh(satGeometry, satMaterial);
        
        // Posición orbital
        const angle = (i / 31) * Math.PI * 2;
        const inclination = (Math.floor(i / 5) * 30) * Math.PI / 180;
        
        satellite.position.x = Math.cos(angle) * orbitRadius;
        satellite.position.y = Math.sin(angle) * orbitRadius * Math.cos(inclination);
        satellite.position.z = Math.sin(inclination) * orbitRadius * 0.5;
        
        satellites3D.push({mesh: satellite, angle: angle, inclination: inclination});
        scene.add(satellite);
        
        // Órbita
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        for(let j = 0; j <= 64; j++) {
            const a = (j / 64) * Math.PI * 2;
            orbitPoints.push(
                Math.cos(a) * orbitRadius,
                Math.sin(a) * orbitRadius * Math.cos(inclination),
                Math.sin(inclination) * orbitRadius * 0.5
            );
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({color: 0x444444});
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);
    }
    
    // Señales
    const signals = [];
    
    // Controles de mouse
    let mouseX = 0, mouseY = 0;
    
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (animation3D) {
            // Rotar Tierra
            earth.rotation.y += 0.001;
            
            // Mover satélites
            satellites3D.forEach((sat, i) => {
                sat.angle += 0.002;
                sat.mesh.position.x = Math.cos(sat.angle) * orbitRadius;
                sat.mesh.position.y = Math.sin(sat.angle) * orbitRadius * Math.cos(sat.inclination);
                sat.mesh.position.z = Math.sin(sat.inclination) * orbitRadius * 0.5;
                
                // Rotar satélites
                sat.mesh.rotation.y += 0.01;
                sat.mesh.rotation.z += 0.005;
            });
        }
        
        // Control de cámara con mouse
        camera.position.x = mouseX * 100;
        camera.position.y = mouseY * 100;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Control functions
    window.toggle3DAnimation = function() {
        animation3D = !animation3D;
    };
    
    window.toggleEarthRotation = function() {
        // Implementar
    };
    
    window.showSignalPropagation = function() {
        // Crear líneas de señal desde satélites a Tierra
        satellites3D.forEach(sat => {
            const geometry = new THREE.BufferGeometry();
            const R = 50; const rx = 0, ry = -R, rz = 0; const points = [sat.mesh.position.x, sat.mesh.position.y, sat.mesh.position.z, rx, ry, rz];
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            const material = new THREE.LineBasicMaterial({
                color: 0x00ff00,
                opacity: 0.5,
                transparent: true
            });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            signals.push(line);
            
            // Eliminar después de 2 segundos
            setTimeout(() => {
                scene.remove(line);
            }, 2000);
        });
    };
    
    window.highlightVisibleSatellites = function() {
        // Resaltar satélites visibles desde un punto
        satellites3D.forEach(sat => {
            const elevation = Math.atan2(sat.mesh.position.y, sat.mesh.position.x) * 180 / Math.PI;
            if (Math.abs(elevation) < 45) {
                sat.mesh.material.color.setHex(0x00ff00);
            } else {
                sat.mesh.material.color.setHex(0xffaa00);
            }
        });
        
        setTimeout(() => {
            satellites3D.forEach(sat => {
                sat.mesh.material.color.setHex(0xffaa00);
            });
        }, 3000);
    };
}

// ============================================
//