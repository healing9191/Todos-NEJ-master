const creatModule = require('../database/db');
let Todos = creatModule();
//输入url之后的响应
let fn_index = async (ctx) => {
    ctx.render('index.html');
};
//增加todos
let fn_add = async (ctx) => {
    let todo = await Todos.create({
        content: ctx.request.body.content,
        done: false
    });
    console.log('created: ' + JSON.stringify(todo));
    ctx.response.body = todo;
};
//删除todo
let fn_delete = async (ctx) => {
    let todo = await Todos.findAll({
        where: {
            id: ctx.request.body.id
        }
    });
    todo.forEach(async(t)=>{
        await t.destroy();
        console.log('deleted: ' + JSON.stringify(t));
    });
    ctx.response.body = todo;
};
//改变状态
let fn_changeMode = async (ctx) => {
    let todo = await Todos.findAll({
        where: {
            id: ctx.request.body.id
        }
    });
    todo.forEach(async(t)=>{
        t.done = ctx.request.body.done;
        await t.save();
        console.log('changed: ' + JSON.stringify(t));
    });
    ctx.response.body = todo;
};
//全部改变成已完成状态
let fn_allDone = async (ctx) => {
    let todos = await Todos.findAll();
    todos.forEach(async(t)=>{
        t.done = true;
        await t.save();
    });
    ctx.response.body = todos;
};
//全部改变成未完成状态
let fn_allTodo = async (ctx) => {
    let todos = await Todos.findAll();
    todos.forEach(async(t)=>{
        t.done = false;
        await t.save();
    });
    ctx.response.body = todos;
};
//改变任务内容
let fn_edit = async (ctx) => {
    let todo = await Todos.findAll({
        where: {
            id: ctx.request.body.id
        }
    });
    todo.forEach(async(t)=>{
        t.content = ctx.request.body.content;
        await t.save();
        console.log('content-changed: ' + JSON.stringify(t));
    });
    ctx.response.body = todo;
};
//检查是否有已完成todos
let fn_checkStatus = async (ctx) => {
    let todos_done = await Todos.findAll({
        where: {
            done: true
        }
    });
  let mark = todos_done !== '';
  console.log('mark: ' + mark);
    ctx.response.body = mark;
};
//查看所有todos
let fn_getAll = async (ctx) => {
    let todos = await Todos.findAll();
    let result = [];
    Object.assign(result,todos);
    //console.log('result: ' + result);
    ctx.response.body = result;
};
//查看待办todos
let fn_getTodo = async (ctx) => {
    let todos = await Todos.findAll({
        where: {
            done: false
        }
    });
    let result = [];
    Object.assign(result,todos);
    //console.log('result: ' + result);
    ctx.response.body = result;
};
//查看待办todos的个数
let fn_getTodocount = async (ctx) => {
    let todos = await Todos.findAll({
        where: {
            done: false
        }
    });
  ctx.response.body = todos.length;
};
//查看已完成todos
let fn_getDone = async (ctx) => {
    let todos = await Todos.findAll({
        where: {
            done: true
        }
    });
    let result = [];
    Object.assign(result,todos);
    //console.log('result: ' + result);
    ctx.response.body = result;
};
//删除已完成todos
let fn_clearDone = async (ctx) => {
    let todos = await Todos.findAll({
        where: {
            done: true
        }
    });
    todos.forEach(async(t)=>{
        await t.destroy();
        //console.log('deleted: ' + JSON.stringify(t));
    });
    ctx.response.body = todos;
};

//通过module.exports把两个URL处理函数暴露出来
module.exports = {
    'GET /': fn_index,
    'GET /checkStatus': fn_checkStatus,
    'GET /getTodocount': fn_getTodocount,
    'GET /getAll': fn_getAll,
    'GET /getTodo': fn_getTodo,
    'GET /getDone': fn_getDone,
    'GET /clearDone': fn_clearDone,
    'GET /allDone': fn_allDone,
    'GET /allTodo': fn_allTodo,
    'POST /edit': fn_edit,
    'POST /delete': fn_delete,
    'POST /changeMode': fn_changeMode,
    'POST /add': fn_add
};