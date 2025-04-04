document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault()

      // Obtener los valores del formulario
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      // Validaciones básicas
      if (!email || !password) {
        showMessage("Email y contraseña son obligatorios", "error")
        return
      }

      // Enviar datos al servidor
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          showMessage(data.message, "success")

          // Guardar información del usuario en localStorage
          localStorage.setItem("user", JSON.stringify(data.user))

          // Redireccionar al dashboard después de un login exitoso
          setTimeout(() => {
            window.location.href = "dashboard.html"
          }, 1000)
        } else {
          showMessage(data.message, "error")
        }
      } catch (error) {
        console.error("Error:", error)
        showMessage("Error al conectar con el servidor", "error")
      }
    })
  }

  // Función para mostrar mensajes
  function showMessage(message, type) {
    // Crear elemento para el mensaje si no existe
    let messageElement = document.querySelector(".message-container")

    if (!messageElement) {
      messageElement = document.createElement("div")
      messageElement.className = "message-container"
      const formElement = document.querySelector(".login-form")
      formElement.insertBefore(messageElement, formElement.firstChild)
    }

    messageElement.textContent = message
    messageElement.className = `message-container ${type}`

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
      messageElement.remove()
    }, 3000)
  }
})

