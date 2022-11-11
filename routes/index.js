const router = require('koa-router')()
const multer = require('koa-multer')

const { routerBaseUrl } = require('../utils/config.ts')
const path = require('path')

router.get(routerBaseUrl,async (ctx) => {
  await ctx.render('index',{
    title:'hello'
  })
})
//配置diskStorage来控制文件存储的位置以及文件名字等
var storage = multer.diskStorage({
  //确定图片存储的位置
  destination: path.join(path.dirname(__dirname), 'public', 'imgs'),
  filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
  }
});
//生成的专门处理上传的一个工具，可以传入storage、limits等配置
var upload = multer({ storage: storage });

router.post(`${routerBaseUrl}/upload`, upload.single('file'), async (ctx, res) => {
  if(ctx.req.file) {
      ctx.body = {
          code:0,
          errMsg:"success!",
          url:`${ctx.protocol + '://' + ctx.get('host') + '/imgs/' + ctx.req.file.filename}`
          // url:`https://api.liangnong.online`+'/imgs/' + ctx.req.file.filename
      }
  } else {
      ctx.body = {
          code:-1,
          errMsg:"fail!"
      }
  }
  // res.send({ status: '0', data: req.protocol + '://' + req.get('host') + '/imgs/' + req.file.filename });
})


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router
