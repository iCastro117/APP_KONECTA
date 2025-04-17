import { db } from './firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

// Crear usuario
await setDoc(doc(db, "users", "uid_isa"), {
    name: "Isabela Torres",
    email: "isa@example.com",
    createdAt: serverTimestamp(),
    profileImage: "https://ejemplo.com/isa.jpg"
});

// Crear chat y subcolección de mensajes
const chatRef = doc(db, "chats", "chat_abc123");

await setDoc(chatRef, {
    participants: ["uid_isa", "uid_juanito"],
    lastMessage: "Hola Isa!",
    lastMessageTime: serverTimestamp()
});

await addDoc(collection(chatRef, "messages"), {
    text: "Hola Isa, ¿cómo estás?",
    sender: "uid_juanito",
    timestamp: serverTimestamp(),
    read: false
});