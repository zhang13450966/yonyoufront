import React from 'react';

window["$nccPlatform"] = window["nc-lightapp-front"];
window.$appRoot = window.$appRoot ? window.$appRoot : { state: { json: {} } }
import "./meConfig.js";
let { base, createPage, ajax } = $nccPlatform;
const { NCCheckbox, NCButton, NCTabs, NCLoading, NCHotKeys } = base;
const NCTabPane = NCTabs.NCTabPane;
import MyTree from "./MyTree";
import { CONSTANT } from "./constant";
import "./index.less";

import ExcelTable from "../ExcelTable";
import mockData from "./mockData.json";
import { buttonEvent, markOrCancel, btnGroupControl } from "./event";
import TwoPointDom from '../TwoPointDom';

class Mselect extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.props.use.editTable("listEditMeta");
        let rData = [];
        if (this.props.jsonProvider) {

            this.jsonProvider = JSON.parse(this.props.jsonProvider);
            if (this.jsonProvider.attributes) {
                this.jsonProvider.attributes.forEach((i, k) => {
                    rData.push({
                        value: i.ID,
                        display: i.displayName,
                        refpk: "unitProp",
                        refname: $appRoot.state.json['public_lang-000119'],/* 国际化处理： 单位信息*/
                    });
                })
            }

            if (this.jsonProvider.measureVos) {
                this.jsonProvider.measureVos.forEach((i, k) => {
                    rData.push({
                        value: i.code,
                        display: i.name,
                        refpk: i.m_strReportPK,
                        refname: i.m_strReportName || "",
                    });
                })
            }
        }
        this.state = {
            asd: "aaa",
            //是否允许渲染表样方式    
            iTtable: true,
            //是否允许列表方式   
            iTlist: true,
            tableIndex: "1",
            searchValue: "",
            markStatus: false,//标记或者取消标记
            loadingStatus: false,
            rightRightData: rData,//右侧全量数据  每次更新以后需要
            rightSearchValueData: [],//右侧搜索显示数据  每次更新以后需要
            rightSearchValue: "",//右侧搜索
            rightSelectList: {},//右侧点击选中数据
            initiativeState: true,
            json: {},
            signButtonShow: true, //标记按钮
            delBtn: true, //删除
            upBtn: true, //上移
            topBtn: true, //置顶
            downBtn: true, //下移
            bottomBtn: true, //置地
            rightLeftTableHeightConfig: {
                height:475
            },
        };
        this.excelTableData = JSON.parse(mockData.data);
        this.dataSet = {}
        this.selectRefpk = "mselect_box";
        // 电子表格当前选中 每次取出数据 需要清空 每次加入数据 为覆盖
        this.excelData = {};
        this.unitProp = false;
        this.hot = {};
        this.tabExcel = false; //是否需要更新电子表格选中
        this.mselectData = this.props.mselectData;
        this.markOrCancel = markOrCancel.bind(this);
        $appRoot.Mselect_owner = this;

    }
    componentWillMount() {
        let _this = this;
        if (_.isEmpty($appRoot.state.json) || (!_.isEmpty($appRoot.state.json) && Object.keys($appRoot.state.json).filter(it => _.startsWith(it,"public_lang").length == 0))) {
            // 初始化调用getPlatformLang方法获取多语
            let callback = (json, bool, LangData) => {
                Object.assign($appRoot.state.json,json);
                _this.setState({json:$appRoot.state.json},()=>{
                    let meta = _this.props.meta.getMeta();
                    meta["listEditMeta"] = CONSTANT.listEditMeta();
                    _this.props.meta.setMeta(meta)
                })
            }
            $nccPlatform.getMultiLang({ domainName: 'ufoe', moduleId: 'public_lang', callback }) // moduleId为所需加载json文件夹名称前缀
        } else {
            let meta = this.props.meta.getMeta();
            meta["listEditMeta"] = CONSTANT.listEditMeta();
            this.props.meta.setMeta(meta, () => { })
        }

    }

    updateTableHeightConfig(){
        let listEditMeta = document.getElementById('hot-key-listEditMeta');
        console.log(`@height!!!!!`,listEditMeta.clientHeight);
        const rightLeftTableHeightConfig = {};
        if(this.props.isInStepContent){
            Object.assign(rightLeftTableHeightConfig, {
                height: listEditMeta.clientHeight - 30
            })
        }else{
            Object.assign(rightLeftTableHeightConfig, {
                adaptionHeight: true,
                otherAreaHeight: 65,
            })
        }
        this.setState({ rightLeftTableHeightConfig });
    }

    componentDidMount() {
        // this.props.excelTable.setExcelTableData(this.selectRefpk,this.excelTableData);
        this.setTableData("reset");
        this.requestTreeData();
        !this.props.showSign && this.setState({tableIndex: "2"},()=>{
            this.updateSelectData("setTable");
        });
        setTimeout(() => {
            this.updateTableHeightConfig();
        },0);
    }
    initComponent = () => {

    }
    // 标记 
    signFn = (config = {}) => {
        // rightRight 是否是右侧 操作
        let { sData, isRest = false, rightRight = false } = config;
        console.log($appRoot.state.json['public_lang-000120'], myNewData())/* 国际化处理： 时间节点1*/
        let selectData = this.props.excelTable.getMeSelected(this.selectRefpk);
        console.log($appRoot.state.json['public_lang-000121'], myNewData())/* 国际化处理： 时间节点2*/
        // if(sData){
        //     selectData = {};
        //     selectData.select = sData;
        // }
        if (selectData.select) {
            // 设置选中区域颜色
            let colorData = [];

            selectData.select.forEach(i => {
                if (i.original[1][1].location) {
                    colorData.push([
                        i.original[1][1].location.row,
                        i.original[1][1].location.col,
                        i

                    ]);
                }
            });
            //console.log("当前选中数据 1", colorData);
            selectData.select = this.props.excelTable.setSign(this.selectRefpk, {
                colorData: colorData,
                color: "#BEFFBE",
                isRest: isRest

            });
        }else if(!selectData.length){
            this.props.excelTable.setSign(this.selectRefpk,{colorData: [],isRest:true})
        }
        
        this.tabExcel = true;
        //console.log("当前选中数据", selectData);
        let { select = [], sizeInfo = [] } = selectData;

        //console.log("当前选中数据", selectData);
        let selectDataMap = {
            sizeInfo: sizeInfo,
            // hisSelect:new Map()
        };
        let hisSelect = new Map();
        // selectDataMap.set()
        select.forEach((element, k) => {
            if (element.m_htExtFmt) {
                hisSelect.set(element.m_htExtFmt.code, element);
            } else {
                // hisSelect.set("invalidCoordinates",element);
            }
        });
        selectDataMap.hisSelect = hisSelect;
        this.excelData = selectDataMap;
        if (!rightRight) {
            this.updateSelectData();
        }
        // 是否同步数据至右侧
        if (this.props.rightRight && !rightRight) {
            let sdata = [];
            let code = "code";
            if (this.selectRefpk === "unitProp") {
                code = "id";
            }
            let type = "add";
            let tableData = this.props.editTable.getAllRows("listEditMeta");
            tableData && tableData.forEach((i, k) => {
                if (selectDataMap.hisSelect.has(i.values[code].value)) {
                    sdata.push({
                        value: i.values[code].value,
                        display: i.values["name"].value,
                        refpk: this.selectRefpk,
                        refName: this.selectTreeNode.refname
                    });
                }

            })
            this.updateRightRightData({
                type: type, value: sdata, callback: () => {
                    if (this.state.rightSearchValue) {
                        this.rightSearchChangeContent(this.state.rightSearchValue);
                    }
                }
            })
        }


        if (this.state.markStatus === false && selectDataMap.hisSelect.size) {
            this.setState({ markStatus: true });
        }
        console.log($appRoot.state.json['public_lang-000039'], myNewData())/* 国际化处理： 时间节点3*/
    }
    // 更新当前选中 
    // type set 设置选中  
    updateSelectData = (type, config = {}) => {
        // 收集表格上的选中
        // let {}
        if (!this.dataSet[this.selectRefpk]) {
            return;
        }
        let attrcode = "code";
        if (this.unitProp) {
            attrcode = "id";
        }
        if (type === "set") {
            //console.log("设置表格选中",config);
            // 设置列表选中
            let selectListMap = this.dataSet[this.selectRefpk].mergeSelect;
            if (selectListMap) {
                let selectList = [];
                let noSelectList = [];
                let focusRowByPkIndex = 0;
                let tableData = this.props.editTable.getAllRows("listEditMeta");
                tableData && tableData.forEach((i, k) => {
                    if (selectListMap.has(i.values[attrcode].value)) {
                        selectList.push(k);
                    } else {
                        noSelectList.push(k);
                    }
                    if (config.focusRowByPk === i.values[attrcode].value) {
                        focusRowByPkIndex = k;
                    }
                })
                // let index = selectList.map(i=>i.index);
                //console.log("当前表格选中", selectList);
                this.props.editTable.selectTableRows("listEditMeta", selectList, true);
                this.props.editTable.selectTableRows("listEditMeta", noSelectList, false);
                if (config.focusRowByPk) {
                    this.props.editTable.focusRowByIndex("listEditMeta", focusRowByPkIndex);
                }
            }



            //设置电子表格选中 暂缺
            // let selectListMap = new Map();
            // selectList = _.cloneDeep(this.props.editTable.getCheckedRows("listEditMeta"));
            // selectList.forEach((i)=>{
            //     selectListMap.set(i.data.values.code.value,i);
            // });
            // // 收集电子表格上的选中;
            // let selectTable = _.cloneDeep(this.excelData);
            // this.excelData = new Map();
            // this.dataSet[this.selectRefpk].listSelect = selectList;
            // this.dataSet[this.selectRefpk].excelSelect = selectTable;

        } else if (type === "setTable") {
            if (config.rightUpdate) {
                this.props.excelTable.deselectCell(this.selectRefpk, {
                    callback: () => {
                        let { mergeSelect = new Map(), excelSelect = new Map() } = this.dataSet[this.selectRefpk];
                        // let {sizeInfo = [] } = excelSelect;
                        let mergeArray = [];
                        let allMeasuresMendegeMap = this.dataSet[this.selectRefpk].tableData["m_cellsModel"]["m_htExtProp"]["allMeasuresMendegeMap"]
                        mergeSelect.forEach((i, k) => {
                            if (allMeasuresMendegeMap.has(k)) {
                                mergeArray.push(allMeasuresMendegeMap.get(k));
                            }

                        });
                        //console.log("当前选中数据-射后来", mergeArray);
                        this.props.excelTable.setMeSelected(this.selectRefpk, mergeArray, {
                            sync: true, callback: () => {
                                // 此处 后续可考虑性能优化
                                this.signFn({ isRest: true, rightRight: true, });
                                // this.excelData = _.cloneDeep(excelSelect);
                            }
                        });
                    }
                });

            } else {
                let tableData = this.dataSet[this.selectRefpk] && this.dataSet[this.selectRefpk].tableData;
                tableData && this.props.excelTable.setExcelTableData(this.selectRefpk, tableData, {
                    callback: (hot) => {

                        this.props.excelTable.deselectCell(this.selectRefpk, {
                            callback: () => {
                                // this.tabExcel = true;
                                let { mergeSelect = new Map(), excelSelect = new Map() } = this.dataSet[this.selectRefpk];
                                // let {sizeInfo = [] } = excelSelect;
                                let mergeArray = [];
                                let allMeasuresMendegeMap = this.dataSet[this.selectRefpk].tableData["m_cellsModel"]["m_htExtProp"]["allMeasuresMendegeMap"]
                                mergeSelect.forEach((i, k) => {
                                    if (allMeasuresMendegeMap.has(k)) {
                                        mergeArray.push(allMeasuresMendegeMap.get(k));
                                    }

                                });
                                //console.log("当前选中数据-射后来", mergeArray);
                                this.props.excelTable.setMeSelected(this.selectRefpk, mergeArray, {
                                    sync: true, callback: () => {
                                        // 此处 后续可考虑性能优化
                                        this.signFn({ isRest: true });
                                        // this.excelData = _.cloneDeep(excelSelect);
                                    }
                                });
                            }
                        });

                    }
                });
            }
        } else {

            if (this.state.tableIndex === "1") {
                let selectListMap = new Map();
                let selectList = _.cloneDeep(this.props.editTable.getCheckedRows("listEditMeta"));

                if (this.dataSet[this.selectRefpk].listSelect && this.dataSet[this.selectRefpk].listSelect.size) {
                    selectListMap = this.dataSet[this.selectRefpk].listSelect;
                }

                // 当前数据列 
                let virListTable = this.props.editTable.getAllRows("listEditMeta");
                let virselectListMap = new Map();
                let virListTableMap = new Map();
                selectList.forEach(i => {
                    virselectListMap.set(i.data.values[attrcode].value, 1);
                });
                virListTable.forEach(i => {
                    if (!virselectListMap.has(i.values[attrcode].value)) {
                        virListTableMap.set(i.values[attrcode].value, 1);
                    }

                });
                selectList.forEach((i) => {
                    if (!selectListMap.has(i.data.values[attrcode].value)) {
                        selectListMap.set(i.data.values[attrcode].value, i);
                    }

                });
                virListTableMap.forEach((i, k) => {
                    if (selectListMap.has(k)) {
                        selectListMap.delete(k);
                    }

                });
                // 收集电子表格上的选中;
                this.dataSet[this.selectRefpk].listSelect = selectListMap;
                this.dataSet[this.selectRefpk].mergeSelect = selectListMap;

                selectListMap.size === 0 && (window.mockThat.sign = {}); //处理bug，颜色标识不会清空，列表已经没有勾选数据，表格还有颜色单元格

            } else {
                if (this.tabExcel) {
                    let selectTable = _.cloneDeep(this.excelData);
                    this.dataSet[this.selectRefpk].excelSelect = selectTable;

                    this.dataSet[this.selectRefpk].listSelect = selectTable.hisSelect ? selectTable.hisSelect : new Map();
                    this.dataSet[this.selectRefpk].mergeSelect = selectTable.hisSelect ? selectTable.hisSelect : new Map();

                    // console.log("表格上的选中",selectList,selectTable,this.dataSet[this.selectRefpk]);
                }
            }
            // 判断是否是单选 如果是单选 则没次更新时 将当前选中 传递给上级 如果不是单选 需要将所有数据传递给上级
            if (this.props.isRadio) {
                if (this.state.tableIndex === "1") {
                    let pData = {
                        treeNode: this.selectTreeNode,
                        data: this.dataSet[this.selectRefpk].listSelect
                    }
                    this.props.setData && this.props.setData(pData);
                } else {
                    let pData = {
                        treeNode: this.selectTreeNode,
                        data: this.dataSet[this.selectRefpk].excelSelect
                    }
                    this.props.setData && this.props.setData(pData)
                }
            } else {
                let pData = {
                    treeNode: this.selectTreeNode,
                    data: this.dataSet
                }
                this.props.setData && this.props.setData(pData);
                this.setState({ initiativeState: this.state.initiativeState ? false : true });
            }
        }


    }
    loopTree = (data, callback) => {
        if (!Array.isArray(data)) return;
        data.forEach((i, k) => {
            callback(i, k);
            if (Array.isArray(i.children) && i.children.length) {
                this.loopTree(i.children, callback);
            }
        });
    }
    getCurrentType = () => {
        return new Promise((reslove) => {
            ajax({
                url: "/nccloud/report/lightsmart/queryreturntype.do",
                data: {},
                success: (res) => {
                    reslove(res.data);
                },
            });
        });
    };
    // 请求并设置树数据
    requestTreeData = async () => {
        //console.log("请求树数据", this);
        let param = CONSTANT.param.tree;
        if (!_.isEmpty(this.props.param)) {
            //console.log("请求树数据1", this.props.param);
            param = this.props.param;
        }
        let url = CONSTANT.requestTreeDataUrl;
        if(this.props.isRuleUrl){
            url = this.props.isRuleUrl
        }

        if (this.props.treeUrl) {
            url = this.props.treeUrl;
        }

        let newParam = {};
        if (this.props.isRefer) {
            newParam = {
                queryCondition: param,
                "pageInfo": { "pageSize": 50, "pageIndex": -1 }
            }
        } else {
            newParam = param;
        }
        //console.log("请求树的数据1-1", newParam);
        
        if (this.props.rightRight) {
            // url = "nccloud/ufoe/task/qryUnitAndReportTree.do";
            newParam = {
                "pageInfo": { "pageSize": 50, "pageIndex": -1 },
                queryCondition: {

                    "isShowUnit": false,
                    showUnitInfo: true,
                    pk_org: CONSTANT.param.tree.pk_org
                }

            };
        }

        //处理审核方案中参数缺少pk_org问题
        if(this.props.unitFormulaId && this.props.unitFormulaId == "auditProgram_card"){
            if(newParam.queryCondition){
                newParam.queryCondition['pk_org'] = $nccStore.getDef('pk_org');
            } else{
                newParam['queryCondition'] = {
                    pk_org: $nccStore.getDef('pk_org')
                }
            }
        }else if(this.props.isTask || this.props.unitFormulaId && this.props.unitFormulaId == "formula_editor"){ //处理任务中参数缺少pk_org问题
            if(newParam.queryCondition){
                newParam.queryCondition['pk_org'] = $nccStore.getDef("taskAppConfigList").pageConfig.org.value;
            } else{
                newParam['queryCondition'] = {
                    pk_org: $nccStore.getDef("taskAppConfigList").pageConfig.org.value
                }
            }
        }else if(this.props.isDataCenter){
            if(newParam.queryCondition){
                newParam.queryCondition['pk_org'] = this.props.param.pk_org;
            } else{
                newParam['queryCondition'] = {
                    pk_org: this.props.param.pk_org
                }
            }
        } else { //处理语义模型中参数缺少pk_org问题
            const getCurrentType = await this.getCurrentType();
            // let pk_group
            // if(getCurrentType.type=='group'){
            //     let pk_group = await $nccUtil.promiseAjax("/nccloud/ufoe/refer/qryPKOrg.do", { nodeType: "1" });
            // }
            
            switch (getCurrentType.type) {
                case "global"://全局
                    newParam.queryCondition.pk_org = CONSTANT.global
                    break
                case "group"://集团
                let pk_group = await $nccUtil.promiseAjax("/nccloud/ufoe/refer/qryPKOrg.do", { nodeType: "1" });
                    newParam.queryCondition.pk_org = _.get(pk_group, 'data.pk_group')
                    break
                case "business"://组织
                    newParam.queryCondition.pk_org = this.props.otherProps.org.values.pk_corp.value
                    break
                default:
                    newParam.queryCondition.pk_org = CONSTANT.global
                    break
            }
        }
        
        let vres = await $nccUtil.promiseAjax(url, newParam);
        //console.log("请求树的数据", vres);
        if (this.props.isRefer) {
            this.props.syncTree.setSyncTreeData(CONSTANT.leftTreeId, this.props.syncTree.createTreeData(vres.data.rows));
        } else {
            this.props.syncTree.setSyncTreeData(CONSTANT.leftTreeId, vres.data);
        }
        if (this.props.isMselect) {

            if (this.props.mselectTrueData) {
                let refcode = this.props.mselectTrueData.split("'")[1].split("->")[0];
                // 获取当前同步树数据
                if (refcode) {
                    let treeData = this.props.syncTree.getSyncTreeValue(CONSTANT.leftTreeId);
                    //console.log("mselect传入已有数据",this.props.mselectTrueData,"%%%%",refcode,treeData);
                    let nodeData;
                    this.loopTree(treeData, (items) => {
                        if (items.refcode && items.refcode === refcode) {
                            nodeData = items;
                        }
                    })
                    if (nodeData) {
                        let ars = [nodeData.refpk, nodeData, "mselectTrue"];
                        //console.log("设置默认值", ars);
                        this.onSelectEve(...ars);
                    }

                }



            }
        }
        // 是否有待定选中
        if (this.mselectData) {
            let onRefpk;
            for (const i in this.mselectData) {
                if (Object.hasOwnProperty.call(this.mselectData, i)) {
                    if (!onRefpk) {
                        onRefpk = [i]
                    }
                    this.dataSet[i] = {
                        hisData: new Map()
                    }
                    // const element = this.mselectData[key];
                    this.mselectData[i].forEach(k => {
                        this.dataSet[i].hisData.set(k, { display: $appRoot.state.json['public_lang-000122'], value: k });/* 国际化处理： 暂时就这样*/
                    })
                    // this.dataSet[i] = {
                    //     hisData: this.mselectData[i]
                    // }
                }
            }
            this.mselectData = null;
            if (onRefpk) {

                let treeNodeData = this.props.syncTree.getSyncTreeValue(CONSTANT.leftTreeId, onRefpk[0]);


                if (treeNodeData) {
                    let ars = [onRefpk[0], treeNodeData, "firstInit"];
                    //console.log("设置默认值", ars);
                    this.onSelectEve(...ars);
                }
            }
        }

        if(this.props.defaultExpandRoot){
            //默认展开根节点
            const treeList = this.props.syncTree.getTreeToList(CONSTANT.leftTreeId);
            if(Array.isArray(treeList) && treeList.length > 0){
                this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, treeList[0].refpk);
            }
        } else {
            this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, 'root');
        }
    }
    // 列表时的 搜索
    searchList = (e) => {

    }
    // 列表搜索
    searchChange = (e) => {
        this.setState({ searchValue: e });
        //console.log("最终的搜索1", e);
        this.searchContent(e);
    }
    // 右侧列表搜索
    rightSearchChange = (e) => {
        this.setState({ rightSearchValue: e }, () => {
            this.rightSearchChangeContent(e);
        });
    }
    rightSearchChangeContent = (e) => {
        let time = 1000;
        let immediately = false;
        if (!e) {
            immediately = true;
        }
        this.debounce1(() => {
            //console.log("右侧搜索",this);
            let searchValue = e;
            let rightRightData = this.state.rightRightData;
            let rightSearchValueData = [];
            rightRightData.forEach((i, k) => {
                if (i.display.indexOf(searchValue) > -1 && searchValue) {
                    i.searValue = searchValue;
                    rightSearchValueData.push(i);
                }
            });
            this.setState({ rightSearchValueData: rightSearchValueData });
        }, time, immediately);
    }
    // 更新右侧数据

    searchContent = (e, callback) => {
        let time = 1000;
        let immediately = false;
        if (!e) {
            immediately = true;
        }
        this.debounce1(() => {
            let searchValue = this.state.searchValue;
            //console.log("最终的搜索2", searchValue);

            // 分两种  一  单位信息 search
            let id = "listEditMeta";
            if (this.selectRefpk
                &&
                this.dataSet[this.selectRefpk].listData
                && this.dataSet[this.selectRefpk].listData.rows
                && this.dataSet[this.selectRefpk].listData.rows.length) {
                // 首先筛选数据
                let tableData = { rows: [], pageInfo: { pageSize: "10", pageIndex: "1" } };
                if (e) {
                    this.dataSet[this.selectRefpk].listData.rows.forEach(i => {
                        let str = i.values.name.display;
                        let searchText = e;
                        let strArray = [];
                        if (searchText) {
                            strArray = str.split(searchText);
                        }
                        if (strArray.length > 1) {
                            tableData.rows.push(i);
                        }
                    })
                }

                if (!e) {
                    tableData = this.dataSet[this.selectRefpk].listData;
                }
                this.setTableData(true, tableData);
                // 设置搜索隐藏列
                this.props.editTable.setColValue(id, "search", { display: e, value: e });
                this.updateSelectData("set");
                if (callback) {
                    callback();
                }
            }
        }, time, immediately);
    }
    // 清空当前 并且取消等待
    emptyFn = (ars, unitProp, callback) => {
        this.selectRefpk = ars[0];
        this.unitProp = false;
        if (unitProp) {
            this.unitProp = unitProp;
        }
        this.props.editTable.setTableData("listEditMeta", { rows: [] });
        this.setState({ loadingStatus: false }, () => {
            if (callback) { callback() }
        });
    }
    // 树节点点击
    onSelectEve = async (...ars) => {
        //console.log("时间节点1", this,ars, ars[0], myNewData())
        //console.log("树节点点击", ars);
        let that = this;
        let pk = ars[0];
        let treeNodeData = this.props.syncTree.getSyncTreeValue(CONSTANT.leftTreeId, this.selectRefpk);

        // this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, pk);

        if (this.selectRefpk !== "mselect_box" && treeNodeData.isleaf) {
            // 每次点击之前  需要判断是否有搜索值 
            let sear = {};
            let awaitSear = this.state.searchValue;
            if (this.state.searchValue) {
                sear.searchValue = "";
            }
            await this.promiseBox({
                callback: (resolve, reject) => {
                    this.setState({ loadingStatus: true, ...sear }, () => {
                        if (awaitSear) {
                            this.searchContent("", () => {
                                resolve(true);
                            });
                        } else {
                            resolve(true);
                        }
                    });
                }
            })

            this.tabExcel = false;
            // 每次切换前需要 将当前选中数据加入数据池 
            this.updateSelectData()
            // 需要判断 当前点击是否是单位信息

            //console.log("时间节点1.2", myNewData())
        }
        this.selectTreeNode = ars[1];
        this.selectRefpk = ars[0];
        if (this.selectRefpk === "unitProp") {
            await this.promiseBox({
                callback: (resolve, reject) => {
                    if (pk === "unitProp") {
                        // 需要修改模板信息
                        let meta = this.props.meta.getMeta();
                        meta["listEditMeta"] = CONSTANT.unitEditMeta();
                        this.unitProp = true;
                        this.props.meta.setMeta(meta, () => {
                            resolve(true)
                        });
                    } else {
                        if (this.props.isTask) {
                            let meta = this.props.meta.getMeta();
                            meta["listEditMeta"] = CONSTANT.listEditMeta();
                            this.unitProp = false;
                            this.props.meta.setMeta(meta, () => {
                                //console.log("时间节点1.1", myNewData())
                                resolve(true)
                            });
                        } else {
                            resolve(true);
                        }

                    }
                }
            });
        } else {
            await this.promiseBox({
                callback: (resolve, reject) => {
                    if (pk === "unitProp") {
                        // 需要修改模板信息
                        let meta = this.props.meta.getMeta();
                        meta["listEditMeta"] = CONSTANT.unitEditMeta();
                        this.unitProp = true;
                        this.props.meta.setMeta(meta, () => {
                            resolve(true)
                        });
                    } else {
                        if (this.props.isTask) {
                            let meta = this.props.meta.getMeta();
                            meta["listEditMeta"] = CONSTANT.listEditMeta();
                            this.unitProp = false;
                            this.props.meta.setMeta(meta, () => {
                                //console.log("时间节点1.1", myNewData())
                                resolve(true)
                            });
                        } else {
                            resolve(true);
                        }

                    }
                }
            });
            this.unitProp = false;
        }
        // 校验是否是相同关键字
        // pk_key_comb
        let pk_key_comb_flag = false;
        try {
            if (pk !== "unitProp") {
                if (ars[1].nodeData) {
                    let pk_key_comb = ars[1].nodeData.pk_key_comb;
                    for (const key in this.dataSet) {
                        if (Object.hasOwnProperty.call(this.dataSet, key)) {
                            const element = this.dataSet[key];
                            if (key !== "unitProp" && element.mergeSelect && element.mergeSelect.size) {
                                if (element.treeNodeData.nodeData.pk_key_comb !== pk_key_comb) {
                                    pk_key_comb_flag = true;
                                }
                            }


                        }
                    }
                } else {
                    let pk_key_comb = ars[1].values.pk_key_comb.value;
                    for (const key in this.dataSet) {
                        if (Object.hasOwnProperty.call(this.dataSet, key)) {
                            const element = this.dataSet[key];
                            if (key !== "unitProp" && element.mergeSelect && element.mergeSelect.size) {
                                if (element && element.treeNodeData && element.treeNodeData.values.pk_key_comb.value !== pk_key_comb) {
                                    pk_key_comb_flag = true;
                                }
                            }


                        }
                    }
                }

            }

        } catch (error) {
            // 清空当前表格数据
            this.emptyFn(ars);
            throw error;
        }

        // if (pk_key_comb_flag) {
        //     // 清空当前表格数据 
        //     $nccPlatform.toast({
        //         color: 'warning',
        //         content: $appRoot.state.json['public_lang-000123'],/* 国际化处理： 只能选择同一关键字组合*/
        //     })
        //     this.emptyFn(ars);
        //     return;
        // }
        if (!ars[1].isleaf) {
            // 清空当前表格数据
            this.emptyFn(ars);
            return;
        }

        // 树据已存在 直接使用缓存 有两种情况 一种是 存在 但是是历史数据 需要在点击以后
        if (this.dataSet[pk] && !this.dataSet[pk].hisData && ars[3] !== "rightClick") {

            this.emptyFn(ars, this.unitProp, () => {
                // this.setState({ tableIndex: "1" }, () => {
                //     // 设置表格数据
                //     // this.setTableData();
                //     this.setTableData();
                //     this.updateSelectData("set", { focusRowByPk: ars[4] });
                //     //console.log("时间节点2.1", myNewData())

                // });
                if(pk == 'unitProp'){ //单位信息单独处理
                    this.setState({ tableIndex: "1" }, () => {
                        // 设置表格数据
                        // this.setTableData();
                        this.setTableData();
                        this.updateSelectData("set", { focusRowByPk: ars[4] });
                        //console.log("时间节点2.1", myNewData())

                    });
                }else if(this.state.tableIndex == '1' || pk_key_comb_flag){ //不存在相同关键字
                    // 设置表格数据
                    // this.setTableData();
                    this.setTableData();
                    this.updateSelectData("set", { focusRowByPk: ars[4] });
                    //console.log("时间节点2.1", myNewData())
                }else if(this.state.tableIndex == '2' && !pk_key_comb_flag){
                    this.setTableData();
                    this.updateSelectData("set", { focusRowByPk: ars[4] });
                    this.updateSelectData("setTable");
                }
            });

        } else {
            let meascode 
            let codeFlag = true
            Object.values(this.dataSet).forEach(it => {
                if (!_.isEmpty(it.listSelect) && codeFlag) {
                    it.listSelect.forEach(its => {
                        if (its.data) {
                            meascode = its.data.values.code && its.data.values.code.value
                        } else if (its.m_htExtFmt) {
                            meascode = its.m_htExtFmt && its.m_htExtFmt.code
                        }
                        codeFlag = false
                    })
                }
            })

            // 列表数据
            let list = {};
            if(this.props.showSign){
                let param = {
                    pk_report: ars[0],
                    meascode
                }
                if(!this.props.isCheckKeyWord){
                    delete param.meascode
                }
                list = await $nccUtil.promiseAjax(CONSTANT.measureGridRef, param);
                if (list.data && list.data.errorMsg) {
                    this.props.isCheckKeyWord && $nccPlatform.toast({
                        color: 'warning',
                        content: list.data.errorMsg,
                    })
                    this.emptyFn(ars);
                    return
                }
            }

            // 表格数据
            let table = {};;
            if (!this.unitProp) {
                let tabParam = {
                    pk_report: ars[0], 
                    meascode
                }
                if(!this.props.isCheckKeyWord || !this.props.showSign){ //showSign字段在合并报表和规则节点为false
                    delete tabParam.meascode
                }
                try{
                    table = await $nccUtil.promiseAjax(CONSTANT.measureTableRef, tabParam);
                    const tableResData = JSON.parse(table.data);
                    //空表不去展示
                    if(tableResData && _.isEmpty(tableResData.m_cellsModel.m_cells)){
                        this.emptyFn(ars);
                        return
                    }
                }catch(err){
                    this.emptyFn(ars);
                    return
                }
            }
            let data = {
                refpk: pk,
                select: new Map(),//已选择数据
                tableData: {},
                listData: {}

            };
            //console.log("列表", "表格数据", list, table);
            let isEmpty = false;
            if (list.success && list.data) {
                if (!table.data) {
                    data.excelTable = false;
                }
                list = list.data && list.data.map(i => {
                    return {
                        status: "0",
                        values: i
                    }
                })
                data.listData = { rows: list }

            } else {
                isEmpty = true;
            }
            if (table.success && table.data) {
                if (table.data) {
                    data.excelTable = true;
                    data.tableData = JSON.parse(table.data);
                    let allMap = new Map();
                    let allMeasures = data.tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.measure.MeasureModel"]["allMeasures"];
                    for (let it in allMeasures) {
                        Array.isArray(allMeasures[it]) && allMeasures[it].forEach((i) => {
                            allMap.set(i[1], [i[0].row, i[0].col]);
                        });
                    }

                    data.tableData["m_cellsModel"]["m_htExtProp"]["allMeasuresMendegeMap"] = allMap;
                } else {
                    data.excelTable = false;
                }
            }
            let hisDataFlag = false;
            // 右侧点击
            if (ars[3] === "rightClick") {
                hisDataFlag = true;
                let rightRightData = this.state.rightRightData;
                let virData = new Map();
                rightRightData.forEach((i, k) => {
                    if (i.refpk === pk) {
                        virData.set(i.value, {
                            value: i.value,
                            display: i.display
                        });
                    }
                });
                if (!this.dataSet[pk]) {
                    this.dataSet[pk] = data;

                }
                this.dataSet[pk].treeNodeData = ars[1];
                this.dataSet[pk].hisData = virData;
                data.mergeSelect = this.dataSet[pk].hisData
                this.dataSet[pk] = data;
                // 只有初次才会反选中
                let parents = this.getTreeNodeParents(pk);
                this.props.syncTree.setNodeSelected(CONSTANT.leftTreeId, pk);
                this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, parents);
            } else {
                if (this.dataSet[pk] && this.dataSet[pk].hisData) {
                    hisDataFlag = true;
                    data.mergeSelect = this.dataSet[pk].hisData;
                    this.dataSet[pk] = data;
                    this.dataSet[pk].treeNodeData = ars[1];
                    // 只有初次才会反选中
                    if (ars[2] === "firstInit") {
                        // 定位树选中 
                        let parents = this.getTreeNodeParents(pk);
                        this.props.syncTree.setNodeSelected(CONSTANT.leftTreeId, pk);
                        this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, parents);
                    }


                } else {
                    if (ars[2] === "mselectTrue") {
                        let parents = this.getTreeNodeParents(pk);
                        this.props.syncTree.setNodeSelected(CONSTANT.leftTreeId, pk);
                        this.props.syncTree.openNodeByPk(CONSTANT.leftTreeId, parents);
                    }
                    this.dataSet[pk] = data;
                    this.dataSet[pk].treeNodeData = ars[1];
                }
            }


            // this.setState({ tableIndex: "1" }, () => {
            this.setState({ tableIndex: this.props.showSign ? (pk_key_comb_flag || pk == 'unitProp') ? '1' : this.state.tableIndex : '2' }, () => {
                // 设置表格数据
                // this.setTableData();
                // this.updateSelectData("set")
                if (!isEmpty) {
                    this.setTableData();
                    // 修改的时候 确认是否已经同步数据 如果没有 需要 手动同步
                    if (!this.dataSet[this.selectRefpk].mergeSelect) {
                        let rightRightData = this.state.rightRightData;
                        let virSelect = new Map();
                        rightRightData.forEach((i, k) => {
                            if (i.refpk === this.selectRefpk) {
                                virSelect.set(i.value, i)
                            }
                        });
                        if (virSelect.size) {
                            this.dataSet[this.selectRefpk].mergeSelect = virSelect;
                        }
                    }
                    // this.dataSet[this.selectRefpk].mergeSelect = 
                    this.updateSelectData("set", { focusRowByPk: ars[4] });
                    this.state.tableIndex == '2' && !pk_key_comb_flag && this.updateSelectData("setTable");
                    // 只有在修改数据时才重新渲染
                    if (hisDataFlag) {
                        this.updateSelectData();
                    }
                } else {
                    this.emptyFn(ars);
                }


                //console.log("列表", "表格数据-转换后的", data);
            });
        }
        this.excelData = {};
        setTimeout(() => {
            that.setState({ loadingStatus: false },()=>{
                !this.props.showSign && this.updateSelectData("setTable");
            });
        }, 0);
        //console.log("时间节点2", myNewData())


    }
    // tab 切换  
    tabOnChange = (v) => {
        //console.log("tab切换", this);
        this.setState({ tableIndex: v }, () => {
            if (v === "2") {
                this.updateSelectData("setTable")


                // 判断是否有相应实例 如果没有 则加载新数据  如果 有 则重新render
                // if(this.props.excelTable.getHot(this.selectRefpk)){
                //     this.props.excelTable.render(this.selectRefpk,{
                //         callback:()=>{
                //             let {excelSelect = {}} = this.dataSet[this.selectRefpk];
                //             let {sizeInfo = [] } = excelSelect;
                //             sizeInfo.length&&this.props.excelTable.setMeSelected(this.selectRefpk,sizeInfo,{sync:true});
                //     }
                //     });
                // }else{
                //     let tableData = this.dataSet[this.selectRefpk]&&this.dataSet[this.selectRefpk].tableData;

                //     tableData&&this.props.excelTable.setExcelTableData(this.selectRefpk,tableData);
                //     // this.props.excelTable.render(this.selectRefpk);
                // }
            } else {
                this.updateSelectData("set");
                $appRoot.PluginUnitFormula_modelbox && $appRoot.PluginUnitFormula_modelbox.setState({});
                $appRoot.excetTableWindow && $appRoot.excetTableWindow.setState({});
            }
        });

    }
    // 函数防抖
    debounce1 = (func, wait = 0, immediately = false) => {

        //console.log("debounce0", window.timeOut)
        if (window.timeOut) {
            //console.log("debounce1", window.timeOut)
            clearTimeout(window.timeOut);
        }
        if (immediately === true) {
            func();
            window.timeOut = null;
        } else {
            window.timeOut = setTimeout(() => {
                //console.log("debounce2", window.timeOut)
                func();
                window.timeOut = null;
            }, wait);
        }


    }
    // 设置表格数据
    setTableData = (reset, newData) => {
        if (reset === "reset") {
            this.props.editTable.setTableData("listEditMeta", { rows: [] });
        } else {
            let data = { rows: [] };
            if (newData) {
                data = newData;
            } else {
                if (this.dataSet[this.selectRefpk] && this.dataSet[this.selectRefpk].listData) {
                    data = this.dataSet[this.selectRefpk].listData;
                }
            }

            this.props.editTable.setTableData("listEditMeta", data);
        }

    }
    // 左边树
    leftDom = () => {
        return <div className={"leftTreeDomBox"}>
            <MyTree mselectTreeId={CONSTANT.leftTreeId} {...this.props} config={
                {
                    onSelectEve: this.onSelectEve,
                }
            } />
        </div>
    }
    // 右边区域
    rightDom = () => {
        let { rightRight = true } = this.props;
        return (

            <div className="rightDom">
                <div className="right_left_box flex-container" style={{height: '100%'}}>
                    {this.rightLeftTabDom()}
                    <div className="rightContentDom flex-container">
                        {this.rightLeftContentDom()}

                    </div>
                </div>
                {
                    rightRight ? <div className="right_right_box">
                        {this.rightRightDom()}
                    </div> : null
                }



            </div>
        )
    }
    listTableDom = (iT, event, style) => {
        if (!iT) { return null }

        return (
            <div style={style} className='fix-container ufoe-mslect-list-table'>
                {
                    this.props.editTable.createEditTable("listEditMeta", {
                        // ...this.state.rightLeftTableHeightConfig,
                        showCheck: true,
                        onSelected: this.onSelected,
                        onSelectedAll: this.onSelectedAll,
                        selectedChange: this.selectedChange,
                        disableRowClickSelect: true,
                        adaptionHeight: true
                    })
                }
            </div>
        )

    }
    excelTableDom = (iT, event, style) => {
        if (!iT) { return null }
        // id "mselect_box"   
        // if(!this.dataSet[this.selectRefpk]){
        //     return null;
        // }
        if (this.state.tableIndex === "1") {
            return null;
        }
        // return null;
        //!类名excel-table-container不可删，会用这个类名来计算高度
        return <div className="excel-table-container" style={style}>
            {this.props.excelTable.createExcelTable(this.selectRefpk, {
                isMselect: this.props.isMselect,
                // 点击单元格以后是否立即更新数据 如果是 需要传入回调 并且在回调内部执行本函数的更新方法
                afterSelectionEnd: () => {
                    let { isMark, isSelectionEndChange } = this.props;
                    if (!isMark || isSelectionEndChange) {
                        let selectData = this.props.excelTable.getMeSelected(this.selectRefpk);
                        let { select, sizeInfo } = selectData;
                        this.tabExcel = true;
                        //console.log("当前选中数据", selectData);
                        let selectDataMap = {
                            sizeInfo: sizeInfo,
                            // hisSelect:new Map()
                        };
                        let hisSelect = new Map();
                        // selectDataMap.set()
                        select.forEach((element, k) => {
                            if (element.m_htExtFmt) {
                                hisSelect.set(element.m_htExtFmt.code, element);
                            } else {
                                // hisSelect.set("invalidCoordinates",element);
                            }
                        });
                        selectDataMap.hisSelect = hisSelect;
                        this.excelData = selectDataMap;
                        // this.updateSelectData();
                        this.updateSelectData();
                        this.debounce1(() => {
                            //console.log("更新选中状态");
                            if (this.selectRefpk != window.selectRefpk) {
                                window.selectRefpk = this.selectRefpk;
                                if (this.state.markStatus === false) {
                                    this.setState({ markStatus: true });
                                }

                            }

                        }, 3000)

                    }
                    if (isMark) { //处理标记按钮
                        let selectDataHandleBtn = this.props.excelTable.getMeSelected(this.selectRefpk);
                        _.isEmpty(selectDataHandleBtn.select) ? this.setState({ signButtonShow: true }) : this.setState({ signButtonShow: false })
                    }

                }
            })}
        </div>
    }
    //判断是不是同一个关键字组合信息 style: ('list'列表选中要标记的数据  'card'表格选中要标记的数据) pks:列表进来选中的关键字pks
    canSign = (style,pks) => {
        //找出已选中的关键字组合
        let hasSelectKeyWord = new Set();
        Object.values(this.dataSet).forEach(it => {
            if (!_.isEmpty(it.listSelect)) {
                it.listSelect.forEach(its => {
                    if (its.data) {
                        its.data.values.m_strKeyCombPK && hasSelectKeyWord.add(its.data.values.m_strKeyCombPK.value);
                    } else if (its.m_htExtFmt) {
                        its.m_htExtFmt.m_strKeyCombPK && hasSelectKeyWord.add(its.m_htExtFmt.m_strKeyCombPK);
                    }
                })
            }
        })
        //判断是列表还是表格需要标记
        let canSignFlag = true
        if(style == 'list'){
            pks && pks.forEach( it =>{
                if (!_.isEmpty(hasSelectKeyWord) && !hasSelectKeyWord.has(it)) {
                    canSignFlag = false;
                }
                hasSelectKeyWord.add(it);
            })
        }else{
            let selectData = this.props.excelTable.getMeSelected(this.selectRefpk);
            selectData.select.forEach(it => {
                if (!_.isEmpty(hasSelectKeyWord) && !hasSelectKeyWord.has(it.m_htExtFmt.m_strKeyCombPK)) {
                    canSignFlag = false;
                }
                it.m_htExtFmt.m_strKeyCombPK && hasSelectKeyWord.add(it.m_htExtFmt.m_strKeyCombPK);
            })
        }
        this.props.isCheckKeyWord && !canSignFlag && $nccPlatform.toast({
            color: 'warning',
            content: '关键字不同的单元格不可被标记',
        })

        if(!this.props.isCheckKeyWord){
            canSignFlag = true
        }

        //true 可以标记  false 不可标记
        return canSignFlag
    }
    rightLeftTabDom = (ev = {}) => {
        // let ev = {};
        // let {base} = $nccPlatform;
        // let {NCButton,FormControl} = base;
        //console.log("rightLeftDom", this.props.editTable);
        let m_row = "m_column";
        if (this.state.tableIndex === "1") {
            m_row = "m_column";
        }
        let styleBlock = {
            display: "block"
        }
        let styleNone = {
            display: "none"
        }
        let cancelMark = false;
        return (
            <div className={`${"mselect_right_left_box " + m_row}`}>
                <div className="mselect_tab_box">
                    <NCTabs navtype="turn" contenttype="moveleft" flex={true}
                        activeKey={this.state.tableIndex}
                        defaultActiveKey={this.state.tableIndex}
                        onChange={this.tabOnChange}>
                        {this.props.showSign ? <NCTabPane tab={this.unitProp ? $appRoot.state.json['public_lang-000119'] : $appRoot.state.json['public_lang-000124']} key={"1"}>{/* 国际化处理： 单位信息,列表方式*/}

                        </NCTabPane> : null}
                        {!this.unitProp ? <NCTabPane tab={$appRoot.state.json['public_lang-000125']} key={"2"} disabled={this.unitProp}>{/* 国际化处理： 表样方式*/}

                        </NCTabPane> : null}
                    </NCTabs>
                    <div className="butt_box">
                        {this.state.tableIndex === "1" ?
                            <$nccPlatform.base.NCFormControl
                            fieldid={this.state.searchValue}
                                type="search"
                                value={this.state.searchValue}
                                onChange={this.searchChange}
                                onSearch={this.searchList}
                                placeholder={this.unitProp ? $appRoot.state.json['public_lang-000126'] : $appRoot.state.json['public_lang-000127']}/* 国际化处理： 搜索结构名称,搜索指标名称*/
                            >

                            </$nccPlatform.base.NCFormControl>
                            :
                            this.props.isMark ? <$nccPlatform.base.NCButton
                                disabled={this.state.signButtonShow}
                                onClick={() => {
                                    let markFlag = this.markOrCancel(); //true 标记
                                    // markFlag ? this.signFn() : buttonEvent["Delete"].call(this)
                                    if(markFlag){
                                        let canSignFlag = this.canSign();
                                        canSignFlag && this.signFn(); //标记
                                    }else{
                                        buttonEvent["Delete"].call(this) //删除标记
                                    }
                                }}
                            >
                                {$appRoot.state.json['public_lang-000131']}{/* 国际化处理： 标记*/}
                            </$nccPlatform.base.NCButton> : null
                        }
                        {/* {
                            this.state.markStatus?<$nccPlatform.base.NCButton
                            onClick = {()=>{
                                this.excelData = new Map();
                                this.props.excelTable.deselectCell();
                                this.updateSelectData();
                                
                                this.setState({markStatus:false},()=>{
                                    this.tabExcel = true;
                                });
                            }}
                        >
                            取消标记
                        </$nccPlatform.base.NCButton>:null
                        } */}
                    </div>
                </div>
            </div>
        )
    }
    rightLeftContentDom = (ev = {}) => {
        let m_row = "m_column";
        if (this.state.tableIndex === "1") {
            m_row = "m_column";
        }
        let styleBlock = {
            display: "block",
            // display: "flex",
            height: "100%"
        }
        let styleFlex = {
            display: "flex",
            height: "100%"
        }
        let styleNone = {
            display: "none"
        }
        return (
            <div style={{ height: "100%" }} className={`${"flex-container mselect_right_left_box " + m_row}`}>
                <div className="mselect_tab_butt_box flex-container">
                    {
                        this.listTableDom(this.state.iTlist, ev,
                            this.state.tableIndex === "1" ? styleFlex
                                : styleNone
                        )
                    }
                    {
                        this.unitProp ? null : this.excelTableDom(this.state.iTtable, ev,
                            this.state.tableIndex === "1" ? styleNone
                                : styleBlock)
                    }

                </div>
            </div>
        )
    }
    rightRightDom = () => {
        return <div className="rightRightDom">
            <div className="rr_buttons_box">{this.rightRightButtons()}</div>
            <div className="rr_contents_box">
                {this.rightRightList()}
            </div>

        </div>

    }
    rightRightButtons = () => {
        let { NCButtonGroup, NCButton } = $nccPlatform.base;
        return <NCButtonGroup >
            <NCButton onClick={() => {
                buttonEvent["Delete"].call(this);
            }} colors="accent" disabled={this.state.delBtn}>
                {$appRoot.state.json['public_lang-000025']}{/* 国际化处理： 删除*/}
            </NCButton>
            <NCButton onClick={() => {
                buttonEvent["Top"].call(this);
            }} colors="accent" disabled={this.state.topBtn}>
                {$appRoot.state.json['public_lang-000026']}{/* 国际化处理： 置顶*/}
            </NCButton>
            <NCButton onClick={() => {
                buttonEvent["MoveUp"].call(this);
            }} colors="accent" disabled={this.state.upBtn}>
                {$appRoot.state.json['public_lang-000027']}{/* 国际化处理： 上移*/}
            </NCButton>
            <NCButton onClick={() => {
                buttonEvent["MoveDown"].call(this);
            }} colors="accent" disabled={this.state.downBtn}>
                {$appRoot.state.json['public_lang-000028']}{/* 国际化处理： 下移*/}
            </NCButton>
            <NCButton onClick={() => {
                buttonEvent["Bottom"].call(this);
            }} colors="accent" disabled={this.state.bottomBtn}>
                {$appRoot.state.json['public_lang-000029']}{/* 国际化处理： 置底*/}
            </NCButton>
        </NCButtonGroup>
    }
    // 生成右边的右边的list列表数据
    updateRightRightData = (config = {}) => {
        let { type, value, callback } = config;
        // 循环当前左侧数据 挑选出 左侧有 右侧无的数据  //首先判断右侧有没有数据
        let sdata = this.dataSet[this.selectRefpk];
        let rightRightData = this.state.rightRightData;
        let rightRightDataMap = new Map();
        rightRightData.forEach((i, k) => {
            rightRightDataMap.set(i.value, i)
        });
        if (type === "delete") {
            if (Array.isArray(value)) {
                value.forEach((i, k) => {
                    if (rightRightDataMap.has(i.value)) {
                        rightRightDataMap.delete(i.value);
                    }
                })
            }
            this.setState({ rightRightData: [...rightRightDataMap.values()] }, () => {
                if (callback) {
                    callback()
                }
            })
        }

        if (type === "add") {
            if (Array.isArray(value)) {
                value.forEach((i, k) => {
                    if (!rightRightDataMap.has(i.value)) {
                        rightRightDataMap.set(i.value, i);
                    }
                })
            }
            this.setState({ rightRightData: [...rightRightDataMap.values()] }, () => {
                if (callback) {
                    callback()
                }
            })
        }
    }
    // 右侧右侧列表
    rightRightList = (config = {}) => {
        // Checkbox

        let { data = new Map() } = config;
        let vdom = [];
        let listCheckedKeys = [];
        let listSelectedKeys = [];
        let checkednumber = 0;
        let allNumber = 0;
        let rightSelectList = this.state.rightSelectList;
        let rightRightData = this.state.rightRightData;
        let rightSearchValue = this.state.rightSearchValue;
        let rightSearchValueData = this.state.rightSearchValueData;
        if (rightSearchValue && rightSearchValueData.length) {
            rightSearchValueData.forEach((i, ik1) => {
                // let index = ik1;
                let itemKey = i.value;
                // let 

                let refName = i.refName ? ("   (" + i.refName + ")") : "";
                let title = <span>{i.display}{refName}</span>;
                let titleText = i.display + "  " + refName;
                // 收索区域
                let str = i.display;
                let searchText = i.searValue;
                let strArray = str.split(searchText);
                if (strArray.length > 1) {
                    let newStr = [];
                    strArray.forEach((a, b) => {
                        if (b !== 0) {
                            newStr.push(<span key={a + "" + b}><span style={{ color: "red" }}>{searchText}</span>{a}</span>);
                            // newStr.push(i);
                        } else {
                            newStr.push(<span key={a + "" + b}>{a}</span>);
                        }
                    });
                    title = [<span>{newStr}{refName}</span>];
                }

                vdom.push(
                    <li
                        className={
                            rightSelectList[itemKey] ? (
                                `u-transfer-list-content-item-hover u-transfer-list-content-item u-transfer-list-content-item-selected `
                            ) : `u-transfer-list-content-item u-transfer-list-content-item-selected `
                        }
                        key={itemKey + "k"}
                        title={titleText}
                        onClick={(v) => {
                            let rightSelectList = this.state.rightSelectList;
                            let newSelectList = {};
                            // rightSelectList.clear();
                            newSelectList[itemKey] = true;

                            this.setState({ rightSelectList: newSelectList }, () => {
                                let data = this.state.rightRightData.find((i, k) => {
                                    return i.value === itemKey
                                });
                                if (this.selectRefpk === data.refpk) {
                                    this.updateSelectData("set", { focusRowByPk: data.value });
                                    return;
                                }

                                let treeNodeData = this.props.syncTree.getSyncTreeValue(CONSTANT.leftTreeId, data.refpk);
                                if (treeNodeData) {
                                    let ars = [data.refpk, treeNodeData, "firstInit", "rightClick", data.value];
                                    //console.log("设置默认值", ars);
                                    this.onSelectEve(...ars);
                                }
                            });
                        }}
                    >
                        <$nccPlatform.base.NCCheckbox
                            checked={i.checked ? true : false}
                            onChange={(v) => {
                                // let rightSelectList = this.state.rightSelectList;
                                // console.log("切换选中",ars);
                                let sdata = this.state.rightRightData;
                                sdata.some((v1) => {
                                    if (v1.value === itemKey) {
                                        v1.checked = v;
                                        return true;
                                    }
                                })

                                const {delBtn,topBtn,upBtn,bottomBtn,downBtn} = btnGroupControl(sdata);
                                this.setState({ rightRightData: sdata,delBtn,topBtn,upBtn,bottomBtn,downBtn});
                            }}
                        />
                        <span>
                            {/* {item.title.substr(0, item.title.indexOf(listSearchKey))} */}
                            <span >
                                {title}
                            </span>
                            {/* {item.title.substr(
                                        item.title.indexOf(listSearchKey) + listSearchKey.length,
                                    )} */}
                        </span>
                    </li>
                )

                if (i.checked) {
                    checkednumber++;
                }
                allNumber++;
            })
        } else {
            rightRightData && rightRightData.forEach((i, ik1) => {
                // let index = ik1;
                let itemKey = i.value;
                // let 
                let refName = i.refName ? ("   (" + i.refName + ")") : "";
                let title = <span>{i.display}{refName}</span>;
                let titleText = i.display + "  " + refName;
                vdom.push(
                    <li
                        className={
                            rightSelectList[itemKey] ? (
                                `u-transfer-list-content-item-hover u-transfer-list-content-item u-transfer-list-content-item-selected `
                            ) : `u-transfer-list-content-item u-transfer-list-content-item-selected `
                        }
                        key={itemKey + "k"}
                        title={titleText}
                        onClick={(v) => {
                            let rightSelectList = this.state.rightSelectList;
                            let newSelectList = {};
                            // rightSelectList.clear();
                            newSelectList[itemKey] = true;

                            this.setState({ rightSelectList: newSelectList }, () => {
                                let data = this.state.rightRightData.find((i, k) => {
                                    return i.value === itemKey
                                });
                                if (this.selectRefpk === data.refpk) {
                                    this.updateSelectData("set", { focusRowByPk: data.value });
                                    return;
                                }

                                let treeNodeData = this.props.syncTree.getSyncTreeValue(CONSTANT.leftTreeId, data.refpk);
                                if (treeNodeData) {
                                    let ars = [data.refpk, treeNodeData, "firstInit", "rightClick", data.value];
                                    //console.log("设置默认值", ars);
                                    this.onSelectEve(...ars);
                                }
                            });
                        }}
                    >
                        <$nccPlatform.base.NCCheckbox
                            checked={i.checked ? true : false}
                            onChange={(v) => {
                                // let rightSelectList = this.state.rightSelectList;
                                // console.log("切换选中",ars);
                                let sdata = this.state.rightRightData;
                                let delBtn, topBtn, upBtn, bottomBtn, downBtn
                                sdata.some((v1) => {
                                    if (v1.value === itemKey) {
                                        v1.checked = v;
                                        return true;
                                    }
                                })

                                let checkDataindexArr = [];
                                sdata.forEach( (it,index) => {
                                    if(it.checked){ checkDataindexArr.push(index)}
                                });
                                delBtn = checkDataindexArr.length > 0 ? false : true;
                                //有第一条并且数组大于一并且连续  或者  只有一条并且等于0   或者  没有选择  ？ 不可用 ： 可用
                                topBtn = (checkDataindexArr[0] == 0 && checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length-1] - checkDataindexArr[0] == checkDataindexArr.length-1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == 0) || checkDataindexArr.length == 0 ? true : false;
                                upBtn = (checkDataindexArr[0] == 0 && checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length-1] - checkDataindexArr[0] == checkDataindexArr.length-1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == 0) || checkDataindexArr.length == 0 ? true : false;
                                //有最后一条并且数组大于一并且连续  或者  只有一条并且等于最后一条  或者  没有选择 ？ 不可用 ： 可用
                                bottomBtn = (checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length-1] == sdata.length-1 && checkDataindexArr[checkDataindexArr.length-1] - checkDataindexArr[0] == checkDataindexArr.length-1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == sdata.length-1) || checkDataindexArr.length == 0 ? true : false;
                                downBtn = (checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length-1] == sdata.length-1 && checkDataindexArr[checkDataindexArr.length-1] - checkDataindexArr[0] == checkDataindexArr.length-1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == sdata.length-1) || checkDataindexArr.length == 0 ? true : false;
                                this.setState({ rightRightData: sdata,delBtn,topBtn,upBtn,bottomBtn,downBtn });
                            }}
                        />
                        <span>
                            {/* {item.title.substr(0, item.title.indexOf(listSearchKey))} */}
                            <span >
                                {title}
                            </span>
                            {/* {item.title.substr(
                                        item.title.indexOf(listSearchKey) + listSearchKey.length,
                                    )} */}
                        </span>
                    </li>
                )

                if (i.checked) {
                    checkednumber++;
                }
                allNumber++;
            })
        }


        return <div className="computedGroup_content">
            <div className="_left_box">
                <div className="_left_content">
                    <div className="_left_content_con">
                        <div className="_header">
                            <$nccPlatform.base.NCCheckbox
                                checked={checkednumber === allNumber && checkednumber !== 0}
                                inverse= {checkednumber !== allNumber && checkednumber !== 0}//半选状态
                                indeterminate= {checkednumber !== allNumber && checkednumber !== 0}//半选状态
                                onChange={(v) => {
                                    let sdata = this.state.rightRightData;
                                    sdata.forEach((v1) => {
                                        v1.checked = v;
                                        return true;
                                    })
                                    if(v && sdata.length > 0){
                                        this.setState({ 
                                            rightRightData: sdata,
                                            delBtn: false, //删除
                                            upBtn: true, //上移
                                            topBtn: true, //置顶
                                            downBtn: true, //下移
                                            bottomBtn: true, //置地 
                                        });
                                    }
                                    if(!v && sdata.length > 0){
                                        this.setState({ 
                                            rightRightData: sdata,
                                            delBtn: true, //删除
                                            upBtn: true, //上移
                                            topBtn: true, //置顶
                                            downBtn: true, //下移
                                            bottomBtn: true, //置地 
                                        });
                                    }
                                    
                                }}
                            />
                            <span className="_counter">({checkednumber}/{allNumber})</span>
                            <span className="_text">{$appRoot.state.json['public_lang-000132']}</span>{/* 国际化处理： 条数据*/}
                            <span className="_title">{$appRoot.state.json['public_lang-000128']}</span>{/* 国际化处理： 已选*/}

                        </div>
                        <div className="_list_box">
                            <$nccPlatform.base.NCFormControl
                             fieldid={this.state.rightSearchValue}
                                type="search"
                                value={this.state.rightSearchValue}
                                onChange={this.rightSearchChange}
                                // onSearch = {this.searchList}
                                placeholder={$appRoot.state.json['public_lang-000129']}/* 国际化处理： 搜索名称*/
                            ></$nccPlatform.base.NCFormControl>
                            <ul>
                                {vdom}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    }
    // 表格处理事件集合
    // 左侧选择列单个选择框回调
    onSelected = (...ars) => {
        if(ars[4]){
            let canSignFlag = this.canSign('list',ars[2].values.m_strKeyCombPK && [ars[2].values.m_strKeyCombPK.value]);
            // props.editTable.selectAllRows('listEditMeta') //清空所有
            !canSignFlag && this.props.editTable.selectTableRows('listEditMeta',ars[3],false);
            if(!canSignFlag){return}
        }
        console.log($appRoot.state.json['public_lang-000130'], ars);/* 国际化处理： 单选*/
        // 只有单选的时候才会 控制该值
        if (this.props.isRadio) {
            if (ars[4]) {
                this.props.editTable.selectTableRows("listEditMeta", [ars[3]], true);
            } else {
                this.props.editTable.selectTableRows("listEditMeta", [ars[3]], false);
            }

            this.updateSelectData();
        } else {
            this.updateSelectData();
        }

        if (this.props.rightRight) {
            let sdata = [];
            let code = "code";
            if (this.selectRefpk === "unitProp") {
                code = "id";
            }
            let type = "delete";
            sdata[0] = {
                value: ars[2].values[code].value,
                display: ars[2].values["name"].value,
                refpk: this.selectRefpk,
                refName: this.selectTreeNode.refname
            }
            if (ars[4]) {
                type = "add";
            }
            this.updateRightRightData({
                type: type, value: sdata, callback: () => {
                    if (this.state.rightSearchValue) {
                        this.rightSearchChangeContent(this.state.rightSearchValue);
                    }
                }
            })
        }
    }
    // 左侧选择列全选回调                   
    onSelectedAll = (...ars) => {
        if(ars[2]){
            let allData = this.props.editTable.getAllData("listEditMeta");
            let allDataKeyWordPks = []
            allData.rows.forEach(it => {
                it.values.m_strKeyCombPK && allDataKeyWordPks.push(it.values.m_strKeyCombPK.value);
            })
            let canSignFlag = this.canSign('list',allDataKeyWordPks);
            !canSignFlag && this.props.editTable.selectAllRows('listEditMeta'); //清空所有
            if(!canSignFlag){return}
        }
        // 只有单选的时候才会 控制该值
        //console.log("多选", ars);
        if (this.props.isRadio) {
            this.props.editTable.selectAllRows("listEditMeta", false);
            this.updateSelectData("set");
        } else {
            this.updateSelectData();
        }

        if (this.props.rightRight) {
            let sdata = [];
            let code = "code";
            if (this.selectRefpk === "unitProp") {
                code = "id";
            }
            let type = "delete";
            if (ars[2]) {
                type = "add";
            }
            let tableData = this.props.editTable.getAllRows("listEditMeta");
            tableData && tableData.forEach((i, k) => {
                sdata.push({
                    value: i.values[code].value,
                    display: i.values["name"].value,
                    refpk: this.selectRefpk
                });
            })
            this.updateRightRightData({
                type: type, value: sdata, callback: () => {
                    if (this.state.rightSearchValue) {
                        this.rightSearchChangeContent(this.state.rightSearchValue);
                    }
                }
            })
        }
    }
    selectedChange = (...ars) => {
        //console.log("选择框变动",ars);
        // 检验 当前表格上勾选的数据  是否和右侧数据一致 如果不一致  那么需要强行匹配

        setTimeout(() => {
            let selectTable = this.props.editTable.getCheckedRows("listEditMeta");
            //console.log("选择框变动",ars,_.cloneDeep(selectTable),_.cloneDeep(this.state.rightRightData));
            let thisSelect = new Map();
            let tabSelect = new Map();
            let code = "code";
            if (this.selectRefpk === "unitProp") {
                code = "id";
            }
            this.state.rightRightData.forEach((i, k) => {
                if (this.selectRefpk === i.refpk) {
                    thisSelect.set(i.value, i);
                }
                tabSelect.set(i.value, i);
            });
            selectTable.forEach((i, k) => {
                if (thisSelect.has(i.data.values[code].value)) {
                    thisSelect.delete(i.data.values[code].value)
                }
            });
            if (thisSelect.size === 0) {
                return;
            }
            thisSelect.forEach((i) => {
                if (tabSelect.has(i.value)) {
                    tabSelect.delete(i.value);
                }

            });
            this.setState({ rightRightData: [...tabSelect.values()] });

        }, 0);


    }
    // 同步包装 
    promiseBox = (config = {}) => {
        let { callback } = config;
        return new Promise((resolve, reject) => {
            if (callback) {
                callback(resolve, reject);
            }
        })
    }
    /**
     * @author Mendege 2020.24
     * @description 获取树节点 上级 树节点  直到根节点
     *  refpk 找寻节点pk  itself 返回结果是否包含本身 默认false 不包含
     */
    getTreeNodeParents = (refpk, itself = false) => {
        //缓存数据  暂时的  本方法执行完成以后会清空
        // this.virTreeData = this.props.syncTree;
        let treeId = CONSTANT.leftTreeId;
        let parents_refpks = [];
        let virNodeData = this.props.syncTree.getSyncTreeValue(treeId, refpk);
        if (itself) {
            parents_refpks.unshift(refpk);
        }
        do {
            parents_refpks.unshift(virNodeData.pid);
            virNodeData = this.props.syncTree.getSyncTreeValue(treeId, virNodeData.pid);
        } while (virNodeData && virNodeData.pid);
        //console.log("当前链条数据", parents_refpks);
        return parents_refpks;
    }
    render() {
        //console.log("超级表格组件", this,this.props.meta.getMeta());
        return <div className="mselect_outermost_box">
            <div className="ModelContent mselect_box">
                <TwoPointDom 
                    LeftDom ={this.leftDom()}
                    RightDom={this.rightDom()}
                    PopWidth='300'
                    Position='left'
                    onAfter={()=>{
                        // $appRoot.setState({})
                    }}
                />
                <NCLoading
                    container={this}
                    show={this.state.loadingStatus}
                ></NCLoading>
            </div>
            {
                this.props.rightRight ? <div className="_footer_box">
                    <NCHotKeys
                        keyMap={{
                            editActionSign: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
                        }}
                        handlers={{
                            editActionSign: (e, ...others) => {
                                buttonEvent['Confirm'].bind(this)();
                            }
                        }}
                        // 是否启用组件
                        enabled={true}
                        // 是否为聚焦触发
                        focused={true}
                        // 默认display 可以设置 inline-block 等dispaly属性
                        display="inline-block"
                    >
                        <NCButton
                            onClick={()=>{buttonEvent['Confirm'].call(this)}}
                            colors='primary'
                        >
                            <div>{$appRoot.state.json['public_lang-000021'] + '('}<span class="text-decoration-underline">Y</span>{')'}</div>
                        </NCButton>
                    </NCHotKeys>
                    <NCHotKeys
                        keyMap={{
                            editActionSign: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                        }}
                        handlers={{
                            editActionSign: (e, ...others) => {
                                buttonEvent['Cancel'].bind(this)();
                            }
                        }}
                        // 是否启用组件
                        enabled={true}
                        // 是否为聚焦触发
                        focused={true}
                        // 默认display 可以设置 inline-block 等dispaly属性
                        display="inline-block"
                    >
                        <NCButton
                            onClick={()=>{buttonEvent['Cancel'].call(this)}}
                        >
                            <div>{$appRoot.state.json['public_lang-000022'] + '('}<span class="text-decoration-underline">N</span>{')'}</div>
                        </NCButton>
                    </NCHotKeys>
                </div> : null
            }

            {/* 不需要标记按钮时，不取状态值，取表格选中值 */}
            {
                !this.props.showSign ? <div className="_footer_box">
                    <NCHotKeys
                        keyMap={{
                            editActionSign: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM
                        }}
                        handlers={{
                            editActionSign: (e, ...others) => {
                                buttonEvent['Confirm'].bind(this)();
                            }
                        }}
                        // 是否启用组件
                        enabled={true}
                        // 是否为聚焦触发
                        focused={true}
                        // 默认display 可以设置 inline-block 等dispaly属性
                        display="inline-block"
                    >
                        <NCButton
                            onClick={()=>{buttonEvent['Confirm'].call(this)}}
                            colors='primary'
                        >
                            <div>{$appRoot.state.json['public_lang-000021'] + '('}<span class="text-decoration-underline">Y</span>{')'}</div>
                        </NCButton>
                    </NCHotKeys>
                    <NCHotKeys
                        keyMap={{
                            editActionSign: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL
                        }}
                        handlers={{
                            editActionSign: (e, ...others) => {
                                buttonEvent['Cancel'].bind(this)();
                            }
                        }}
                        // 是否启用组件
                        enabled={true}
                        // 是否为聚焦触发
                        focused={true}
                        // 默认display 可以设置 inline-block 等dispaly属性
                        display="inline-block"
                    >
                        <NCButton
                            onClick={()=>{buttonEvent['Cancel'].call(this)}}
                        >
                            <div>{$appRoot.state.json['public_lang-000022'] + '('}<span class="text-decoration-underline">N</span>{')'}</div>
                        </NCButton>
                    </NCHotKeys>
                </div> : null
            }
        </div>

    }

}
Mselect.defaultProps = {
    rightRight: true,//是否开启右侧已选操作框
    isRadio: false,//是否开启单选模式
    isMselect: true,//是否是按照mselect 方式调用
    isMark: true,//是否开启标记功能  如果开启 选择单元格以后将不再实时更新 选中数据  需要手动触发标记来更新
    isSelectionEndChange: false,//表格编辑后是否强行更新 选中数据  可优化性能
    isRefer: true,
    isTask: false,//是否是任务直接使用,
    isListRelevanceTable: true,//是否启动 列表关联电子表格
    showSign: true, //是否展示标记按钮
    isCheckKeyWord: true, //是否校验关键字
    isInStepContent: false, //是否处于步骤中，就是说，在模态框中，该组件之外还有其他组件。
    isFromHb: false,
}
// export default ExcelTable(Mselect);
export default (Mselect = createPage({})(ExcelTable(Mselect)));
