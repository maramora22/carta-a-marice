// Función para mostrar el contador regresivo
function startCountdown() {
    const weddingDate = new Date("June 28, 2025 00:00:00").getTime();
    const countdown = document.getElementById("countdown");
    const timer = document.getElementById("timer");

    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            clearInterval(interval);
            timer.innerHTML = "¡El gran día ha llegado!";
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            timer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

// Función para manejar la respuesta del usuario
document.getElementById("yes-btn").addEventListener("click", function() {
    document.getElementById("countdown").classList.remove("hidden");
    startCountdown();
});

document.getElementById("no-btn").addEventListener("click", function() {
    alert("Espero que podamos seguir adelante de la mejor manera.");
});
