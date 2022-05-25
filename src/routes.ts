import homeController from './controller/home-controller'
import TestController from './controller/test-controller'
import StudyService from './controller/study-controller'

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello,
  },
  {
    path: '/test',
    method: 'post',
    action: TestController.hello,
  },
  {
    path: '/study',
    method: 'get',
    action: StudyService.base,
  },
  {
    path: '/study/dangdang',
    method: 'get',
    action: StudyService.dangDang,
  },
  //#region uniShop
  {
    path: '/study/uniShop/login',
    method: 'post',
    action: StudyService.uniShopLogin,
  },
  {
    path: '/study/uniShop/register',
    method: 'post',
    action: StudyService.uniShopRegister,
  },
  {
    path: '/study/uniShop/showCart',
    method: 'get',
    action: StudyService.uniShopShowCart,
  },
  {
    path: '/study/uniShop/addCart',
    method: 'post',
    action: StudyService.uniShopAddCart,
  },
  {
    path: '/study/uniShop/updateCart',
    method: 'post',
    action: StudyService.uniShopUpdateCart,
  },
  {
    path: '/study/uniShop/delCart',
    method: 'post',
    action: StudyService.uniShopDelCart,
  },
  {
    path: '/study/uniShop/showOrder',
    method: 'get',
    action: StudyService.uniShopShowOrder,
  },
  {
    path: '/study/uniShop/addOrder',
    method: 'post',
    action: StudyService.uniShopAddOrder,
  },
  //#endregion
]
