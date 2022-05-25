export default class HomeService {
  hello = () => {
    return new Promise(resolve =>
      resolve({
        msg: 'hello world',
        接口文档: {
          书籍: 'https://documenter.getpostman.com/view/15834238/UyxnEQrd',
          uniShop: 'https://documenter.getpostman.com/view/15834238/Uz59NzU9',
        },
      }),
    )
  }
}
