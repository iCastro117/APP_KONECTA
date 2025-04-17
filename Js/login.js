// Importar Firebase SDK y configuración
import { auth, db, firebase } from "./firebaseConfig.js";

document.addEventListener("DOMContentLoaded", () => {
    // Verificar que Firebase esté disponible
    if (typeof firebase === "undefined") {
        console.error("Firebase no está inicializado. Asegúrate de incluir los SDK de Firebase.");
        return;
    }

    // Verificar si el usuario ya está autenticado
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Usuario ya autenticado:", user.email);
            window.location.href = "dashboard.html";
        }
    });

    // Actualizar hora en barra de estado
    updateStatusBarTime();

    // Manejar login
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const submitButton = loginForm.querySelector('button[type="submit"]');

        if (!email || !password) {
            alert("Por favor completa todos los campos");
            return;
        }

        if (!isValidEmail(email)) {
            alert("El correo no tiene un formato válido");
            return;
        }

        // Mostrar carga
        submitButton.disabled = true;
        submitButton.textContent = "Iniciando sesión...";

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log("Usuario autenticado:", user.uid);

            // Obtener información del usuario desde Firestore
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (userDoc.exists) {
                sessionStorage.setItem("userName", userDoc.data().name);
            }

            alert("Inicio de sesión exitoso");
            window.location.href = "chat.html";
        } catch (error) {
            console.error("Error de autenticación:", error);

            let errorMessage = "Error al iniciar sesión";
            switch (error.code) {
                case "auth/user-not-found":
                    errorMessage = "Usuario no encontrado";
                    break;
                case "auth/wrong-password":
                    errorMessage = "Contraseña incorrecta";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Email inválido";
                    break;
                case "auth/too-many-requests":
                    errorMessage = "Demasiados intentos fallidos. Intenta más tarde.";
                    break;
            }
            alert(errorMessage);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Iniciar sesión";
        }
    });

    // Recuperación de contraseña
    const forgotPasswordLink = document.getElementById("forgotPassword");
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();

            if (!email) {
                alert("Por favor, ingresa tu correo electrónico para recuperar tu contraseña");
                return;
            }

            if (!isValidEmail(email)) {
                alert("Por favor, ingresa un correo electrónico válido");
                return;
            }

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
                })
                .catch((error) => {
                    console.error("Error al enviar correo de recuperación:", error);
                    alert("Error al enviar el correo: " + error.message);
                });
        });
    }

    // Efectos táctiles
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("mousedown", () => (button.style.transform = "scale(0.98)"));
        button.addEventListener("mouseup", () => (button.style.transform = "scale(1)"));
        button.addEventListener("touchstart", () => (button.style.transform = "scale(0.98)"));
        button.addEventListener("touchend", () => (button.style.transform = "scale(1)"));
    });

    // Validación de email visual
    const emailInput = document.getElementById("email");
    emailInput.addEventListener("blur", function() {
        this.style.boxShadow = this.value && !isValidEmail(this.value) ? "0 0 0 2px red" : "";
    });

    // Utilidad: Validación de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Actualizar hora de la barra de estado
function updateStatusBarTime() {
    if (typeof window.updateStatusBarTime === "function") return;

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const timeElement = document.querySelector(".status-bar-time");
    if (timeElement) {
        timeElement.textContent = `${hours}:${minutes} ${ampm}`;
    }
}