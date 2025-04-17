import { auth, db } from "./firebaseConfig.js";
import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
    collection,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    updateStatusBarTime();

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async(e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const termsAccepted = document.getElementById("terms").checked;
        const submitButton = registerForm.querySelector('button[type="submit"]');

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        if (!termsAccepted) {
            alert("Debes aceptar los términos y condiciones");
            return;
        }

        if (!isValidEmail(email)) {
            alert("El correo no tiene un formato válido");
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Creando cuenta...";

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(collection(db, "users"), user.uid), {
                name: name,
                email: email,
                createdAt: serverTimestamp(),
            });

            alert("¡Registro exitoso!");
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error en el registro:", error);
            let errorMessage = "Error en el registro: " + error.message;

            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Este correo electrónico ya está registrado. Por favor, usa otro o inicia sesión.";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "La contraseña es demasiado débil. Usa al menos 6 caracteres.";
            }

            alert(errorMessage);
        } finally {
            submitButton.textContent = "Crear cuenta";
            submitButton.disabled = false;
        }
    });

    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((button) => {
        button.addEventListener("mousedown", () => (button.style.transform = "scale(0.98)"));
        button.addEventListener("mouseup", () => (button.style.transform = "scale(1)"));
        button.addEventListener("touchstart", () => (button.style.transform = "scale(0.98)"));
        button.addEventListener("touchend", () => (button.style.transform = "scale(1)"));
    });

    const emailInput = document.getElementById("email");
    emailInput.addEventListener("blur", function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.boxShadow = "0 0 0 2px red";
        } else {
            this.style.boxShadow = "";
        }
    });

    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirmPassword");
    confirmInput.addEventListener("input", function() {
        if (this.value && this.value !== passwordInput.value) {
            this.style.boxShadow = "0 0 0 2px red";
        } else {
            this.style.boxShadow = "";
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

function updateStatusBarTime() {
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