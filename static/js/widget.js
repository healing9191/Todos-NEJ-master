NEJ.define([
    'base/klass',
    'base/element',
    'base/event',
    'util/template/tpl',
    'ui/base',
    'text!../css/widget.css',
    'text!../widget.html'
],function(_k,_e,_v,_t,_i,_css,_html,_p){
    let _pro;

    // 定义UI控件
    _p._$$UIWidget = _k._$klass();
    // _pro是一个继承了此基类的实例化对象
    _pro = _p._$$UIWidget._$extend(_i._$$Abstract);

    // 按需完成通用控件接口重写
    // _pro.__init ...
    // _pro.__reset ...
    // _pro.__destroy ...

    // 初始化外观信息，子类实现具体逻辑
    // 此过程只会在控件第一次创建时进入
    _pro.__initXGui = (function(){
        // 将注入的样式/结构做预处理后缓存
        let _seed_css = _e._$pushCSSText(_css),
            _seed_html = _t._$addNodeTemplate(_html);
        return function(){
            this.__seed_css = _seed_css;
            this.__seed_html = _seed_html;
        };
    })();

    // 初始化结构
    // 此过程只会在控件第一次创建时进入
    _pro.__initNode = function(){
        // 调用父类接口通过提供的__seed_html构建控件结构
        // 构建好的控件结构可以通过this.__body访问
        this.__super();
        //为什么直接_$get取节点就无法绑定事件呢？？
        // var _input = _e._$get('add-input');
        //console.log('_input', _input)
        let _input = _e._$getByClassName(
            this.__body,'add-todo'
        );
        let _filter = _e._$getByClassName(
            this.__body,'filter'
        );
        let _clear = _e._$getByClassName(
            this.__body,'clear'
        );
        let _toggle = _e._$getByClassName(
            this.__body,'toggle-all'
        );
        
        this.__add = _input[0];
        this.__all = _filter[0];
        this.__todo = _filter[1];
        this.__done = _filter[2];
        this.__clear = _clear[0];
        this.__toggle = _toggle[0];

        //console.log(this.__list);

        _v._$addEvent(
            this.__add,'keydown',
            this.__onAdd._$bind(this)
        );
        _v._$addEvent(
            this.__body,'click',
            this.__onDelete._$bind(this)
        );
        _v._$addEvent(
            this.__body,'click',
            this.__onChangeStatus._$bind(this)
        );

        _v._$addEvent(
            this.__all,'click',
            this.__onAll._$bind(this)
        );
        _v._$addEvent(
            this.__done,'click',
            this.__onDone._$bind(this)
        );
        _v._$addEvent(
            this.__todo,'click',
            this.__onTodo._$bind(this)
        );
        _v._$addEvent(
            this.__clear,'click',
            this.__onClear._$bind(this)
        );
        _v._$addEvent(
            this.__body,'input',
            this.__onEdit._$bind(this)
        );
         _v._$addEvent(
            this.__toggle,'click',
            this.__onToggle._$bind(this)
        );
        // _v._$addEvent(
        //     this.__body,'click',
        //     this.__onChangeContent._$bind(this)
        // );
        // TODO
    };

    //添加todo
    _pro.__onAdd = function(_event){
         if (_event.keyCode === 13&&this.__add.value!==''){
            this.__events.onadd(_event);
            this.__add.value='';
         }   
    };
    //删除todo
    _pro.__onDelete = function(_event){
        this.__events.ondelete(_event);
        //console.log('delete');
    };
    //改变状态
    _pro.__onChangeStatus = function(_event){
        this.__events.onchangestatus(_event);
    };
    //显示所有条目
    _pro.__onAll = function(_event){
        // console.log(this)
        this.__events.onall(_event);
    };
    //显示已经完成的todos
    _pro.__onDone = function(_event){
        // console.log(this)
        this.__events.ondone(_event);
    };
    //显示待办todos
    _pro.__onTodo = function(_event){
        // console.log(this)
        this.__events.ontodo(_event);
    };
    //清除已经完成的todos
    _pro.__onClear = function(_event){
        this.__events.onclear(_event);
    };
    //编辑todos的内容
    _pro.__onEdit = function(_event){
        this.__events.onedit(_event);
    };
    //“全部完成”与“全部未完成”状态切换
    _pro.__onToggle = function(_event){
        this.__events.ontoggle(_event);
    };
    // 实现控件核心功能
    
    _pro._myPrivateMethod = function(){
        
        // TODO
    };
    _pro.__myProtectedMethod = function(){
        // TODO
    };
    _pro._$myPublicMethod = function(){
        // TODO
    };

    // TODO

    return _p;
});