import StudyService from '../service/study-service'

class StudyController {
  private service: StudyService = new StudyService()

  base = async ctx => {
    ctx.body = await this.service.base()
  }
  dangDang = async ctx => {
    ctx.body = await this.service.dangDang(ctx)
  }

  //#region uniShop
  uniShopLogin = async ctx => {
    ctx.body = await this.service.uniShopLogin(ctx)
  }

  uniShopRegister = async ctx => {
    ctx.body = await this.service.uniShopRegister(ctx)
  }

  uniShopShowCart = async ctx => {
    ctx.body = await this.service.uniShopShowCart(ctx)
  }

  uniShopAddCart = async ctx => {
    ctx.body = await this.service.uniShopAddCart(ctx)
  }

  uniShopUpdateCart = async ctx => {
    ctx.body = await this.service.uniShopUpdateCart(ctx)
  }

  uniShopDelCart = async ctx => {
    ctx.body = await this.service.uniShopDelCart(ctx)
  }

  uniShopShowOrder = async ctx => {
    ctx.body = await this.service.uniShopShowOrder(ctx)
  }

  uniShopAddOrder = async ctx => {
    ctx.body = await this.service.uniShopAddOrder(ctx)
  }
  //#endregion
}

export default new StudyController()
