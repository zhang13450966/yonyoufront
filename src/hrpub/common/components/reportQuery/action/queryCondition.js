
import deepCopy from '../../../utils/deep-copy';

import QueryConditionComp from '../components/QueryCondition';

import CustomSearchArea from '../components/CustomSearch';

export default class QueryCondition {

    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props);
    }

    init = () => {
        const {
            reportQuery,
            initLeftTreeData
        } = this.comp.props;
        
        let template = this.meta.getMeta();
        // 表单变成编辑态
        this.form.setFormStatus(reportQuery.currentQueryForm, 'edit');

        // 为了员工台账报表专门执行
        if(reportQuery.currentTreeData === '1001Z71000000000A3GT') {
            this.comp.props.renderEmployeeInput();
            initLeftTreeData();
        }
        

        this.dispatch({
            type: 'reportQuery/update',
            payload: {
                queryLeftData: [],
                queryRightData: [],
                leftChecked: [],
                rightChecked: [],
                hasShowQueryCondition: true
            }
        });
    }


    // 穿梭狂穿梭的时候
    changeTransfer = (leftData, rightData) => {

        this.dispatch({ 
            type: 'reportQuery/update',
            payload: {
                queryLeftData: leftData,
                queryRightData: rightData
            }
        });

    }

    // // 表单编辑后事件
    // afterFormEdit = (props, moduleId, key, value, oldValue) => {
    //     let formData = this.form.getAllFormValue(moduleId);
    //     let postData = {
    //         area_code: moduleId,
    //         key: key,
    //         model: formData
    //     };

    //     this.dispatch({
    //         type: 'reportQuery/afterEditForm',
    //         payload: {
    //             postData
    //         }
    //     })
    //         .then((res) => {
    //             let {form, item_list} = res.data;
    //             if(form) {
    //                 this.form.setAllFormValue({
    //                     [moduleId]: form[moduleId]
    //                 });
    //             }
                
    //             if(item_list && item_list.length > 0) {
    //                 this.dispatch({
    //                     type: 'reportQuery/update',
    //                     payload: {
    //                         queryLeftData: this.processTransferData(item_list),
    //                         queryRightData: []
    //                     }
    //                 });
    //             }
    //         });
    // }

        // 表单编辑后事件
        afterFormEdit = (props, moduleId, key, value, oldValue) => {
            const {
                reportQuery
            } = this.comp.props;
            // 这两个不需要编辑后事件， 否则会将左边树的后来的数据清除掉
            if (moduleId === 'WaItemQueryConditionPanel' && (key === 'bIfCountByDept' || key === 'bIfContainMutiple')) return;
            const {searchProps} = reportQuery
            let formData = this.form.getAllFormValue(moduleId);
            let postData = {
                area_code: moduleId,
                key: key,
                model: formData
            };
    
            this.dispatch({
                type: 'reportQuery/afterEditForm',
                payload: {
                    postData
                }
            })
                .then((res) => {
                    let {form, item_list,numlist, stringlist} = res.data;
                    if(form) {
                        this.form.setAllFormValue({
                            [moduleId]: form[moduleId]
                        });
                    }
                    
                    let arr = []
                    if(item_list && item_list.length > 0) {
                        this.dispatch({
                            type: 'reportQuery/update',
                            payload: {
                                queryLeftData: this.processTransferData(item_list),
                                queryRightData: []
                            }
                        });
                        
                    }
                    // if(meta.deptsum&&meta.deptsum.items.length>0) {
                        if(numlist&&numlist.length > 0) {
                            numlist.forEach((item) => {
                                arr.push({
                                    "queryOperateType": "between@=@>@>=@<@<=@",
                                    "isfixedcondition": false,
                                    "isdrag": true,
                                    "pid": "f_n",
                                    "visibleposition": "3",
                                    "functions": null,
                                    "usefunc": false,
                                    "checkStrictly": false,
                                    "hyperlinkflag": false,
                                    "col": "3",
                                    "leftspace": "0",
                                    "rightspace": "0",
                                    "rows": "0",
                                    "colnum": "1",
                                    "isnextrow": false,
                                    "attrcode": item.attrcode,
                                    "refpk": item.attrcode,
                                    "color": null,
                                    "containlower": false,
                                    "dataPowerOperationCode": null,
                                    "datatype": item.datatype,// todo 30
                                    "disabled": false,
                                    "editAfterFlag": false,
                                    "fieldDisplayed": "refcode",//
                                    "fieldValued": "refcode",//
                                    "formattype": null,
                                    "initialvalue": null,
                                    "isDataPowerEnable": false,
                                    "isMultiSelectedEnabled": false,
                                    "isnotmeta": true,//
                                    "isResLabel": false,
                                    "isrevise": null,
                                    "isShowUnit": false,
                                    "isTreelazyLoad": null,
                                    "itemtype": "number",//
                                    "label": item.label,
                                    "languageMeta": null,
                                    "max": null,
                                    "maxlength": item.maxlength,
                                    "metadataProperty": null,
                                    "min": null,
                                    "options": null,
                                    "pk_defdoclist": null,
                                    "position": "8",//
                                    "ratio": null,
                                    "refcode": null,
                                    "refName": "-99",
                                    "required": false,
                                    "scale": item.scale,
                                    "unit": null,
                                    "visible": false
                                })
                            })
                        }
                        if(stringlist&&stringlist.length > 0) {
                            stringlist.forEach((item) => {
                                arr.push({
                                    "queryOperateType":"like@=@left like@right like@",
                                    "isfixedcondition":false,
                                    "isdrag":true,
                                    "pid":"c_n",
                                    "visibleposition":"4",
                                    "functions":null,
                                    "usefunc":false,
                                    "checkStrictly":false,
                                    "hyperlinkflag":false,
                                    "col":"3",
                                    "leftspace":"0",
                                    "rightspace":"0",
                                    "rows":"0",
                                    "colnum":"1",
                                    "isnextrow":false,
                                    "attrcode":item.attrcode,
                                    "refpk": item.attrcode,
                                    "color":null,
                                    "containlower":false,
                                    "dataPowerOperationCode":null,
                                    "datatype": item.datatype,//1
                                    "disabled":false,
                                    "editAfterFlag":false,
                                    "fieldDisplayed":"refcode",//
                                    "fieldValued":"refcode",//
                                    "formattype":null,
                                    "initialvalue":null,
                                    "isDataPowerEnable":false,
                                    "isMultiSelectedEnabled":false,
                                    "isnotmeta":true,//
                                    "isResLabel":false,
                                    "isrevise":null,
                                    "isShowUnit":false,
                                    "isTreelazyLoad":null,
                                    "itemtype":"input",//
                                    "label": item.label,
                                    "languageMeta":null,
                                    "max":null,
                                    "maxlength": item.maxlength,
                                    "metadataProperty":null,
                                    "min":null,
                                    "options":null,
                                    "pk_defdoclist":null,
                                    "position":"8",//
                                    "ratio":null,
                                    "refcode":null,
                                    "refName":"-99",
                                    "required":false,
                                    "scale":item.scale,
                                    "unit":null,
                                    "visible":false
                                })
                            
                            })
                        }
                    
                    
                    // }
                    // 重新设置查询左树数据
                    let newMeta = deepCopy(reportQuery.searchMeta)
                    let newItems = [...newMeta.light_report.items,...arr]
                    newMeta.light_report.items = newItems
                    // newMeta.light_report.code = 'light_report'
                    newMeta.deptsum.items = newItems
                    searchProps.meta.setMeta(newMeta,function(){
                        searchProps.search.changeItemVisibleByField('light_report',
                        reportQuery.searchMeta.light_report.items[0].attrcode,
                        reportQuery.searchMeta.light_report.items[0].visible
                        )
                    });
                    console.log(searchProps.meta.getMeta(),'nhgyt')
                    
                    
                    
                    // this.dispatch({
                    //     type: 'reportQuery/update',
                    //     payload: {
                    //         newMetaUp:newMeta
                    //     }
                    // });
                    
                });
        }
    
    // 处理返回的穿梭狂数据
    processTransferData = (data = []) => {

        data.forEach((item) => {
            item.display = item.title;
        });

        return data;
    }

    // 表单编辑前事件
    beforeFormEdit = async (props, moduleId, key, value, data) => {
        const {
            orgValue
        } = this.comp.props.reportQuery;
        let template = this.meta.getMeta();
        let formData = this.form.getAllFormValue(moduleId);
        // 查询条件2 员工收入台账 员工添加参数过滤
        if(orgValue && orgValue.refpk && moduleId === 'PsnIncomeAccountQueryConditionPanel' && key === 'waEmployeePk') {
            template['psnaccount2'].items.map((item) => {
                item.queryCondition = {
                    pk_org: orgValue.refpk
                }
            })
        }

        
        let postData = {
            area_code: moduleId,
            key: key,
            model: formData
        };

        try {
            let res = await this.dispatch({
                type: 'reportQuery/beforeEditForm',
                payload: {
                    postData: postData
                }
            })

            let {editTable, refParam = {}} = res.data;
            this.form.setFormItemsDisabled(moduleId, {
                [key]: editTable
            });
            template[moduleId].items.map((item) => {
                if(key === 'sumDept') {
                    let bIfContainInSeal = formData.rows[0].values.bIfContainInSeal
                    bIfContainInSeal && Object.assign(item.queryCondition, {'bIfContainInSeal': bIfContainInSeal.value});
                }
                if(item.queryCondition && item.attrcode === key) {
                    Object.assign(item.queryCondition, refParam);
                }
            });
        }
        catch(e) {
        }

        return true;
    }

    // 穿梭狂item上下移动
    moveItem = (direction) => {
        return () => {
            const {
                leftChecked, 
                rightChecked,
                queryRightData,
                queryLeftData
            } = this.comp.props.reportQuery;

            let nList = [...queryRightData];
            let prefixList = [];
            let subfixList = [];
            if(direction === 'down') {
                
                for(let i = nList.length-1; i>=0;i--) {
                    if(rightChecked.includes(queryRightData[i].key)) {
                        if(i < nList.length - 1) {
                            nList[i] = nList[i + 1];
                            nList[i + 1] = queryRightData[i];
                        }
                    }
                }
                
            }
            nList.forEach((item, index) => {
                if(rightChecked.includes(queryRightData[index].key)) {
                    // 向上
                    if(direction === 'up') {
                        if(index > 0) {
                            // 与上一个元素交换
                            nList[index] = nList[index - 1];
                            nList[index - 1] = item;
                        }
                    }
                    else if(direction === 'upp') {
                        // 存到前置数组里，并且置空现在元素
                        prefixList.push(deepCopy(nList[index]));
                        nList[index] = null;
                    }
                    // else if(direction === 'down') {
                    //     // 与下一个元素交换
                    //     if(index < nList.length - 1) {
                    //         nList[index] = nList[index + 1];
                    //         nList[index + 1] = item;
                    //     }
                    // }
                    else if(direction === 'downn') {
                        // 存到后置数组里，并且置空当前元素
                        subfixList.push(deepCopy(nList[index]));
                        nList[index] = null;
                    }
                }
            });
            // 删除null元素
            nList = nList.filter(item => item);
            // 合并前缀数组
            if(prefixList.length > 0) {
                nList = prefixList.concat(nList);
            }
            // 合并后缀数组
            if(subfixList.length > 0) {
                nList = nList.concat(subfixList);
            }

            this.dispatch({
                type: 'reportQuery/update',
                payload: {
                    queryRightData: nList
                }
            });
        }
    }

    // 穿梭狂选中
    // 这个穿梭狂是我自己写的，比较变态，checkedList里的元素的status为true才是选中
    checkedTransfer = (type, checkedList) => {
        
        let nList = [];

        Object.keys(checkedList).forEach((key) => {
            if(checkedList[key].status) {
                nList.push(checkedList[key].data.key)
            }
        })

        let payload = {};
        if(type === 'left') {
            payload = {
                leftChecked: nList
            };
        }
        else {
            payload = {
                rightChecked: nList
            }
        }
        this.dispatch({
            type: 'reportQuery/update',
            payload: payload
        });
    }

    // 如果有form 就渲染querycondition
    renderSearchTab = () => {
        let _this = this 
        const {currentQueryForm, queryLeftData,queryRightData,language} = this.comp.props.reportQuery;
        if(!currentQueryForm) {
            return null;
        }
        else {
            return () => {
                return [{
                    name: language['hrpub-000140'], // '查询条件2',
                    content: (
                        <QueryConditionComp
                            {...this.comp.props}
                            initLeftTreeData={this.comp.action.ReportQuery.initLeftTreeData}
                            searchMan={this.comp.action.ReportQuery.searchMan}
                            renderEmployeeInput={this.comp.action.ReportQuery.renderEmployeeInput}
                        />
                    ),
                    callback:()=> {
                        setTimeout(()=>{
                            _this.dispatch({
                                type: 'reportQuery/update',
                                payload: {
                                    queryLeftData:[...queryLeftData],
                                    queryRightData:[...queryRightData]
                                }
                            });
                        },200)
                        
                    }
                }]
            }
        }
    }

    renderCustomSearchBody = () => {
        let {
            customFormData,
            language,
            customFormValue,
            customReferValue,
            customQueryCondition,
            currentTreeData,
            refQueryConditionMap
        } = this.comp.props.reportQuery;

        return (
            <CustomSearchArea
                language={language}
                data={customFormData}
                onChange={this.onChangeCustomSearchArea}
                customFormValue={customFormValue}
                customReferValue={customReferValue}
                ref={ref => this.customSearchRef = ref}
                dispatch={this.dispatch}
                customQueryCondition={customQueryCondition}
                currentTreeData={currentTreeData}
                refQueryConditionMap={refQueryConditionMap}
            />
        );
    }

    saveProgramme = (res,c,v) => {
        const {
            currentQueryForm, 
            queryRightData, 
            queryLeftData,
            language,
            orgValue,
            ifHideSearchModal,
            hasShowQueryCondition,
            currentTreeData,
            pk_ncc_queryscheme,
            reportTemplateMap,
            employeeV,
            showCustomSearchBody,
            customFormValue,
            customFormData,
            reportSearchMap,
            reportWithoutTransfer = []
        } = this.comp.props.reportQuery;

            let formData = null;
        // 如果有查询表单
            if(currentQueryForm) {
                formData = this.form.getAllFormValue(currentQueryForm);
            }
            let postData = {}
            if(!reportWithoutTransfer.includes(currentTreeData)) {
                // 这里是有穿梭框的部分
                postData.leftData = queryLeftData
                postData.rightData = queryRightData
            }
            postData.model = formData
        
            
            return postData
       
    }
    clearEve = () => {
        const {
            reportTemplateMap,
            currentTreeData
           
        } = this.comp.props.reportQuery;
        let attrCode = reportTemplateMap[currentTreeData]
        this.form.EmptyAllFormValue(attrCode)
        this.dispatch({
            type: 'reportQuery/update',
            payload: {
                queryLeftData:[],
                queryRightData:[]
            }
        });
    }
    displayItem = (res,query,c) => {
        const {
            reportTemplateMap,
            currentTreeData
           
        } = this.comp.props.reportQuery;
        let attrCode = reportTemplateMap[currentTreeData]
            // }
        let queryLeftData = []
        let queryRightData = []
        if(query.conditionobj4web&&query.conditionobj4web.nonpublic&&query.conditionobj4web.nonpublic.leftData) {
            queryLeftData = query.conditionobj4web.nonpublic.leftData
        }
        if(query.conditionobj4web&&query.conditionobj4web.nonpublic&&query.conditionobj4web.nonpublic.rightData) {
            queryRightData = query.conditionobj4web.nonpublic.rightData
        }
        this.dispatch({
            type: 'reportQuery/update',
            payload: {
                queryLeftData,
                queryRightData
            }
        });
        
        if(query.conditionobj4web&&query.conditionobj4web.nonpublic&&query.conditionobj4web.nonpublic.model) {
            this.form.setAllFormValue({[attrCode]:query.conditionobj4web.nonpublic.model})

        } else {
            this.form.EmptyAllFormValue(attrCode)
        }
       
    }
   
    // 自定义的查询区域的change handle
    onChangeCustomSearchArea = (type, item) => {
        return (...args) => {
            // 这里 当删除值的时候不走，所以只能在processUserDefObj处理删除值的refParams
            let {reportQuery} = this.comp.props;
            let {refParams} = reportQuery;
            let value = '';
            let param = args[0];
            if(Array.isArray(args[0])) {
                param = args[0].join()
            }
            refParams[item.code] = {'value': param};

            if(type === 'select') {
                value = args[0]
            }
            else if(type === 'refer') {
                refParams[item.code] = args[1]
                let sourceValue = {
                    refpk: [],
                    refname: [],
                    refcode: []  
                };
                if(Array.isArray(args[0])) {
                    args[0].forEach((v) => {
                        sourceValue.refpk.push(v.refpk);
                        sourceValue.refname.push(v.refname);
                        sourceValue.refcode.push(v.refcode);
                    });

                }
                else {
                    sourceValue.refpk.push(args[0].refpk);
                    sourceValue.refname.push(args[0].refname);
                    sourceValue.refcode.push(args[0].refcode);
                }
                
                if(/6/.test(item.dataType)) {
                    value = sourceValue.refname.join(',');
                }
                else if(/4/.test(item.dataType)) {
                    value = sourceValue.refpk.join(',');
                }
                else if(/5/.test(item.dataType)) {
                    value = sourceValue.refcode.join(',');
                }

                if(value.split(',').length > 1) {
                    value = `${value}`;
                }
            }
            else if(type === 'input') {
                value = args[0]
            }
            else if(type === 'date') {
                value = args[0]
            }
            let payload = {
                // refParams: refParams,
                customFormValue: {
                    ...reportQuery.customFormValue,
                    [item.code]: value
                }
            };

            // 编制管理的编制纬度参照需要添加参数
            if(item.code === 'B5:O6year') {
                payload['customQueryCondition'] = {
                    ...reportQuery.queryCondition,
                    year: value
                };
            }

            if(type === 'refer') {
                payload['customReferValue'] = {
                    ...reportQuery.customReferValue,
                    [item.code]: args[0]
                };
            }
            refParams[item.code]['name'] = item.name
            payload['refParams'] = refParams
            this.dispatch({
                type: 'reportQuery/update',
                payload: payload
            });
        }
    }

}