
const router = require('koa-router')()

var  { routerBaseUrl } = require('../utils/config.ts')
const articleController = require('../controllers/article.js')


console.log(routerBaseUrl);
router.prefix(`${routerBaseUrl}/article`)

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get(`/getArticleList`,articleController.getArticleList)


module.exports = router
