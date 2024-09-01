

import mockData from '../store/mock';
import deepCopy from '../../../utils/deep-copy';

import pubSub from '../../../frame/pubSub';

let runOnceFlag = false;

export default class Actions {
    constructor(comp) {
        this.comp = comp;
        Object.assign(this, comp.props);
    }

    // 初始化页面
    init = () => {
        this.getLanguage();
        this.getTemplate()
            .then(() => {
                this.initPage();
            });
    }

    // 获取页面高度
    getPageHeight = () => {
        if(window.getComputedStyle) {
            let app = document.getElementById('app');
            if(app) {
                let height = window.getComputedStyle(app).height.replace('px', '');

                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        pageHeight: height
                    }
                });
            }

        }
    }

    // 设置url上的n参数为当前的报表名称
    setCurrentReportTitle = (refpk) => {
        const {asyncTree} = this.comp.props;
        let treeData = asyncTree.getAsyncTreeValue('reportTree', refpk);

        if(treeData) {
            let _hash = window.location.hash;
            let hash = '';
            if(_hash) {
                hash = `${_hash}&n=${treeData.title}`
            }
            else {
                hash = `n=${treeData.title}`
            }
            window.location.hash = hash;
        }
    }

    // 左树选中了一棵树
    selectTree = (refpk, ifInit = true) => {
        // refpk 这个参数 一会是数组 一会不是数组的  先这样处理一下
        if (refpk && Array.isArray(refpk)) {
            refpk = refpk.join(',')
        }
        const {
            reportQuery
        } = this.comp.props;

        const {
            reportTemplateMap = {},
            folderTreeList,
            reportSearchMap = {}
        } = reportQuery;

        // 重新选中的时候一些值要重新赋值
        this.dispatch({
            type: 'reportQuery/update',
            payload: {
                currentTreeData: '',
                ifInit: ifInit,
                ifHideSearchModal: false,
                hasShowQueryCondition: false,
                showCustomSearchBody: false,
                showAdvSearchPlanBtn: true,
                customFormData: [],
                customFormValue: {},
                customReferValue: {
                    refpk: '',
                    refcode: ''
                },
                refParams: {}
            }
        });
        window.keyReportParamWeb={}
        // 第一次请求回来的是文件夹而不是报表
        if(folderTreeList.includes(refpk) || refpk === 'root') {
            return false;
        }
        // 如果有对应的查询form或者查询模版，则都要显示查询弹窗
        else if(reportTemplateMap[refpk] || reportSearchMap[refpk]) {
            this.setCurrentReportTitle(refpk);
            this.dispatch({
                type: 'reportQuery/update',
                payload: {
                    currentTreeData: refpk,
                    currentQueryForm: reportTemplateMap[refpk]
                }
            });
        }
        else {
            this.setCurrentReportTitle(refpk);
            // 如果没有对应的查询模版或者form，就去查询是否有自定义的表格弹窗
            this.dispatch({
                type: 'reportQuery/getCustomModalData',
                payload: {
                    pk_report: refpk
                }
            })
                .then((res) => {

                    if(res.data) {
                        this.processCustomSearchData(res.data)
                            .then((data) => {
                                this.dispatch({
                                    type: 'reportQuery/update',
                                    payload: {
                                        currentTreeData: refpk,
                                        currentQueryForm: '',
                                        showCustomSearchBody: true,
                                        showAdvSearchPlanBtn: false,
                                        customFormData: data.itemList,
                                        refQueryConditionMap: data.queryConditionMap
                                    }
                                });
                            });
                    }
                    else {
                        this.dispatch({
                            type: 'reportQuery/update',
                            payload: {
                                currentTreeData: refpk,
                                currentQueryForm: '',
                                ifHideSearchModal: true
                            }
                        });
                    }
                })
                .catch((e) => {
                    this.dispatch({
                        type: 'reportQuery/update',
                        payload: {
                            currentTreeData: refpk,
                            currentQueryForm: '',
                            ifHideSearchModal: true
                        }
                    });
                });
        }
    }
    // 左树拉取子树数据
    loadChildTree = (refpk, treeNode) => {
        const {
            reportQuery
        } = this.comp.props;

        const {folderTreeList} = reportQuery;

        if(refpk === 'root') {
            return;
        }
        this.dispatch({
            type: 'reportQuery/loadSubTreeData',
            payload: {
                pk_folder: refpk
            }
        })
            .then((res) => {
                let folderList = res.data ? res.data.map(item => item.nodeData.nodeValue.repSort && item.id) : [];
                let folderTList = Array.from(new Set(folderTreeList.concat(folderList)))
                this.asyncTree.setTreeData('reportTree', res.data, treeNode);
                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        folderTreeList: folderTList
                    }
                });

                runOnceFlag === false && pubSub.publish('initLoadFirstTree', {
                    treeData: res
                });
                runOnceFlag = true;
            });
    }
    // 初始化页面数据
    initPage = () => {
        this.comp.props.asyncTree.closeNodeByPkAsync('reportTree');
        return new Promise((resolve, reject) => {
            this.getTreeData()
                .then((res) => {
                    if(res && res.data && res.data[0]) {
                        this.asyncTree.openNodeByPkAsync('reportTree', res.data[0].key);
                        // 初始化数据之后在进行高度获取
                        this.getPageHeight();
                        pubSub.subscribe('initLoadFirstTree', (res) => {
                            if(res && res.treeData && res.treeData.data && res.treeData.data[0]) {
                                let nodeKey = res.treeData.data[0].key;
                                if(nodeKey) {
                                    this.asyncTree.setNodeSelectedAsync('reportTree', nodeKey);
                                    this.selectTree(nodeKey);
                                    pubSub.unSubscribe('initLoadFirstTree');
                                }
                            }
                        });
                    }
                });
        });
    }
    // 获取左树数据
    getTreeData = () => {
        return this.dispatch({
            type: 'reportQuery/getTreeData'
        })
            .then((res) => {
                let treeData = deepCopy(mockData.rootTreeData);
                treeData[0].children = res.data;
                this.asyncTree.setTreeData('reportTree', treeData);

                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        folderTreeList: res.data ? res.data.map(item => item.id) : []
                    }
                });
                return res;
            });
    }
    // 获取模版
    getTemplate = () => {
        return new Promise((resolve, reject) => {
            this.createUIDom(this.appConfig, (res) => {
                Object.keys(res.template).forEach((key) => {
                    if(res.template[key] && res.template[key].moduletype === 'form') {
                        res.template[key].items.map((item) => {
                            if(item.itemtype === 'refer' && !item.queryCondition) {
                                item['queryCondition'] = {};
                            }
                        })
                    }
                });
                res.template = this.processSpecial(res.template);
                console.log(res);
                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        context: res.context
                    }
                });
                this.meta.setMeta(res.template);
                this.button.setButtons(res.button);
                resolve();
            });
        });

    }

    // 处理特殊模版特殊数据
    processSpecial = (template) => {

        Object.keys(template).forEach((key) => {
            // 人员类别汇总的人员类别多选
            // 部门汇总表的汇总部门参照多选
            if(
                key === 'WaSumByPsnclQueryConditionPanel' ||
                key === 'WaSumByDeptQueryConditionPanel' ||
                key === 'DeptWaAccountQueryConditionPanel'
            ) {
                template[key].items.map((item) => {
                    if(item.attrcode === 'sumPsncl') {
                        item['isMultiSelectedEnabled'] = true;
                    }
                    if(item.attrcode === 'sumDept') {
                        item['isMultiSelectedEnabled'] = true;
                    }
                });
            }
        });

        return template;
    }

    // 获取多语言
    getLanguage = async () => {

        // let waJson = await new Promise((resolve) => {
        //     this.MultiInit.getMultiLang({
        //         moduleId: 'i6013',
        //         domainName: 'hrwa',
        //         callback: (json, status, init) => {
        //             resolve(json);
        //         }
        //     });
        // });
        this.MultiInit.getMultiLang({
            moduleId: 'hrpub',
            domainName: 'hrpub',
            callback: (json, status, init) => {
                this.dispatch({
                    type: 'reportQuery/update',
                    payload: {
                        language: json
                    }
                });
                mockData.rootTreeData[0].refname = json['hrpub-000127']; // 自由报表
            }
        });

    }

    // 处理自定义查询区域返回来的数据
    processCustomSearchData = async(data) => {

        let refCodes = [];
        let referItemIndex = [];
        let itemList = JSON.parse(data);
        let customFormValue1 = {}, customReferValue = {};
        window.hasDefault = false
        itemList.forEach((item, index) => {
            if(/[456]/.test(item.dataType)) {
                refCodes.push(item.refCode);
                referItemIndex.push(index)
                 if (item.value) {
                    window.hasDefault = true
                    customReferValue[item.code] = {
                        refpk: item.value,
                        refcode: item.refCode,
                        refname: item.display
                    };
                }
            }
            else if(/[23]/.test(item.dataType)) {
                item['options'] = item.refCode.split('@')
            }
             if (item.value) {
                window.hasDefault = true
                customFormValue1[item.code] = item.value;
            } 
        });
         await this.dispatch({
            type: 'reportQuery/update',
            payload: {
                customFormValue: customFormValue1,
                customReferValue: customReferValue
            }
        })
        return this.dispatch({
            type: 'reportQuery/getReferRefPath',
            payload: {
                refCode: refCodes.join(',')
            }
        })
            .then((res) => {
                let queryConditionMap = {};
                let refPathList = [];

                !!res.data && Object.values(res.data).forEach((item, index) => {
                    if(item.queryCondition) {
                        queryConditionMap[refCodes[index]] = item.queryCondition;
                    }

                    refPathList.push(item.refpath);
                });
                if(Array.isArray(refPathList)) {
                    !!referItemIndex.length && referItemIndex.forEach((item, index) => {
                        itemList[item].refPath = refPathList[index]
                    })
                }

                return {
                    itemList,
                    queryConditionMap
                }
            });
    }
}