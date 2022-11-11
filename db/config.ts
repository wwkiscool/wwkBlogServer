const mysql = require('mysql')
const config = {
    host: "139.196.56.93",
    user: "root",
    port: "3306",
    password: "Wu66666!",
    database: "blog"
}

const pool = mysql.createPool(config)

const query = (sql,val) => {
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection) => {
            if(err) throw new Error(err)
            connection.query(sql,val,(err,rows) => {
                if(err) reject(err)
                resolve(rows)
                connection.release()
            })
        })
    })
}

module.exports = {
    query
}