export default class HomeService {
  base = ctx => {
    return new Promise(resolve => {
      console.log(ctx.request.body)

      resolve(ctx.request.body)
    })
  }
}
