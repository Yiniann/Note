const jwt = require('jsonwebtoken') 
const bcrypt = require('bcrypt')
const loginRouter =require(express).Router()
const User = require('../models/user')

//路由登录
loginRouter.post('/', async( request,response) => {
  const {username, password} =request.body

  const user = await User.findOne({username})//查询username是否在数据库中
  const passwordCorrect = user === null//如果用户存在，对比密码和哈希值
  ?false
  :await bcrypt.compare(password, user.passwordHash)

  //验证密码和用户名
  if(!(user&& passwordCorrect)){
    return response.status(401).json({
      error:'invaild username or password'
    })
  }
//使用jsonwebtoken.sign方法生产秘钥，token以数字签名包含用户名和id，作为响应体返回
  const userForToken ={
    username:user.username,
    id:user._id
  }

  const token =jwt.sign(userForToken,process.env.SECRET, { expiresIn: 60*60 })

  response.status(200)
  .send({token, username:user.username, name:user.name})
})

module.exports = loginRouter