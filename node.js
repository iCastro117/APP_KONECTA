const oracledb = require('oracledb');

async function run() {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: "hr",
            password: "hr",
            connectString: "localhost/xepdb1"  // <- Aquí va xepdb1
        });

        const result = await connection.execute(`SELECT * FROM departments`);
        console.log(result.rows);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

run();
