const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')
const passportConfig = require('./_Api_Interface/passport')

const indexRouter = require('./routes')
const config = require('./config/config')

const app = express()
passportConfig()

app.set('port', 3000)
app.set('config', config)

// 세션 설정
const sessionStore = new MySQLStore(require('./config/config').development.db)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(
  session({
    secret: require('./config/config').development.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan('dev'))

app.use('/', indexRouter)

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}에서 실행중`)
})

const MessageDAO = require('./_Api_Interface/DAO/messageDAO')
const { param } = require('./routes')
const messageDAO = new MessageDAO()

async function a() {
  console.log(
    await messageDAO.getLastMessageTime(
      '0a0c3485-6f31-4376-b',
      'user1',
      'user2',
    ),
  )
}

a()
