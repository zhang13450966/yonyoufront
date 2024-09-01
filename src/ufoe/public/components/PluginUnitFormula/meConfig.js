// 改写 Map方法 
// 增加 合并功能  合并两个Map 并且去重
window.Map.prototype.merge = function (data,key,callback){
    // this.set("asd",{a:1})
  
    console.log($appRoot.state.json['public_lang-000153'],this,data);/* 国际化处理： 改写 Map方法 */
    
    if(Array.isArray(data)){

    }else{
        while(data.size){
            let newData = data.pop();
            this.set(newData[0],newData[1]);
        }
    }
    console.log("prototype.merge",this);
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
