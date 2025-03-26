// Script para la página de chat
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar la hora en tiempo real
    updateStatusBarTime();
    setInterval(updateStatusBarTime, 60000);
    
    // Referencias a elementos del DOM
    const chatListView = document.getElementById('chatListView');
    const chatDetailView = document.getElementById('chatDetailView');
    const backToListButton = document.getElementById('backToList');
    const chatItems = document.querySelectorAll('.chat-item');
    const contactName = document.querySelector('.contact-name');
    const contactStatus = document.querySelector('.contact-status');
    const messagesContainer = document.getElementById('messagesContainer');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    
    // Cambiar entre vistas de lista y chat individual
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Obtener datos del chat seleccionado
            const chatId = this.getAttribute('data-chat-id');
            const name = this.getAttribute('data-name');
            const status = this.getAttribute('data-status');
            
            // Actualizar la información del contacto en la vista de detalle
            contactName.textContent = name;
            contactStatus.textContent = status === 'online' ? 'En línea' : 'Desconectado';
            
            // Mostrar la vista de detalle y ocultar la lista
            chatListView.style.display = 'none';
            chatDetailView.style.display = 'flex';
            
            // Cargar mensajes (en una aplicación real, esto cargaría mensajes del servidor)
            // loadMessages(chatId);
            
            // Desplazar al final de los mensajes
            scrollToBottom();
        });
    });
    
    // Volver a la lista de chats
    backToListButton.addEventListener('click', function() {
        chatDetailView.style.display = 'none';
        chatListView.style.display = 'flex';
    });
    
    // Enviar mensaje
    sendMessageButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            // Crear nuevo mensaje
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            // Crear elemento de mensaje
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${messageText}</p>
                    <span class="message-time">${timeString}</span>
                    <span class="message-status">✓</span>
                </div>
            `;
            
            // Agregar mensaje al contenedor
            messagesContainer.appendChild(messageElement);
            
            // Limpiar input y hacer scroll
            messageInput.value = '';
            scrollToBottom();
            
            // Simular respuesta después de un tiempo aleatorio
            simulateResponse();
        }
    }
    
    function simulateResponse() {
        // Respuestas predefinidas para la simulación
        const responses = [
            "¡Claro! Me parece bien.",
            "Entiendo, gracias por la información.",
            "¿Podemos discutir esto más tarde?",
            "Excelente, continuemos con el plan.",
            "Necesito más detalles sobre esto."
        ];
        
        // Seleccionar respuesta aleatoria
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Simular tiempo de respuesta (entre 1 y 3 segundos)
        const responseTime = Math.random() * 2000 + 1000;
        
        setTimeout(() => {
            // Crear timestamp
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            // Crear elemento de mensaje
            const messageElement = document.createElement('div');
            messageElement.className = 'message received';
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${randomResponse}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
            
            // Agregar mensaje al contenedor
            messagesContainer.appendChild(messageElement);
            
            // Hacer scroll
            scrollToBottom();
            
            // Actualizar último mensaje en la lista de chats
            updateLastMessage(randomResponse);
        }, responseTime);
    }
    
    function updateLastMessage(message) {
        // En una aplicación real, esto actualizaría el último mensaje en la base de datos
        // Para esta demo, actualizamos el primer chat de la lista
        const firstChatLastMessage = document.querySelector('.chat-item:first-child .chat-last-message');
        if (firstChatLastMessage) {
            firstChatLastMessage.textContent = message;
            
            // Actualizar hora
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            const firstChatTime = document.querySelector('.chat-item:first-child .chat-time');
            if (firstChatTime) {
                firstChatTime.textContent = timeString;
            }
        }
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Función para actualizar la hora si no está disponible desde index.js
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
    
    // Efectos táctiles para los botones
    const buttons = document.querySelectorAll('button');
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
    
    // Inicializar la vista
    scrollToBottom();
});