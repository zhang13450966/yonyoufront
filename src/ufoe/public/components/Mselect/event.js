//数组元素互换位置
function swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}
// 按钮事件
export let buttonEvent = {
    // 删除
    Delete: function () {
        // 
        //console.log("删除",this);
        let data = this.state.rightRightData;
        let newData = [];
        data.forEach((i) => {
            if (i.checked) {

                // 移除电子表格选中 
                if (this.dataSet[i.refpk] && this.dataSet[i.refpk].excelSelect &&
                    this.dataSet[i.refpk].excelSelect.hisSelect.has(i.value)) {
                    this.dataSet[i.refpk].excelSelect.hisSelect.delete(i.value);
                }
                // 移除列表选中
                if (this.dataSet[i.refpk] && this.dataSet[i.refpk].listSelect.has(i.value)) {
                    this.dataSet[i.refpk].listSelect.delete(i.value);
                }
                // 移除合并选中
                if (this.dataSet[i.refpk] && this.dataSet[i.refpk].mergeSelect.has(i.value)) {
                    this.dataSet[i.refpk].mergeSelect.delete(i.value);
                }

            } else {
                newData.push(i);
            }
        })
        //处理最右侧没有表格，任务中这种，取消标记
        if (_.isEmpty(data)) {
            let selectData = this.props.excelTable.getMeSelected(this.selectRefpk);
            if (!_.isEmpty(selectData)) {
                selectData.select.forEach(i => {
                    // 移除电子表格选中 
                    if (this.dataSet[i.m_htExtFmt.m_strReportPK] && this.dataSet[i.m_htExtFmt.m_strReportPK].excelSelect &&
                        this.dataSet[i.m_htExtFmt.m_strReportPK].excelSelect.hisSelect.has(i.original[0])) {
                        this.dataSet[i.m_htExtFmt.m_strReportPK].excelSelect.hisSelect.delete(i.original[0]);
                    }
                    // 移除列表选中
                    if (this.dataSet[i.m_htExtFmt.m_strReportPK] && this.dataSet[i.m_htExtFmt.m_strReportPK].listSelect.has(i.original[0])) {
                        this.dataSet[i.m_htExtFmt.m_strReportPK].listSelect.delete(i.original[0]);
                    }
                    // 移除合并选中
                    if (this.dataSet[i.m_htExtFmt.m_strReportPK] && this.dataSet[i.m_htExtFmt.m_strReportPK].mergeSelect.has(i.original[0])) {
                        this.dataSet[i.m_htExtFmt.m_strReportPK].mergeSelect.delete(i.original[0]);
                    }
                })
            }
        }
        const { delBtn, topBtn, upBtn, bottomBtn, downBtn } = btnGroupControl(newData);
        this.setState({ rightRightData: newData, delBtn, topBtn, upBtn, bottomBtn, downBtn }, () => {
            // 判断当前是表格还是列表
            if (this.state.tableIndex === "1") {
                this.updateSelectData("set");
            } else {
                this.updateSelectData("setTable", { rightUpdate: true });

            }
            if (this.state.rightSearchValue) {
                this.rightSearchChangeContent(this.state.rightSearchValue);
            }

        })
    },
    // 上移
    MoveUp: function () {
        let data = this.state.rightRightData;
        //重排
        let selectData, noSelectData, first, insetPosition;
        selectData = data.filter(it => it.checked);
        noSelectData = data.filter(it => !it.checked);
        first = _.findIndex(data, it => it.checked);
        if (data[first - 1]) {
            insetPosition = _.findIndex(noSelectData, it => it.value == data[first - 1].value);
            noSelectData.splice(insetPosition, 0, ...selectData);
        } else {
            noSelectData.splice(0, 0, ...selectData);
        }
        let newRightData = noSelectData;

        const { delBtn, topBtn, upBtn, bottomBtn, downBtn } = btnGroupControl(newRightData);
        this.setState({ rightRightData: newRightData, delBtn, topBtn, upBtn, bottomBtn, downBtn }, () => {
            if (this.state.rightSearchValue) {
                this.rightSearchChangeContent(this.state.rightSearchValue);
            }
        });

    },
    // 下移
    MoveDown: function () {
        let data = this.state.rightRightData;
        //重排
        let selectData, noSelectData, last, insetPosition;
        selectData = data.filter(it => it.checked);
        noSelectData = data.filter(it => !it.checked);
        last = _.findLastIndex(data, it => it.checked);
        if (data[last + 1]) {
            insetPosition = _.findIndex(noSelectData, it => it.value == data[last + 1].value);
            noSelectData.splice(insetPosition + 1, 0, ...selectData);
        } else {
            noSelectData.splice(noSelectData.length, 0, ...selectData);
        }
        let newRightData = noSelectData;

        const { delBtn, topBtn, upBtn, bottomBtn, downBtn } = btnGroupControl(newRightData);
        this.setState({ rightRightData: newRightData, delBtn, topBtn, upBtn, bottomBtn, downBtn }, () => {
            if (this.state.rightSearchValue) {
                this.rightSearchChangeContent(this.state.rightSearchValue);
            }
        });

    },
    Top: function () {
        //console.log("下移");
        // 
        //console.log("上移",this);
        // 
        let data = this.state.rightRightData;
        //  let dataIndex = data.map((i,k)=>i.index = k);
        //  let dataMap
        let firstIndex;
        let sizeObj = [];
        //  首先收集 选中数据的 
        data.forEach((i, k) => {
            if (i.checked) {
                if (typeof firstIndex === "undefined") {
                    firstIndex = 0;
                    sizeObj.push({
                        his: k,
                        prev: 0
                    })

                } else {
                    firstIndex++
                    sizeObj.push({
                        his: k,
                        prev: firstIndex
                    })
                }
            }


        });
        sizeObj.forEach((i, k) => {
            swapArray(data, i.prev, i.his)
        })
        const { delBtn, topBtn, upBtn, bottomBtn, downBtn } = btnGroupControl(data);
        this.setState({ rightRightData: data, delBtn, topBtn, upBtn, bottomBtn, downBtn }, () => {
            if (this.state.rightSearchValue) {
                this.rightSearchChangeContent(this.state.rightSearchValue);
            }
        });

    },
    Bottom: function () {
        //console.log("置底");
        // 
        //console.log("上移",this);
        // 
        let data = this.state.rightRightData.reverse();
        //  let dataIndex = data.map((i,k)=>i.index = k);
        //  let dataMap
        let firstIndex;
        let sizeObj = [];
        //  首先收集 选中数据的 
        data.forEach((i, k) => {
            if (i.checked) {
                if (typeof firstIndex === "undefined") {
                    firstIndex = 0;
                    sizeObj.push({
                        his: k,
                        prev: 0
                    })

                } else {
                    firstIndex++
                    sizeObj.push({
                        his: k,
                        prev: firstIndex
                    })
                }
            }


        });
        sizeObj.forEach((i, k) => {
            swapArray(data, i.prev, i.his)
        })
        let newRightData = data.reverse();
        const { delBtn, topBtn, upBtn, bottomBtn, downBtn } = btnGroupControl(newRightData);
        this.setState({ rightRightData: newRightData, delBtn, topBtn, upBtn, bottomBtn, downBtn }, () => {
            if (this.state.rightSearchValue) {
                this.rightSearchChangeContent(this.state.rightSearchValue);
            }
        });

    },
    // 确定 0
    Confirm: async function () {
        if (!this.props.showSign) {
            if (this.props.isFromHb) {
                hbConfrimFn.call(this);
            } else { //集团报表规则应用
                ruleConfirmFn.call(this);
            }
            return
        }
        let newParam = {
            attrIdList: [],
            // measureCodeList:{}
            measureCodeList: []
        };
        try {
            let data = this.state.rightRightData;
            // let dataMap = new Map();
            // data.forEach((i,k)=>{
            //     dataMap.set(i.value,i);
            //     if(i.refpk==="unitProp"){

            //     }else{

            //     }
            // });
            data.forEach((i, k) => {
                if (i.refpk === "unitProp") {
                    newParam.attrIdList.push(i.value);
                } else {
                    newParam.measureCodeList.push(i.value)
                    // if(newParam.measureCodeList[i.refpk]){
                    //     newParam.measureCodeList[i.refpk].push(i.value);
                    // }else{
                    //     newParam.measureCodeList[i.refpk] = [];
                    //     newParam.measureCodeList[i.refpk].push(i.value);
                    // }
                }
            });
            if (newParam.measureCodeList.length === 0) {
                $nccPlatform.toast({
                    color: 'warning',
                    content: $appRoot.state.json['public_lang-000118'],/* 国际化处理： 请选择指标！*/
                })
                return;
            }
            let vres = await $nccUtil.promiseAjax("/nccloud/ufoe/provider/repDataProviderDesign.do", newParam);
            //console.log("语义模型保存",vres);
            if (vres.data) {
                if (this.props.beSureBtnClick) {
                    this.props.beSureBtnClick(vres.data);
                }
            }
        } catch (error) {
            throw error;
        }
    },
    // 取消 "1"
    Cancel: function () {
        this.props.closeModal();
    },



}

export let markOrCancel = function () {
    //制定规则，选中的单元格的数量全被标记，取消标记，否则走标记
    console.log(this);
    let selectData = this.props.excelTable.getMeSelected(this.selectRefpk).select;
    let markData = this.props.excelTable.setSign(this.selectRefpk);
    let intersectionData = _.intersectionBy(selectData, markData, 'm_htExtFmt.code');
    if (!_.isEmpty(intersectionData) && selectData.length == intersectionData.length) { //取消标记
        let rightTableData = this.state.rightRightData
        rightTableData.forEach(it => {
            selectData.forEach(its => {
                it.value == its.m_htExtFmt.code && (it['checked'] = true);
            })
        })
        this.setState({ rightRightData: rightTableData });
        return false;
    } else { //添加标记
        return true;
    }
}

//删除，置顶，上移，下移，置底  按钮控制  （参数：最右侧表格数据this.state.rightRightData）
export let btnGroupControl = (sdata) => {
    let delBtn, topBtn, upBtn, bottomBtn, downBtn
    let checkDataindexArr = [];
    sdata.forEach((it, index) => {
        if (it.checked) { checkDataindexArr.push(index) }
    });
    delBtn = checkDataindexArr.length > 0 ? false : true;
    //有第一条并且数组大于一并且连续  或者  只有一条并且等于0  或者  没有选择 ？ 不可用 ： 可用
    topBtn = (checkDataindexArr[0] == 0 && checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length - 1] - checkDataindexArr[0] == checkDataindexArr.length - 1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == 0) || checkDataindexArr.length == 0 ? true : false;
    upBtn = (checkDataindexArr[0] == 0 && checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length - 1] - checkDataindexArr[0] == checkDataindexArr.length - 1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == 0) || checkDataindexArr.length == 0 ? true : false;
    //有最后一条并且数组大于一并且连续  或者  只有一条并且等于最后一条 或者  没有选择 ？ 不可用 ： 可用
    bottomBtn = (checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length - 1] == sdata.length - 1 && checkDataindexArr[checkDataindexArr.length - 1] - checkDataindexArr[0] == checkDataindexArr.length - 1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == sdata.length - 1) || checkDataindexArr.length == 0 ? true : false;
    downBtn = (checkDataindexArr.length > 1 && checkDataindexArr[checkDataindexArr.length - 1] == sdata.length - 1 && checkDataindexArr[checkDataindexArr.length - 1] - checkDataindexArr[0] == checkDataindexArr.length - 1) || (checkDataindexArr.length == 1 && checkDataindexArr[0] == sdata.length - 1) || checkDataindexArr.length == 0 ? true : false;
    return { delBtn, topBtn, upBtn, bottomBtn, downBtn }
}

//集团报表规则点击确定事件
const ruleConfirmFn = function () {
    const { selectTreeNode, selectRefpk, dataSet } = $appRoot.Mselect_owner;
    const dataMap = dataSet[selectRefpk];
    if (!dataMap) {
        $nccPlatform.toast({
            color: 'warning',
            content: $appRoot.state.json['public_lang-000118'],/* 国际化处理： 请选择指标！*/
        })
    }
    const { tableData } = dataMap;
    const { m_AreaDatas } = tableData.m_cellsModel;
    const { allMeasures, measurePK2VO } = tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.measure.MeasureModel"];
    const { keyPK2VO } = tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.key.KeywordModel"];
    let responseData = {}, positionInfo, measureInfo, position, keywordsInfo, keyWordCheck;

    //浮动表不支持取数
    let floatArea = m_AreaDatas.find(it => it.areaInfoSet);
    if (floatArea) {
        $nccPlatform.toast({
            color: 'warning',
            content: "仅支持取固定表数据，不支持取浮动表数据",
        })
        return
    }

    //指标选取表格页
    const checked = $appRoot.excetTableWindow.hot.getSelected();
    if (checked.length == 0) {
        $nccPlatform.toast({
            color: 'warning',
            content: $appRoot.state.json['public_lang-000118'],/* 国际化处理： 请选择指标！*/
        })
        return
    }
    if (!(checked[0][2] == checked[0][0] && checked[0][3] == checked[0][1])) {
        $nccPlatform.toast({
            color: 'warning',
            content: '请选择一个已提取指标的单元格',
        })
        return
    }

    const row = checked[0][0];
    const col = checked[0][1];

    position = allMeasures.MAIN.find(it => it[0].row == row && it[0].col == col);
    if (position) {
        positionInfo = position[0].m_key
    } else {
        $nccPlatform.toast({
            color: 'warning',
            content: '请选择一个已提取指标的单元格',
        })
        return
    }
    measureInfo = measurePK2VO[position[1]];
    keywordsInfo = Object.values(keyPK2VO);
    //(单位；币种；会计月)或 (单位；会计月)外关键字不可取数
    keyWordCheck = new Set();
    Object.values(keyPK2VO).forEach(it => keyWordCheck.add(it.code));
    if (!(
        (keyWordCheck.size == 2 && keyWordCheck.has('corp') && (keyWordCheck.has('accyear') || keyWordCheck.has('accmonth') || keyWordCheck.has('year') || keyWordCheck.has('month'))) ||
        (keyWordCheck.size == 3 && keyWordCheck.has('corp') && keyWordCheck.has('coin') && (keyWordCheck.has('accyear') || keyWordCheck.has('accmonth') || keyWordCheck.has('year') || keyWordCheck.has('month')))
    )) {
        $nccPlatform.toast({
            color: 'warning',
            content: "仅支持从关键字为单位、会计年/会计月/年/月、（币种）的报表取数",
        })
        return
    }

    Object.assign(responseData, {
        selectTreeNode,
        positionInfo,
        measureInfo,
        keywordsInfo,
    })
    this.props.beSureBtnClick(responseData);
}

//合并报表合并报表项目点击确定事件
const hbConfrimFn = function () {
    const { selectTreeNode, selectRefpk, dataSet } = $appRoot.Mselect_owner;
    const dataMap = dataSet[selectRefpk];
    if (!dataMap) {
        $nccPlatform.toast({
            color: 'warning',
            content: $appRoot.state.json['public_lang-000118'],/* 国际化处理： 请选择指标！*/
        })
    }
    const { tableData } = dataMap;
    const { allMeasures, measurePK2VO } = tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.measure.MeasureModel"];
    const { keyPK2VO } = tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.key.KeywordModel"];
    const { mainDisplayKeys } = tableData["m_cellsModel"]["m_htExtProp"]["com.ufsoft.iufo.fmtplugin.key.KeywordModel"];
    let responseData = {}, positionInfo, measureInfo, position, keywordsInfo, keyWordCheck;

    //指标选取表格页
    const checked = $appRoot.excetTableWindow.hot.getSelected();
    if (checked.length == 0) {
        $nccPlatform.toast({
            color: 'warning',
            content: $appRoot.state.json['public_lang-000118'],/* 国际化处理： 请选择指标！*/
        })
        return
    }
    if (!(checked[0][2] == checked[0][0] && checked[0][3] == checked[0][1])) {
        $nccPlatform.toast({
            color: 'warning',
            content: '请选择一个已提取指标的单元格',
        })
        return
    }

    const row = checked[0][0];
    const col = checked[0][1];
    Object.keys(allMeasures).forEach(it => {
        if (!position) {
            position = allMeasures[it].find(it => it[0].row == row && it[0].col == col);
        }
    });

    if (position) {
        positionInfo = position[0].m_key
    } else {
        $nccPlatform.toast({
            color: 'warning',
            content: '请选择一个已提取指标的单元格',
        })
        return
    }

    measureInfo = measurePK2VO[position[1]];
    // keywordsInfo = Object.values(keyPK2VO);
    let pre_keywordsInfo = Object.values(keyPK2VO);
    let list = []
    for (let i = 0; i < mainDisplayKeys.length; i++) {
        pre_keywordsInfo.forEach(item => {
            if (item.pk_keyword == mainDisplayKeys[i][1]) {
                list.push(item)
            }
        })
    }
    keywordsInfo = Object.values(list);

    Object.assign(responseData, {
        selectTreeNode,
        positionInfo,
        measureInfo,
        keywordsInfo,
    })
    this.props.beSureBtnClick(responseData);
}

/**
 * 返回表头
 * @param {*} Number 
 * 
 */
const returnColHead = function (n) {
    let ordA = "A".charCodeAt(0);
    let ordZ = "Z".charCodeAt(0);
    let len = ordZ - ordA + 1;
    let s = '';
    while (n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s;
}

