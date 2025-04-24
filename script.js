// Obtener referencias a los elementos HTML
const proposalSection = document.getElementById('proposal-section');
const celebrationSection = document.getElementById('celebration-section');
const acceptButton = document.getElementById('accept-button');
const countdownDisplay = document.getElementById('countdown');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const music = document.getElementById('background-music');

// --- Lógica para el Botón y Ocultar/Mostrar Secciones ---
acceptButton.addEventListener('click', () => {
    // Ocultar la sección de la propuesta
    proposalSection.classList.add('hidden');

    // Mostrar la sección de celebración
    celebrationSection.classList.remove('hidden');

    // Mostrar el canvas de fuegos artificiales
    fireworksCanvas.classList.remove('hidden');

    // Intentar reproducir la música si aún no lo ha hecho (por restricciones de autoplay)
    if (music.paused) {
        music.play().catch(error => {
            console.log("Error al intentar reproducir la música:", error);
            // Opcional: mostrar un mensaje al usuario para que haga clic para iniciar la música
        });
    }


    // Iniciar el contador
    startCountdown();

    // Iniciar los fuegos artificiales
    startFireworks();
});

// --- Lógica para el Contador Regresivo ---

// Fecha objetivo: 28 de junio de 2025 a las 00:00:00
const targetDate = new Date('2025-06-28T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostrar los resultados en los elementos correspondientes
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    // Si la cuenta regresiva termina
    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownDisplay.innerHTML = "<h2>¡El día ha llegado!</h2>";
        // Puedes detener o cambiar la animación de fuegos artificiales aquí si quieres
    }
}

let countdownInterval; // Variable para guardar el ID del intervalo

function startCountdown() {
     // Actualizar la cuenta regresiva cada 1 segundo
     countdownInterval = setInterval(updateCountdown, 1000);
     // Llamar a updateCountdown una vez inmediatamente para evitar el retraso inicial de 1 segundo
     updateCountdown();
}


// --- Lógica para los Fuegos Artificiales (Implementación básica con Canvas) ---

const ctx = fireworksCanvas.getContext('2d');
let particles = []; // Array para guardar las partículas de los fuegos artificiales

// Ajustar el tamaño del canvas
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas); // Ajustar si se redimensiona la ventana

// Partícula individual
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1; // Opacidad
        this.friction = 0.98; // Fricción para ralentizar
        this.gravity = 0.5; // Gravedad para que caigan
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false); // Dibujar un círculo pequeño
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.velocity.y += this.gravity; // Aplicar gravedad
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.005; // Desvanecer la partícula

        // Si la opacidad es muy baja, la partícula "muere"
        return this.alpha > 0;
    }
}

// Crear una explosión de fuegos artificiales
function createExplosion(x, y, color) {
    const particleCount = 100; // Número de partículas por explosión
    const angleIncrement = (Math.PI * 2) / particleCount; // Ángulo entre partículas

    for (let i = 0; i < particleCount; i++) {
        const angle = i * angleIncrement;
        const velocity = {
            x: Math.cos(angle) * (Math.random() * 8 + 2), // Velocidad horizontal aleatoria
            y: Math.sin(angle) * (Math.random() * 8 + 2)  // Velocidad vertical aleatoria
        };
        particles.push(new Particle(x, y, color, velocity));
    }
}

// Bucle principal de animación
let animationFrameId;

function animateFireworks() {
    animationFrameId = requestAnimationFrame(animateFireworks); // Bucle continuo

    // Reducir la opacidad del fondo para crear un efecto de rastro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Fondo semi-transparente oscuro
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    // Actualizar y dibujar partículas
    particles = particles.filter(particle => particle.update()); // Eliminar partículas muertas

    particles.forEach(particle => {
        particle.draw();
    });

    // Opcional: Crear nuevas explosiones aleatorias periódicamente
    if (Math.random() < 0.05) { // Pequeña probabilidad de crear una nueva explosión
        const x = Math.random() * fireworksCanvas.width;
        const y = Math.random() * fireworksCanvas.height * 0.8; // Evitar explosiones demasiado bajas
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF']; // Colores aleatorios
        const color = colors[Math.floor(Math.random() * colors.length)];
        createExplosion(x, y, color);
    }
}

function startFireworks() {
    // Limpiar cualquier animación anterior y partículas
    cancelAnimationFrame(animationFrameId);
    particles = [];

    // Asegurarse de que el canvas tiene el tamaño correcto
    resizeCanvas();

    // Empezar la animación de fuegos artificiales
    animateFireworks();

    // Crear algunas explosiones iniciales para empezar
    setTimeout(() => createExplosion(fireworksCanvas.width * 0.25, fireworksCanvas.height * 0.5, '#FF0000'), 500);
    setTimeout(() => createExplosion(fireworksCanvas.width * 0.75, fireworksCanvas.height * 0.5, '#00FF00'), 1000);
    setTimeout(() => createExplosion(fireworksCanvas.width * 0.5, fireworksCanvas.height * 0.3, '#FFFF00'), 1500);
}

// Asegurarse de que el canvas tiene el tamaño correcto al cargar la página inicialmente
resizeCanvas();
