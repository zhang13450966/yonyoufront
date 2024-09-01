
// 对于simplereport 组件的一些方法

import deepCopy from '../../../utils/deep-copy';

import {toast} from 'nc-lightapp-front';

const defaultSearchItem = [{
    attrcode: 'report-empty',
    visible: true,
    label: '',
    required: false,
    checkStrictly: false,
    col: "3",
    colnum: "1",
    color: null,
    containlower: false,
    dataPowerOperationCode: null,
    datatype: "0",
    disabled: false,
    editAfterFlag: false,
    fieldDisplayed: null,
    fieldValued: null,
    formattype: null,
    functions: null,
    hyperlinkflag: false,
    initialvalue: null,
    isDataPowerEnable: null,
    isMultiSelectedEnabled: null,
    isResLabel: false,
    isShowUnit: false,
    isTreelazyLoad: null,
    isdrag: false,
    isfixedcondition: false,
    isnextrow: false,
    isnotmeta: false,
    isrevise: null,
    itemtype: null,
    languageMeta: null,
    leftspace: "0",
    max: null,
    maxlength: "0",
    metadataProperty: null,
    min: null,
    options: null,
    pid: null,
    pk_defdoclist: null,
    position: "0",
    queryOperateType: '',
    ratio: null,
    refName_db: null,
    refcode: null,
    rightspace: "0",
    rows: "0",
    scale: "0",
    unit: null,
    usefunc: false,
    visibleposition: "0"
}];

let fromSelf = false;
let onceRun = true;

export default class SimpleReport {
    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props);
    }

    // 修改meta
    disposeSearch = (meta, props) => {
        const {
            reportSearchMap, 
            currentTreeData,
            ifHideSearchModal,
            showCustomSearchBody,
            orgValue
        } = this.comp.props.reportQuery;
        
        let _openAdvSearch = props.search.openAdvSearch;

        // 拦截报表的openAdvSearch函数
        this.dispatch({
            type: 'reportQuery/update',
                payload: {
                    searchMeta:meta,
                    searchProps:props
                }
        })
        props.search.openAdvSearch = (name, flag, fromSelf) => {
            !fromSelf && !window.hasDefault && this.dispatch({
                type: 'reportQuery/update',
                payload: {
                    customFormValue: {},
                    customReferValue: {
                        refpk: '',
                        refcode: ''
                    }
                }
            });
            // 因为不知道什么原因，需要调用下更新操作，才能触发查询弹窗的关闭
            // 所以再次做一次空更新
            onceRun && setTimeout(() => {
                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {}
                });
                // onceRun = false;
            }, 600);
            
            _openAdvSearch.apply(props.search, [name, flag]);
        }

        // 如果没有设定隐藏查询弹窗
        if(!ifHideSearchModal) {
            // 找到查询弹窗对应的查询模版
            let searchTmp = meta[reportSearchMap[currentTreeData]];

            searchTmp = this.processSpecialItem(searchTmp, currentTreeData);

            // 有配置search模版, 让light_report 模版的items改成配置的items
            if(searchTmp) {
                // 这部防止如果查询模版是空的，添加个默认的，防止他不显示
                if(searchTmp.items.length <= 0) {
                    searchTmp.items = deepCopy(defaultSearchItem)
                }
                // 将light_report换成对应的查询模版
                meta['light_report'] = searchTmp;
            }
            // 如果没有配置search模版，用默认的light_report模版, 并且如果默认的light_reportitems为空，则给个默认的
            else {
                if(!meta['light_report'] || meta['light_report'].items.length <= 0) {
                    if(!meta['light_report']) {
                        meta['light_report'] = {
                            areaVisible: false,
                            code: "light_report",
                            isnotmeta: false,
                            isunfold: true,
                            items: [],
                            moduletype: "search"
                        };
                    }
                    meta['light_report'].items = deepCopy(defaultSearchItem);
                }
            }

            // 清空一下上一次填写的值  // 如果设置了默认值 不能再清空不然默认值也被清了
            !window.hasDefault && this.dispatch({
                type: 'reportQuery/update',
                payload: {
                    customFormValue: {},
                    customReferValue: {
                        refpk: '',
                        refcode: ''
                    }
                }
            });
        }
// console.log('1');
        if(orgValue&&orgValue.refpk) {
            for( let key in meta) {
                if(meta[key].items&&meta[key].items.length > 0 && orgValue) {
                    meta[key].items.forEach((item)=> {
                        
                        item.queryCondition = {
                            pk_org:orgValue.refpk
                        }
                    })
                }
            }
        }
        return meta;
    }

    // 对于特殊的查询条件进行特殊处理
    processSpecialItem = (template) => {

        // 人员类别汇总表的人员类别查询参照多选
        // 部门汇总表的部门参照多选
        if(!template) {
            return template;
        }
        if(
            template.code === 'psnclsum' || 
            template.code === 'deptsum' || 
            template.code === 'deptaccount'
        ) {
            template.items.map((item) => {
                if(item.attrcode === 'pk_psnjob.pk_psncl') {
                    item.isMultiSelectedEnabled = true;
                }
                if(item.attrcode === 'pk_psnjob.pk_dept.name') {
                    item.isMultiSelectedEnabled = true;
                }
                if(item.attrcode === 'pk_psnjob.pk_dept') {
                    item.isMultiSelectedEnabled = true;
                }
            });
        }

        return template;
    }

    // 发起搜索钱扩展搜索条件
    expandSearchVal = (items, props, type, queryInfo) => {
        const {
            currentQueryForm, 
            queryRightData, 
            language,
            orgValue,
            ifHideSearchModal,
            hasShowQueryCondition,
            currentTreeData,
            employeeV,
            showCustomSearchBody,
            customFormValue,
            customFormData,
            reportWithoutTransfer = []
        } = this.comp.props.reportQuery;

        // 如果不弹出查询弹窗，默认直接返回条件
        if(ifHideSearchModal) {
            return items;
        }

        // 如果items不是一个数组
        if(!Array.isArray(items&&items.conditions)) {
            items = {
                logic: 'and',
                conditions: []
            }
        }

        // 如果是组织节点，则需要将组织拼到条件里
        if(orgValue) {
            items.conditions.unshift({
                field: 'pk_org',
                value: {
                    firstvalue: orgValue.refpk
                }
            });
        }

        // 如果展示的是自定义的查询内容，进行必填验证
        if(showCustomSearchBody) {
            let isEmptyItem = [];
            customFormData.map((item) => {
                if(item.required && customFormValue[item.code] === undefined) {
                    isEmptyItem.push(item.name);
                }
            })
            if(isEmptyItem.length > 0) {
                setTimeout(() => {
                    props.search.openAdvSearch('light_report', true, true);
                }, 0);
                toast({
                    color: 'danger',
                    content: `${isEmptyItem.join(', ')}${language['hrpub-000131']}`, // xxx为必填项
                });
                return false
            }
        }
        else {
            let formData = null;
            // 如果有查询表单
            if(currentQueryForm) {
                formData = this.form.getAllFormValue(currentQueryForm);
            }
            // 有部分报表不需要穿梭框，所以也就不需要穿梭框的唯恐检测
            if(!reportWithoutTransfer.includes(currentTreeData)) {
                // 穿梭狂数据写进条件里
                let rightList = deepCopy(queryRightData);
                rightList.map((item) => {
                    // display是为了适应穿梭狂加的字段
                    delete item['display'];
                });
                if(rightList.length <= 0) {
                    toast({
                        color: 'warning',
                        content: language['hrpub-000133'], // 已选薪资项目不能为空！
                    });
                    setTimeout(() => {
                        fromSelf = true;
                        props.search.openAdvSearch('light_report', true);
                        fromSelf = false;
                    }, 0);
                    return false;
                }
                // 把穿梭狂右侧值拼到条件里
                items.conditions.unshift({
                    field: 'items',
                    value: {
                        firstvalue: JSON.stringify(rightList)
                    }
                });
            }
            // 如果是员工收入台账报表，则需要给报表的员工item赋值，以绕过必填检测
            if(currentTreeData === '1001Z71000000000A3GT') {
                this.form.setFormItemsValue(currentQueryForm, {
                    waEmployeePk: {
                        value: employeeV.value
                    }
                });
            }
            // 检测是否填写或者打开了form表单
            if(hasShowQueryCondition === false || (formData && !this.checkFormData(formData.rows[0].values))) {
                toast({
                    color: 'warning',
                    content: language['hrpub-000132'], // 请先填写查询条件2
                });
                setTimeout(() => {
                    props.search.openAdvSearch('light_report', true);
                }, 0);
                return false;
            }
            // 如果formData有数据，并且没有通过检测
            else if(formData && !this.form.isCheckNow(currentQueryForm)) {
                setTimeout(() => {
                    props.search.openAdvSearch('light_report', true);
                }, 0);
                return false;
            }
            // 如果拿到了form数据，就进行拼接查询条件
            if(formData) {
                Object.keys(formData.rows[0].values).forEach((key) => {
                    // 员工台帐报表比较特殊，form理由查询弹窗, 所以特殊处理
                    if(currentTreeData === '1001Z71000000000A3GT' && key === 'waEmployeePk') {
                        items.conditions.unshift({
                            field: 'waEmployeePk',
                            value: {
                                firstvalue: employeeV.value
                            }
                        });
                    }
                    else {
                        // 正常的把form表单值加进条件里
                        items.conditions.unshift({
                            field: key,
                            value: {
                                firstvalue: formData.rows[0].values[key].value,
                                secondvalue: null
                            }
                        });
                    }
                });
            }
        }
        return items;
    }

    // 自定义查询数据
    isBusiRender = () => {

        const {ifHideSearchModal} = this.comp.props.reportQuery;
        let searchData = {
            logic: '',
            conditions: []
        };

        return this.dispatch({
            type: 'reportQuery/getReportData',
            payload: {}
        })
            .then((res) => {
                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        ifInit: false
                    }
                });
                return {
                    data: res
                }
            });
    }

    // 检测form值
    checkFormData = (formData) => {
        let result = false;

        Object.keys(formData).forEach((key) => {
            if(formData[key].value !== null) {
                result = true;
            }
        });

        return result;
    }

    // 处理自定义弹窗内容的参数
    processUserDefObj = () => {
        let {customFormValue, refParams, orgValue} = this.comp.props.reportQuery;
        for (let key in customFormValue) {
            if (!customFormValue[key]) delete refParams[key]
        }
        refParams['pk_org'] = {
            value: orgValue && orgValue.refpk || ''
        }

        let searchValue = null;

        if(typeof customFormValue === 'object' && customFormValue !== null) {
            
            searchValue = {};

            Object.keys(customFormValue).forEach((key) => {
                if(
                    customFormValue[key] !== undefined && 
                    customFormValue[key] !== null &&
                    customFormValue[key] !== ''
                ) {
                    if (Array.isArray(customFormValue[key])) {
                        searchValue[key] = customFormValue[key].join(',')
                    } else {
                        searchValue[key] = customFormValue[key];
                    }
                }
            });
        }
        else {
            searchValue = customFormValue;
        }
        window.keyReportParamWeb = refParams
        console.log('....keyReportParamWeb.....')
        console.log(window.keyReportParamWeb)
 
        window.userdefObj = {
            keyReportParamWeb: searchValue,
            CurrentReportOrg: orgValue ? orgValue.refpk : null,
            keyIsHrQueryForWeb: 'ncchr'
        }
        return searchValue;
    }
}
