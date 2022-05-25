import TestService from '../service/test-service'

class TestController {
  private service: TestService = new TestService()

  hello = async ctx => {
    ctx.body = await this.service.base(ctx)
  }
}

export default new TestController()
