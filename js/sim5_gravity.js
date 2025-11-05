// SIMULACIÓN 5: CAMPO GRAVITACIONAL
// ============================================
let gravityFieldSketch = function(p) {
    let particles = [];
    let showContours = false;
    
    p.setup = function() {
        p.createCanvas(800, 600);
        p.colorMode(p.HSB, 360, 100, 100, 100);
    };
    
    p.draw = function() {
        p.background(240, 30, 10);
        
        p.push();
        p.translate(p.width/2, p.height/2);
        
        // Dibujar campo gravitacional como gradiente
        for(let r = 400; r > 50; r -= 5) {
            let altitude = (r - 50) * 100; // escala a km
            
            // Calcular intensidad gravitacional
            let g = G * EARTH_MASS / Math.pow(EARTH_RADIUS + altitude * 1000, 2);
            let gSurface = G * EARTH_MASS / Math.pow(EARTH_RADIUS, 2);
            let ratio = g / gSurface;
            
            // Color basado en intensidad
            let hue = p.map(ratio, 0, 1, 240, 0); // Azul a rojo
            let brightness = p.map(ratio, 0, 1, 80, 100);
            
            p.noStroke();
            p.fill(hue, 70, brightness, 20);
            p.ellipse(0, 0, r * 2);
        }
        
        // Tierra
        p.fill(120, 50, 30);
        p.noStroke();
        p.ellipse(0, 0, 100);
        
        // Órbita GPS
        p.noFill();
        p.stroke(60, 100, 100);
        p.strokeWeight(3);
        p.ellipse(0, 0, 350 * 2);
        
        // Etiquetas
        p.fill(0, 0, 100);
        p.noStroke();
        p.textAlign(p.CENTER);
        p.textSize(12);
        p.text('TIERRA', 0, 0);
        p.text('Órbita GPS', 350, -10);
        p.text('20,200 km', 350, 10);
        
        // Contornos de tiempo
        if (showContours) {
            p.stroke(0, 0, 100, 50);
            p.strokeWeight(1);
            p.noFill();
            for(let r = 100; r < 400; r += 50) {
                p.ellipse(0, 0, r * 2);
                
                // Calcular dilatación temporal
                let altitude = (r - 50) * 100 * 1000;
                let potential = -G * EARTH_MASS / (EARTH_RADIUS + altitude);
                let timeDilation = Math.sqrt(1 + 2 * potential / (C * C));
                let microsecondsPerDay = (1 - timeDilation) * 86400 * 1e6;
                
                p.fill(0, 0, 100);
                p.noStroke();
                p.text(microsecondsPerDay.toFixed(1) + 'μs/día', r + 10, 0);
                p.stroke(0, 0, 100, 50);
                p.noFill();
            }
        }
        
        // Partículas de prueba
        if (gravityAnimation) {
            particles.forEach((particle, index) => {
                let distance = p.dist(0, 0, particle.x, particle.y);
                let altitude = (distance - 50) * 100 * 1000;
                
                if (altitude > 0) {
                    let g = G * EARTH_MASS / Math.pow(EARTH_RADIUS + altitude, 2);
                    let angle = Math.atan2(particle.y, particle.x);
                    
                    // Aplicar aceleración gravitacional
                    particle.vx -= g * Math.cos(angle) * 0.00001;
                    particle.vy -= g * Math.sin(angle) * 0.00001;
                    
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Dibujar partícula
                    p.fill(180, 100, 100);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, 8);
                    
                    // Trail
                    p.stroke(180, 100, 100, 30);
                    p.strokeWeight(1);
                    p.line(particle.x, particle.y, particle.x - particle.vx * 10, particle.y - particle.vy * 10);
                } else {
                    particles.splice(index, 1);
                }
            });
        }
        
        p.pop();
        
        // Escala de colores
        drawColorScale(p);
    };
    
    function drawColorScale(p) {
        p.push();
        p.translate(p.width - 100, 50);
        
        p.fill(0, 0, 0, 50);
        p.noStroke();
        p.rect(-20, -10, 110, 220, 5);
        
        for(let i = 0; i < 200; i++) {
            let hue = p.map(i, 0, 200, 0, 240);
            p.stroke(hue, 70, 80);
            p.line(10, i, 40, i);
        }
        
        p.fill(0, 0, 100);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(12);
        p.text('Fuerte', 50, 10);
        p.text('Débil', 50, 200);
        p.text('Gravedad', 0, -15);
        
        p.pop();
    }
    
    window.toggleGravityAnimation = function() {
        gravityAnimation = !gravityAnimation;
    };
    
    window.showTimeContours = function() {
        showContours = !showContours;
    };
    
    window.addTestParticle = function() {
        particles.push({
            x: Math.random() * 600 - 300,
            y: -300,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2
        });
    };
};

// ============================================
//