// SIMULACIÓN 6: EFECTOS COMBINADOS (PLOTLY)
// ============================================
function initCombinedEffects() {
    let days = Array.from({length: 30}, (_, i) => i + 1);
    
    // Calcular efectos acumulados
    let velocityEffects = days.map(d => -7 * d);
    let gravityEffects = days.map(d => 45 * d);
    let totalEffects = days.map(d => 38 * d);
    let errorKm = days.map(d => 11.4 * d);
    
    // Gráfico 1: Efectos relativistas
    let trace1 = {
        x: days,
        y: velocityEffects,
        type: 'scatter',
        name: 'Efecto Velocidad',
        line: {color: '#ff6b6b'}
    };
    
    let trace2 = {
        x: days,
        y: gravityEffects,
        type: 'scatter',
        name: 'Efecto Gravedad',
        line: {color: '#51cf66'}
    };
    
    let trace3 = {
        x: days,
        y: totalEffects,
        type: 'scatter',
        name: 'Efecto Total',
        line: {color: '#339af0', width: 3}
    };
    
    let layout1 = {
        title: 'Efectos Relativistas Acumulados',
        xaxis: {title: 'Días'},
        yaxis: {title: 'Microsegundos'},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0.1)',
        font: {color: 'white'}
    };
    
    // Gráfico 2: Error de posición
    let trace4 = {
        x: days,
        y: errorKm,
        type: 'scatter',
        fill: 'tozeroy',
        name: 'Error de Posición',
        line: {color: '#ffd43b'}
    };
    
    let layout2 = {
        title: 'Error de Posición Sin Corrección',
        xaxis: {title: 'Días'},
        yaxis: {title: 'Kilómetros'},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0.1)',
        font: {color: 'white'}
    };
    
    // Crear gráficos
    Plotly.newPlot('combined-effects', [trace1, trace2, trace3], layout1);
    
    // Añadir segundo gráfico
    setTimeout(() => {
        let div2 = document.createElement('div');
        div2.id = 'error-graph';
        div2.style.marginTop = '20px';
        document.getElementById('combined-effects').appendChild(div2);
        Plotly.newPlot(div2, [trace4], layout2);
    }, 100);
}

// ============================================
//
// FUNCIONES AUXILIARES
// ============================================
window.updateCombinedChart = function() {
    initCombinedEffects();
};

window.exportData = function() {
    // Crear datos para exportar
    let data = {
        constants: {
            c: C,
            G: G,
            earthMass: EARTH_MASS,
            earthRadius: EARTH_RADIUS,
            gpsAltitude: GPS_ALTITUDE,
            gpsVelocity: GPS_VELOCITY
        },
        effects: {
            velocityEffect: -7,
            gravityEffect: 45,
            totalEffect: 38,
            dailyError: 11.4
        },
        calculations: []
    };
    
    // Calcular 30 días
    for(let day = 1; day <= 30; day++) {
        data.calculations.push({
            day: day,
            velocityEffect_us: -7 * day,
            gravityEffect_us: 45 * day,
            totalEffect_us: 38 * day,
            positionError_km: 11.4 * day
        });
    }
    
    // Descargar como JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gps_relativity_data.json';
    a.click();
};

// Calcular efectos en otros planetas (bonus)
function calculateEffectsOnPlanet(planetMass, planetRadius, satelliteAltitude, satelliteVelocity) {
    // Efecto de velocidad
    let gamma = 1 / Math.sqrt(1 - Math.pow(satelliteVelocity/C, 2));
    let velocityEffect = (gamma - 1) * 86400e6;
    
    // Efecto gravitacional
    let surfacePotential = -G * planetMass / planetRadius;
    let orbitPotential = -G * planetMass / (planetRadius + satelliteAltitude);
    let gravityEffect = (orbitPotential - surfacePotential) / (C * C) * 86400e6;
    
    return {
        velocity: velocityEffect,
        gravity: gravityEffect,
        total: velocityEffect + gravityEffect
    };
}

// Datos de planetas para comparación
const planets = {
    mars: {
        mass: 6.39e23,
        radius: 3389500,
        gpsAltitude: 17000000,
        name: 'Marte'
    },
    jupiter: {
        mass: 1.898e27,
        radius: 69911000,
        gpsAltitude: 100000000,
        name: 'Júpiter'
    },
    moon: {
        mass: 7.34e22,
        radius: 1737400,
        gpsAltitude: 5000000,
        name: 'Luna'
    }
};