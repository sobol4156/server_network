const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('db_network', 'root', 'gdeta235R', {
  host: 'mysql',
  port: 3007,
  dialect: 'mysql'
})

sequelize.authenticate()
.then(() => console.log('connected db_network'))
.catch(err => console.log(`нет конекта к бд ${err}`))

sequelize.sync({ force: false })
        .then(() => {
            console.log(`Database & tables synchronised!`)
        });


module.exports = sequelize