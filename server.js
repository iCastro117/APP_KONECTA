import express from "express"
import oracledb from "oracledb"
import bcrypt from "bcrypt"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)))

// Configuración de Oracle
const dbConfig = {
  user: 'hr',
  password: 'hr', // Asegúrate de que esta contraseña sea correcta
  connectString: 'localhost/xepdb1' // Verifica que este string de conexión sea correcto
};

// Inicializar el pool de conexiones
let pool

async function initializePool() {
  try {
    console.log("Iniciando pool de conexiones Oracle...")
    pool = await oracledb.createPool(dbConfig)
    console.log("✅ Pool de conexiones Oracle inicializado correctamente")
    return true
  } catch (err) {
    console.error("❌ Error al inicializar el pool de conexiones Oracle:", err)
    return false
  }
}

// Función para obtener una conexión del pool
async function getConnection() {
  try {
    return await pool.getConnection()
  } catch (err) {
    console.error("Error al obtener conexión del pool:", err)
    throw err
  }
}

// Ruta de prueba para verificar que el servidor está funcionando
app.get("/api/test", (req, res) => {
  res.json({ message: "API funcionando correctamente" })
})

// Ruta para el registro de usuarios
app.post("/api/register", async (req, res) => {
  const { name, email, codigo, programa, password } = req.body

  // Validaciones básicas
  if (!name || !email || !codigo || !programa || !password) {
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" })
  }

  let connection
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    connection = await getConnection()

    // Verificar si el email ya existe
    const emailCheckResult = await connection.execute(`SELECT email FROM usuarios WHERE email = :email`, [email], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    })

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "El email ya está registrado" })
    }

    // Verificar si el código estudiantil ya existe
    const codigoCheckResult = await connection.execute(
      `SELECT codigo_estudiantil FROM usuarios WHERE codigo_estudiantil = :codigo`,
      [codigo],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    )

    if (codigoCheckResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "El código estudiantil ya está registrado" })
    }

    // Insertar el nuevo usuario
    const result = await connection.execute(
      `INSERT INTO usuarios (nombre, email, codigo_estudiantil, programa, password) 
       VALUES (:name, :email, :codigo, :programa, :password)
       RETURNING id INTO :id`,
      {
        name,
        email,
        codigo,
        programa,
        password: hashedPassword,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true },
    )

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      userId: result.outBinds.id[0],
    })
  } catch (err) {
    console.error("Error en el registro:", err)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error("Error al cerrar la conexión:", err)
      }
    }
  }
})

// Ruta para el login de usuarios
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email y contraseña son obligatorios" })
  }

  let connection
  try {
    connection = await getConnection()

    const result = await connection.execute(
      `SELECT id, nombre, email, codigo_estudiantil, programa, password 
       FROM usuarios 
       WHERE email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" })
    }

    const user = result.rows[0]
    const passwordMatch = await bcrypt.compare(password, user.PASSWORD)

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Credenciales inválidas" })
    }

    // Eliminar la contraseña del objeto usuario antes de enviarlo
    delete user.PASSWORD

    res.json({
      success: true,
      message: "Login exitoso",
      user,
    })
  } catch (err) {
    console.error("Error en el login:", err)
    res.status(500).json({ success: false, message: "Error en el servidor" })
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error("Error al cerrar la conexión:", err)
      }
    }
  }
})

// Ruta para servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Html", "index.html"));
});


// Iniciar el servidor
async function startServer() {
  console.log("Iniciando servidor...")

  const poolInitialized = await initializePool()

  if (poolInitialized) {
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    })
  } else {
    console.error("❌ No se pudo iniciar el servidor debido a problemas con la base de datos")
  }
}

// Iniciar el servidor
startServer().catch((err) => {
  console.error("Error al iniciar el servidor:", err)
})

// Manejar el cierre del servidor
process.on("SIGINT", async () => {
  console.log("Cerrando el servidor...")

  if (pool) {
    try {
      await pool.close(10)
      console.log("Pool de conexiones cerrado correctamente")
    } catch (err) {
      console.error("Error al cerrar el pool de conexiones:", err)
    }
  }

  process.exit(0)
})

