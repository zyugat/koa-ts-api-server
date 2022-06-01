import dangDangService from './study/study-dang-dang'
import uniShopService from './study/study-uni-shop'

export default class StudyService {
  private dangDangService: dangDangService = new dangDangService()
  private uniShopService: uniShopService = new uniShopService()

  base = () => {
    return new Promise(resolve => resolve(this.dangDangService.base()))
  }

  dangDang = ctx => {
    // 判断传值为空
    // console.log(JSON.stringify(ctx.query) === '{}')
    // console.log(Object.getOwnPropertyNames(ctx.query).length === 0)

    /** 无传参默认返回所有 */
    if (Object.getOwnPropertyNames(ctx.query).length === 0) {
      return new Promise(resolve => resolve(this.dangDangService.all()))
    }

    /** 多余传值 */
    let params = []
    /** 遍历参数 */
    for (let index in ctx.query) {
      switch (index.toLowerCase()) {
        case 'random':
          return new Promise(resolve =>
            resolve(this.dangDangService.random(ctx.query.random)),
          )
        case 'id':
          return new Promise(resolve =>
            resolve(this.dangDangService.id(ctx.query.id)),
          )
        case 'searchAuthor'.toLowerCase():
          return new Promise(resolve =>
            resolve(this.dangDangService.searchAuthor(ctx.query.searchAuthor)),
          )
        case 'searchTitle'.toLowerCase():
          return new Promise(resolve =>
            resolve(this.dangDangService.searchTitle(ctx.query.searchTitle)),
          )
        default:
          params.push(index)
      }
    }

    return new Promise(resolve =>
      resolve({
        data: `不存在以下参数：${params}`,
        status: false,
        code: 200,
      }),
    )
  }

  //#region uniShop
  uniShopLogin = ctx => {
    return new Promise(resolve => {
      let { name, email, psw, token } = ctx.request.body || undefined
      resolve(this.uniShopService.login(name, email, psw, token))
    })
  }

  uniShopRegister = ctx => {
    return new Promise(resolve => {
      let { name, email, psw } = ctx.request.body || undefined
      resolve(this.uniShopService.register(name, email, psw))
    })
  }

  uniShopShowCart = ctx => {
    return new Promise(resolve => {
      let token = ctx.query.token || undefined
      resolve(this.uniShopService.showCart(token))
    })
  }

  uniShopAddCart = ctx => {
    return new Promise(resolve => {
      let { token, pid } = ctx.request.body || undefined
      resolve(this.uniShopService.addCart(token, pid))
    })
  }

  uniShopUpdateCart = ctx => {
    return new Promise(resolve => {
      let { token, cid, count } = ctx.request.body || undefined
      resolve(this.uniShopService.updateCart(token, cid, count))
    })
  }

  uniShopDelCart = ctx => {
    return new Promise(resolve => {
      let { token, cid } = ctx.request.body || undefined
      resolve(this.uniShopService.delCart(token, cid))
    })
  }

  uniShopShowOrder = ctx => {
    return new Promise(resolve => {
      let { token } = ctx.request.query || undefined
      resolve(this.uniShopService.showOrder(token))
    })
  }

  uniShopAddOrder = ctx => {
    return new Promise(resolve => {
      let { token, plist, phone, address, time, total } =
        ctx.request.body || undefined
      resolve(
        this.uniShopService.addOrder(token, plist, phone, address, time, total),
      )
    })
  }
  //#endregion
}
