// 改写 Map方法 
// 增加 合并功能  合并两个Map 并且去重
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
window.Map.prototype.pops = function (){
    let newThis = this[Symbol.iterator]();
    let popData = newThis.next();
    if(popData.value){
        this.delete(popData.value[0])
        return [popData.value[0],popData.value];
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

// 增加  Map some

// 增加 取出第一个 并且删除原有map()
window.Map.prototype.some = function (callback){
    let newThis = this[Symbol.iterator]();
    let popData = newThis.next();
    let flag = true;
    do {
        if(popData.value&&callback&&callback instanceof Function){
            let vflag = callback(popData.value[1],popData.value[0]);
            if(typeof vflag==="boolean"&&vflag===false){
                flag = false;
                
            }else{
                popData = newThis.next();
            }
        }
    } while (!popData.done&&flag);
}


