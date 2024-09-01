import React, { Component } from "react";
import { base, toast } from "nc-lightapp-front";
import TreeArea from "./components/treeArea";
import TableArea from "./components/BaseTableArea/index";
import {
    buildModelItem,
    filterTree,
    findPKs,
    formatResDataByCacheData,
    deleteTreeFieldByAuthorityFld,
} from "./methods";
import {
    loadDataViewFirstNode,
    loadSmartModelSubData,
    operateDataView,
} from "./ajaxMethod.js";
import { TREE_ID, NAME_MAP_BY_LANG } from "./constants";
import { checkSum, getCalculateOptions, listAssemble } from "./methods/util";
import { isRepeatItem, isSameItem } from "./methods/validate";
import SaveAsModal from "./components/saveAsModal";
import HelpModal from "./components/helpModal";
import Utils from "@public/utils";
import dataViewHelpGif from "@static/images/icondef/data_view_help.gif";
// import dataViewHelpGif from "../../../src/static/images/icondef/data_view_help.gif";
// import dataViewHelpGif from "@static/images/icondef/green_flag.png";
require("./index.less");
const { langCheck } = Utils;
// const dataViewHelpGif = require("../../../../static/images/icondef/data_view_help.gif");
const { NCModal, NCButton, NCButtonGroup, NCHotKeys, NCTooltip } = base;
class DataViewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curSelectExpandIndex: 0, // 当前选中的扩展区的index
            curSelectExpandData: {}, // 当前选中的扩展区的数据
            middleCacheData: {}, // 缓存的副本数据
            treeCacheData: {}, // tree缓存的data

            saveAsVisible: false, // 另存为和重命名 的显隐条件
            helpModalVisible: false, // 帮助文档的visible
            saveAsType: 1, // 1: 另存为  2:重命名
            isResizing: false,
            currentE: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        const { middleCacheData, curSelectExpandIndex } = this.state;

        const openDataViewModelFlag =
            nextProps.visible !== this.props.visible &&
            nextProps.visible === true;
        // 从右肩进来 edit
        const isEditDataViewFlag =
            openDataViewModelFlag && nextProps.entranceType === "edit";
        // 点击数据视图设置进来 add
        const isAddDataViewFlag =
            openDataViewModelFlag && nextProps.entranceType === "add";
        // 没有中间缓存数据
        const noneMiddleDataFlag = Object.keys(middleCacheData).length === 0;
        if (
            (isEditDataViewFlag && !nextProps.continueSetDataViewFlag) ||
            (isAddDataViewFlag && noneMiddleDataFlag)
        ) {
            const currentData = nextProps.curViewData;
            const showDataFlag =
                currentData &&
                Array.isArray(currentData.areacontentsets) &&
                currentData.areacontentsets.length > 0;
            const curExpandData =
                (showDataFlag && currentData.areacontentsets[0]) || {};
            this.setState({
                middleCacheData: currentData, // 使用接口数据 记录中间状态
            });
            this.setDisplayTable(curExpandData);
        }

        // 切换了数据视图 清楚缓存数据 并使用当前选中数据作为缓存数据
        if (
            nextProps.currentSelectDataViewIndex !==
                this.props.currentSelectDataViewIndex ||
            (nextProps.allData !== this.props.allData &&
                !nextProps.viewDataIngVisibile)
        ) {
            // 数据预览中 设为默认视图 会改变alldata 此时不能重新重置 cacheData
            const currentData =
                nextProps.allData[nextProps.currentSelectDataViewIndex];
            const showDataFlag =
                currentData &&
                currentData.areacontentsets &&
                Array.isArray(currentData.areacontentsets) &&
                currentData.areacontentsets.length > 0;
            const curExpandData =
                (showDataFlag && currentData.areacontentsets[0]) || {};
            if (currentData) {
                this.setState({
                    middleCacheData: currentData, // 使用接口数据 记录中间状态
                });
                this.setDisplayTable(curExpandData);
            }
        }

        if (openDataViewModelFlag) {
            const treeDataParams = noneMiddleDataFlag
                ? {
                      pk_def: nextProps.curViewData.areacontentsets[
                          curSelectExpandIndex
                      ].smartModelDefID,
                      reportPk: this.props.reportId,
                      isRunState: true,
                      exAreaPK: nextProps.curViewData.areacontentsets[
                          curSelectExpandIndex
                      ].areaPk
                  }
                : {
                      pk_def: middleCacheData.areacontentsets[
                          curSelectExpandIndex
                      ].smartModelDefID,
                      reportPk: this.props.reportId,
                      isRunState: true,
                      exAreaPK: middleCacheData.areacontentsets[
                          curSelectExpandIndex
                      ].areaPk
                  };
            this.loadDataViewDataFn(treeDataParams); // 加载treeData
        }
        if (
            nextProps.saveAsType !== this.props.saveAsType &&
            nextProps.saveAsType === 2
        ) {
            this.setState({
                saveAsVisible: true,
            });
        }

        if (
            this.props.needClearCacheFlag !== nextProps.needClearCacheFlag &&
            nextProps.needClearCacheFlag === true
        ) {
            this.clearAllCache();
        }

        if (
            this.props.viewDataIngSaveFlag !== nextProps.viewDataIngSaveFlag &&
            nextProps.viewDataIngSaveFlag === true
        ) {
            this.saveDataView();
        }

        if (
            this.props.viewDataIngSaveAsFlag !==
                nextProps.viewDataIngSaveAsFlag &&
            nextProps.viewDataIngSaveAsFlag === true
        ) {
            this.saveAsNewDataView();
        }

        if (
            this.props.visible !== nextProps.visible &&
            nextProps.visible === false
        ) {
            // 关闭弹窗要重置 expandIndex
            this.setState({
                curSelectExpandIndex: 0,
            });
            this.setDisplayTable(middleCacheData.areacontentsets[0]);
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    clearAllCache = () => {
        this.clearTreeCacheData();
        this.setState({
            middleCacheData: {},
        });
    };

    setDisplayTable = (curSelectData) => {
        // 设置当前显示的table数据 -- table内的数据是根据 此页面的state内以下字段 去同步更新的
        this.setState({
            groupFldNames: listAssemble(curSelectData.groupFldNames),
            detailFldNames: listAssemble(curSelectData.detailFldNames),
            areaFieldSet: listAssemble(curSelectData.areaFieldSet),
            columnFldNames: listAssemble(curSelectData.columnFldNames),
            rowFldNames: listAssemble(curSelectData.rowFldNames),
            measureSet: listAssemble(curSelectData.measureSet),
            showType: curSelectData.showType,
            isSyncData: curSelectData.isSyncData,
            isShowCount: curSelectData.isShowCount,
            columnSubType: curSelectData.columnSubType,
            rowSubType: curSelectData.rowSubType,
            measureDirection: curSelectData.measureDirection,
            curSelectExpandData: curSelectData,
        });
    };

    clearTreeCacheData = () => {
        this.setState({
            treeCacheData: {},
        });
    };

    loadDataViewDataFn = (treeDataParams) => {
        // 加载第一层树结构数据
        const { setTreeData, openNodeByPkAsync } = this.props.props.asyncTree;

        const { treeCacheData, curSelectExpandIndex } = this.state;

        if (treeCacheData[curSelectExpandIndex]) {
            // 判断是否有缓存
            setTreeData(TREE_ID, treeCacheData[curSelectExpandIndex]);
            openNodeByPkAsync(
                TREE_ID,
                treeCacheData[curSelectExpandIndex][0].refpk
            );
            this.setState({
                treeData: treeCacheData[curSelectExpandIndex],
            });
        } else {
            loadDataViewFirstNode(treeDataParams).then((treeData) => {
                if (treeData[0]) {
                    const newCacheData = JSON.parse(
                        JSON.stringify(treeCacheData)
                    );

                    const newTreeData = [
                        {
                            ...treeData[0],
                            children: deleteTreeFieldByAuthorityFld(treeData[0].children)
                        }
                    ];

                    setTreeData(TREE_ID, newTreeData);
                    openNodeByPkAsync(TREE_ID, newTreeData[0].refpk);

                    newCacheData[curSelectExpandIndex] = newTreeData; // 做缓存

                    this.setState({
                        treeData: newTreeData,
                        treeCacheData: newCacheData,
                    });
                }
            });
        }
    };

    onDragStartEve = ({ node }) => {
        let { getAsyncTreeValue } = this.props.props.asyncTree;
        let treeValue = getAsyncTreeValue(TREE_ID, node.props.eventKey);

        if (treeValue.refpk === "root" || treeValue.pid === "root") return;

        this.treeModelData = JSON.parse(
            JSON.stringify(buildModelItem(treeValue))
        );
    };

    loadTreeData = (pid, treeNode) => {
        // 懒加载树节点数据
        let { getAsyncTreeValue, addTreeData } = this.props.props.asyncTree;
        const { middleCacheData, curSelectExpandIndex } = this.state;
        if (
            (treeNode.props &&
                ((treeNode.props.children && treeNode.props.children.length) ||
                    treeNode.props.isLeaf === true)) ||
            treeNode.children
        ) {
            return;
        }

        let record = {
            ...getAsyncTreeValue(TREE_ID, pid),
            reportPk: this.props.reportId,
            isRunState: true,
            exAreaPK: middleCacheData.areacontentsets[
                curSelectExpandIndex
            ].areaPk
        };
        if (!record.code) return;
        loadSmartModelSubData(record).then((children) => {
            children.forEach((item) => (item.pid = pid));
            addTreeData(TREE_ID, children);
            this.setData(children, record);
        });
    };

    setData = (children, record) => {
        function loop(data) {
            data.forEach((item) => {
                if (item.refpk === record.refpk) {
                    item.children = children;
                } else if (item.children) {
                    loop(item.children);
                }
            });
        }
        loop(this.state.treeData);

        this.setState({
            treeData: this.state.treeData,
        });
    };

    // onSearch = (searchVal) => { // tree上面的搜索框查询
    //   let { treeData } = this.state;
    //   // if (searchVal === '') return this.setSearchTree(treeData[0].children);
    //   if (searchVal === '') return this.setSearchTree(treeData);
    //   const res = filterTree(searchVal, treeData) || [];
    //   this.setSearchTree(res, searchVal);
    // };

    searchChangeEve = (searchVal) => {
        let { treeData } = this.state;
        if (searchVal === "") {
            this.setSearchTree(treeData);
            return;
        }
        const res = filterTree(searchVal, treeData) || [];
        this.setSearchTree(res);
    };

    setSearchTree = (treeNodes) => {
        let { setTreeData, openNodeByPkAsync } = this.props.props.asyncTree;
        const pks = findPKs(treeNodes);
        setTreeData(TREE_ID, treeNodes);
        openNodeByPkAsync(TREE_ID, [...pks]);
    };

    selectExpandArea = (item, index) => {
        // 选扩展区
        const { middleCacheData } = this.state;
        const curArea = middleCacheData.areacontentsets[index];
        this.setState(
            {
                curSelectExpandIndex: index,
                curSelectExpandData: curArea,
            },
            () => {
                const treeParams = {
                    pk_def: curArea.smartModelDefID || "",
                    isRunState: true,
                    reportPk: this.props.reportId,
                    exAreaPK: curArea.areaPk
                };
                this.loadDataViewDataFn(treeParams);

                this.setDisplayTable(curArea);
            }
        );
    };

    /*
     * listKey: string,
     * type: string 'add', 'change',
     * dropIndex: number 拖放的表格行索引
     * 所有的操作过后需要对 middleCacheData 进行维护
     * */
    handleDrop = (listKey, type, dropIndex) => {
        const { curSelectExpandIndex, middleCacheData } = this.state;
        const resultData = JSON.parse(JSON.stringify(middleCacheData));
        let list = this.state[listKey];
        let anaRepFieldInfo = this.treeModelData.AnaRepFieldInfo;
        if (type === "add") {
            if (isRepeatItem(list, anaRepFieldInfo)) return;
            if (!anaRepFieldInfo.authorityFld) {
                toast({
                    content: langCheck("reportMultiLang", "dataView-100301-000280"),
                    color: "warning",
                }); // 该字段无权限，请至自由报表设计器：更多-数据视图字段集，添加补充字段
                return
            };
            anaRepFieldInfo.id =
                anaRepFieldInfo.anaRepField.m_field.m_fldname ||
                anaRepFieldInfo.anaRepField.name;
            anaRepFieldInfo.key =
                anaRepFieldInfo.anaRepField.m_field.m_fldname ||
                anaRepFieldInfo.anaRepField.name;
            anaRepFieldInfo.anaRepField.isShow = true; // 从树拖过来就选中
            anaRepFieldInfo.anaRepField.isCalcShow = true; // 从树拖过来就选中

            if (listKey === "measureSet" || listKey === "areaFieldSet") {
                //如果是统计列表交叉指标就默认添加类型
                let anaRepField = anaRepFieldInfo.anaRepField;
                let types = getCalculateOptions(anaRepField.m_field.dataType);
                anaRepField.m_countType = types[0].disabled
                    ? types[1].value
                    : types[0].value;
            }

            if (checkSum(listKey)) {
                //如果是统计列表交叉指标就默认添加类型
                // let anaRepField = anaRepFieldInfo.anaRepField;
                anaRepFieldInfo.m_isSum = true;
            }

            const newAnaRepFieldInfo = {
                ...anaRepFieldInfo,
                ...anaRepFieldInfo.anaRepField,
                colWidth: 1, // 后段需要此字段 拖过来的信息没有 需要手动加
                isShow: true,
                isCalcShow: true,
            };

            if (dropIndex || dropIndex === 0) {
                list.splice(dropIndex, 0, newAnaRepFieldInfo);
            } else {
                list.push(newAnaRepFieldInfo);
            }
        }

        if (type === "change") {
            // 拖到表格第二列的时候 走这里
            let currentItem = list[dropIndex];
            if (isSameItem(currentItem, anaRepFieldInfo)) {
                toast({
                    content: langCheck(
                        "reportMultiLang",
                        "dataView-100301-000259"
                    ), // '显示字段不应与字段名相同',
                    color: "warning",
                });
                return;
            }
            list[dropIndex].anaRepField.showField =
                anaRepFieldInfo.anaRepField.m_field;
            list[dropIndex].showField = anaRepFieldInfo.anaRepField.m_field;
            if (anaRepFieldInfo.anaRepField.name) {
                list[dropIndex].anaRepField.showField.m_caption =
                    anaRepFieldInfo.anaRepField.name;
                list[dropIndex].showField =
                    anaRepFieldInfo.anaRepField.m_caption;
            }
        }
        resultData.areacontentsets[curSelectExpandIndex][listKey] = list;
        this.setState({
            [listKey]: list,
            middleCacheData: resultData,
        });
        this.treeModelData = null;
    };

    // 行列转换

    transformRowAndCol = () => {
        const { curSelectExpandIndex, middleCacheData } = this.state;
        const resultData = JSON.parse(JSON.stringify(middleCacheData));

        const curAreaData = resultData.areacontentsets[curSelectExpandIndex];

        const newRowData = listAssemble(curAreaData.rowFldNames);
        const newColData = listAssemble(curAreaData.columnFldNames);

        resultData.areacontentsets[curSelectExpandIndex].columnFldNames =
            newRowData;
        resultData.areacontentsets[curSelectExpandIndex].rowFldNames =
            newColData;

        this.setState({
            rowFldNames: newColData,
            columnFldNames: newRowData,
            middleCacheData: resultData,
        });
    };

    operateTableButton = (list, listKey, operateType, deleteObjs) => {
        // 上移、下移、删除、行列转换等操作
        const { curSelectExpandIndex, middleCacheData, isSyncData } =
            this.state;
        const resultData = JSON.parse(JSON.stringify(middleCacheData));
        if (listKey === "shiftdim") {
            // 行列转换
            this.transformRowAndCol();
        } else if (
            listKey === "detailFldNames" &&
            operateType === "delete" &&
            isSyncData
        ) {
            // 删除明细列表字段 联动删除统计列表字段
            const deleteKeyArr = Object.keys(deleteObjs);
            const currentAreaSetArr = listAssemble(
                resultData.areacontentsets[curSelectExpandIndex].areaFieldSet
            );
            if (currentAreaSetArr.length > 0) {
                const newAreaFieldSet = currentAreaSetArr.filter(
                    (areeSetItem) => {
                        return !deleteKeyArr.includes(areeSetItem.key);
                    }
                );
                resultData.areacontentsets[curSelectExpandIndex].areaFieldSet =
                    newAreaFieldSet;
                this.setState({ areaFieldSet: newAreaFieldSet });
            }
            resultData.areacontentsets[curSelectExpandIndex][listKey] =
                list;
            this.setState({
                middleCacheData: resultData,
            });
        } else {
            resultData.areacontentsets[curSelectExpandIndex][listKey] = list;

            this.setState({
                middleCacheData: resultData,
            });
        }
    };

    operateTableValue = (valueKey, value) => {
        // 设置选中值的操作
        const { curSelectExpandIndex, middleCacheData } = this.state;
        const resultData = JSON.parse(JSON.stringify(middleCacheData));
        const isShowTypeFlag = valueKey === "isShowCount";
        const changeKeyData = isShowTypeFlag ? value : Number(value);
        resultData.areacontentsets[curSelectExpandIndex][valueKey] =
            changeKeyData;
        this.setState({
            [valueKey]: changeKeyData,
            middleCacheData: resultData,
        });
    };

    changeList = (list, listKey, operateType, deleteObjs) => {
        // 上移下移等操作
        this.setState({ [listKey]: list });
        this.operateTableButton(list, listKey, operateType, deleteObjs);
    };

    changeValue = (valueKey, value) => {
        // 选中复选框等操作
        this.setState({ [valueKey]: value });
        this.operateTableValue(valueKey, value);
    };

    sortRowCb = (data, record, tableKey) => {
        const { curSelectExpandIndex, middleCacheData } = this.state;
        let resultCache = JSON.parse(JSON.stringify(middleCacheData));
        resultCache.areacontentsets[curSelectExpandIndex][tableKey] = data;

        this.setState({
            [tableKey]: data,
            middleCacheData: resultCache,
        });
    };

    checkDeleteFieldCb = (
        field,
        value,
        list,
        checkedKey,
        tableKey,
        index,
        isChecked
    ) => {
        // 选中table当前节点的操作
        const { curSelectExpandIndex, middleCacheData } = this.state;
        let result = JSON.parse(JSON.stringify(this.state[tableKey]));
        let resultCache = JSON.parse(JSON.stringify(middleCacheData));

        if (!isChecked) {
            // 启用和选中分离
            if (field === "all") {
                // 全选
                result =
                    result &&
                    result.map((item) => {
                        const newAnaRepFieldInfo = {
                            ...item.anaRepField,
                            isShow: value,
                            isCalcShow: value,
                        };
                        return {
                            ...item,
                            anaRepField: newAnaRepFieldInfo,
                        };
                    });
            } else {
                result[index].anaRepField.isShow = value;
                result[index].anaRepField.isCalcShow = value;
                result[index].isShow = value;
                result[index].isCalcShow = value;
            }
        } else {
            if (field === "all") {
                // 全选
                result =
                    result &&
                    result.map((item) => {
                        const newAnaRepFieldInfo = {
                            ...item.anaRepField,
                            isChecked: value,
                        };
                        return {
                            ...item,
                            anaRepField: newAnaRepFieldInfo,
                        };
                    });
            } else {
                result[index].anaRepField.isChecked = value;
                result[index].isChecked = value;
            }
        }

        resultCache.areacontentsets[curSelectExpandIndex][tableKey] = result;
        this.setState({
            [tableKey]: result,
            middleCacheData: resultCache,
        });
    };

    handleGradeAreaDrop = (key) => {
        this.setState({
            [key]: this.treeModelData.AnaRepFieldInfo,
        });
    };

    saveDataView = () => {
        // 保存

        if (this.validateNullField()) {
            return;
        }

        const { middleCacheData } = this.state;
        if (!formatResDataByCacheData(middleCacheData)) {
            return 
        }
        const params = {
            saved_data: formatResDataByCacheData(middleCacheData),
        };
        operateDataView(params).then((res) => {
            if (res === "success") {
                // this.props.setIsAddNewDataView(true);
                this.props.getAllViewData(); // 重新加载数据
                this.props.onCancel(); // 关闭弹窗
                this.props.fetchTableData(
                    formatResDataByCacheData(middleCacheData)
                );
                toast({
                    content: langCheck(
                        "reportMultiLang",
                        "dataView-100301-000255"
                    ),
                    color: "success",
                }); // 保存成功
                this.props.resetCacheFlag(); // 重置父级flag
            }
        });
    };

    validateSelectField = (curTableInfo, tableKey, showKey = "isShow") => {
        let result = false;
        curTableInfo[tableKey].length > 0 &&
            curTableInfo[tableKey].forEach((item) => {
                if (Array.isArray(item)) {
                    // group特殊
                    if (item[0].anaRepField) {
                        if (item[0].anaRepField[showKey]) {
                            result = true;
                        }
                    } else {
                        if (item[0][showKey]) {
                            result = true;
                        }
                    }
                } else {
                    if (item.anaRepField) {
                        if (item.anaRepField[showKey]) {
                            result = true;
                        }
                    } else {
                        if (item[showKey]) {
                            result = true;
                        }
                    }
                }
            });
        return result;
    };

    validateNullField = () => {
        // 弹窗内表格字段都为空 点保存 另存 预览后 提示信息
        let resultFlag = false;
        const { curSelectExpandIndex, middleCacheData } = this.state;

        for (let i = 0; i < middleCacheData.areacontentsets.length; i++) {
            const curTableInfo = middleCacheData.areacontentsets[i];
            if (curTableInfo.groupFldNames) {
                // 行列表
                if (
                    (curTableInfo.groupFldNames.length === 0 ||
                        (curTableInfo.groupFldNames[0] &&
                            curTableInfo.groupFldNames[0].length === 0)) &&
                    curTableInfo.detailFldNames.length === 0 &&
                    curTableInfo.areaFieldSet.length === 0
                ) {
                    toast({
                        content: langCheck(
                            "reportMultiLang",
                            "dataView-100301-000263"
                        ),
                        color: "warning",
                    }); // 视图设置信息不可为空
                    resultFlag = true;
                } else {
                    if (
                        !this.validateSelectField(
                            curTableInfo,
                            "detailFldNames"
                        ) &&
                        !this.validateSelectField(
                            curTableInfo,
                            "groupFldNames"
                        ) &&
                        !this.validateSelectField(
                            curTableInfo,
                            "areaFieldSet",
                            "isCalcShow"
                        )
                    ) {
                        resultFlag = true;
                        toast({
                            content: langCheck(
                                "reportMultiLang",
                                "dataView-100301-000263"
                            ),
                            color: "warning",
                        }); // 交叉表视图设置必须有行列维度和指标
                        return resultFlag;
                    }
                }
            } else {
                // 交叉表
                if (
                    curTableInfo.columnFldNames.length === 0 ||
                    curTableInfo.rowFldNames.length === 0 ||
                    curTableInfo.measureSet.length === 0
                ) {
                    // 任何一个为0
                    toast({
                        content: langCheck(
                            "reportMultiLang",
                            "dataView-100301-000265"
                        ),
                        color: "warning",
                    }); // 交叉表视图设置必须有行列维度和指标
                    resultFlag = true;
                } else {
                    if (
                        !this.validateSelectField(
                            curTableInfo,
                            "columnFldNames"
                        ) ||
                        !this.validateSelectField(
                            curTableInfo,
                            "rowFldNames"
                        ) ||
                        !this.validateSelectField(
                            curTableInfo,
                            "measureSet",
                            "isCalcShow"
                        )
                    ) {
                        resultFlag = true;
                        toast({
                            content: langCheck(
                                "reportMultiLang",
                                "dataView-100301-000265"
                            ),
                            color: "warning",
                        }); // 交叉表视图设置必须有行列维度和指标
                        return resultFlag;
                    }
                }
            }
        }
        return resultFlag;
    };

    saveAsNewDataView = () => {
        // 打开另存为新视图

        if (this.validateNullField()) {
            return;
        }

        this.setState({
            saveAsVisible: true,
        });
        this.props.resetSaveAs(); // 重置默认的 renameData 和 saveAsType
    };

    getCurDataViewName = (data, langType) => {
        // 从多语数据中拿到当前选中的对象
        let resultName = {};
        const dataArr = (data && Object.keys(data)) || [];
        if (dataArr.length > 0) {
            dataArr.map((key, index) => {
                if (data[`dataViewSaveAs${langType}`]) {
                    resultName = data[key];
                }
                return item;
            });
        }
        return resultName;
    };

    isRepeatName = (value) => {
        const { allData, renameData } = this.props;

        let result = false;
        allData &&
            Array.isArray(allData) &&
            allData.length > 0 &&
            allData.map((item) => {
                const curNameKey = NAME_MAP_BY_LANG[item.multlanguage];
                if (
                    item[curNameKey] === value &&
                    renameData.code !== item.code
                ) {
                    result = true;
                }
                return item;
            });
        return result;
    };

    saveAsSubmit = (saveAsValue, saveAsDefault) => {
        // 另存
        const { middleCacheData } = this.state;
        const { renameData, saveAsType } = this.props;
        const saveAsCacheData = JSON.parse(JSON.stringify(middleCacheData));

        const currentLangType =
            saveAsType === 1
                ? saveAsCacheData.multlanguage
                : renameData.multlanguage;
        const content =
            saveAsType === 1
                ? langCheck("reportMultiLang", "dataView-100301-000254")
                : langCheck("reportMultiLang", "dataView-100301-000255");

        const curName =
            (saveAsValue &&
                saveAsValue[`dataViewSaveAs${currentLangType}`] &&
                saveAsValue[`dataViewSaveAs${currentLangType}`].value) ||
            "";

        if (curName === "") {
            toast({
                content: langCheck("reportMultiLang", "dataView-100301-000256"),
                color: "warning",
            }); // 视图名称不能为空
            return;
        }

        if (this.isRepeatName(curName)) {
            toast({
                content: langCheck("reportMultiLang", "dataView-100301-000257"),
                color: "warning",
            }); // 视图名称已经存在
            return;
        }

        let params = {};

        /**
         * 重命名  --- 三种情况
         *  修改前是true 修改后是false --- isdefault传fasle
         *  修改前是false 修改后是true --- isdefault传true
         *  没变化则不传参数 -- isdefault undefined
         */
        if (saveAsType === 2) {
            // 重命名  --- 三种情况 修改前是true 修改后是false
            let isdefault = undefined;
            if (renameData.isdefault === true && saveAsDefault === false) {
                isdefault = false;
            } else if (
                renameData.isdefault === false &&
                saveAsDefault === true
            ) {
                isdefault = true;
            }

            params = {
                rename_code: renameData.code,
                reportpk: renameData.reportpk,
                rename: curName,
                isdefault,
            };
        } else {
            // 另存新视图
            // if (saveAsCacheData.multlanguage === 1) {
            //     saveAsCacheData.name = curName;
            // } else {
            //     saveAsCacheData[`name${saveAsCacheData.multlanguage}`] = curName;
            // }

            saveAsCacheData.name = saveAsValue.dataViewSaveAs1.value || '';
            saveAsCacheData.name2 = saveAsValue.dataViewSaveAs2.value || '';
            saveAsCacheData.name3 = saveAsValue.dataViewSaveAs3.value || '';

            saveAsCacheData.isdefault = saveAsDefault;
            saveAsCacheData.code = new Date().getTime();
            if (!formatResDataByCacheData(saveAsCacheData)) {
                return 
            }
            params = {
                saved_data: formatResDataByCacheData(saveAsCacheData),
            };
        }
        operateDataView(params).then((res) => {
            if (res === "success") {
                this.props.setIsAddNewDataView(true); // 新加的数据视图 对勾要打在这上面
                this.props.getAllViewData(); // 重新加载数据
                this.props.onCancel(); // 关闭弹窗
                this.props.resetSaveAs(); // 重置数据
                this.props.resetCacheFlag(); // 重置父级flag
                this.setState({
                    saveAsVisible: false,
                    curSelectExpandIndex: 0,
                });
                this.props.fetchTableData(
                    formatResDataByCacheData(saveAsCacheData)
                );
                this.props.setDataViewCacheData({});
                toast({ content, color: "success" });
            }
        });
    };

    paintTreeArea = (isResizing) => {
        let { createAsyncTree } = this.props.props.asyncTree;
        const { curViewData } = this.props;
        return (
            <TreeArea
                isResizing={isResizing}
                createAsyncTree={createAsyncTree}
                onDragStartEve={this.onDragStartEve}
                loadTreeData={this.loadTreeData}
                // onSearch={this.onSearch}
                curViewData={curViewData}
                selectExpandArea={this.selectExpandArea}
                setResizeModalFlag={this.setResizeModalFlag}
                currentE={this.state.currentE}
                searchChangeEve={this.searchChangeEve}
                clearSearchVal={() => {
                    this.setSearchTree(this.state.treeData);
                }}
            />
        );
    };

    hasTransformRowAndCol = (curSelectExpandData, relationAreaPkList) => {
        let result = true;
        if (
            Array.isArray(relationAreaPkList) &&
            relationAreaPkList.includes(curSelectExpandData.areaPk)
        ) {
            result = false;
        }
        return result;
    };

    setResizeModalFlag = (isResizing) => {
        this.setState({
            isResizing,
        });
    };

    render() {
        const { curViewData, entranceType, renameData, saveAsType } =
            this.props;
        const { curSelectExpandIndex, middleCacheData, curSelectExpandData } =
            this.state;

        const buttonList = [
            {
                title: langCheck("reportMultiLang", "dataView-100301-000246"), // 保存
                colors: "primary",
                key: "confirm",
                onClick: this.saveDataView,
                className: "button-primary",
            },
            {
                title: langCheck("reportMultiLang", "dataView-100301-000247"), // 另存
                key: "default",
                colors: "secondary",
                onClick: this.saveAsNewDataView,
            },
        ];
        return (
            <div>
                <NCModal
                    fieldid="dataView"
                    show={this.props.visible}
                    id="dataViewModal"
                    width={1200}
                    height={610}
                    className="report-data-view-modal"
                    onHide={() => {
                        this.clearTreeCacheData();
                        this.props.onCancel();
                        this.setState({
                            middleCacheData: {},
                        });
                    }}
                    bodyHeight="530px"
                    onResize={(e, position) => {
                        if (position === "bottom") {
                            this.setState({
                                currentE: e,
                            });
                        }
                        if (!this.state.isResizing) {
                            this.setResizeModalFlag(true);
                        }
                    }}
                >
                    <NCModal.Header closeButton className='data-view-modal-header'>
                        <div className="nc-theme-common-font-c" style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                            {entranceType === "add" ? (
                                <span className="data-view-title">
                                    {/* 新增视图 */}
                                    {langCheck(
                                        "reportMultiLang",
                                        "dataView-100301-000242"
                                    )}
                                </span>
                            ) : (
                                <span className="data-view-title">
                                    {/* 修改视图 */}
                                    {langCheck(
                                        "reportMultiLang",
                                        "dataView-100301-000253"
                                    )}{" "}
                                    -{" "}
                                    {middleCacheData.name ||
                                        (curViewData && curViewData.name)}
                                </span>
                            )}
                            <i
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.setState({
                                        helpModalVisible: true,
                                    });
                                }}
                                style={{ cursor: "pointer" }}
                                className="dnd-cancel iconfont icon-bangzhutishi"
                            />
                        </div>
                    </NCModal.Header>
                    <NCModal.Body className="data-view-body">
                        <div className="data-view-left-container">
                            <div className="tree-container">
                                {this.paintTreeArea(this.state.isResizing)}
                            </div>
                            <div className="table-container nc-theme-area-split-bc ">
                                {
                                    <TableArea
                                        {...this.state}
                                        relationAreaPkList={
                                            this.props.relationAreaPkList
                                        }
                                        changeList={this.changeList}
                                        handleDrop={this.handleDrop}
                                        sortRowCb={this.sortRowCb}
                                        changeValue={this.changeValue}
                                        curViewData={middleCacheData}
                                        curSelectExpandIndex={
                                            curSelectExpandIndex
                                        }
                                        curSelectExpandData={
                                            curSelectExpandData
                                        }
                                        handleGradeAreaDrop={
                                            this.handleGradeAreaDrop
                                        }
                                        checkDeleteFieldCb={
                                            this.checkDeleteFieldCb
                                        }
                                        showTransformRowAndCol={this.hasTransformRowAndCol(
                                            curSelectExpandData,
                                            this.props.relationAreaPkList
                                        )}
                                    />
                                }
                            </div>
                        </div>
                    </NCModal.Body>
                    <NCModal.Footer>
                        {entranceType === "edit" && (
                            <NCButtonGroup list={buttonList} />
                        )}

                        {entranceType === "add" && (
                            <NCButton
                                fieldid="saveAs"
                                colors="primary"
                                onClick={() => {
                                    this.saveAsNewDataView();
                                }}
                            >
                                {/* 保存 */}
                                {langCheck(
                                    "reportMultiLang",
                                    "dataView-100301-000246"
                                )}
                            </NCButton>
                        )}

                        <NCButton
                            fieldid="continue"
                            className="sure-button"
                            onClick={() => {
                                if (this.validateNullField()) {
                                    return;
                                }
                                if (!formatResDataByCacheData(this.state.middleCacheData, true)) {
                                    return 
                                }
                                this.clearTreeCacheData();
                                this.props.onOk(
                                    formatResDataByCacheData(
                                        this.state.middleCacheData,
                                        true
                                    )
                                );
                            }}
                        >
                            {/* 预览 */}
                            {langCheck(
                                "reportMultiLang",
                                "dataView-100301-000260"
                            )}
                        </NCButton>
                        <NCHotKeys
                            keyMap={{
                                cancelBtnHandler:
                                    NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL,
                            }}
                            handlers={{
                                cancelBtnHandler: () => {
                                    this.clearTreeCacheData();
                                    this.props.onCancel();
                                    this.setState({
                                        middleCacheData: {},
                                    });
                                },
                            }}
                            focused={true}
                            attach={document.body}
                            style={{ display: "inline-block" }}
                        >
                            <NCTooltip
                                inverse
                                trigger={["hover", "focus"]}
                                placement="top"
                                className="model-helper-overlay"
                                overlay={`${langCheck(
                                    "reportMultiLang",
                                    "100301-000048"
                                )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL})`}
                            >
                                <NCButton
                                    fieldid="cancel"
                                    className="cancel-button"
                                    onClick={() => {
                                        this.clearTreeCacheData();
                                        this.props.onCancel();
                                        this.setState({
                                            middleCacheData: {},
                                        });
                                    }}
                                >
                                    {langCheck(
                                        "reportMultiLang",
                                        "dataView-100301-000248"
                                    )}

                                    (<span className="text-decoration-underline">
                                        N
                                    </span>)
                                </NCButton>
                            </NCTooltip>
                        </NCHotKeys>
                    </NCModal.Footer>
                </NCModal>

                <SaveAsModal
                    show={this.state.saveAsVisible}
                    saveAsSubmit={this.saveAsSubmit}
                    renameData={renameData}
                    enableLangMaps={middleCacheData && middleCacheData.enableLangMaps }
                    entranceType={entranceType}
                    saveAsType={saveAsType}
                    resetSaveAs={() => {
                        this.setState({ saveAsVisible: false });
                        this.props.resetSaveAs();
                        this.props.setIsViewingAndSave(false);
                    }}
                    onCancel={() => {
                        this.setState({ saveAsVisible: false });
                        if (this.props.state.isViewingAndSave) {
                            this.props.setViewDataIngVisibile(true);
                        }
                        this.props.setIsViewingAndSave(false);
                        // this.props.onCancel();
                    }}
                />
                {this.state.helpModalVisible && (
                    <HelpModal
                        show={this.state.helpModalVisible}
                        title={langCheck(
                            "reportMultiLang",
                            "dataView-100301-000243"
                        )}
                        content={
                            <div>
                                <span>
                                    {langCheck(
                                        "reportMultiLang",
                                        "dataView-100301-000268"
                                    )}
                                </span>
                                <div className="data-view-help-gif">
                                    <img
                                        width="100%"
                                        height="100%"
                                        src={dataViewHelpGif}
                                    />
                                </div>
                            </div>
                        }
                        onCancel={() => {
                            this.setState({ helpModalVisible: false });
                        }}
                    />
                )}
            </div>
        );
    }
}

export default DataViewModal;
