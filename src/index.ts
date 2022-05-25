import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { PORT } from './config'
import AppRoutes from './routes'

const cors = require('koa2-cors')

const app = new Koa()
// 跨域
app.use(cors())
const router = new Router()

//路由
AppRoutes.forEach(route => router[route.method](route.path, route.action))

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT)

console.log(`应用启动成功 端口:${PORT}`)
