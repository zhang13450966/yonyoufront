import {toast} from 'nc-lightapp-front';
const EMPTY_FN = function () {
};
/**
 * 对象合并 类似Object.assign();
 * @returns 第一个参数对象
 */
const apply  = function(){
    if(!arguments){
        throw new ReferenceError("该方法执行时至少传递一个参数对象!");
    }
    //参数的长度
    let length = arguments.length;
    //长度是1 直接返回
    if(length == 1){
        return arguments[0];
    }
    //源
    let target = arguments[0];
    //从第二个元素开始 到 最后一个组成sources
    let sources = [...arguments].slice(1);
    for(let i = 0;i<sources.length;i++){
        //第i个参数
        let param = sources[i];
        Object.keys(param).forEach(key=>{
            //param原型上有该对象或者属性
            if(Object.prototype.hasOwnProperty.call(param,key)){
                target[key] = param[key];
            }
        })
    }
    return target;
}
/**
 * 加载单据模板
 * props：
 * cfg:{必输项
 *    pagecode： 必输项 参数模板的参数
 * },
 * callback(fn): 回调
 */
const loadTemplate = function (props, {pagecode,appcode} = cfg) {
    return new Promise(resolve=>{
        props.createUIDom(
            {
                pagecode,
                appcode
            }, 
            (data) => {
                resolve({...data});
            }
        );
    })
};


/**
 * 加载多语言
 * @param {*} props 必输项
 * @param {*} cfg:{
 *   moduleId: 必输项  【应用编码： 例如 38211902 @attention 这里是应用编码多语文件的名称也要以应用编码命名】
 *   domainName：必输项 【领域编码：例如 uapbd、fi、gl等等】
 * }
 */
const loadLang = function (props, {moduleId,domainName} = cfg) {
    return new Promise((resolve)=>{
    	//请求多语
        props.MultiInit.getMultiLang(
            {
                moduleId,
                domainName, 
                callback: (data, success, inlt) => {
                    if (!success){
                        toast({content: '加载语言包失败', color: 'warning'});
                    }
                    resolve({lang:data,inlt});
                }
            }
        );
    })
};

/**
 * 加载参照  多个参照一块加载
 * @param {*} urls 
 *      示例：[
 *             {
 *                url:'uapbd/refer/supplier/SupplierClassTreeRef/index',
 *               name:'uapbd/refer/supplier/SupplierClassTreeRef/index'
 *             },
 *             {
 *               url:'uapbd/refer/supplier/SupplierClassTreeRef/index',
 *               name:'uapbd/refer/supplier/SupplierClassTreeRef/index'
 *             }
 *            ]
 * @returns 
 */
const loadRefer = function (urls = []) {
    if(!urls || urls.length == 0){
        return Promise.resolve(true);
    }
    let result = {};
    //构造
    let loads = (urls.filter((refObj,index)=>{
        let {url} = refObj;
        let jsname = url.includes(".")?url.substring(0, url.length - 3):url;
        if(!window[jsname]){
            return refObj;
        }
    })||[]).map((refObj)=>{
        return new Promise((resolve,reject)=>{
            let {url,name} = refObj;
            let jsname = url.includes(".")?url.substring(0, url.length - 3):url;
            let script = document.createElement('script');
            let suffix = url.includes(".")?'':'.js'
            script.src = '../../../../' + url+suffix;
            script.type = 'text/javascript';
            script.onload = () => {
                result[name] = window[jsname].default || EMPTY_FN;
                resolve(result);
            };
            script.onerror = () => {
                result[name] = undefined;
                reject(result);
            };
            document.body.appendChild(script);
        })
    });
    //Promise 请求全部参照
    return Promise.all(loads);
    
}
/**
 * 请求资源
 * @param {*} config 
 *           props,  当前应用对象的props
 *           pagecode,  页面编码
 *           appcode,   应用编码
 *           moduleId,  建议使用应用编码
 *           domainName, 领域编码
 *           referObjs = [], 参照请求路径集合 
 *           callback = EMPTY_FN 回调
 */
const loadNCCResource = function (config) {
    let {
            props, 
            pagecode, 
            appcode, 
            moduleId, 
            domainName, 
            referObjs = [], 
            callback = EMPTY_FN
    } = config;
    //加载参照
    loadRefer(referObjs)
    .then(()=>{
        return Promise.all([
            //加载模板
            loadTemplate(props,{pagecode,appcode}),
            //加载多语
            loadLang(props,{moduleId,domainName})
        ]);
    }).then(res=>{
        callback({...res[0],...res[1]});
    })
};

const isArray = function(param){
    return Object.prototype.toString.call(param).slice(8, -1) === 'Array';
};

const isString = function(param) {
    return Object.prototype.toString.call(param).slice(8, -1) === 'String';
};
const isObject = function(param){
    return Object.prototype.toString.call(param).slice(8, -1) === 'Object';
};
const transferDataWapper = function(datas, grandsonMap){
    (isObject(datas)?[datas]:datas || []).forEach((data)=>{
        let {head,body,bodys} = data;
        head['bodys'] = apply({},(bodys || body || {}));
        data['body'] = apply({},(bodys || body || {}));
        data['bodys'] = apply({},(bodys || body || {}));
        grandsonMap && (data['grandsonMap'] = apply({}, grandsonMap));
    })
    return datas;
};

const onTransferItemSelectedWrapper = function( func ){
    const fetchDataUnWapper = function(datas){
        ([datas] || []).forEach((data)=>{
            let {head,body,bodys} = data;
            data['body'] = apply({},body ||  head['bodys'] || bodys);
            data['bodys'] = apply({},body || head['bodys'] || bodys);
        })
        return datas;
    };
    return  function(record, isComplete, curActiveIndex,status){
        func(fetchDataUnWapper(record), isComplete, curActiveIndex,status);
    };
};
const onTransferWrapper = function( {props,fetchList}){
    let {ncTabs} = fetchList;
    let {tabPanes} = ncTabs;
    let tables = (tabPanes || []).map(tabPane=>{
        let {transferTable,headIdName,bodyIdName} = tabPane;
        let {headTableId,bodyTableId,billType} = transferTable;
        return {headTableId,bodyTableId,billType,headPkField:headIdName,bodyPkField:bodyIdName};
    });
    let data = props.transferTable.getTransferTableSelectedValue();
    let records = (tables || []).map(table=>{
        let {headTableId,bodyTableId,billType,headPkField,bodyPkField} = table;
        let transData = data[headTableId];
        let records = (transData || []).map(record=>{
            let pk = record[headPkField] ? record[headPkField].value : record.head[headTableId].rows[0].values[headPkField].value
            let ts = record["ts"] ? record["ts"].value : record.head[headTableId].rows[0].values["ts"].value
            let children = (record.body && bodyTableId && bodyTableId.length>0 && record.body[bodyTableId]) ? (record.body[bodyTableId].rows || []).map(row=>{
                return {pk:row.values[bodyPkField].value,ts:row.values["ts"].value}
            }):[];
            return {pk,ts,children};
        });
        return {billType,records};
    });
    return records;
};
//float类型数求和
const FloatAdd = function(arg1,arg2){
    var r1,r2,m,s1 = arg1.toString(),s2 = arg2.toString();
    try{
        r1=s1.split(".")[1].length;
    }catch(e){
        r1=0
    }
    try{
        r2=s2.split(".")[1].length;
    }catch(e){
        r2=0
    }
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m;
};
//float类型数乘积
const FloatMultiple = function(f1,f2){
    var m=0,s1=f1.toString(),s2=f2.toString();
    
    try{
        m+=s1.split(".")[1].length;
    }catch(e){

    }
    try{
        m+=s2.split(".")[1].length;
    }catch(e){

    }
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
};
export const Utils = {
    loadNCCResource,
    loadTemplate,
    loadLang,
    loadRefer,
    apply,
    transferDataWapper,
    onTransferItemSelectedWrapper,
    onTransferWrapper,
    FloatAdd,
    FloatMultiple
};



