// Actualizar la hora en la barra de estado
function updateStatusBarTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Formato de 12 horas
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;

    const timeString = `${hours}:${minutes} ${ampm}`;
    document.querySelector('.status-bar-time').textContent = timeString;
}

// Actualizar la hora cada minuto
updateStatusBarTime();
setInterval(updateStatusBarTime, 60000);

// Crear círculos flotantes
const connections = document.getElementById('connections');
const numCircles = 10; // Menos círculos para mejor rendimiento
const circles = [];

// Crear círculos con posiciones aleatorias
for (let i = 0; i < numCircles; i++) {
    const size = Math.random() * 60 + 20; // Tamaños más pequeños para el mockup
    const circle = document.createElement('div');
    circle.classList.add('circle');

    // Posición aleatoria
    const x = Math.random() * 350; // Ajustado al tamaño del mockup
    const y = Math.random() * 700;

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    // Velocidad y dirección aleatorias
    circle.dataset.vx = Math.random() * 0.8 - 0.4; // Velocidad más lenta
    circle.dataset.vy = Math.random() * 0.8 - 0.4;

    // Color aleatorio entre azul claro y oscuro
    const opacity = Math.random() * 0.3 + 0.1;
    circle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;

    // Animación con retraso aleatorio
    circle.style.animationDelay = `${Math.random() * 5}s`;
    circle.style.animationDuration = `${Math.random() * 10 + 15}s`; // Más lento

    connections.appendChild(circle);
    circles.push({
        element: circle,
        x,
        y,
        size: size / 2, // radio
        vx: parseFloat(circle.dataset.vx),
        vy: parseFloat(circle.dataset.vy)
    });
}

// Función para dibujar conexiones entre círculos cercanos
function drawConnections() {
    // Limpiar conexiones anteriores
    const lines = document.querySelectorAll('.connection-line');
    lines.forEach(line => line.remove());

    // Verificar distancias entre círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            const circle1 = circles[i];
            const circle2 = circles[j];

            // Calcular distancia entre círculos
            const dx = circle1.x - circle2.x;
            const dy = circle1.y - circle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Si están lo suficientemente cerca, dibujar una línea
            if (distance < 120) { // Distancia más corta para el mockup
                const opacity = 1 - distance / 120; // Más transparente cuanto más lejos

                // Crear línea SVG
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', circle1.x);
                line.setAttribute('y1', circle1.y);
                line.setAttribute('x2', circle2.x);
                line.setAttribute('y2', circle2.y);
                line.setAttribute('stroke', `rgba(255, 255, 255, ${opacity * 0.2})`);
                line.setAttribute('stroke-width', '1');
                line.classList.add('connection-line');

                // Si no existe un SVG, crearlo
                let svg = document.querySelector('svg.connections-svg');
                if (!svg) {
                    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.classList.add('connections-svg');
                    svg.style.position = 'absolute';
                    svg.style.top = '0';
                    svg.style.left = '0';
                    svg.style.width = '100%';
                    svg.style.height = '100%';
                    svg.style.zIndex = '0';
                    connections.appendChild(svg);
                }

                svg.appendChild(line);
            }
        }
    }
}

// Función para actualizar posiciones de círculos
function updateCircles() {
    circles.forEach(circle => {
        // Obtener posición actual
        const rect = circle.element.getBoundingClientRect();
        circle.x = rect.left + circle.size - document.querySelector('.phone-screen').getBoundingClientRect().left;
        circle.y = rect.top + circle.size - document.querySelector('.phone-screen').getBoundingClientRect().top;
    });

    // Dibujar conexiones
    drawConnections();

    // Programar siguiente actualización
    requestAnimationFrame(updateCircles);
}

// Iniciar animación
updateCircles();

// Función para simular división celular (mitosis) ocasionalmente
function simulateMitosis() {
    // Seleccionar un círculo aleatorio para dividir
    if (circles.length < 18) { // Limitar número máximo de círculos
        const randomIndex = Math.floor(Math.random() * circles.length);
        const parentCircle = circles[randomIndex];

        // Crear nuevo círculo (hijo)
        const newSize = parentCircle.size * 0.8; // Ligeramente más pequeño
        const newCircle = document.createElement('div');
        newCircle.classList.add('circle');

        // Posicionar cerca del padre
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        const newX = parentCircle.x + offsetX;
        const newY = parentCircle.y + offsetY;

        newCircle.style.width = `${newSize * 2}px`; // Diámetro
        newCircle.style.height = `${newSize * 2}px`;
        newCircle.style.left = `${newX - newSize}px`;
        newCircle.style.top = `${newY - newSize}px`;

        // Velocidad y dirección opuestas al padre
        newCircle.dataset.vx = -parentCircle.vx * 1.2;
        newCircle.dataset.vy = -parentCircle.vy * 1.2;

        // Mismo color que el padre
        newCircle.style.backgroundColor = parentCircle.element.style.backgroundColor;

        // Animación
        newCircle.style.animationDelay = '0s';
        newCircle.style.animationDuration = `${Math.random() * 10 + 15}s`;

        connections.appendChild(newCircle);
        circles.push({
            element: newCircle,
            x: newX,
            y: newY,
            size: newSize,
            vx: parseFloat(newCircle.dataset.vx),
            vy: parseFloat(newCircle.dataset.vy)
        });

        // Reducir tamaño del padre
        parentCircle.size = parentCircle.size * 0.9;
        parentCircle.element.style.width = `${parentCircle.size * 2}px`;
        parentCircle.element.style.height = `${parentCircle.size * 2}px`;
    }

    // Programar próxima mitosis
    setTimeout(simulateMitosis, Math.random() * 5000 + 3000);
}

// Iniciar mitosis después de un tiempo
setTimeout(simulateMitosis, 5000);

// Agregar efectos táctiles para los botones
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });

    button.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });

    button.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
    });

    button.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
});

// Script específico para la página de login
document.addEventListener('DOMContentLoaded', function() {
    // Manejar el envío del formulario
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Aquí puedes agregar la lógica de autenticación
        console.log('Intento de inicio de sesión:', { email, password });

        // Simulación de inicio de sesión exitoso
        // En una aplicación real, aquí verificarías las credenciales
        alert('Inicio de sesión exitoso');
        // Redirigir a una página de dashboard (que deberías crear)
        // window.location.href = 'dashboard.html';
    });

    // Agregar efectos táctiles para los botones del formulario
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });

        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
});



// Js/index.js
import { db } from './firebase.js';
import {
    doc,
    setDoc,
    addDoc,
    collection,
    serverTimestamp
} from "firebase/firestore";

// Crear usuario
await setDoc(doc(db, "users", "uid_isa"), {
    name: "Isabela Torres",
    email: "isa@example.com",
    createdAt: serverTimestamp(),
    profileImage: "https://ejemplo.com/isa.jpg"
});

// Crear chat
const chatRef = doc(db, "chats", "chat_abc123");

await setDoc(chatRef, {
    participants: ["uid_isa", "uid_juanito"],
    lastMessage: "Hola Isa!",
    lastMessageTime: serverTimestamp()
});

// Agregar mensaje al chat
await addDoc(collection(chatRef, "messages"), {
    text: "Hola Isa, ¿cómo estás?",
    sender: "uid_juanito",
    timestamp: serverTimestamp(),
    read: false
});