import * as dotenv from 'dotenv'

dotenv.config()

export const { PORT, MYSQL_HOST, MYSQL_USER, MYSQL_PSW, MYSQL_DB } = process.env
