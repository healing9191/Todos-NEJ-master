NEJ.define([
      'base/element',
      'base/event',
      './widget.js',
      'text!../list.html',
      'util/template/jst',
      'util/ajax/rest'
    ], function(_e, _v, _i,_l,_j,_a) {
      //分配UI控件实例
      let _uiwidget = _i._$$UIWidget._$allocate({
        parent:'app-main',
        clazz:'m-ui-widget',
        //自定义事件
        onadd:function(_event){ 
          let toAdd = _event.target.value;
          add(toAdd);   
        },
        ondelete:function(_event){
          if (_event.target.id === 'del') {
            let id = _e._$attr(_event.target.parentNode.parentNode.children[0],'data-id');
            //console.log(id);
            del(id);
          }
        },
        onchangestatus:function(_event){
          if(_event.target.type === 'checkbox') {
            if (_e._$attr(_event.target,'data-status') === 'done') {
              let id = _e._$attr(_event.target.parentNode.children[0],'data-id');
              changeMode({id:id,done:false});
            }
            else if (_e._$attr(_event.target,'data-status') === 'todo') {
              let id = _e._$attr(_event.target.parentNode.children[0],'data-id');
              changeMode({id:id,done:true});
              //_e._$delClassName('clear','submit');
            }
          }
        },
        onall:function(){
          currentList = listIndicator.all;
          _e._$addClassName('all','select');
          _e._$delClassName('todo','select');
          _e._$delClassName('done','select');
          getAll();
        },
        ondone:function(){
          currentList = listIndicator.done;
          _e._$addClassName('done','select');
          _e._$delClassName('todo','select');
          _e._$delClassName('all','select');
          getDone();
        },
        ontodo:function(){
          currentList = listIndicator.todo;
          _e._$addClassName('todo','select');
          _e._$delClassName('all','select');
          _e._$delClassName('done','select');
          getTodo();
        },
        onclear:function(){
          clearDone();
          _e._$addClassName('clear','submit');
        },
        onedit:function(_event){
          if(_event.target.id === 'content') {
            _event.target.onblur=function (){
              //console.log(_event.target.innerHTML);
              let id = _e._$attr(_event.target,'data-id');
              let content = _event.target.innerHTML;
              edit({id:id,content:content});
            }
          }
        },
        ontoggle: function(){
          let count = _e._$get('todos-count');
          if(count.innerHTML!=='0'){
            let list = _e._$getByClassName('list-box','Checkbox');
            list.forEach((l)=>{
              l.checked = true;
            });
            allDone();
          }else {
            let list = _e._$getByClassName('list-box','Checkbox');
            list.forEach((l)=>{
              l.checked = false;
            });
            allTodo();
          }
          
        }
      });

      //get和post函数
      let get = function(url,onload,onerror,onbeforerequest){
        _a._$request(url,{
          // param:{brand:'noko'},
          method:'get',
          // data:'123',
          onload:onload,
          onerror:onerror,
          onbeforerequest:onbeforerequest
        });
      };
      let post = function(url,param,onload,onerror,onbeforerequest){
        _a._$request(url,{
          //param:param,
          method:'post',
           data:param,
          onload:onload,
          onerror:onerror,
          onbeforerequest:onbeforerequest
        });
      };

      //从服务器获取任务列表
      //检查是否有已完成任务
      let checkStatus = function(){
        get('http://localhost:3000/checkStatus',function(_data){
             if(_data){
                _e._$delClassName('clear','submit');
             }else{
                _e._$addClassName('clear','submit');
             }
          });
      };
      //获取所有任务
      let getAll = function(){
        get('http://localhost:3000/getAll',function(_data){
            _j._$render('list-box',sn,{list:_data});  //渲染模板（容器id，模板名，模板数据）
          });
      };
      //获取已完成的任务
      let getDone = function(){
        get('http://localhost:3000/getDone',function(_data){
            _j._$render('list-box',sn,{list:_data});
          });
      };
      //获取未完成的任务
      let getTodo = function(){
        get('http://localhost:3000/getTodo',function(_data){
            _j._$render('list-box',sn,{list:_data});
          });
      };
      //获取当前未完成todos个数
      let getTodocount = function(){
        get('http://localhost:3000/getTodocount',function(_data){ 
            _e._$get('todos-count').innerHTML = _data;
            if(_data===0){
              _e._$setStyle('toggle-all','color','#4d4d4d');
            }else {
              _e._$setStyle('toggle-all','color','#DEDEDE');
            }
          });
      };

      //判断当前在哪个条目下，并获取对应的任务
      let getCurrent = function(){
        switch(currentList){
          case listIndicator.all:
            getAll();
          break;
          case listIndicator.done:
            getDone();
          break;
          case listIndicator.todo:
            getTodo();
          break;
          }
      };

      //增加任务
      let add = function(toAdd){
        //发送add请求
        post('http://localhost:3000/add',{content:toAdd},function(){
          //console.log(_data);
          getCurrent();
          getTodocount();
        });
        //console.log(toAdd);
      };
      //删除任务
      let del = function(toDelete){
        post('http://localhost:3000/delete',{id:toDelete},function(){
          getCurrent();
          getTodocount();
        });
      };
      //改变任务状态——完成未完成
      let changeMode = function(changeItem){
        post('http://localhost:3000/changeMode',{id:changeItem.id,done:changeItem.done},function(){
            checkStatus();
            getCurrent();
            getTodocount();
            
          });
      };
      //全都变为已完成
      let allDone = function(){
        get('http://localhost:3000/allDone',function(){
            checkStatus();
            getCurrent();
            getTodocount();
            
          });
      };
      //全都变为未完成
      let allTodo = function(){
        get('http://localhost:3000/allTodo',function(){
            checkStatus();
            getCurrent();
            getTodocount();
            
          });
      };
      //删除已完成的任务
      let clearDone = function(){
        get('http://localhost:3000/clearDone',function(){
            getCurrent();
          });
      };
      //改变任务内容
      let edit = function(changeContent){
        post('http://localhost:3000/edit',{id:changeContent.id,content:changeContent.content},function(){
            getCurrent();
          });
      };
      
      let listIndicator = {all:0,done:1,todo:2};//状态标记
      let currentList = listIndicator.all;//初始化当前状态为显示所有记录
      let sn = _j._$add(_l,true);//添加模板（模板内容，是否保留模板）；sn为模板名称
      //_j._$render('list-box',sn,{content:'hello',list:[1,2]});
      getAll();
      checkStatus();
      getTodocount();
});