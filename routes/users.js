
const router = require('koa-router')()

var  { routerBaseUrl } = require('../utils/config.ts')
const usersController = require('../controllers/user.js')


console.log(routerBaseUrl);
router.prefix(`${routerBaseUrl}/users`)

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get(`/getUserInfo`,usersController.getUserInfo)


module.exports = router
