// CONFIGURACIÓN GLOBAL Y CONSTANTES
// ============================================
const C = 299792458; // Velocidad de la luz en m/s
const G = 6.67430e-11; // Constante gravitacional
const EARTH_MASS = 5.972e24; // Masa de la Tierra en kg
const EARTH_RADIUS = 6371000; // Radio de la Tierra en metros
const GPS_ALTITUDE = 20200000; // Altitud GPS en metros
const GPS_VELOCITY = 14000 * 1000 / 3600; // Velocidad GPS en m/s
const GPS_ORBITAL_RADIUS = EARTH_RADIUS + GPS_ALTITUDE;

// Variables globales para animaciones
let orbitalAnimation = true;
let timeAnimation = true;
let driftAnimation = true;
let gravityAnimation = false;
let animation3D = true;

// Datos para las simulaciones
let satellites = [];
let userPosition = { x: 0, y: 0, z: 0 };
let earthClock = 0;
let gpsClock = 0;
let accumulatedError = 0;
let driftTime = 0;

// ============================================
//