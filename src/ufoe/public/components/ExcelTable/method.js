// 方法集 创建代理模式 支持后期嵌入式修改 

// 内部方法
let internalMethod  = new Map();

/** getInSelectedData
     * // 获取对应区域数据 area (单元格区域) data (第一数据模型 必输)  callback 如果有 需要返回被处理以后的数据
    * @param {*} 
*/ 
internalMethod.set("getInSelectedData",function(area,data,callback){
    // startCol 开始列 startRow 开始行  endCol 结束列 endRow 结束行
    let [startRow ,startCol,endRow,endCol] = area;
    if(startRow > endRow){
        let current_row = startRow;
        startRow = endRow;
        endRow = current_row;
    }
    if(startCol > endCol){
        let current_col = startCol;
        startCol = endCol;
        endCol = current_col;
    }
    // 获取当前定位数据集 表 二维坐标  行 列 二维数组
    let list = [];
    // 数据列表
    let dataList = []
    
    while(startRow<=endRow){
        let newStartCol = startCol;
        while(newStartCol<=endCol){
            list.push({
                row:startRow,
                col:newStartCol
            }) 
            newStartCol ++
        }
        startRow++;
    }

    let symList = list[Symbol.iterator]();
    let nextList = symList.next();
    while(!nextList.done){
        if(data[nextList.value.row]&&data[nextList.value.row][nextList.value.col]){
            let virData = data[nextList.value.row][nextList.value.col];
       
            virData.location = {
                row:nextList.value.row,
                col:nextList.value.col,
            }
            dataList.push(virData);
            nextList = symList.next();
        }else{
            nextList = symList.next();
        }
       
    }

    //console.log("选中单元格列表",list);
    if(callback){
        dataList =  callback(dataList)
    }
    return dataList;
})
// 函数防抖
internalMethod.set("debounce",function(func,wait=0){
    let timeOut;
    return function(...ars){
        if(timeOut){
            clearTimeout(timeOut);
        }
        timeOut =  setTimeout(()=>{
            func(...ars)
        },wait);
    }
    
})

internalMethod.set("debounce1",function(func,wait=0){
    debounce1(func,wait)
    // console.log("debounce1",this);
    // debounce1("debounce1",)
    // if(this.timeOut){
    //     clearTimeout(this.timeOut);
    // }
    // this.timeOut =  setTimeout(()=>{
    //     func()
    // },wait);
})


// 导出方法
let exportMethod = new Map();
/** getMeSelected
         * 获取当前选中单元格 
         * id :组价id 必传 type = true 是否 返回关联后台以后的数据 如果传入 false 会返回 原始位置以及后台数据 
         * @param {*} 
*/ 
exportMethod.set("getMeSelected",function(id,type=true){
        //console.log("获取选中单元格",this);
        if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return false;}/* 国际化处理： 表格实例不存在*/
        let m_cellsModel = this.state.data[id].m_cellsModel;
        let tableData = m_cellsModel.m_cells;
        if(!tableData){console.error(`ID ${$appRoot.state.json['public_lang-000042']} ${id} ${$appRoot.state.json['public_lang-000043']} ${$appRoot.state.json['public_lang-000044']} ${$appRoot.state.json['public_lang-000045']} ${$appRoot.state.json['public_lang-000046']} 实例${$appRoot.state.json['public_lang-000046']}`);return;}/* 国际化处理： 为,的,表格,数据,不存在,实例不存在,实例*/
        // let selected = this.hot[id].getSelected();
        let selected = typeof(this.hot.getSelected) ===  'function' ? this.hot.getSelected() : [];
        //console.log("获取选中单元格",this,selected);

        if(!selected||!selected.length){return []}
        let selectedSymbol = selected[Symbol.iterator]();
        let selectedData = [];
        let nextData = selectedSymbol.next();
        
        while(!nextData.done){
            let newData = this.internalMethod.getInSelectedData(nextData.value,tableData);
            selectedData = selectedData.concat(newData);
            nextData = selectedSymbol.next();
        }
        return {select:this.configMethod.peek(m_cellsModel,selectedData),sizeInfo:selected};
    }
);

var compare = function(x,y){
    if(x<y){
        return -1;
    }else if(x>y){
        return 1;
    }else{
        return 0;
    }
}
/** setMeSelected
         * 获取当前选中单元格 
         * id :组价id 必传 type = true 是否 返回关联后台以后的数据 如果传入 false 会返回 原始位置以及后台数据 
         * @param {*} 
*/ 
exportMethod.set("setMeSelected",async function(id,data,config = {}){
    let {sync = false,callback} = config;
    //console.log("设置选中单元格",this,data);
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return false;}/* 国际化处理： 表格实例不存在*/
    if(sync){
        setTimeout(()=>{
         
            try {
                /**优化单元格选中操作*/
                //1、找出行列信息并排序
                let cols = [];
                let rows = []
                let cellsMap = new Map();
                data.forEach((item)=>{
                    let row = item[0];
                    let col = item[1];
                    if(!cols.includes(col)){
                        cols.push(col);
                    }
                    if(!rows.includes(row)){
                        rows.push(row);
                    }
                    cellsMap.set(row+'_'+col,1);
                })
                cols.sort(compare);
                rows.sort(compare);
                //2、以列为划分依据，构建多个连续的行区域
                let areaDatas = [];
                let area = [];
                cols.forEach((col)=>{
                    let startRow = -1;
                    let endRow = -1;                   
                    for(let i =0;i<rows.length;i++){
                        let row = rows[i];
                        let cell = cellsMap.get(row+'_'+col);
                        if(cell ){
                            if(startRow === -1 && endRow === -1){
                                startRow = row;
                                endRow = row;
                                if(i === rows.length -1){//最后一行
                                    area = [startRow,col,endRow,col];
                                    areaDatas.push(area);
                                }
                                continue;
                            }
                             //行是连续的
                            if(row === (endRow + 1)){
                                endRow = row;
                                if(i === rows.length -1){//最后一行
                                    area = [startRow,col,endRow,col];
                                    areaDatas.push(area);
                                }
                            }else{
                                //如果行是不连续的，则结束该区域，开始下一个区域
                                area = [startRow,col,endRow,col];
                                areaDatas.push(area);
                                startRow = row;
                                endRow = row;
                                if(i === rows.length -1){//最后一行
                                    area = [startRow,col,endRow,col];
                                    areaDatas.push(area);
                                }
                            }
                        }   
                    }
                    
                })
                this.hot.selectCells(areaDatas);
                if(callback){callback()}
            } catch (error) {
                console.error(error)
            }

        },100)
    }else{
        this.hot.selectCells(data);

    }
    
    // let m_cellsModel = this.state.data[id].m_cellsModel;
    // let tableData = m_cellsModel.m_cells;
    // if(!tableData){console.error(`ID 为 ${id} 的 表格 数据 不存在 实例不存在`);return;}
    // let selected = this.hot[id].setSelected();
    // console.log("获取选中单元格",this,selected);

    // if(!selected.length){return [-1,-1,-1,-1]}
    // let selectedSymbol = selected[Symbol.iterator]();
    // let selectedData = [];
    // let nextData = selectedSymbol.next();
    
    // while(!nextData.done){
    //     let newData = this.internalMethod.getInSelectedData(nextData.value,tableData);
    //     selectedData = selectedData.concat(newData);
    //     nextData = selectedSymbol.next();
    // }
    // return this.configMethod.peek(m_cellsModel,selectedData);
}
);
/** getHot
         * 获取固定表格实例
         * id :组价id 
         * @param {*} 
*/ 
exportMethod.set("getHot",function(id){
        //console.log("获取选中单元格",this);
        if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return false;}/* 国际化处理： 表格实例不存在*/
        return this.hot;
    }
);

/** deselectCell
         * 清空选中单元格  不传入data则取消所有 
         * id :组价id 
         * @param {*} 
*/ 
exportMethod.set("deselectCell",async function (id,config = {}){
    //console.log("获取选中单元格",this);
    let {type,data,callback} = config;
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return false;}/* 国际化处理： 表格实例不存在*/
    await this.configMethod.promiseBox({callback:(resolve,reject)=>{
        if(data){

        }else{
            setTimeout(()=>{
                //console.log("谁闲来");
                try {
                    this.hot.deselectCell();
                    resolve(true);
                } catch (error) {
                    console.error(error);
                    reject(false)
                }
                
            },10)
        }
    }});
    if(callback){
        callback();
    }
    //console.log("到底谁后来");
    
}
);
/** render
         * 重新渲染 某个 ID的实例  
         * id :组价id  type = false 是否更新数据 type 后续可考虑为其他值 做差异渲染用
         * @param {*} 
*/ 
exportMethod.set("render",function(id,config = {}){
    let {type,callback} = config
    //console.log("重新渲染 某个 ID的实例  ",this);
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return;}/* 国际化处理： 表格实例不存在*/
    // if(!this.hot[id]){console.error(`ID 为 ${id} 的 表格 数据 不存在 实例不存在`);return;}
    let hot = this.hot;
    let that  = this;
    if(type==="render"){
        hot.render();
    }else{
        setTimeout(()=>{
            // hot.render();
            that.initSelect&&that.initSelect()
            if(callback)callback();
        },50)
    }
}
);
/** setBackGroundColor
         * 重新渲染 某个 ID的实例  
         * id :组价id  
         * @param {*} 
*/
exportMethod.set("setBackGroundColor",function(id,config = {}){
    let {colorData = [],color="#BEFFBE"} = config;
    //console.log("重新渲染 某个 ID的实例  ",this);
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return;}/* 国际化处理： 表格实例不存在*/
    // if(!this.hot[id]){console.error(`ID 为 ${id} 的 表格 数据 不存在 实例不存在`);return;}
    let hot = this.hot;
    let that  = this;
    try {
        setTimeout(()=>{
            colorData.forEach((i)=>{
                hot.getCell(i[0], i[1]).style.backgroundColor = color;
            });
        },0)
    } catch (error) {
        throw error;
    }
   
    
}
);
//  // 设置标志数据 
/** setSign
         * 重新渲染 某个 ID的实例   每次设置以后 都会重新render
         * id :组价id  
         * @param {*} 
*/
exportMethod.set("setSign",function(id,config = {}){
    let {colorData = [],color="#BEFFBE",type="add",isRest = false} = config;
    //console.log("重新渲染 某个 ID的实例  ",this);
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return;}/* 国际化处理： 表格实例不存在*/
    // if(!this.hot[id]){console.error(`ID 为 ${id} 的 表格 数据 不存在 实例不存在`);return;}
    let hot = this.hot;
    let that  = this;

    try {
        if(isRest&&this.sign[id]){
            this.sign[id] = new Map();
            this.exportMethod.render(id,{type:"render"});
        }
        colorData.forEach((i)=>{
            if(!this.sign[id]){
                this.sign[id] = new Map();
            }
            if(type==="add"){
                this.sign[id].set((i[0]+"--"+i[1]),{color:color,data:i[2]});
            }
        });
        //console.log("标记元素",this.sign);
        this.exportMethod.render(id,{type:"render"});
        let allData = [];
        !_.isEmpty(this.sign[id]) && this.sign[id].forEach(i=>{
            allData.push(i.data);
        })
        this.renderSign = false;
        return allData;
    } catch (error) {
        throw error;
    }
   
    
}
);

/** getSign
         * 重新渲染 某个 ID的实例   获取当前表格的 标记对象
         * id :组价id  
         * @param {*} 
*/
exportMethod.set("getSign",function(id,config = {}){
    let {callback} = config;
    //console.log("重新渲染 某个 ID的实例  ",this);
    if(_.isEmpty(this.hot)){console.error($appRoot.state.json['public_lang-000041']);return;}/* 国际化处理： 表格实例不存在*/
    // if(!this.hot[id]){console.error(`ID 为 ${id} 的 表格 数据 不存在 实例不存在`);return;}
    try {
        let sign = false;
        if(this.sign[id]){
            sign = this.sign[id];
        }
        return sign;
    } catch (error) {
        throw error;
    }
   
    
}
);
// 配置方法 在渲染时会 读取外部方法 可以覆盖本地方法
let configMethod = new Map();
// 获取对应指标数据
configMethod.set("peek",(m_cellsModel,selectedData)=>{
        let newSelectedData = new Map();
        let newData = [];
        let peekType = "m_htExtFmt";
        if(peekType === "m_htExtFmt"){
            // 情况1  取formatClazz 
            selectedData.forEach(element => {
                if(element&&element[peekType]&&element[peekType]["measurefmt"]){
                    newSelectedData.set(m_cellsModel["cache"][element[peekType]["measurefmt"]].value.code,element)
                }else{
                    if(newSelectedData.has("invalidCoordinates")){
                        newSelectedData.get("invalidCoordinates").add(element.location);
                    }else{
                        newSelectedData.set("invalidCoordinates",new Set());
                        newSelectedData.get("invalidCoordinates").add(element.location);
                    }
                    
                };
            });
            let virData = m_cellsModel["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.measure.MeasureModel"]["measurePK2VO"];
            while(newSelectedData.size){
                let selectedData = newSelectedData.pops();
                newData.push({
                    // location:
                    original:_.cloneDeep(selectedData),
                    m_htExtFmt:virData[selectedData[0]]
                });
            }
        }
        return newData;
    }
);
// 同步包装
configMethod.set("promiseBox",(config={})=>{
    let {callback} = config;
    return new Promise((resolve,reject)=>{
        if(callback){
            callback(resolve,reject);
        }
    })
}
);

// 将单独单元格  转换成区域型单元格  亦或者将区域型单元格 转换成单独单元格 暂时未开发完善 后续可作为优化路径
configMethod.set("*****",(config={})=>{
    let {callback,data} = config;
   
    // 区域信息  该信息由四个信息素组成 行开始  列开始  行结束  列结束
    let locationArea = new Map();
    function mergeCells(locationArea,i){
                 // 1 行在其允许范围内
            // 2 列在其允许范围内
            // 3 行不在其允许范围内
            // 4 列不在其允许范围内
            // 5 无效选中 单元格
            
            let sFlag = false;
            // 缓存区
            let storeLocationArea = new Map();
            locationArea.some((a,b)=>{
                // 终止符  默认继续下一次
                let isStop = true;
                // 1 本行 正好衔接其中的 开始行  内部需要判断 当前列是否符合  如果 都符合才可以归为本区
                if((i.row+1)===b[0]){
                   
                    // 列符合本区
                    if((i.col+1)===a[0]){
                        locationArea.set([i.row,b[1]],[i.col,a[0]]);
                        locationArea.delete(b);
                    }
                    else if((i.col-1)===a[1]){
                        locationArea.set([i.row,b[1]],[a[0],i.col]);
                        locationArea.delete(b);
                    }
                    else if((i.col+1)<a[0]||(i.col-1)>a[1]){
                        locationArea.set([i.row,i.row],[i.col,i.col]);
                    }else{
                        return false;
                    }
                    
                    
                }
                else if((i.row-1)===b[1]){
                     // 列符合本区
                     if((i.col+1)===a[0]){
                        locationArea.set([b[0],i.row],[i.col,a[0]]);
                        locationArea.delete(b);
                    }
                    else if((i.col-1)===a[1]){
                        locationArea.set([b[0],i.row],[a[0],i.col]);
                        locationArea.delete(b);
                    }//建立新区 
                    else if((i.col+1)<a[0]||(i.col-1)>a[1]){
                        locationArea.set([b[0],i.row],[i.col,i.col]);
                    }else{
                        return false;
                    }
                    
                }else if((i.row+1)<b[0]||(i.col-1)>b[1]){
                    locationArea.set([i.row,i.row],[i.col,i.col]);
                }else{
                        return false;
                }
                
            });
    }
    data.forEach((i)=>{
        if(locationArea.size===0){
            locationArea.set([i.row,i.row],[i.col,i.col]);
        }else{
            mergeCells(locationArea,i)
        }
    });
    //console.log("最终合区数据",locationArea);
    return locationArea;
}
);
























export {exportMethod,internalMethod,configMethod}



