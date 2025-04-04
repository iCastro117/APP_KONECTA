document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm")
  
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault()
  
        // Obtener los valores del formulario
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const codigo = document.getElementById("codigo").value
        const programa = document.getElementById("programa").value
        const password = document.getElementById("password").value
        const confirmPassword = document.getElementById("confirmPassword").value
        const termsChecked = document.getElementById("terms").checked
  
        // Validaciones básicas
        if (!name || !email || !codigo || !programa || !password || !confirmPassword) {
          showMessage("Todos los campos son obligatorios", "error")
          return
        }
  
        if (password !== confirmPassword) {
          showMessage("Las contraseñas no coinciden", "error")
          return
        }
  
        if (!termsChecked) {
          showMessage("Debes aceptar los términos y condiciones", "error")
          return
        }
  
        // Enviar datos al servidor
        try {
          const response = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              codigo,
              programa,
              password,
            }),
          })
  
          const data = await response.json()
  
          if (response.ok) {
            showMessage(data.message, "success")
            // Redireccionar al login después de un registro exitoso
            setTimeout(() => {
              window.location.href = "login.html"
            }, 2000)
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
        const formElement = document.querySelector(".register-form")
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
  
  