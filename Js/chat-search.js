// Script para la funcionalidad de búsqueda de chat
document.addEventListener("DOMContentLoaded", () => {
  // Actualizar la hora en tiempo real
  updateStatusBarTime()
  setInterval(updateStatusBarTime, 60000)

  // Referencias a elementos del DOM
  const chatSearchView = document.getElementById("chatSearchView")
  const chatDetailView = document.getElementById("chatDetailView")
  const backToChatsButton = document.getElementById("backToChats")
  const backToSearchButton = document.getElementById("backToSearch")
  const searchInput = document.getElementById("searchInput")
  const clearSearchButton = document.getElementById("clearSearch")
  const searchResults = document.getElementById("searchResults")
  const emptyState = document.getElementById("emptyState")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const searchResultItems = document.querySelectorAll(".search-result")
  const contactName = document.querySelector(".contact-name")
  const contactStatus = document.querySelector(".contact-status")
  const messagesContainer = document.getElementById("messagesContainer")
  const messageInput = document.getElementById("messageInput")
  const sendMessageButton = document.getElementById("sendMessage")

  // Datos de ejemplo para la búsqueda
  const chatData = [
    {
      id: 1,
      name: "María González",
      status: "online",
      lastMessage: "¡Hola! ¿Cómo va todo con el proyecto?",
      time: "10:45 AM",
      messages: [
        { sender: "María", content: "¡Hola! ¿Cómo va todo con el proyecto?", time: "10:30 AM" },
        {
          sender: "me",
          content:
            "¡Hola María! Todo va bien, estamos avanzando según lo planeado. Ya terminamos la primera fase del proyecto.",
          time: "10:32 AM",
        },
        {
          sender: "María",
          content: "¡Excelente! ¿Podríamos tener una reunión para revisar los avances del proyecto?",
          time: "10:35 AM",
        },
        {
          sender: "María",
          content: "Aquí está el diagrama que mencioné para el proyecto.",
          time: "10:40 AM",
          hasImage: true,
        },
        {
          sender: "me",
          content: "Gracias por compartirlo. ¿Te parece bien reunirnos mañana a las 10 AM para discutir el proyecto?",
          time: "10:45 AM",
        },
      ],
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      status: "offline",
      lastMessage: "Gracias por la información. Te contactaré mañana.",
      time: "Ayer",
      messages: [
        { sender: "Carlos", content: "Hola, necesito información sobre el nuevo sistema.", time: "Ayer" },
        { sender: "me", content: "Claro, puedo enviarte la documentación. ¿Qué aspectos te interesan?", time: "Ayer" },
        {
          sender: "Carlos",
          content: "Principalmente la integración con nuestras herramientas actuales.",
          time: "Ayer",
        },
        {
          sender: "me",
          content: "Perfecto, te enviaré los detalles técnicos y ejemplos de implementación.",
          time: "Ayer",
        },
        { sender: "Carlos", content: "Gracias por la información. Te contactaré mañana.", time: "Ayer" },
      ],
    },
    {
      id: 3,
      name: "Laura Sánchez",
      status: "online",
      lastMessage: "¿Podemos reunirnos esta tarde para discutir el plan?",
      time: "12:20 PM",
      messages: [
        { sender: "Laura", content: "Buenos días, ¿cómo estás?", time: "11:30 AM" },
        { sender: "me", content: "Muy bien, gracias. ¿Y tú?", time: "11:45 AM" },
        {
          sender: "Laura",
          content: "Bien también. Estoy trabajando en el nuevo plan de comunicación.",
          time: "12:00 PM",
        },
        { sender: "me", content: "Suena interesante. Me gustaría conocer más detalles.", time: "12:10 PM" },
        { sender: "Laura", content: "¿Podemos reunirnos esta tarde para discutir el plan?", time: "12:20 PM" },
      ],
    },
    {
      id: 4,
      name: "Grupo Comunitario",
      status: "group",
      lastMessage: "Juan: ¿Alguien puede ayudar con la organización del evento?",
      time: "11:30 AM",
      messages: [
        { sender: "Ana", content: "Hola a todos, ¿cómo va la planificación del evento?", time: "10:00 AM" },
        { sender: "Pedro", content: "Estamos avanzando bien con la logística.", time: "10:15 AM" },
        { sender: "me", content: "Ya confirmé los proveedores para el catering.", time: "10:45 AM" },
        { sender: "María", content: "Excelente trabajo equipo.", time: "11:00 AM" },
        { sender: "Juan", content: "¿Alguien puede ayudar con la organización del evento?", time: "11:30 AM" },
      ],
    },
    {
      id: 5,
      name: "Soporte Técnico",
      status: "online",
      lastMessage: "Su ticket #45678 ha sido resuelto. ¿Podría confirmar?",
      time: "09:15 AM",
      messages: [
        { sender: "Soporte", content: "Buenos días, ¿en qué podemos ayudarle?", time: "08:30 AM" },
        {
          sender: "me",
          content: "Tengo problemas para acceder al sistema. Me aparece un error de autenticación.",
          time: "08:35 AM",
        },
        {
          sender: "Soporte",
          content: "Entendido. Hemos creado el ticket #45678 para su caso. Lo revisaremos de inmediato.",
          time: "08:40 AM",
        },
        {
          sender: "Soporte",
          content: "Hemos identificado el problema. Era un error en la configuración del servidor.",
          time: "09:10 AM",
        },
        { sender: "Soporte", content: "Su ticket #45678 ha sido resuelto. ¿Podría confirmar?", time: "09:15 AM" },
      ],
    },
  ]

  // Volver a la lista de chats
  backToChatsButton.addEventListener("click", () => {
    // En una aplicación real, esto redireccionaría a la página de chats
    window.location.href = "../index.html"
  })

  // Volver a la búsqueda desde el chat detalle
  backToSearchButton.addEventListener("click", () => {
    chatDetailView.style.display = "none"
    chatSearchView.style.display = "flex"
  })

  // Limpiar búsqueda
  clearSearchButton.addEventListener("click", () => {
    searchInput.value = ""
    searchInput.focus()
    performSearch("")
  })

  // Manejar filtros de búsqueda
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Quitar clase activa de todos los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Añadir clase activa al botón seleccionado
      this.classList.add("active")

      // Aplicar filtro
      const filter = this.getAttribute("data-filter")
      applyFilter(filter)
    })
  })

  // Manejar clic en resultados de búsqueda
  searchResultItems.forEach((item) => {
    item.addEventListener("click", function () {
      const chatId = this.getAttribute("data-chat-id")
      const name = this.getAttribute("data-name")
      const status = this.getAttribute("data-status") || "offline"

      // Actualizar la información del contacto en la vista de detalle
      contactName.textContent = name
      contactStatus.textContent = status === "online" ? "En línea" : "Desconectado"

      // Mostrar la vista de detalle y ocultar la búsqueda
      chatSearchView.style.display = "none"
      chatDetailView.style.display = "flex"

      // Cargar mensajes del chat seleccionado
      loadChatMessages(chatId)

      // Desplazar al final de los mensajes
      scrollToBottom()
    })
  })

  // Búsqueda en tiempo real
  searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase()
    performSearch(query)
  })

  // Función para realizar la búsqueda
  function performSearch(query) {
    if (query === "") {
      // Mostrar resultados iniciales/recientes
      showInitialResults()
      return
    }

    // Filtrar chats y mensajes que coincidan con la búsqueda
    const matchingChats = chatData.filter(
      (chat) => chat.name.toLowerCase().includes(query) || chat.lastMessage.toLowerCase().includes(query),
    )

    // Buscar en mensajes
    const matchingMessages = []
    chatData.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.content.toLowerCase().includes(query)) {
          matchingMessages.push({
            chatId: chat.id,
            chatName: chat.name,
            sender: message.sender,
            content: message.content,
            time: message.time,
            hasImage: message.hasImage,
          })
        }
      })
    })

    // Actualizar resultados en la UI
    updateSearchResults(query, matchingChats, matchingMessages)
  }

  // Función para mostrar resultados iniciales
  function showInitialResults() {
    // Mostrar chats recientes
    const recentChats = chatData.slice(0, 3) // Mostrar los 3 primeros chats

    let html = `
              <div class="search-section">
                  <h3 class="section-title">Chats recientes</h3>
          `

    recentChats.forEach((chat) => {
      html += createChatItemHTML(chat)
    })

    html += `</div>`

    searchResults.innerHTML = html
    emptyState.style.display = "none"

    // Añadir event listeners a los nuevos elementos
    attachSearchResultListeners()
  }

  // Función para actualizar los resultados de búsqueda
  function updateSearchResults(query, matchingChats, matchingMessages) {
    if (matchingChats.length === 0 && matchingMessages.length === 0) {
      // Mostrar estado vacío
      searchResults.innerHTML = ""
      emptyState.style.display = "flex"
      return
    }

    let html = ""

    // Mostrar chats coincidentes
    if (matchingChats.length > 0) {
      html += `
                  <div class="search-section">
                      <h3 class="section-title">Chats</h3>
              `

      matchingChats.forEach((chat) => {
        html += createChatItemHTML(chat)
      })

      html += `</div>`
    }

    // Mostrar mensajes coincidentes
    if (matchingMessages.length > 0) {
      html += `
                  <div class="search-section">
                      <h3 class="section-title">Mensajes con "${query}"</h3>
              `

      matchingMessages.forEach((message) => {
        html += createMessageResultHTML(message, query)
      })

      html += `</div>`
    }

    searchResults.innerHTML = html
    emptyState.style.display = "none"

    // Añadir event listeners a los nuevos elementos
    attachSearchResultListeners()
  }

  // Función para crear HTML de un chat
  function createChatItemHTML(chat) {
    return `
              <div class="chat-item search-result" data-chat-id="${chat.id}" data-name="${chat.name}" data-status="${chat.status}">
                  <div class="chat-avatar${chat.status === "group" ? " group-avatar" : ""}">
                      <div class="avatar-placeholder">${getInitials(chat.name)}</div>
                      ${chat.status !== "group" ? `<span class="status-indicator ${chat.status}"></span>` : ""}
                  </div>
                  <div class="chat-info">
                      <div class="chat-top-row">
                          <h3 class="chat-name">${chat.name}</h3>
                          <span class="chat-time">${chat.time}</span>
                      </div>
                      <div class="chat-bottom-row">
                          <p class="chat-last-message">${chat.lastMessage}</p>
                      </div>
                  </div>
              </div>
          `
  }

  // Función para crear HTML de un resultado de mensaje
  function createMessageResultHTML(message, query) {
    // Resaltar la palabra buscada
    const highlightedContent = message.content.replace(
      new RegExp(query, "gi"),
      (match) => `<span class="highlight">${match}</span>`,
    )

    return `
              <div class="message-result search-result" data-chat-id="${message.chatId}" data-name="${message.chatName}">
                  <div class="result-avatar">
                      <div class="avatar-placeholder">${message.sender === "me" ? "TÚ" : getInitials(message.sender)}</div>
                  </div>
                  <div class="result-content">
                      <div class="result-header">
                          <h3 class="result-name">${message.sender === "me" ? "Tú" : message.sender}</h3>
                          <span class="result-time">${message.time}</span>
                      </div>
                      <p class="result-message">${highlightedContent}</p>
                  </div>
              </div>
          `
  }

  // Función para obtener iniciales de un nombre
  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Función para aplicar filtros
  function applyFilter(filter) {
    const query = searchInput.value.trim().toLowerCase()

    if (query === "") {
      showInitialResults()
      return
    }

    // Filtrar resultados según el tipo seleccionado
    switch (filter) {
      case "chats":
        // Mostrar solo chats
        const matchingChats = chatData.filter(
          (chat) => chat.name.toLowerCase().includes(query) || chat.lastMessage.toLowerCase().includes(query),
        )
        updateSearchResults(query, matchingChats, [])
        break

      case "messages":
        // Mostrar solo mensajes
        const matchingMessages = []
        chatData.forEach((chat) => {
          chat.messages.forEach((message) => {
            if (message.content.toLowerCase().includes(query)) {
              matchingMessages.push({
                chatId: chat.id,
                chatName: chat.name,
                sender: message.sender,
                content: message.content,
                time: message.time,
                hasImage: message.hasImage,
              })
            }
          })
        })
        updateSearchResults(query, [], matchingMessages)
        break

      case "media":
        // Mostrar solo mensajes con multimedia
        const mediaMessages = []
        chatData.forEach((chat) => {
          chat.messages.forEach((message) => {
            if (message.hasImage && message.content.toLowerCase().includes(query)) {
              mediaMessages.push({
                chatId: chat.id,
                chatName: chat.name,
                sender: message.sender,
                content: message.content,
                time: message.time,
                hasImage: message.hasImage,
              })
            }
          })
        })
        updateSearchResults(query, [], mediaMessages)
        break

      default:
        // Mostrar todos los resultados
        performSearch(query)
        break
    }
  }

  // Función para cargar mensajes de un chat
  function loadChatMessages(chatId) {
    // Buscar el chat por ID
    const chat = chatData.find((c) => c.id == chatId)

    if (!chat) return

    // Limpiar contenedor de mensajes
    messagesContainer.innerHTML = ""

    // Añadir fecha
    const dateElement = document.createElement("div")
    dateElement.className = "message-date"
    dateElement.innerHTML = "<span>Hoy</span>"
    messagesContainer.appendChild(dateElement)

    // Añadir mensajes
    chat.messages.forEach((message) => {
      const messageElement = document.createElement("div")
      messageElement.className = `message ${message.sender === "me" ? "sent" : "received"}`

      let messageHTML = `
                  <div class="message-content">
              `

      // Añadir imagen si existe
      if (message.hasImage) {
        messageHTML += `
                      <div class="message-image">
                          <div class="image-placeholder">
                              <div class="image-icon"></div>
                              <span>Imagen</span>
                          </div>
                      </div>
                  `
      }

      messageHTML += `
                      <p>${message.content}</p>
                      <span class="message-time">${message.time}</span>
              `

      // Añadir estado de mensaje para mensajes enviados
      if (message.sender === "me") {
        messageHTML += `<span class="message-status">✓</span>`
      }

      messageHTML += `</div>`

      messageElement.innerHTML = messageHTML
      messagesContainer.appendChild(messageElement)
    })
  }

  // Función para añadir event listeners a los resultados de búsqueda
  function attachSearchResultListeners() {
    const newSearchResults = document.querySelectorAll(".search-result")

    newSearchResults.forEach((item) => {
      item.addEventListener("click", function () {
        const chatId = this.getAttribute("data-chat-id")
        const name = this.getAttribute("data-name")
        const status = this.getAttribute("data-status") || "offline"

        // Actualizar la información del contacto en la vista de detalle
        contactName.textContent = name
        contactStatus.textContent = status === "online" ? "En línea" : "Desconectado"

        // Mostrar la vista de detalle y ocultar la búsqueda
        chatSearchView.style.display = "none"
        chatDetailView.style.display = "flex"

        // Cargar mensajes del chat seleccionado
        loadChatMessages(chatId)

        // Desplazar al final de los mensajes
        scrollToBottom()
      })
    })
  }

  // Función para desplazar al final de los mensajes
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // Enviar mensaje
  sendMessageButton.addEventListener("click", sendMessage)
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  function sendMessage() {
    const messageText = messageInput.value.trim()
    if (messageText) {
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
    }
  }

  // Función para actualizar la hora en la barra de estado
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
    button.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.98)"
    })

    button.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)"
    })

    button.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)"
    })

    button.addEventListener("touchend", function () {
      this.style.transform = "scale(1)"
    })
  })

  // Inicializar la vista
  showInitialResults()
})

