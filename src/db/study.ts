//文件名为mysqlDB.js
var mysql = require('mysql')
import { MYSQL_HOST, MYSQL_USER, MYSQL_PSW, MYSQL_DB } from '../config'

const mysql_config = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PSW,
  database: MYSQL_DB,
}
let pool = mysql.createPool(mysql_config)

exports.query = (sql, value) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        console.log('数据库连接成功')
        connection.query(sql, value, (err, row) => {
          if (err) {
            reject(err)
          } else {
            resolve(row)
          }
          connection.release()
        })
      }
    })
  })
}
