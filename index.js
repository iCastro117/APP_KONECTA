// How to connect Oracle Database with Nodejs

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function fun() {
    let con;

    try {
        con = await oracledb.getConnection({
            user: "hr",
            password: "hr",
            connectString: "localhost/orcl"
        });

        const data = await con.execute(
            `SELECT * FROM departments`
        );
        console.log(data.rows);

    } catch (err) {
        console.error(err);
    }
}
fun();
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
