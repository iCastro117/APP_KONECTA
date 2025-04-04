// Función para manejar los tabs
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover clase activa de todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase activa al tab clickeado
            tab.classList.add('active');
        });
    });
}

// Función para simular doble tap en fotos
function setupGridItems() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        let lastClick = 0;
        
        item.addEventListener('click', () => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClick;
            
            if (timeDiff < 300 && timeDiff > 0) {
                // Doble click - Mostrar corazón
                const heart = document.createElement('div');
                heart.className = 'heart-animation';
                heart.innerHTML = '<i class="fas fa-heart"></i>';
                
                item.appendChild(heart);
                
                // Animar el corazón
                setTimeout(() => {
                    heart.style.opacity = '1';
                    heart.style.transform = 'translate(-50%, -50%) scale(1.2)';
                }, 10);
                
                setTimeout(() => {
                    heart.style.opacity = '0';
                    heart.style.transform = 'translate(-50%, -50%) scale(0.8)';
                }, 1000);
                
                setTimeout(() => {
                    item.removeChild(heart);
                }, 1500);
            }
            
            lastClick = currentTime;
        });
    });
}

// Función para crear círculos animados adicionales
function createMoreCircles() {
    const connections = document.getElementById('connections');
    
    // Crear círculos adicionales con posiciones y tamaños aleatorios
    for (let i = 0; i < 5; i++) {
        const size = Math.floor(Math.random() * 100) + 50; // Tamaño entre 50 y 150px
        const top = Math.floor(Math.random() * 100); // Posición top entre 0% y 100%
        const left = Math.floor(Math.random() * 100); // Posición left entre 0% y 100%
        const delay = Math.floor(Math.random() * 10); // Delay entre 0 y 10s
        
        const circle = document.createElement('div');
        circle.className = 'circle';
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.top = `${top}%`;
        circle.style.left = `${left}%`;
        circle.style.animationDelay = `${delay}s`;
        
        connections.appendChild(circle);
    }
}

// Actualizar la hora en la barra de estado
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.querySelector('.status-bar-time').textContent = `${hours}:${minutes}`;
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupGridItems();
    createMoreCircles();
    
    updateTime();
    setInterval(updateTime, 60000); // Actualizar cada minuto
});