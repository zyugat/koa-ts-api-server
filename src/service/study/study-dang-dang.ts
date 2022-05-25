let db = require('src/db/study')

export default class dangdangService {
  base = () => {
    return new Promise(resolve => {
      resolve({
        id: 'study',
        des: '连接个人数据库，规则如下。',
        rules: [
          {
            id: '1',
            url: '/dangdang',
            api: 'https://documenter.getpostman.com/view/15834238/UyxnEQrd',
          },
        ],
      })
    })
  }

  all = () => {
    return new Promise(resolve => {
      let sql = `select * from dangdang`
      db.query(sql).then(
        (res: any) => {
          // 转JSON
          const _res = JSON.parse(JSON.stringify(res))
          // console.log(_res)
          resolve({
            data: _res,
            status: true,
            code: 200,
          })
        },
        (err: any) => {
          resolve({
            data: err,
            status: false,
            code: 400,
          })
        },
      )
    })
  }

  random = (num: string) => {
    return new Promise((resolve, reject) => {
      console.log(num)

      let sql = `select * from dangdang order by rand() limit ${num}`
      db.query(sql).then(
        (res: string | any[]) => {
          // 转JSON
          let _res = JSON.parse(JSON.stringify(res))

          if (res.length === 0) {
            _res = '请正确传值'
          }

          resolve({
            data: _res,
            status: true,
            code: 200,
          })
        },
        (err: any) => {
          resolve({
            data: err,
            status: false,
            code: 400,
          })
        },
      )
    })
  }

  id = (num: string) => {
    return new Promise((resolve, reject) => {
      let sql = `select * from dangdang where id=${num}`
      db.query(sql).then(
        (res: string | any[]) => {
          // 转JSON
          let _res = JSON.parse(JSON.stringify(res))

          if (res.length === 0) {
            _res = '请正确传值'
            resolve({
              data: _res,
              status: false,
              code: 400,
            })
          } else {
            resolve({
              data: _res,
              status: true,
              code: 200,
            })
          }
        },
        (err: any) => {
          resolve({
            data: err,
            status: false,
            code: 400,
          })
        },
      )
    })
  }

  searchAuthor = (str: string) => {
    return new Promise((resolve, reject) => {
      let sql = `select * from dangdang`
      db.query(sql).then(
        (res: any) => {
          // 转JSON
          const _res = JSON.parse(JSON.stringify(res)).filter(
            (item: { author: string | any[] }) => {
              return item.author.indexOf(str) !== -1
            },
          )

          resolve({
            data: _res,
            status: true,
            code: 200,
          })
        },
        (err: any) => {
          resolve({
            data: err,
            status: false,
            code: 400,
          })
        },
      )
    })
  }

  searchTitle = (str: string) => {
    return new Promise((resolve, reject) => {
      let sql = `select * from dangdang`
      db.query(sql).then(
        (res: any) => {
          // 转JSON
          const _res = JSON.parse(JSON.stringify(res)).filter(
            (item: { title: string | any[] }) => {
              return item.title.indexOf(str) !== -1
            },
          )

          resolve({
            data: _res,
            status: true,
            code: 200,
          })
        },
        (err: any) => {
          resolve({
            data: err,
            status: false,
            code: 400,
          })
        },
      )
    })
  }
}
