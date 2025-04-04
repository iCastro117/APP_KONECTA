import oracledb from 'oracledb';

async function checkConnection() {
  let connection;

  try {
    // Intentar conectarse a Oracle con HR
    connection = await oracledb.getConnection({
      user: 'hr',
      password: 'hr',
      connectString: 'localhost/xepdb1'
    });

    console.log('✅ Conexión exitosa a Oracle Database!');

    // Ejecutar una consulta accesible para HR
    const result = await connection.execute(`SELECT table_name FROM user_tables`);

    console.log('📋 Tablas disponibles en el esquema HR:');
    console.log(result.rows);

  } catch (err) {
    console.error('❌ Error al conectar con Oracle Database:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
}

// Ejecutar la función
checkConnection();
