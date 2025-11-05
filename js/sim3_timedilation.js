// SIMULACIÓN 3: DILATACIÓN TEMPORAL
// ============================================
let timeDilationSketch = function(p) {
    let startTime = Date.now();
    let timeScale = 86400; // 1 día por segundo por defecto
    let paused = false;
    
    p.setup = function() {
        p.createCanvas(800, 400);
    };
    
    p.draw = function() {
        p.background(30, 35, 60);
        
        if (!paused) {
            let elapsed = (Date.now() - startTime) / 1000; // segundos transcurridos
            let simulatedDays = elapsed * timeScale / 86400;
            
            // Calcular efectos relativistas
            // Dilatación por velocidad (relatividad especial)
            let gamma = 1 / Math.sqrt(1 - Math.pow(GPS_VELOCITY/C, 2));
            let velocityEffect = (gamma - 1) * simulatedDays * 86400e6; // en microsegundos
            
            // Dilatación gravitacional (relatividad general)
            let earthPotential = -G * EARTH_MASS / EARTH_RADIUS;
            let gpsPotential = -G * EARTH_MASS / GPS_ORBITAL_RADIUS;
            let gravityEffect = (gpsPotential - earthPotential) / (C * C) * simulatedDays * 86400e6;
            
            // Efecto total
            let totalEffect = gravityEffect + velocityEffect;
            
            // Actualizar displays
            document.getElementById('earth-time').textContent = formatTime(simulatedDays * 86400);
            document.getElementById('gps-time').textContent = formatTime(simulatedDays * 86400 + totalEffect/1e6);
            document.getElementById('time-diff').textContent = totalEffect.toFixed(1) + ' μs';
            
            // Visualización
            p.push();
            p.translate(p.width/2, p.height/2);
            
            // Reloj Tierra
            drawClock(p, -200, 0, simulatedDays * 86400, 'Tierra', [100, 200, 255]);
            
            // Reloj GPS
            drawClock(p, 200, 0, simulatedDays * 86400 + totalEffect/1e6, 'GPS', [255, 200, 100]);
            
            // Diferencia visual
            p.stroke(255, 100, 100);
            p.strokeWeight(2);
            p.noFill();
            let diffAngle = (totalEffect/1e6) * Math.PI * 2 / 86400;
            p.arc(0, 0, 300, 300, -Math.PI/2, -Math.PI/2 + diffAngle);
            
            p.pop();
            
            // Gráfico de efectos
            drawEffectsGraph(p, velocityEffect, gravityEffect);
        }
    };
    
    function drawClock(p, x, y, seconds, label, color) {
        p.push();
        p.translate(x, y);
        
        // Círculo del reloj
        p.stroke(color[0], color[1], color[2]);
        p.strokeWeight(3);
        p.fill(0, 0, 0, 150);
        p.ellipse(0, 0, 150);
        
        // Manecillas
        let hours = (seconds / 3600) % 12;
        let minutes = (seconds / 60) % 60;
        let secs = seconds % 60;
        
        // Hora
        p.push();
        p.rotate(hours * Math.PI / 6 - Math.PI/2);
        p.stroke(255);
        p.strokeWeight(4);
        p.line(0, 0, 40, 0);
        p.pop();
        
        // Minutos
        p.push();
        p.rotate(minutes * Math.PI / 30 - Math.PI/2);
        p.stroke(255);
        p.strokeWeight(3);
        p.line(0, 0, 55, 0);
        p.pop();
        
        // Segundos
        p.push();
        p.rotate(secs * Math.PI / 30 - Math.PI/2);
        p.stroke(255, 100, 100);
        p.strokeWeight(2);
        p.line(0, 0, 65, 0);
        p.pop();
        
        // Centro
        p.fill(255);
        p.noStroke();
        p.ellipse(0, 0, 10);
        
        // Etiqueta
        p.textAlign(p.CENTER);
        p.textSize(16);
        p.text(label, 0, 100);
        
        p.pop();
    }
    
    function drawEffectsGraph(p, velocityEffect, gravityEffect) {
        p.push();
        p.translate(50, p.height - 100);
        
        // Ejes
        p.stroke(255, 255, 255, 100);
        p.strokeWeight(1);
        p.line(0, 0, 200, 0);
        p.line(0, -50, 0, 50);
        
        // Barras
        p.noStroke();
        
        // Efecto velocidad (negativo)
        p.fill(255, 100, 100);
        p.rect(20, 0, 40, velocityEffect * 0.5);
        
        // Efecto gravedad (positivo)
        p.fill(100, 255, 100);
        p.rect(80, 0, 40, -gravityEffect * 0.5);
        
        // Total
        p.fill(100, 100, 255);
        p.rect(140, 0, 40, -(gravityEffect + velocityEffect) * 0.5);
        
        // Etiquetas
        p.fill(255);
        p.textAlign(p.CENTER);
        p.textSize(10);
        p.text('Velocidad', 40, 65);
        p.text('Gravedad', 100, 65);
        p.text('Total', 160, 65);
        
        p.pop();
    }
    
    function formatTime(seconds) {
        let h = Math.floor(seconds / 3600);
        let m = Math.floor((seconds % 3600) / 60);
        let s = (seconds % 60).toFixed(3);
        return `${pad(h)}:${pad(m)}:${pad(s, 6)}`;
    }
    
    function pad(num, size = 2) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
    
    window.resetClocks = function() {
        startTime = Date.now();
    };
    
    window.toggleTimeDilation = function() {
        paused = !paused;
    };
    
    window.updateTimeScale = function(value) {
        timeScale = parseFloat(value) * 86400;
    };
    
    window.changeTimeScale = function() {
        let scales = [1, 10, 100, 365];
        let current = scales.findIndex(s => s * 86400 === timeScale);
        timeScale = scales[(current + 1) % scales.length] * 86400;
        document.getElementById('days-per-sec').value = timeScale / 86400;
    };
};

// ============================================
//