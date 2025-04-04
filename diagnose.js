import express from "express"
import oracledb from "oracledb"
import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log("=== DIAGNÓSTICO DE LA APLICACIÓN ===")

// 1. Verificar que Node.js está funcionando
console.log(`✅ Node.js versión: ${process.version}`)

// 2. Verificar que Express está instalado
try {
  console.log(`✅ Express versión: ${express.version}`)
} catch (err) {
  console.error("❌ Error con Express:", err)
}

// 3. Verificar que Oracle está instalado
try {
  console.log(`✅ Oracle DB versión: ${oracledb.versionString}`)
} catch (err) {
  console.error("❌ Error con Oracle DB:", err)
}

// 4. Verificar la estructura de archivos
console.log("\n=== VERIFICANDO ESTRUCTURA DE ARCHIVOS ===")
const requiredFiles = [
  "server.js",
  "Html/login.html",
  "Html/register.html",
  "Js/login.js",
  "Js/register.js",
  "Css/index.css",
]

for (const file of requiredFiles) {
  try {
    fs.accessSync(path.join(__dirname, file), fs.constants.F_OK)
    console.log(`✅ Archivo encontrado: ${file}`)
  } catch (err) {
    console.error(`❌ Archivo no encontrado: ${file}`)
  }
}

// 5. Verificar la conexión a Oracle
console.log("\n=== VERIFICANDO CONEXIÓN A ORACLE ===")
async function checkOracleConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: "hr",
      password: "hr",
      connectString: "localhost/xepdb1",
    })

    console.log("✅ Conexión a Oracle establecida correctamente")

    // Verificar si la tabla usuarios existe
    try {
      const result = await connection.execute(`SELECT table_name FROM user_tables WHERE table_name = 'USUARIOS'`)

      if (result.rows.length > 0) {
        console.log("✅ Tabla USUARIOS encontrada")
      } else {
        console.error("❌ Tabla USUARIOS no encontrada")
      }
    } catch (err) {
      console.error("❌ Error al verificar la tabla USUARIOS:", err)
    }

    await connection.close()
  } catch (err) {
    console.error("❌ Error al conectar con Oracle:", err)
    console.error("Detalles del error:", err.message)
  }
}

// 6. Verificar que el puerto 3000 está disponible
console.log("\n=== VERIFICANDO DISPONIBILIDAD DEL PUERTO ===")
const testServer = express()
try {
  const server = testServer.listen(3000, () => {
    console.log("✅ Puerto 3000 está disponible")
    server.close()
  })

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error("❌ Puerto 3000 ya está en uso por otra aplicación")
    } else {
      console.error("❌ Error al verificar el puerto:", err)
    }
  })
} catch (err) {
  console.error("❌ Error al verificar el puerto:", err)
}

// Ejecutar la verificación de Oracle
checkOracleConnection()

