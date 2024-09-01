/**
 * 根据类型不同弹不同的模态框
 * @param type
 * @param ctx
 * @param field
 */
import {
    high,
    createPage,
    ajax,
    base,
    toast,
    cacheTools,
    promptBox,
    deepClone,
    getBusinessInfo,
    getMultiLang,
    viewModel
} from "nc-lightapp-front";
import BusinessUnitTreeRef from 'src/hrpub/refer/pub/BusinessUnitTreeRef';
const {Refer} = high;

const handleDataByType = (type, ctx, field, refcode = '',json) => {
    let flag = true; // 用于标识是否为弹窗类型的操作
    //参照的自定义条件
    let condition = {}
    let map = ctx.state.searchParam.map
    if(map){
        let keys = Object.keys(map)
        let values = Object.values(map)
        values.forEach((value,i)=>{
            condition[keys[i]] = field[value]
        })
    }
   
    cacheTools.set('searchParam',ctx.state.searchParam);

    ctx.handleState({
        strCode: field
    })
    switch (type) {
        case '203':
            flag = false
            ctx.handleState({
                comp: 'psntype',
                currentField: field,
                // refQuery:
            }, () => {
                ctx.refs['psntype-refer'].setProps({
                    queryCondition : () => {
                        return {
                            dataTypeid: field.dataTypeid,
                            pk_org: ctx.state.searchParam.pk_org,
                            pk_group: ctx.state.searchParam.groupId
                        }
                    }
                })
                let propsEnu = ctx.refs['psntype-refer'].props
                propsEnu.placeholder = field.displayName
                propsEnu.refname = field.displayName
                propsEnu.refName = field.displayName
                ctx.refs['psntype-refer'].show()
                // ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
            })
            break;
        case '204':
            flag = false
            let config = {}
            if (field.strCode === 'bd_psndoc.nativeplace' || field.strCode  === 'bd_psndoc.permanreside') {
                const unitConf = {
                    multiLang: {
                        domainName: 'uapbd',
                        currentLocale: 'zh-CN',
                        moduleId: 'refer_uapbd',
                    },
                    key: 'pk_country',
                    refType: 'grid',
                    refName: 'refer-000444', /* 国际化处理： 国家地区EX*/
                    placeholder: 'refer-000444', /* 国际化处理： 国家地区EX*/
                    refCode: 'uapbd.refer.pubinfo.CountryExDefaultGridRef',
                    queryGridUrl: '/nccloud/uapbd/pub/CountryExDefaultGridRef.do',
                    isMultiSelectedEnabled: false,
                    columnConfig: [{
                        name: ['refer-000002', 'refer-000441', 'refer-000003', 'refer-000422', 'refer-000442', 'refer-000443', 'refer-000445'], /* 国际化处理： 编码,三位代码,名称,描述,时区,格式,欧盟国家*/
                        code: ['refcode', 'codeth', 'refname', 'description', 'timezonename', 'formatname', 'iseucountry'],
                        checked: {
                            description: false,
                            timezonename: false,
                            formatname: false,
                            iseucountry: false,
                        }
                    }],
                };
                config.defaultUnitValue= {
                    refpk: '0001Z010000000079UJJ',
                    refname: json['hrpub-000130']
                }
                config.isShowUnit = true;
                config.unitProps = unitConf;
               
            } else if(field.strCode === 'hi_psnjob.pk_dept' || field.strCode === 'hi_psnjob.pk_post'){
                const unitConf = {
                    multiLang: {
                        domainName: 'uapbd',
                        currentLocale: 'zh-CN',
                        moduleId: 'refer_uapbd',
                    },
                    queryTreeUrl: '/nccloud/riaorg/ref/AdminOrgDefaultTreeRef.do',
                    refType: "tree",
                    //isMultiSelectedEnabled:true
                    placeholder: '',/* 国际化处理： 集团*/
                    refName: 'refer-000176',/* 国际化处理： 集团*/
                    rootNode: {refname: 'refer-000176', refpk: 'root'},/* 国际化处理： 集团*/
                    queryCondition: {
                        TreeRefActionExt: "nccloud.web.hrhi.pub.sqlbuilder.OrgRefSqlBuilder"
                    }
                };
                if(field.refModelPath === 'hrjf/refer/jfref/HRDeptTreeRef/index' || field.refModelPath === 'hrjf/refer/jfref/PostTreeRef/index'){
                    config.isShowUnit = true;
                }
                config.unitProps = unitConf;
            }else if(field.strCode === 'hi_psnjob.pk_dept_v'){
                const unitConf = {
                    multiLang: {
                        domainName: 'uapbd',
                        currentLocale: 'zh-CN',
                        moduleId: 'refer_uapbd',
                    },
                    refType: "tree",
                    //isMultiSelectedEnabled:true
                    placeholder: 'refer-000201',/* 国际化处理： 业务单元*/
                    refName: 'refer-000176',/* 国际化处理： 集团*/
                    rootNode: {refname: 'refer-000176', refpk: 'root'}
                };
                if(field.refModelPath === 'hrjf/refer/jfref/HRDeptVersionTreeRef/index'){
                    config.isShowUnit = true;
                }
                config.unitProps = unitConf;
            }else {
                config = {}
            }
            window.viewModel = viewModel
            if (refcode) {
                ctx.refs["hr-refer-loader"].createScript(refcode, config)
                setTimeout(() => {
                    let hrReferProp = ctx.refs["hr-refer"].props;
                    let propOrigin = ctx.refs['hr-refer-loader'].state.refer().props;
                    hrReferProp.multiLang = {
                        moduleId: propOrigin.multiLang.moduleId,
                        currentLocale: propOrigin.multiLang.currentLocale,
                        domainName: propOrigin.multiLang.domainName
                    }
                    const callback = (propOrigin) => {
                            let hrReferLoaderProp = typeof (ctx.refs['hr-refer-loader'].state.refer) === 'function' && propOrigin;
                            hrReferLoaderProp.isShowUnit = true;
                            hrReferLoaderProp.placeholder = field.displayName;
                            hrReferLoaderProp.refname = field.displayName;
                            hrReferLoaderProp.refName = field.displayName;
                            if(hrReferLoaderProp.refType === 'tree'){
                                hrReferLoaderProp.rootNode = {
                                    refname : field.displayName,
                                    refpk:'root'
                                }
                            }
                            Object.assign(hrReferProp, hrReferLoaderProp)
                            let contry = ''
                            
                            if(field.strCode === 'bd_psndoc.nativeplace'){
                                contry = field.para2 || config.defaultUnitValue && 'nativeplace_' +config.defaultUnitValue.refpk
                                contry&&ctx.countryPk.push(contry)
                                
                            }else if(field.strCode  === 'bd_psndoc.permanreside'){
                                contry = field.para2 || config.defaultUnitValue && 'permanreside_' +config.defaultUnitValue.refpk
                                contry&&ctx.countryPk.push(contry)
                            }else{
                                contry = field.para2 || config.defaultUnitValue && config.defaultUnitValue.refpk
                                contry&&ctx.countryPk.push(contry)
                            }
                            ctx.countryPkRef = field.para2 || config.defaultUnitValue && config.defaultUnitValue.refpk;
                            hrReferProp.queryCondition = () => {
                            return Object.assign(condition, {
                                    unitPks: config.defaultUnitValue && config.defaultUnitValue.refpk,
                                    pk_org: ctx.state.searchParam.pk_org || ctx.state.searchParam.groupId,
                                    pk_group: ctx.state.searchParam.groupId,
                                    pk_defdoclist: field.para2 || null})
                            }
                            if (field.strCode === 'bd_psndoc.nativeplace' || field.strCode  === 'bd_psndoc.permanreside' || field.strCode === 'hi_psnjob.pk_dept' || field.strCode === 'hi_psnjob.pk_post') {
                                ctx.refs["hr-refer"].setState({
                                    unit: config.defaultUnitValue
                                })
                                ctx.refs["hr-refer"].renderPopoverHeaderExtend = () => {
                                    const { unitProps, isShowUnit, unitCondition} = config;
                                    let props = { ...unitProps };
                                    
                                    if (unitCondition) {
                                        props = { ...unitProps, queryCondition: unitCondition };
                                    }
                                    return (
                                        isShowUnit && (

                                            <div style={{ width: '200px', marginLeft: '20px' }} className="cancel-drag">
                                                <Refer
                                                    {...props}
                                                    value={ctx.refs["hr-refer"].state.unit}
                                                    onChange={(v) => {
                                                        // this.loadSelectedData();
                                                        console.log(v,'vvv')
                                                        ctx.refs["hr-refer"].setState(
                                                            {
                                                                unit: v
                                                            },
                                                            () => {
                                                                ctx.refs["hr-refer"].refresh(false);
                                                            }
                                                        );
                                                        ctx.countryPkRef = v.refpk
                                                        if(field.strCode === 'bd_psndoc.nativeplace'){
                                                            ctx.countryPk.push('nativeplace_'+v.refpk)
                                                        }else if(field.strCode  === 'bd_psndoc.permanreside'){
                                                            ctx.countryPk.push('permanreside_'+v.refpk)
                                                        }else{
                                                            ctx.countryPk.push(v.refpk) 
                                                        }
                                                        hrReferProp.queryCondition = () => {
                                                            return Object.assign(condition, {
                                                                unitPks: v.refpk,
                                                                pk_org: v.refpk,
                                                                pk_group: ctx.state.searchParam.groupId,
                                                                pk_defdoclist: field.para2 || null})                        
                                                        }
                                                        
                                                    }}
                                                    // popWindowClassName={'refer-unit-pop-window'}
                                                    // container={this.props.container}
                                                />
                                            </div>
                                        )
                                    );
                                };
                            }else if(field.strCode === 'hi_psnjob.pk_dept_v'){
                                ctx.refs["hr-refer"].setState({
                                    unit: config.defaultUnitValue
                                })
                                ctx.refs["hr-refer"].renderPopoverHeaderExtend = () => {
                                    const { unitProps, isShowUnit, unitCondition } = config;
                                    let props = { ...unitProps };
                                    if (unitCondition) {
                                        props = { ...unitProps, queryCondition: unitCondition };
                                    }
                                    return (
                                        isShowUnit && (
                                        <div style={{ width: '200px', marginLeft: '20px' }} className="cancel-drag">
                                            <BusinessUnitTreeRef
                                                {...props}
                                                value={ctx.refs["hr-refer"].state.unit}
                                                onChange={(v) => {
                                                    // this.loadSelectedData();
                                                    // ctx.countryPk = v.refpk;
                                                    ctx.countryPkRef = v.refpk
                                                    ctx.countryPk.push(v.refpk)
                                                    hrReferProp.queryCondition = () => {
                                                        return Object.assign(condition, {
                                                                pk_org: v.refpk
                                                            })                        
                                                    }
                                                    ctx.refs["hr-refer"].setState(
                                                        {
                                                            unit: v
                                                        },
                                                        () => {
                                                            ctx.refs["hr-refer"].refresh(false);
                                                        }
                                                    );
                                                }}
                                                popWindowClassName={'refer-unit-pop-window'}
                                            />
                                        </div>)
                                    )
                                }
                            }else {
                                ctx.refs["hr-refer"].renderPopoverHeaderExtend = () => {
                                    return null
                                }
                            }
                            ctx.refs["hr-refer"].show()
                        }

                    getMultiLangJSON(propOrigin.multiLang.moduleId,propOrigin.multiLang.currentLocale,propOrigin.multiLang.domainName,propOrigin, callback);
                    // getMultiLangJSON(hrReferProp.multiLang.moduleId,hrReferProp.multiLang.currentLocale,hrReferProp.multiLang.domainName,hrReferProp, callback);
                }, 100)
            } else {
                flag = true
            }

            break;
        case '205':
            flag = false
            if (refcode) {
                ctx.refs["hr-refer-loader"].createScript(refcode)
                setTimeout(() => {
                    // debugger
                    let hrReferProp = ctx.refs["hr-refer"].props;
                    let hrReferLoaderProp = typeof (ctx.refs['hr-refer-loader'].state.refer) === 'function' && ctx.refs['hr-refer-loader'].state.refer().props;
                    hrReferProp.multiLang = {
                        moduleId: propOrigin.multiLang.moduleId,
                        currentLocale: propOrigin.multiLang.currentLocale,
                        domainName: propOrigin.multiLang.domainName
                    }
                    const callback205 = (hrReferLoaderProp) => {
                        Object.assign(hrReferProp, hrReferLoaderProp);
                        if (field.strCode === 'bd_psndoc.hi_psnjob') {
                            hrReferProp.queryConditon = () => {
                                return {
                                    pk_org: ctx.state.searchParam.pk_org,
                                    pk_group: ctx.state.searchParam.groupId
                                }
                            }
                        }
                        // ctx.refs["hr-refer"].setProps(hrReferProp)
                        ctx.refs["hr-refer"].show();
                    }
                    getMultiLangJSON(hrReferLoaderProp.multiLang.moduleId,hrReferLoaderProp.multiLang.currentLocale,hrReferLoaderProp.multiLang.domainName,hrReferLoaderProp);
                    callback205(hrReferLoaderProp)
                }, 100)
            } else {
                flag = true
            }
            break;
        case '0':
            if (field.strArguments) {
                flag = false
                if(field.para3 !== 'budget'){
                    if (field.strCode === "wageDays") {
                        ctx.handleState({
                            comp: 'dataInterval',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    } else if (field.strCode === "taxRate") {
                        ctx.handleState({
                            comp: 'taxFunc',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    } else if (field.strCode === "preAdjustDate") {
                        ctx.handleState({
                            comp: 'salaryChange',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    } else if (field.strCode === "getAvgWaData"){
                        ctx.handleState({
                            comp: 'psntype',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }else if (field.strCode === "preStaff()"){
                        ctx.handleState({
                            comp: 'lastStaffEstab',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }else if (field.strCode === 'staff()'){

                        ctx.handleState({
                            comp: 'staffestab',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }else if (field.strCode === "scaleStaff"){
                        ctx.handleState({
                            comp: 'staffestablishscale',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }else if (field.strCode === "budgetYear()"){
                        ctx.handleState({
                            comp: 'lastannualbudget',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }
                }else{
                    if(field.strCode === "getAvgWaData" || field.strCode === "getWaData"){
                        ctx.handleState({
                            comp: 'grant',
                            currentField: field
                        }, () => {
                            ctx.refs["hr-panel-modal"].refs["hr-panel-container-ref"].show()
                        })
                    }
                }
            }
            break;
        default:
            flag = true
            break;
    }
    return flag
};

// 回写textarea
const handleFieldByType = (data, field) => {
    // 要求不用引号包含公式内容的参照
    let codeNoQuotation = ['taxRate', 'preAdjustDate', 'budgetYear()', 'scaleStaff', 'preStaff()', 'staff()'];
    let str = null
    if (field.strArguments) {
        const handleStr = (handleStr, currentData, code) => {
            handleStr = handleStr.replace(new RegExp(`({.*?})`, 'g'), (e) => {
                if(codeNoQuotation.includes(code)){
                    return `${currentData[e.match(/\d/)]}`
                }else{
                    return `"${currentData[e.match(/\d/)]}"`
                }
                
            })
            console.log(handleStr)
            return handleStr
        }
        // 这几个是写死的
        switch (field.strCode) {
            case "taxRate":
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig)
                if (data.val00 === '0') {
                    let d0 = [
                        '0', data.val01, 'null', 'null'
                    ]
                    str = handleStr(str, d0, field.strCode)
                } else if(data.val00 === '1') {
                    let d1 = [
                        '1', data.val11, data.val12, data.val13 || 12
                    ]
                    str = handleStr(str, d1, field.strCode)
                } else {
                    let d1 = [
                        '3', data.val16, data.val15, data.val14, 'null'
                    ]
                    str = handleStr(str, d1, field.strCode)
                }
                break;
            case "wageDays":
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig)
                let d0 = [
                    data.dateStart, data.dateEnd
                ]
                str = handleStr(str, d0, field.strCode)
                break;
            case "preAdjustDate":

                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig)
                let d1 = [
                    data.modalValue
                ]
                str = handleStr(str, d1, field.strCode)
                break;
            case "getWaData":
                if(field.para3 === 'budget' && field.inputSig.lastIndexOf('@') > 0){
                    field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1);
                }
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);
                if(field.para3 === 'budget'){
                    str = str+'@';
                }
                let d2 = [
                    data.modalValue.refname
                ]
                str = handleStr(str, d2, field.strCode);
                break;
            // case "getWaData":
            //     str = field.strArguments.replace(/(\w+)*/, field.inputSig)
            //     let d3 = [
            //         data.modalValue.refname
            //     ]
            //     str = handleStr(str, d3)
            //     break;
            case "getAvgWaData":
                field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1);
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);
                str = str+'@';
                let d4 = [
                    data.modalValue.refname
                ]
                str = handleStr(str, d4, field.strCode);
            break;
            case 'preStaff()':
                let searchParam1 = cacheTools.get('searchParam')
                let periodyear1 = (parseInt(searchParam1.periodyear)-1).toString();
                
                field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1);  
                // str = field.inputSig;
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);  
                str = str+'@';
                let d5 = [
                    '['+periodyear1+'.'+data.modalValue.refname+']'       
                ]
                str = handleStr(str, d5, field.strCode);
            break;        
            case "staff()":                
                let searchParam2 = cacheTools.get('searchParam');
                let periodyear2 = searchParam2.periodyear;
            
                field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1);  //inputSig: "@本年度人员编制数据"
                // str = field.inputSig;
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);  // 单词字符  strArguments: "staff({0})"
                str = str+'@';
                let d6 = [
                    '['+periodyear2+'.'+data.modalValue.refname+']'              // data:{modalValue:{refname: '三位'}}
                ]
                str = handleStr(str, d6, field.strCode);
            break;

            case 'budgetYear()':
                    let searchParam3 = cacheTools.get('searchParam');
                    let periodyear3 = (parseInt(searchParam3.periodyear)-1).toString();

                    field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1); 
                    str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);  
                    str = str+'@';
                    let d7 = [
                        '['+periodyear3+'.'+data.modalValue.refname+']'          
                    ]
                    str = handleStr(str, d7, field.strCode);
            break;
            case 'scaleStaff': 
                let searchParam4 = cacheTools.get('searchParam');
                let periodyear4 = (parseInt(searchParam4.periodyear)-1).toString();
                
                field.inputSig = field.inputSig.substring(0,field.inputSig.length - 1);  
                str = field.strArguments.replace(new RegExp(`(\\w+)*`), field.inputSig);  
                str = str+'@';
                let d8 = [
                    '['+periodyear4+'.'+data.modalValue.refname+''+']'              
                ]
                let d9 = [
                    '['+searchParam4.periodyear+'.'+data.modalValue_second.refname+''+']'  
                ]
                str = handleStr(str, [d8, d9], field.strCode);
            break;
            case '':
                break;
        }
        return str;
    }
}
const getMultiLangJSON = (moduleId, currentLocale, domainName , props, callback) => {
    getMultiLang({
        moduleId,
        currentLocale,
        domainName,
        callback: (json) => {
            props.refName = json[props.refName ]
            props.placeholder = json[props.placeholder]
            let columns = props.columnConfig
            if (columns) {
                for (let i = 0, j = columns.length; i < j; i++) {
                    let names = columns[i]['name']
                    names.forEach((v,k)=>{
                        names[k] = json[v]
                    })
                }
                props.columnConfig = columns
            }
            
            if(props.rootNode && json[props.rootNode.refname]){
                props.rootNode.refname = json[props.rootNode.refname]
            }
            callback(props)
        }
    });
};
export default {
    handleDataByType,
    handleFieldByType
}