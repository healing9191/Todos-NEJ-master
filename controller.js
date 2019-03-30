const fs = require('fs');
// 先导入fs模块，然后用readdirSync依次列出文件

function addMapping(router, mapping) {

    for (let url in mapping) {
    	// 如果url类似"GET xxx":
        if (url.startsWith('GET ')) {
            let path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            let path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }

}

function addControllers(router,dir) {
    let files = fs.readdirSync(__dirname + '/'+dir);
    let js_files = files.filter((f) => {
        return f.endsWith('.js');   // 过滤出.js文件:
    });
    // 处理每个js文件:
    js_files.forEach((f)=>{
        console.log(`process controller: ${f}...`);
          // 导入js文件:
        let mapping = require(__dirname + '/controllers/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
};