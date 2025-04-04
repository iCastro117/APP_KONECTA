// Script para la funcionalidad de login con QR
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const qrCodeElement = document.getElementById("qrCode")
    const refreshButton = document.getElementById("refreshQR")
  
    // Función para generar un token único para el QR
    function generateToken() {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36)
      )
    }
  
    // Función para generar el código QR
    function generateQRCode(token) {
      // Limpiar el contenedor del QR
      qrCodeElement.innerHTML = ""
  
      // Añadir animación de carga
      const loadingDiv = document.createElement("div")
      loadingDiv.className = "qr-loading"
      qrCodeElement.appendChild(loadingDiv)
  
      // Crear la URL con el token (en una aplicación real, esto sería una URL completa)
      const qrData = `https://konecta.app/auth?token=${token}`
  
      // Simular un pequeño retraso para mostrar la animación de carga
      setTimeout(() => {
        // Eliminar la animación de carga
        qrCodeElement.removeChild(loadingDiv)
  
        // Generar el código QR usando la librería QRCode.js
        QRCode.toCanvas(
          qrCodeElement,
          qrData,
          {
            width: 180,
            margin: 1,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          },
          (error) => {
            if (error) {
              console.error("Error generando el código QR:", error)
              qrCodeElement.textContent = "Error al generar el código QR"
            }
          },
        )
      }, 800)
  
      // Devolver el token para poder usarlo en la simulación
      return token
    }
  
    // Función para simular la verificación del estado del QR
    function checkQRStatus(token) {
      // En una aplicación real, esto sería una llamada a un servidor
      // para verificar si el QR ha sido escaneado y autenticado
  
      // Para la demostración, simulamos un escaneo exitoso después de un tiempo aleatorio
      const checkInterval = setInterval(() => {
        // Simulamos un 5% de probabilidad de éxito en cada comprobación
        if (Math.random() < 0.05) {
          clearInterval(checkInterval)
  
          // Mostrar animación de éxito
          const successDiv = document.createElement("div")
          successDiv.className = "qr-success"
          qrCodeElement.appendChild(successDiv)
  
          // Simular redirección después del éxito
          setTimeout(() => {
            // En una aplicación real, redirigirías al dashboard o página principal
            alert("¡Inicio de sesión exitoso!")
            // window.location.href = 'dashboard.html';
          }, 1500)
        }
      }, 2000) // Comprobar cada 2 segundos
  
      // Establecer un tiempo de expiración para el QR (2 minutos)
      setTimeout(() => {
        clearInterval(checkInterval)
  
        // Si el QR aún existe y no ha sido autenticado, mostramos que ha expirado
        if (qrCodeElement.querySelector(".qr-success") === null) {
          qrCodeElement.innerHTML =
            '<div style="text-align: center; padding: 20px; color: #9D39B6;">Código QR expirado</div>'
        }
      }, 120000)
    }
  
    // Función para iniciar todo el proceso
    function initQRLogin() {
      const token = generateQRCode(generateToken())
      checkQRStatus(token)
    }
  
    // Iniciar el proceso al cargar la página
    initQRLogin()
  
    // Manejar el botón de actualizar QR
    refreshButton.addEventListener("click", () => {
      initQRLogin()
    })
  
    // Efectos táctiles para los botones
    refreshButton.addEventListener("mousedown", function () {
      this.style.transform = "scale(0.98)"
    })
  
    refreshButton.addEventListener("mouseup", function () {
      this.style.transform = "scale(1)"
    })
  
    refreshButton.addEventListener("touchstart", function () {
      this.style.transform = "scale(0.98)"
    })
  
    refreshButton.addEventListener("touchend", function () {
      this.style.transform = "scale(1)"
    })
  
    // Actualizar la hora en la barra de estado
    function updateStatusBarTime() {
      // This function should update the status bar time.
      // For now, let's just log a message to the console.
      console.log("Updating status bar time (implementation needed)")
    }
  
    updateStatusBarTime()
  })
  
  