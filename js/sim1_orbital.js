// SIMULACIÓN 1: SISTEMA ORBITAL GPS
// ============================================
let orbitalSketch = function(p) {
    let angle = 0;
    let speed = 1;
    let showTrails = false;
    let trails = [];
    let viewMode = 0; // 0: Vista superior, 1: Vista lateral, 2: Vista 3D
    
    p.setup = function() {
        p.createCanvas(800, 600);
        
        // Inicializar 31 satélites en 6 planos orbitales
        for (let plane = 0; plane < 6; plane++) {
            let planeAngle = (plane * 60) * Math.PI / 180;
            let satellitesInPlane = plane < 4 ? 5 : 6; // 4 planos con 5, 2 con 6
            
            for (let sat = 0; sat < satellitesInPlane; sat++) {
                let satAngle = (sat * 360 / satellitesInPlane) * Math.PI / 180;
                satellites.push({
                    plane: plane,
                    angle: satAngle,
                    planeAngle: planeAngle,
                    trail: []
                });
            }
        }
    };
    
    p.draw = function() {
        // Fondo con gradiente
        for(let i = 0; i <= p.height; i++){
            let inter = p.map(i, 0, p.height, 0, 1);
            let c = p.lerpColor(p.color(20, 24, 82), p.color(10, 10, 30), inter);
            p.stroke(c);
            p.line(0, i, p.width, i);
        }
        
        p.push();
        p.translate(p.width/2, p.height/2);
        
        // Dibujar la Tierra
        p.noStroke();
        let earthSize = 100;
        
        // Gradiente para la Tierra
        for(let r = earthSize; r > 0; r -= 2) {
            let alpha = p.map(r, 0, earthSize, 255, 100);
            p.fill(50, 150, 250, alpha);
            p.ellipse(0, 0, r*2);
        }
        
        // Continentes simplificados
        p.fill(100, 200, 100, 200);
        p.ellipse(-20, -10, 40, 30);
        p.ellipse(25, 5, 35, 25);
        
        // Dibujar órbitas y satélites
        satellites.forEach((sat, index) => {
            let orbitRadius = 250;
            
            // Calcular posición según el modo de vista
            let x, y;
            if (viewMode === 0) { // Vista superior
                x = Math.cos(sat.angle + angle * speed) * orbitRadius;
                y = Math.sin(sat.angle + angle * speed) * orbitRadius;
            } else if (viewMode === 1) { // Vista lateral
                x = Math.cos(sat.angle + angle * speed) * orbitRadius * Math.cos(sat.planeAngle);
                y = Math.sin(sat.angle + angle * speed) * orbitRadius;
            } else { // Vista pseudo-3D
                let perspective = 0.7;
                x = Math.cos(sat.angle + angle * speed) * orbitRadius;
                y = Math.sin(sat.angle + angle * speed) * orbitRadius * perspective;
                y += Math.sin(sat.planeAngle) * 50;
            }
            
            // Guardar trail
            if (showTrails && p.frameCount % 2 === 0) {
                sat.trail.push({x: x, y: y});
                if (sat.trail.length > 50) sat.trail.shift();
            }
            
            // Dibujar trail
            if (showTrails) {
                p.noFill();
                p.strokeWeight(1);
                p.stroke(100, 200, 255, 100);
                p.beginShape();
                sat.trail.forEach(point => {
                    p.vertex(point.x, point.y);
                });
                p.endShape();
            }
            
            // Dibujar línea de órbita
            p.stroke(255, 255, 255, 30);
            p.strokeWeight(1);
            p.noFill();
            if (viewMode === 0) {
                p.ellipse(0, 0, orbitRadius * 2);
            }
            
            // Dibujar satélite
            p.push();
            p.translate(x, y);
            
            // Cuerpo del satélite
            p.fill(255, 200, 0);
            p.noStroke();
            p.ellipse(0, 0, 12, 12);
            
            // Paneles solares
            p.stroke(100, 150, 255);
            p.strokeWeight(3);
            p.line(-20, 0, -8, 0);
            p.line(8, 0, 20, 0);
            
            // Número del satélite
            p.fill(255);
            p.noStroke();
            p.textAlign(p.CENTER);
            p.textSize(8);
            p.text(index + 1, 0, -10);
            
            p.pop();
        });
        
        p.pop();
        
        // Información en pantalla
        p.fill(255);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(14);
        p.text(`Vista: ${['Superior', 'Lateral', '3D'][viewMode]}`, 20, 30);
        p.text(`Velocidad: ${speed.toFixed(1)}x`, 20, 50);
        p.text(`Satélites visibles: ${countVisibleSatellites()}`, 20, 70);
        
        if (orbitalAnimation) {
            angle += 0.002;
        }
    };
    
    
function countVisibleSatellites() {
    // Heurística determinista basada en un receptor en la superficie y horizonte local.
    const RE = 100; // radio "Tierra" en esta escena
    const orbitRadius = 250;
    const rec = {x: 0, y: -RE, z: 0};
    const recHat = {x: 0, y: -1, z: 0}; // normal local

    let count = 0;
    satellites.forEach(sat => {
        const theta = sat.angle + angle * speed;
        const x = Math.cos(theta) * orbitRadius;
        const y = Math.sin(theta) * orbitRadius * Math.cos(sat.planeAngle);
        const z = Math.sin(sat.planeAngle) * orbitRadius * 0.5;
        const dot = recHat.x * x + recHat.y * y + recHat.z * z;
        if (dot > RE) count++;
    });
    return Math.min(count, 12);
}

window.toggleOrbitalAnimation = function() {
        orbitalAnimation = !orbitalAnimation;
    };
    
    window.changeOrbitalView = function() {
        viewMode = (viewMode + 1) % 3;
    };
    
    window.toggleSatelliteTrails = function() {
        showTrails = !showTrails;
        if (!showTrails) {
            satellites.forEach(sat => sat.trail = []);
        }
    };
    
    window.updateOrbitalSpeed = function(value) {
        speed = parseFloat(value);
    };
};

// ============================================
//