const path = require('path')

const root = path.join(__dirname, '../')

module.exports = {
  development: {
    db: {
      // user: 'skills03',
      // username: 'skills03',
      // password: '123456',
      // database: 'skills03',
      // host: 'yark.yydhsoft.com',
      // dialect: 'mysql',
      // omitNull: true,
      // logging: false,
      // define: {
      //   timestamps: false,
      // },
      user: 'root',
      username: 'root',
      password: 'yydh',
      database: 'yydh',
      host: '10.104.104.231',
      // host: 'localhost',
      dialect: 'mysql',
      omitNull: true,
      logging: false,
      define: {
        timestamps: false,
      },
    },

    crypto: {
      password: '1234',
      salt: 'KBGaWl2mwo6IIyh8gr2BNIdKtzmnQsPZxK3LseVRTNY=',
      // iv 정의 필요..
    },

    storage: {
      path: path.join(root, '/_storage'),
    },

    session: {
      secret: 'yydhsoft1123',
    },

    github: {
      clientId: 'cb4be3cb36c8839e3f99',
      clientSecret: '954fdeebfc229e2979ee1081bb85e8064c25b417',
    },
  },

  root,
}
