/**
 * localStorage 本地缓存处理工具
 * @author zhanghaug
 * @version 1.0 2018-2-1
 */

 /*
 * Created by zhanghuag on 2017/09/06.
 * localStorage ##2 封装localStorage
 * @module utils/tools
 *
 * getStorage(key)  - 获取localStorage数据
 * @param {string} [key]    - 返回对象或字符串
 * 
 * setStorage(key,value)     - 设置localStorage数据，
 * @param {string} [key] - 设置的localStorage的名称
 * @param {object/string} [value] - 设置的localStorage的名称对应的值
 * 
 * clearStorage()  - 清空localStorage数据
 * 
 * removeStorage(key)  - 删除localStorage数据
 * @param {string} [key]
 *
 */
   
function getStorage(key){
    var v=localStorage.getItem(key);
    if(!v){return null}
    var v4=v.slice(0,4);
    if(v4=='obj-'){
        v=JSON.parse(v.slice(4));
    }else if(v4=='str-'){
        v=v.slice(4);
    }
    return v
};
function setStorage(key,value){
   
    var v=value;
    if(typeof v == "object"){
        v="obj-"+JSON.stringify(v)
    }else{

        if(value==null||value==undefined){
            v="str-"
        }else{
            v="str-"+v
        }
    }
    localStorage.setItem(key,v);
};
function clearStorage(){
    localStorage.clear();
};
function removeStorage(key){
    localStorage.removeItem(key);
}
/**
 * @author siyk 2018/12/27
 * @param {string} [key]
 * @param {string} [value]
 * setSession(key,value)     - 设置sessionStorage数据(一次会话)
 */
function getSession(key){
    var v=sessionStorage.getItem(key);
    if(!v){return null}
    var v4=v.slice(0,4);
    if(v4=='obj-'){
        v=JSON.parse(v.slice(4));
    }else if(v4=='str-'){
        v=v.slice(4);
    }
    return v
};
function setSession(key,value){
    var v=value;
    if(typeof v == "object"){
        v="obj-"+JSON.stringify(v)
    }else{

        if(value==null||value==undefined){
            v="str-"
        }else{
            v="str-"+v
        }
    }
    sessionStorage.setItem(key,v);
};
function clearSession(){
    sessionStorage.clear();
};
function removeSession(key){
    sessionStorage.removeItem(key);
}
/**
 * @author siyk 2019/1/15
 * @param {string} [key]
 * @param {string} [value]
 * setCache(key,data, duration)     - 设置用户绑定的数据(切换用户失效)
 */
function setCache(key, data, userinfo, duration ){
    let defaultTime = 7*24*3600*1000;//默认存一周
    let user = getStorage('userinfo') || userinfo;
    try{
        var _obj = {
            data: data,
            tenantid: user.tenantId,
            userid: user.userId,
            datetime: new Date().getTime(),
            duration: duration || defaultTime
        }
        setStorage(key, _obj);
    }catch(e){
        console.log("ERR100:setCache出错了\n" + e);
    }
};
function getCache(key, userinfo){
    let user = getStorage('userinfo') || userinfo;
    try{
        var curT = new Date().getTime();
        var old = null;//旧数据
        try{
            old = getStorage(key);
        }catch(e){
            console.log("ERR104:缓存数据转json出错了,\n仅支持json数据缓存\n" + e);
            return null;
        }
        if(old == null) return;
        var tid = old.tenantid;
        var uid = old.userid;
        if(tid == user.tenantId && uid == user.userId){
            var oldT = old.datetime;
            var dur = old.duration;
            if(curT - parseInt(oldT) <= parseInt(dur)){
                return old.data;
            }else{
                removeStorage(key);
                return null;
            }
        }else{
            //缓存数据不是当前租户下当前用户的缓存
            return null;
        }
    }catch(e){
        console.log("ERR103:getCache出错了\n" + e);
    }
};
/**
 * Created by zhanghuag on 2017/10/28
 * 根据提供不同的id值，进行独立存储，相互不受影响
 * 
 * @module utils/tools
 * getSaveData 获取localStorage中某个数据中的某个属性
 * @param {string} [str] -localStorage中的数据名称
 * @param {string} [key] -属性名称(用户标识)
 * 
 * setSaveData 设置localStorage中某个数据的某个属性
 * @param {string} [str] -localStorage中的数据名称
 * @param {string} [key] -属性名称(用户标识)
 * @param {all} [val] -属性值（用户对于的数据）
 * 
 * example
 * 要缓存用户的搜索记录，search_history
 * 用户id：a123
 * 用户数据：[{name:'zhang'},{name:'li'}]
 * 
 */

function getSaveData(str,key){
    if(!isNaN(key)){console.error("第二个参数不合法，该类型应为sting类型")}
    if(!getStorage(str)){return ""}
    return getStorage(str)[key];
}

function setSaveData(str,key,val){
    if(!isNaN(key)){console.error("第二个参数不合法，该类型应为sting类型")}
    var tempobj={};
    if(getStorage(str)){
        tempobj=getStorage(str);
    }
    tempobj[key]=val;
    setStorage(str,tempobj);
}

/**
 * Created by zhanghuag on 2018/2/1
 * 对一个数据进行添加操作、并去重，
 * 不可对一维数组去重，参数有误返回null
 * 
 * @param {string} [id] -添加数据的唯一标识
 * @param {obj} [current] -需要添加的数据
 * @param {arr} [arr] -被添加的数组
 * @param {string} [num] -限定数组长度，默认5个
 * @param {boolean} [asc] -添加的位置，默认在上方添加
 * 
 * 
 */

function refreshArray(id,current,arr,num,asc){
  var n=num||5;
  var length=arr.length;
  if(!id||!current||!arr){
    console.log("数据有误")
    return null;
  }
  var newarr=arr.filter(function(item) {  return current[id]!==item[id] });
  if(!asc){  
    newarr.unshift(current);
    newarr=newarr.slice(0,n);
  }else{
    newarr.push(current);
    newarr=newarr.slice(-n,n);
  }
  return newarr
} 


export  {
    getStorage,
    setStorage,
    clearStorage,
    removeStorage,
    getSession,
    setSession,
    clearSession,
    removeSession,
    getSaveData,
    setSaveData,
    setCache,
    getCache,
}