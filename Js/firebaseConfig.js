// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// CONFIGURACIÓN CORREGIDA
const firebaseConfig = {
    apiKey: "AIzaSyBTbsFSstA_4mYG4E6FnB5o4Z2Nu_AqmHw",
    authDomain: "isabella-castro.firebaseapp.com",
    projectId: "isabella-castro",
    storageBucket: "isabella-castro.appspot.com", // ← CORREGIDO AQUÍ
    messagingSenderId: "244493221667",
    appId: "1:244493221667:web:4d7707abb3f4a97cce9696",
    measurementId: "G-0TT9E180Y4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Prueba de registro
createUserWithEmailAndPassword(auth, "test@email.com", "password123")
    .then((userCredential) => {
        console.log("✅ Usuario registrado:", userCredential.user);
    })
    .catch((error) => {
        console.error("❌ Error en el registro:", error.message);
    });

export { auth, db };