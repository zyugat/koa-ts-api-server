import { v4 as uuidv4 } from 'uuid'
import { createToken, verifyToken } from '../../jwt'
import { createOrderNum } from '../../hooks/base'
let db = require('../../db/study')

interface Ires {
  msg: string
  uid: string
  name: string
  psw: string
  email: string
  iat: number
  exp: number
}

interface IOrder {
  oid: string
  uid: string
  plist: string
  address: string
  phone: string
  time: string
  status: string
  tracking: string
  finish: number
}

/** 在订单数据中添加商品数据 */
function orderPList(item: IOrder) {
  return new Promise((resolve, reject) => {
    let plist = item.plist
    /** 保存进行格式化后的plist */
    // [ [ 2, 1 ], [ 5, 2 ] ]
    let _plist = []
    /** 整理 plist */
    for (let index in plist.match(/(\d+-\d+)/g)) {
      // 匹配元素,[ '2-1', '5-2' ]
      let item = plist.match(/(\d+-\d+)/g)[index]
      // 拆分元素并转为数字类型,id + count 格式,[ 2, 1 ]
      let id = Number(item.split('-')[0])
      let count = Number(item.split('-')[1])
      _plist.push([id, count])
    }

    // 转为字符串方便mysql查询
    let idList = _plist.map(item => item[0]).toString()

    db.query(`SELECT * from dangdang where id in (${idList})`).then(res => {
      let a = 0
      let result: [[], {}] = [[], {}]
      result[0] = res.map(item => {
        item['count'] = _plist[a][1]
        a++
        return item
      })
      result[1] = item
      resolve(result)
    })
  })
}

export default class uniShopService {
  /** 登录 */
  login = (name: string, email: string, psw: string, token: string) => {
    return new Promise(resolve => {
      /** 判断是否存在 token,并且传值是否正常 */
      if (token) {
        verifyToken(token).then(
          res => {
            resolve({
              data: res as Ires,
              msg: '成功',
              status: true,
              code: 200,
            })
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      } else if (!name && !email) {
        resolve({
          msg: '请传递 name 或 email',
          status: false,
          code: 400,
        })
      } else if (!psw) {
        resolve({
          msg: '请传递 psw',
          status: false,
          code: 400,
        })
      } else {
        let sql = `select * from user where ${name ? 'name' : 'email'}='${
          name || email
        }'`
        db.query(sql).then(
          res => {
            const _res = JSON.parse(JSON.stringify(res))
            /** 错误检测 */
            if (_res.length === 0) {
              resolve({
                msg: '用户名或邮箱不正确',
                status: false,
                code: 400,
              })
            } else if (_res[0].psw !== psw) {
              resolve({
                msg: '密码不正确',
                status: false,
                code: 400,
              })
            } else {
              let token = createToken(_res[0])
              resolve({
                data: token,
                msg: '登录成功',
                status: true,
                code: 200,
              })
            }
          },
          err => {
            resolve({
              data: err,
              msg: '失败',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 注册 */
  register = (name: string, email: string, psw: string) => {
    return new Promise(resolve => {
      /** 判断传值是否正常 */
      if (!name) {
        resolve({
          msg: '请传递 name',
          status: false,
          code: 400,
        })
      } else if (!email) {
        resolve({
          msg: '请传递 email',
          status: false,
          code: 400,
        })
      } else if (!psw) {
        resolve({
          msg: '请传递 psw',
          status: false,
          code: 400,
        })
      } else {
        let uid = uuidv4().replace(/\-/g, '')
        let sql = `insert into user(uid,name,psw,email) SELECT "${uid}", "${name}", "${psw}", "${email}" FROM dual WHERE NOT EXISTS (SELECT name FROM user WHERE name="${name}");`
        db.query(sql).then(
          res => {
            const _res = JSON.parse(JSON.stringify(res))

            if (_res.affectedRows === 0) {
              resolve({
                msg: '已存在该用户,无法注册成功',
                status: false,
                code: 400,
              })
            } else {
              resolve({
                msg: '注册成功',
                status: true,
                code: 200,
              })
            }
          },
          err => {
            resolve({
              data: err,
              msg: '失败',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 显示购物车 */
  showCart = (token: string) => {
    return new Promise(resolve => {
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires

            let sql = `select * from unishopcart, dangdang where unishopcart.pid=dangdang.id AND unishopcart.uid="${uid}";`
            db.query(sql).then(
              _res => {
                resolve({
                  data: _res,
                  msg: '成功',
                  status: true,
                  code: 200,
                })
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 添加购物车 */
  addCart = (token: string, pid: string) => {
    return new Promise(resolve => {
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else if (pid === undefined) {
        resolve({ data: '请传入产品ID', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires

            let sql = `insert into unishopcart(uid,pid,count) SELECT "${uid}", "${pid}",1 FROM dual WHERE NOT EXISTS (SELECT uid FROM unishopcart WHERE uid="${uid}" AND pid=${pid});`

            db.query(sql).then(
              _res => {
                if (_res.affectedRows === 0) {
                  resolve({
                    msg: '失败,存在重复项',
                    status: false,
                    code: 400,
                  })
                } else {
                  resolve({
                    msg: '添加成功',
                    status: true,
                    code: 200,
                  })
                }
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 修改购物车商品数量 */
  updateCart = (token: string, cid: string, count: string) => {
    return new Promise(resolve => {
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else if (cid === undefined) {
        resolve({ data: '请传入购物车ID', status: false, code: 400 })
      } else if (count === undefined) {
        resolve({ data: '请传入count', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires
            let sql = `update unishopcart set count=${count} where cid=${cid} AND uid="${uid}";`
            db.query(sql).then(
              _res => {
                if (_res.changedRows === 0) {
                  resolve({
                    msg: '失败,找不到与用户与产品相匹配的数据',
                    status: false,
                    code: 400,
                  })
                } else {
                  resolve({
                    msg: '修改成功',
                    status: true,
                    code: 200,
                  })
                }
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 删除购物车 */
  delCart = (token: string, cid: string) => {
    return new Promise(resolve => {
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else if (cid === undefined) {
        resolve({ data: '请传入商品ID', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires
            let sql = `delete from unishopcart where cid=${cid} AND uid="${uid}";`
            db.query(sql).then(
              _res => {
                if (_res.affectedRows === 0) {
                  resolve({
                    msg: '失败,找不到与uid与cid相匹配的数据',
                    status: false,
                    code: 400,
                  })
                } else {
                  resolve({
                    msg: '删除成功',
                    status: true,
                    code: 200,
                  })
                }
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  /** 显示所有订单 */
  showOrder = (token: string) => {
    return new Promise(resolve => {
      /** 判断是否存在 token,并且传值是否正常 */
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires
            let sql = `select * from unishoporder where uid="${uid}"`
            db.query(sql).then(
              _res => {
                let index = 0
                let result: [] = []
                result = _res.map(item => {
                  let orderItem = orderPList(_res[index])
                  index++
                  return orderItem
                })
                Promise.all(result).then(order => {
                  resolve({
                    data: order,
                    msg: '成功',
                    status: true,
                    code: 200,
                  })
                })
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }

  addOrder = (
    token: string,
    plist: string,
    phone: string,
    address: string,
    time: string,
    total: string,
  ) => {
    return new Promise(resolve => {
      if (token === undefined) {
        resolve({ data: '请传入 token', status: false, code: 400 })
      } else if (plist === undefined) {
        resolve({ data: '请传入订单信息', status: false, code: 400 })
      } else if (address === undefined) {
        resolve({ data: '收货地址', status: false, code: 400 })
      } else if (phone === undefined) {
        resolve({ data: '请传入手机号', status: false, code: 400 })
      } else if (time === undefined) {
        resolve({ data: '请传入time', status: false, code: 400 })
      } else if (total === undefined) {
        resolve({ data: '请传入total', status: false, code: 400 })
      } else {
        verifyToken(token).then(
          res => {
            let { uid } = res as Ires

            let id = createOrderNum()
            let _plist = plist.match(/(\d-\d)/g).toString()
            let sql = `insert into unishoporder(oid,uid,plist,address,phone,time,status,tracking,finish,total) VALUES("${id}","${uid}","${_plist}","${address}","${phone}","${time}","已下订单","无",0,${total}) `

            db.query(sql).then(
              _res => {
                if (_res.affectedRows === 0) {
                  resolve({
                    msg: '失败',
                    status: false,
                    code: 400,
                  })
                } else {
                  resolve({
                    msg: '添加成功',
                    status: true,
                    code: 200,
                  })
                }
              },
              err => {
                resolve({
                  data: err,
                  msg: '失败',
                  status: false,
                  code: 400,
                })
              },
            )
          },
          err => {
            resolve({
              data: err,
              msg: '请传入正确的token',
              status: false,
              code: 400,
            })
          },
        )
      }
    })
  }
}
