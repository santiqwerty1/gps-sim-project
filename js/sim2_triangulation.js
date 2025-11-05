// SIMULACIÓN 2: TRIANGULACIÓN GPS
// ============================================
let triangulationSketch = function(p) {
    let sats = [];
    let userPos = {x: 0, y: 0};
    let animating = false;
    let animationStep = 0;
    
    p.setup = function() {
        p.createCanvas(800, 600);
        
        // Inicializar 4 satélites por defecto
        sats = [
            {x: -200, y: -150, r: 0, color: [255, 100, 100]},
            {x: 200, y: -150, r: 0, color: [100, 255, 100]},
            {x: -150, y: 200, r: 0, color: [100, 100, 255]},
            {x: 150, y: 150, r: 0, color: [255, 255, 100]}
        ];
        updateDistances();
    };
    
    p.draw = function() {
        // Fondo
        p.background(25, 28, 50);
        
        // Rejilla
        p.stroke(255, 255, 255, 20);
        p.strokeWeight(1);
        for(let i = 0; i < p.width; i += 50) {
            p.line(i, 0, i, p.height);
        }
        for(let j = 0; j < p.height; j += 50) {
            p.line(0, j, p.width, j);
        }
        
        p.push();
        p.translate(p.width/2, p.height/2);
        
        // Dibujar esferas de distancia
        sats.forEach((sat, index) => {
            if (index < parseInt(document.getElementById('sat-count').value)) {
                // Esfera de distancia
                p.noFill();
                p.strokeWeight(2);
                p.stroke(sat.color[0], sat.color[1], sat.color[2], 100);
                
                if (animating) {
                    let animRadius = p.lerp(0, sat.r, animationStep / 100);
                    p.ellipse(sat.x, sat.y, animRadius * 2);
                } else {
                    p.ellipse(sat.x, sat.y, sat.r * 2);
                }
                
                // Satélite
                p.fill(sat.color[0], sat.color[1], sat.color[2]);
                p.noStroke();
                p.ellipse(sat.x, sat.y, 20);
                
                // Línea al usuario
                p.stroke(sat.color[0], sat.color[1], sat.color[2], 50);
                p.strokeWeight(1);
                p.line(sat.x, sat.y, userPos.x, userPos.y);
                
                // Etiqueta
                p.fill(255);
                p.noStroke();
                p.textAlign(p.CENTER);
                p.text(`Sat ${index + 1}`, sat.x, sat.y - 15);
                p.text(`${Math.round(sat.r)}m`, sat.x, sat.y + 35);
            }
        });
        
        // Dibujar intersecciones
        drawIntersections(p);
        
        // Usuario/Receptor
        p.fill(255, 200, 0);
        p.noStroke();
        p.ellipse(userPos.x, userPos.y, 15);
        p.stroke(255, 200, 0);
        p.strokeWeight(2);
        p.line(userPos.x - 10, userPos.y, userPos.x + 10, userPos.y);
        p.line(userPos.x, userPos.y - 10, userPos.x, userPos.y + 10);
        
        p.pop();
        
        // Información
        p.fill(255);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(14);
        let satCount = parseInt(document.getElementById('sat-count').value);
        p.text(`Satélites activos: ${satCount}`, 20, 30);
        p.text(`Posición: (${Math.round(userPos.x)}, ${Math.round(userPos.y)})`, 20, 50);
        
        let precision = ['Imposible', 'Superficie esférica', 'Círculo', '2 puntos', 'Punto único'][satCount];
        p.text(`Precisión: ${precision}`, 20, 70);
        
        if (animating) {
            animationStep += 2;
            if (animationStep > 100) {
                animating = false;
                animationStep = 0;
            }
        }
    };
    
    
function drawIntersections(p) {
    const satCount = parseInt(document.getElementById('sat-count').value);
    const EPS = 1.0; // tolerancia para validar con el tercer círculo

    function circleIntersections(x0, y0, r0, x1, y1, r1) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        const d = Math.hypot(dx, dy);
        if (d > r0 + r1 || d < Math.abs(r0 - r1) || d === 0) return []; // 0 soluciones

        // distancia desde c0 al eje de intersección
        const a = (r0*r0 - r1*r1 + d*d) / (2*d);
        const h2 = r0*r0 - a*a;
        if (h2 < 0) return [];
        const h = Math.sqrt(h2);

        // punto medio entre las intersecciones sobre la línea c0->c1
        const xm = x0 + a * dx / d;
        const ym = y0 + a * dy / d;

        // desplazamiento perpendicular
        const rx = -dy * (h / d);
        const ry =  dx * (h / d);

        return [
            {x: xm + rx, y: ym + ry},
            {x: xm - rx, y: ym - ry}
        ];
    }

    // dibujar intersecciones REALES
    if (satCount >= 2) {
        for (let i = 0; i < satCount - 1; i++) {
            for (let j = i + 1; j < satCount; j++) {
                const s1 = sats[i], s2 = sats[j];
                const pts = circleIntersections(s1.x, s1.y, s1.r, s2.x, s2.y, s2.r);

                pts.forEach(pt => {
                    // Validar con un tercer círculo (si existe)
                    let valid = (satCount < 3); // si no hay tercero, solo marcamos
                    for (let k = 0; k < satCount; k++) {
                        if (k === i || k === j) continue;
                        const s3 = sats[k];
                        const d3 = Math.hypot(pt.x - s3.x, pt.y - s3.y);
                        if (Math.abs(d3 - s3.r) <= EPS) {
                            valid = true; break;
                        }
                    }
                    p.noStroke();
                    p.fill(valid ? 255 : 255, valid ? 80 : 0, 0, 220);
                    p.ellipse(pt.x, pt.y, 8, 8);
                });
            }
        }
    }
}

    p.mousePressed = function() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            userPos.x = p.mouseX - p.width/2;
            userPos.y = p.mouseY - p.height/2;
            updateDistances();
        }
    };
    
    function updateDistances() {
        sats.forEach(sat => {
            sat.r = p.dist(sat.x, sat.y, userPos.x, userPos.y);
        });
    }
    
    window.animateTriangulation = function() {
        animating = true;
        animationStep = 0;
    };
    
    window.updateSatelliteCount = function(value) {
        // El select ya actualiza, solo necesitamos redibujar
    };
    
    window.addSatellite = function() {
        if (sats.length < 8) {
            sats.push({
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 300,
                r: 0,
                color: [
                    Math.random() * 155 + 100,
                    Math.random() * 155 + 100,
                    Math.random() * 155 + 100
                ]
            });
            updateDistances();
        }
    };
    
    window.removeSatellite = function() {
        if (sats.length > 1) {
            sats.pop();
        }
    };
};

// ============================================
//