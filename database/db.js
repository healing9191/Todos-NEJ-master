//第一步，用config的配置信息创建一个sequelize对象实例：
const Sequelize = require('sequelize');
const config = require('./config');

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

//第二步，定义模型Pet，告诉Sequelize如何映射数据库表
//通过sequelize.define()返回的Pet称为Model，它表示一个数据模型。
function creatModule() {
    let Pet = sequelize.define('Todo', {
    id: {
        type: Sequelize.INTEGER(255),
        primaryKey: true
    },
    content: Sequelize.STRING(255),
    done: Sequelize.BOOLEAN
}, {
        timestamps: false
    });
    return Pet;
 }

module.exports = creatModule;