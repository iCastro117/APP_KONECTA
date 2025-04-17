// Script para la página de chat
document.addEventListener("DOMContentLoaded", () => {
    // Importar Firebase (asegúrate de que Firebase esté configurado en tu proyecto)
    try {
        firebase
    } catch (e) {
        console.error("Firebase is not defined. Make sure you have included the Firebase SDK.")
        return
    }

    // Inicializar Firebase (si aún no lo has hecho en otro lugar)
    // const firebaseConfig = {
    //   apiKey: "YOUR_API_KEY",
    //   authDomain: "YOUR_AUTH_DOMAIN",
    //   projectId: "YOUR_PROJECT_ID",
    //   storageBucket: "YOUR_STORAGE_BUCKET",
    //   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    //   appId: "YOUR_APP_ID",
    //   measurementId: "YOUR_MEASUREMENT_ID"
    // };
    // firebase.initializeApp(firebaseConfig);

    // Inicializar Firestore
    const db = firebase.firestore()

    // Verificar si Firebase está inicializado correctamente
    if (typeof firebase === "undefined") {
        console.error("Firebase no está inicializado correctamente")
        return
    }

    // Actualizar la hora en tiempo real
    updateStatusBarTime()
    setInterval(updateStatusBarTime, 60000)

    // Referencias a elementos del DOM
    const chatListView = document.getElementById("chatListView")
    const chatDetailView = document.getElementById("chatDetailView")
    const backToListButton = document.getElementById("backToList")
    const chatItems = document.querySelectorAll(".chat-item")
    const contactName = document.querySelector(".contact-name")
    const contactStatus = document.querySelector(".contact-status")
    const messagesContainer = document.getElementById("messagesContainer")
    const messageInput = document.getElementById("messageInput")
    const sendMessageButton = document.getElementById("sendMessage")

    // Variable para almacenar el ID del chat actual
    let currentChatId = null

    // Cambiar entre vistas de lista y chat individual
    chatItems.forEach((item) => {
        item.addEventListener("click", function() {
            // Obtener datos del chat seleccionado
            const chatId = this.getAttribute("data-chat-id")
            const name = this.getAttribute("data-name")
            const status = this.getAttribute("data-status")

            // Guardar el ID del chat actual
            currentChatId = chatId

            // Actualizar la información del contacto en la vista de detalle
            contactName.textContent = name
            contactStatus.textContent = status === "online" ? "En línea" : "Desconectado"

            // Establecer el atributo data-chat-id en la vista de detalle
            chatDetailView.setAttribute("data-chat-id", chatId)

            // Mostrar la vista de detalle y ocultar la lista
            chatListView.style.display = "none"
            chatDetailView.style.display = "flex"

            // Cargar mensajes desde Firebase
            loadMessages(chatId)

            // Desplazar al final de los mensajes
            scrollToBottom()
        })
    })

    // Volver a la lista de chats
    backToListButton.addEventListener("click", () => {
        // Detener la escucha de mensajes del chat actual
        if (currentChatId && unsubscribeMessages) {
            unsubscribeMessages()
        }

        chatDetailView.style.display = "none"
        chatListView.style.display = "flex"
    })

    // Enviar mensaje
    sendMessageButton.addEventListener("click", sendMessage)
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    })

    // Variable para almacenar la función de cancelación de la suscripción
    let unsubscribeMessages = null

    // Función para cargar mensajes desde Firestore
    function loadMessages(chatId) {
        // Limpiar el contenedor de mensajes, pero mantener la fecha
        const dateElement = messagesContainer.querySelector(".message-date")
        messagesContainer.innerHTML = ""
        if (dateElement) {
            messagesContainer.appendChild(dateElement)
        }

        // Verificar si el chat existe en Firestore, si no, crearlo
        db.collection("chats")
            .doc(chatId)
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    // Crear el documento del chat si no existe
                    return db
                        .collection("chats")
                        .doc(chatId)
                        .set({
                            participants: ["usuario_actual", "contacto_" + chatId], // Ejemplo de IDs de participantes
                            lastMessage: "",
                            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                }
            })
            .catch((error) => {
                console.error("Error verificando el chat:", error)
            })

        // Suscribirse a los mensajes del chat
        unsubscribeMessages = db
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot(
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const message = change.doc.data()
                            addMessageToUI(message)
                        }
                    })
                    scrollToBottom()
                },
                (error) => {
                    console.error("Error escuchando mensajes:", error)
                },
            )
    }

    // Función para añadir un mensaje a la UI
    function addMessageToUI(message) {
        // Determinar si el mensaje es enviado o recibido
        const isCurrentUser = message.sender === "usuario_actual" // Reemplazar con lógica real de autenticación

        // Formatear la hora
        const timestamp = message.timestamp ? message.timestamp.toDate() : new Date()
        const hours = timestamp.getHours() % 12 || 12
        const minutes = timestamp.getMinutes().toString().padStart(2, "0")
        const ampm = timestamp.getHours() >= 12 ? "PM" : "AM"
        const timeString = `${hours}:${minutes} ${ampm}`

        // Crear elemento de mensaje
        const messageElement = document.createElement("div")
        messageElement.className = isCurrentUser ? "message sent" : "message received"

        // Contenido del mensaje
        let messageContent = `
              <div class="message-content">
                  <p>${message.text}</p>
                  <span class="message-time">${timeString}</span>
          `

        // Añadir indicador de lectura solo para mensajes enviados
        if (isCurrentUser) {
            messageContent += `<span class="message-status">${message.read ? "✓✓" : "✓"}</span>`
        }

        messageContent += `</div>`
        messageElement.innerHTML = messageContent

        // Agregar mensaje al contenedor
        messagesContainer.appendChild(messageElement)
    }

    // Función para enviar mensajes
    function sendMessage() {
        const messageText = messageInput.value.trim()
        if (messageText) {
            const chatId = chatDetailView.getAttribute("data-chat-id")

            // En una aplicación real, obtendrías el ID del usuario actual desde Firebase Auth
            const userId = "usuario_actual" // Reemplazar con firebase.auth().currentUser.uid

            db.collection("chats")
                .doc(chatId)
                .collection("messages")
                .add({
                    text: messageText,
                    sender: userId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    read: false,
                })
                .then(() => {
                    // Actualizar el último mensaje en el documento del chat
                    return db.collection("chats").doc(chatId).update({
                        lastMessage: messageText,
                        lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                })
                .then(() => {
                    // Limpiar el input
                    messageInput.value = ""
                })
                .catch((error) => {
                    console.error("Error enviando mensaje:", error)

                    // Fallback para demostración si hay error
                    fallbackSendMessage(messageText)
                })
        }
    }

    // Función de respaldo para demostración si Firebase falla
    function fallbackSendMessage(messageText) {
        // Crear nuevo mensaje
        const now = new Date()
        const hours = now.getHours() % 12 || 12
        const minutes = now.getMinutes().toString().padStart(2, "0")
        const ampm = now.getHours() >= 12 ? "PM" : "AM"
        const timeString = `${hours}:${minutes} ${ampm}`

        // Crear elemento de mensaje
        const messageElement = document.createElement("div")
        messageElement.className = "message sent"
        messageElement.innerHTML = `
              <div class="message-content">
                  <p>${messageText}</p>
                  <span class="message-time">${timeString}</span>
                  <span class="message-status">✓</span>
              </div>
          `

        // Agregar mensaje al contenedor
        messagesContainer.appendChild(messageElement)

        // Limpiar input y hacer scroll
        messageInput.value = ""
        scrollToBottom()

        // Simular respuesta después de un tiempo aleatorio
        simulateResponse()
    }

    // Función para simular respuestas (solo para demostración)
    function simulateResponse() {
        // Respuestas predefinidas para la simulación
        const responses = [
            "¡Claro! Me parece bien.",
            "Entiendo, gracias por la información.",
            "¿Podemos discutir esto más tarde?",
            "Excelente, continuemos con el plan.",
            "Necesito más detalles sobre esto.",
        ]

        // Seleccionar respuesta aleatoria
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        // Simular tiempo de respuesta (entre 1 y 3 segundos)
        const responseTime = Math.random() * 2000 + 1000

        setTimeout(() => {
            // Crear timestamp
            const now = new Date()
            const hours = now.getHours() % 12 || 12
            const minutes = now.getMinutes().toString().padStart(2, "0")
            const ampm = now.getHours() >= 12 ? "PM" : "AM"
            const timeString = `${hours}:${minutes} ${ampm}`

            // Crear elemento de mensaje
            const messageElement = document.createElement("div")
            messageElement.className = "message received"
            messageElement.innerHTML = `
                  <div class="message-content">
                      <p>${randomResponse}</p>
                      <span class="message-time">${timeString}</span>
                  </div>
              `

            // Agregar mensaje al contenedor
            messagesContainer.appendChild(messageElement)

            // Hacer scroll
            scrollToBottom()

            // Actualizar último mensaje en la lista de chats
            updateLastMessage(randomResponse)
        }, responseTime)
    }

    function updateLastMessage(message) {
        // En una aplicación real, esto actualizaría el último mensaje en la base de datos
        // Para esta demo, actualizamos el primer chat de la lista
        const firstChatLastMessage = document.querySelector(".chat-item:first-child .chat-last-message")
        if (firstChatLastMessage) {
            firstChatLastMessage.textContent = message

            // Actualizar hora
            const now = new Date()
            const hours = now.getHours() % 12 || 12
            const minutes = now.getMinutes().toString().padStart(2, "0")
            const ampm = now.getHours() >= 12 ? "PM" : "AM"
            const timeString = `${hours}:${minutes} ${ampm}`

            const firstChatTime = document.querySelector(".chat-item:first-child .chat-time")
            if (firstChatTime) {
                firstChatTime.textContent = timeString
            }
        }
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    // Función para actualizar la hora si no está disponible desde index.js
    function updateStatusBarTime() {
        const now = new Date()
        let hours = now.getHours()
        let minutes = now.getMinutes()

        // Formato de 12 horas
        const ampm = hours >= 12 ? "PM" : "AM"
        hours = hours % 12
        hours = hours ? hours : 12 // La hora '0' debe ser '12'
        minutes = minutes < 10 ? "0" + minutes : minutes

        const timeString = `${hours}:${minutes} ${ampm}`
        document.querySelector(".status-bar-time").textContent = timeString
    }

    // Efectos táctiles para los botones
    const buttons = document.querySelectorAll("button")
    buttons.forEach((button) => {
        button.addEventListener("mousedown", function() {
            this.style.transform = "scale(0.98)"
        })

        button.addEventListener("mouseup", function() {
            this.style.transform = "scale(1)"
        })

        button.addEventListener("touchstart", function() {
            this.style.transform = "scale(0.98)"
        })

        button.addEventListener("touchend", function() {
            this.style.transform = "scale(1)"
        })
    })

    // Inicializar la vista
    scrollToBottom()

    // Cargar la lista de chats desde Firebase
    loadChatList()

    // Función para cargar la lista de chats desde Firebase
    function loadChatList() {
        db.collection("chats")
            .orderBy("lastMessageTime", "desc")
            .limit(10)
            .get()
            .then((snapshot) => {
                // En una aplicación real, actualizarías la lista de chats con los datos de Firebase
                console.log("Chats cargados:", snapshot.size)
            })
            .catch((error) => {
                console.error("Error cargando chats:", error)
            })
    }
})