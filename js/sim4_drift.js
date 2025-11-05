// SIMULACIÓN 4: DERIVA GPS
// ============================================
let driftSketch = function(p) {
    let mapImage;
    let currentLocation = 'nyc';
    let locations = {
        nyc: {lat: 40.7128, lon: -74.0060, name: 'Nueva York'},
        london: {lat: 51.5074, lon: -0.1278, name: 'Londres'},
        tokyo: {lat: 35.6762, lon: 139.6503, name: 'Tokyo'},
        sydney: {lat: -33.8688, lon: 151.2093, name: 'Sydney'},
        mexico: {lat: 19.4326, lon: -99.1332, name: 'Ciudad de México'}
    };
    
    let realPos = {x: 400, y: 300};
    let uncorrectedPos = {x: 400, y: 300};
    let driftRate = 11.4 / 86400 * 1000; // metros por segundo
    let elapsedTime = 0;
    let showCorrected = true;
    let showUncorrected = true;
    
    p.setup = function() {
        p.createCanvas(800, 600);
    };
    
    p.draw = function() {
        // Fondo tipo mapa
        p.background(50, 100, 150);
        
        // Rejilla de coordenadas
        p.stroke(255, 255, 255, 30);
        p.strokeWeight(1);
        for(let i = 0; i < p.width; i += 40) {
            p.line(i, 0, i, p.height);
        }
        for(let j = 0; j < p.height; j += 40) {
            p.line(0, j, p.width, j);
        }
        
        // Simular calles/terreno
        p.stroke(200, 200, 200, 50);
        for(let i = 0; i < 20; i++) {
            let x1 = p.random(p.width);
            let y1 = p.random(p.height);
            let x2 = x1 + p.random(-100, 100);
            let y2 = y1 + p.random(-100, 100);
            p.line(x1, y1, x2, y2);
        }
        
        // Actualizar deriva
        if (driftAnimation) {
            const dt = p.deltaTime / 1000; // segundos reales
            elapsedTime += dt;
            let drift = driftRate * elapsedTime / 1000; // conversión a píxeles
            
            // Deriva en dirección aleatoria pero consistente
            let driftAngle = elapsedTime * 0.1;
            uncorrectedPos.x = realPos.x + Math.cos(driftAngle) * drift;
            uncorrectedPos.y = realPos.y + Math.sin(driftAngle) * drift;
            
            // Actualizar displays
            document.getElementById('accumulated-error').textContent = 
                (driftRate * elapsedTime).toFixed(1) + ' metros';
            document.getElementById('elapsed-time').textContent = 
                (elapsedTime / 3600).toFixed(2) + ' horas';
        }
        
        // Círculo de error
        if (showUncorrected) {
            p.noFill();
            p.stroke(255, 100, 100, 100);
            p.strokeWeight(2);
            let errorRadius = driftRate * elapsedTime / 10; // escala visual
            p.ellipse(realPos.x, realPos.y, errorRadius * 2);
        }
        
        // Posición real/corregida
        if (showCorrected) {
            p.fill(0, 255, 0);
            p.noStroke();
            p.ellipse(realPos.x, realPos.y, 20);
            p.fill(255);
            p.textAlign(p.CENTER);
            p.text('Posición Real', realPos.x, realPos.y - 20);
        }
        
        // Posición sin corrección
        if (showUncorrected) {
            p.fill(255, 0, 0);
            p.noStroke();
            p.ellipse(uncorrectedPos.x, uncorrectedPos.y, 20);
            
            // Línea de deriva
            p.stroke(255, 100, 100, 150);
            p.strokeWeight(2);
            p.line(realPos.x, realPos.y, uncorrectedPos.x, uncorrectedPos.y);
            
            p.fill(255);
            p.textAlign(p.CENTER);
            p.text('Sin Relatividad', uncorrectedPos.x, uncorrectedPos.y - 20);
        }
        
        // Panel de información
        p.fill(0, 0, 0, 150);
        p.noStroke();
        p.rect(10, 10, 250, 120, 10);
        
        p.fill(255);
        p.textAlign(p.LEFT);
        p.textSize(14);
        p.text('Ubicación: ' + locations[currentLocation].name, 20, 35);
        p.text('Deriva diaria: 11.4 km', 20, 55);
        p.text('Velocidad deriva: ' + (driftRate * 3.6).toFixed(2) + ' km/h', 20, 75);
        p.text('Error actual: ' + (driftRate * elapsedTime).toFixed(1) + ' m', 20, 95);
        p.text('Tiempo: ' + (elapsedTime / 3600).toFixed(2) + ' horas', 20, 115);
    };
    
    window.resetDrift = function() {
        elapsedTime = 0;
        uncorrectedPos = {x: realPos.x, y: realPos.y};
    };
    
    window.toggleDrift = function() {
        driftAnimation = !driftAnimation;
    };
    
    window.showWithCorrection = function() {
        showCorrected = true;
        showUncorrected = false;
    };
    
    window.showWithoutCorrection = function() {
        showCorrected = false;
        showUncorrected = true;
    };
    
    window.changeLocation = function(loc) {
        currentLocation = loc;
        // Podrías ajustar la visualización según la ubicación
    };
};

// ============================================
//