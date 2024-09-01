
let {ajax,toast} = window["nc-lightapp-front"];
if(!window.$nccUtil){
    window.$nccUtil = {
        promiseAjax:function _promiseAjax(url, data = {}, additions = {}) {
            let start = Date.now();
            ajax({
                loading: true, url, data, ...additions,
                success: (response) => {
                    console.log(
                        `😊%c promiseAjax%c ${url}`,
                        'color: white;background: green;', 'color: white;background: rebeccapurple;',
                        {data, response, url, timing: Date.now() - start});
        
                    _executor.resolve(response); //不控制逻辑 转发结果
                },
                error(response) {
                    //console.log("接口报错",);
                    //console.log("接口报错1",response);
                    console.log(
                        `😱%c promiseAjax%c ${url}`,
                        'color: white;background: red;', 'color: white;background: rebeccapurple;',
                        {data, response, url, timing: Date.now() - start});
        
                    toast({ color: 'danger', content: response.message });
                    _executor.reject(response);
                }
            });
        
            let _executor = {};
            return new Promise((resolve, reject) => _executor = {resolve, reject});
        }
    }
}
/*
 * @Description: 
 * @Autor: Mendege
 * @Date: 2020-12-14 15:57:34
 */
// 改写 Map方法 
// 增加 合并功能  合并两个Map 并且去重 git测试
window.Map.prototype.merge = function (data,key,callback){
    // this.set("asd",{a:1})
  
    //console.log("改写 Map方法 ",this,data);
    
    if(Array.isArray(data)){

    }else{
        while(data.size){
            let newData = data.pop();
            this.set(newData[0],newData[1]);
        }
    }
    //console.log("prototype.merge",this);


    
}

// 增加 取出第一个 并且删除原有map()
window.Map.prototype.pop = function (){
    let newThis = this[Symbol.iterator]();
    let popData = newThis.next();
    if(popData.value){
        this.delete(popData.value[0])
        return popData.value;
    }else{
        return false;
    }
   
}

window.Map.prototype.popKey = function (){
    let newThis = this[Symbol.iterator]();
    let popData = newThis.next();
    if(popData.value){
        return popData.value[0];
    }else{
        return false;
    }
   
}
window.Map.prototype.popValue = function (){
    let newThis = this[Symbol.iterator]();
    let popData = newThis.next();
    if(popData.value){
        return popData.value[1];
    }else{
        return false;
    }
   
}

// 增加 批量删除
window.Map.prototype.deletes = function (data = []){
    if(!Array.isArray(data))return;
    data.forEach((i)=>{
        if(this.has(i)){
            this.delete(i)
        }
    })
}

// 增加 升序climaol  -1 默认往后排 只接受 数值型value
window.Map.prototype.climaol = function (){
    let newMap = new Map();
    
    let keys = [];
    let left = [];
    let right = [];
    let virLeft = [];
    this.forEach((i,k)=>{
        if(i===-1){
            right.push({
                i:i,
                k:k
            });
        }else{
            left.push({
                i:i,
                k:k
            });
            virLeft.push(i)
        }
    });
    let maxNum = 0;
     if(virLeft.length){
        maxNum = Math.max(...virLeft)
    };
    right = right.map((i)=>{
        maxNum++
        i.i=maxNum;
        return i;
    });
    keys = left.concat(right);
    let h = 0
    keys.forEach((i)=>{
        newMap.set(i.k,h);
        h++
    });
    return newMap;
}

// 比较 两个 集合是否相同  默认浅比较 
window.Map.prototype.isMapKey = function(){
    return "this is Map";
}
window.Map.isMap = function(data){
    if(data&&data.isMapKey&&data.isMapKey&&data.isMapKey()==="this is Map"){
        return true;
    }else{
        return false;
    }
}
// 查找获取删除某一个元素
window.Map.prototype.hasGetDelete = function(key){
    if(this.has(key)){
        let data = this.get(key);
        this.delete(key);
        return data;
    }else{
        return {};
    }
}
window.ObjExtend = {
    getPopKey:function(data){
        return Object.keys(data)[0];
    },
    getPopValue:function(data){
        return Object.values(data)[0];
    },
    hasGetDelete : function(object,key){
        if(object[key]){
            let data = object[key];
            delete object[key]
            return data;
        }else{
            return {};
        }
    }
}

window.myNewData = function(){
    var myDate = new Date();
      var y=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
      var m=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
      var d=myDate.getDate();        //获取当前日(1-31)
      var t=myDate.getTime();        //获取当前时间(从1970.1.1开始的毫秒数)
      var h=myDate.getHours();       //获取当前小时数(0-23)
      var min=myDate.getMinutes();     //获取当前分钟数(0-59)
      var s=myDate.getSeconds();     //获取当前秒数(0-59)
      var ms=myDate.getMilliseconds();    //获取当前毫秒数(0-999)
      if (m >= 1 && m <= 9) {
        m = "0" + m;
      }
      if (d >= 0 && d <= 9) {
        d = "0" + d;
      }
      if (h >= 0 && h <= 9) {
        h = "0" + h;
      }
      if (min >= 0 && min <= 9) {
        min = "0" + min;
      }
      if (s >= 0 && s <= 9) {
        s = "0" + s;
      }
      var fh='-';
      var fh2=':'
     return  y+fh+m+fh+d+' '+h+fh2+min+fh2+s+fh2+ms;//当前时间
}


