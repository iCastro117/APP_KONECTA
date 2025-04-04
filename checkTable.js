import oracledb from "oracledb"

async function checkAndCreateTable() {
  let connection

  try {
    connection = await oracledb.getConnection({
      user: "hr",
      password: "hr",
      connectString: "localhost/xepdb1",
    })

    console.log("✅ Conexión a Oracle establecida correctamente")

    // Verificar si la tabla usuarios existe
    const tableCheck = await connection.execute(`SELECT table_name FROM user_tables WHERE table_name = 'USUARIOS'`)

    if (tableCheck.rows.length > 0) {
      console.log("✅ Tabla USUARIOS ya existe")
    } else {
      console.log("⚠️ Tabla USUARIOS no encontrada. Creando tabla...")

      // Crear la tabla usuarios
      await connection.execute(`
        CREATE TABLE usuarios (
          id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          nombre VARCHAR2(100) NOT NULL,
          email VARCHAR2(100) UNIQUE NOT NULL,
          codigo_estudiantil VARCHAR2(20) UNIQUE NOT NULL,
          programa VARCHAR2(100) NOT NULL,
          password VARCHAR2(100) NOT NULL,
          fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      console.log("✅ Tabla USUARIOS creada correctamente")
    }

    // Verificar la estructura de la tabla
    const columnCheck = await connection.execute(`
      SELECT column_name, data_type, data_length
      FROM user_tab_columns
      WHERE table_name = 'USUARIOS'
      ORDER BY column_id
    `)

    console.log("\n=== ESTRUCTURA DE LA TABLA USUARIOS ===")
    console.log("Columna\t\tTipo\t\tLongitud")
    console.log("----------------------------------------")

    for (const row of columnCheck.rows) {
      console.log(`${row[0]}\t\t${row[1]}\t\t${row[2]}`)
    }

    // Commit los cambios
    await connection.commit()

    console.log("\n✅ Verificación y creación de tabla completada")
  } catch (err) {
    console.error("❌ Error:", err)
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error("Error al cerrar la conexión:", err)
      }
    }
  }
}

checkAndCreateTable()

