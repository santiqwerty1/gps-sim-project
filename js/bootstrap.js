// INICIALIZACIÓN
// ============================================
window.onload = function() {
    // Inicializar sketches de p5.js
    new p5(orbitalSketch, 'gps-orbital');
    new p5(triangulationSketch, 'triangulation');
    new p5(timeDilationSketch, 'time-dilation');
    new p5(driftSketch, 'drift-simulation');
    new p5(gravityFieldSketch, 'gravity-field');
    
    // Inicializar gráficos Plotly
    initCombinedEffects();
    
    // Inicializar visualización 3D
    init3DVisualization();
};

// ============================================
//