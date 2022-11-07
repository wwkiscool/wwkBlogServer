var router = require('koa-router')()
console.log("222",require('../utils/confg'));

var  { routerBaseUrl } = require('../utils/confg')
const usersController = require('../controllers/user')



router.prefix(`${routerBaseUrl}/users`)

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.post('/getUserInfo',usersController.getUserInfo)


module.exports = router
