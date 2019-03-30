const Koa = require('koa');
const isProduction = process.env.NODE_ENV === 'production';
const templating = require('./templating');
//发送post请求时提供解析request的body的功能
const bodyParser = require('koa-bodyparser');
// 导入controller middleware:
const controller = require('./controller');
const app = new Koa();

// 使用各种中间件。。。


if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

// 解析POST请求：
app.use(bodyParser());

// 负责给ctx加上render()来使用Nunjucks：
// 定义了一个常量isProduction，它判断当前环境是否是production环境。如果是，就使用缓存，如果不是，就关闭缓存。
app.use(templating('static', {
    noCache: !isProduction,
    watch: !isProduction
}));

// 处理URL路由：
app.use(controller());


app.listen(3000);
console.log('app started at port 3000...');