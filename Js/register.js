// Script para la página de registro
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar la hora en tiempo real (complementa al script principal)
    updateStatusBarTime();
    
    // Manejar el envío del formulario de registro
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccepted = document.getElementById('terms').checked;
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Validar que se aceptaron los términos
        if (!termsAccepted) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }
        
        // Aquí puedes agregar la lógica de registro
        console.log('Datos de registro:', { name, email, password, termsAccepted });
        
        // Simulación de registro exitoso
        // En una aplicación real, aquí enviarías los datos al servidor
        alert('¡Registro exitoso!');
        // Redirigir a una página de confirmación o login
        // window.location.href = 'login.html';
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
    
    // Función para validar el formato de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validación en tiempo real para el email
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.boxShadow = '0 0 0 2px red';
            // Opcional: mostrar un mensaje de error
        } else {
            this.style.boxShadow = '';
        }
    });
    
    // Validación en tiempo real para confirmar contraseña
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    
    confirmInput.addEventListener('input', function() {
        if (this.value && this.value !== passwordInput.value) {
            this.style.boxShadow = '0 0 0 2px red';
        } else {
            this.style.boxShadow = '';
        }
    });
});

// Función para actualizar la hora (en caso de que no esté disponible desde index.js)
function updateStatusBarTime() {
    if (typeof window.updateStatusBarTime === 'function') {
        return; // Ya está definida en index.js
    }
    
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