export let CONSTANT = {
    // 左侧树id
    leftTreeId: "mselectTree",
    // 请求树节点url "/nccloud/ufoe/task/taskDel.do"
    // requestTreeDataUrl:"ufoe.refer.reportSortTree",
    requestTreeDataUrl: "/nccloud/ufoe/refer/ufoeReportTreeRef.do",
    // 请求列表数据  ufoe.refer.measureGridRef   
    measureGridRef: "/nccloud/ufoe/refer/measureGridRef.do",
    // 请求电子表格数据  ufoe.refer.measureTableRef
    measureTableRef: "/nccloud/ufoe/refer/measureTableRef.do",
    global:"GLOBLE00000000000000",
    param: {
        tree: {
            pk_org: "GLOBLE00000000000000",
            group:"GROUPORGTYPE00000000",
            busi_prop: "0001Z0100000000005CQ",
        }
    },
    listEditMeta: () => {
        return {
            "items": [
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    // "width": "120px",
                    "attrcode": "name",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "customer",
                    "label": $appRoot && $appRoot.state.json['public_lang-000110'],/* 国际化处理： 指标名称*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "1",
                    "required": false,
                    "scale": "0",
                    "visible": true,
                    "width":"400px",
                    render:(text, record, index)=>{
                        let newText = text.display;
                        
                        if(record.values.search&&record.values.search.value){
                            let str = record.values.name.display;
                            let searchText = record.values.search.value;
                            let strArray = str.split(searchText);
                            if(strArray.length>1){
                                let newStr = [];
                                strArray.forEach((i,k) => {
                                    if(k!==0){
                                        newStr.push(<span><span style={{color:"red"}}>{searchText}</span>{i}</span>);
                                        // newStr.push(i);
                                    }else{
                                        newStr.push(<span>{i}</span>);
                                    }
                                });
                                newText = newStr;
                            }
                        }
                        return <span>{newText}</span>;
                    }
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "type",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000111'],/* 国际化处理： 指标类型*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "2",
                    "required": false,
                    "scale": "0",
                    whichKeyToDisplay:"display",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "note",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000112'],/* 国际化处理： 指标说明*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "3",
                    "required": false,
                    "scale": "0",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "pk_report",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000113'],/* 国际化处理： 所属报表*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "4",
                    "required": false,
                    "scale": "0",
                    "visible": true,
                    whichKeyToDisplay:"display",
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "search",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "label",
                    "label": "",
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "4",
                    "required": false,
                    "scale": "0",
                    "visible": false
                }
            ],
            "moduletype": "table",
            "pagination": false,
            "position": "5",
            "code": "listEditMeta",
            "name": $appRoot && $appRoot.state.json['public_lang-000006'],/* 国际化处理： 虚拟大区*/
            "oid": "1001ZE1000000000RQGQ",
            "areaVisible": true,
            "isunfold": true,
            "isnotmeta": false,
            "appcode": "182001016A",
            "pagecode": "182001016A_list",
            "templateCode": "182001016A_list",
            "pageid": "1001ZE1000000000OZJ4"
        }
    },
    // 单位信息
    unitEditMeta: () => {
        return {
            "items": [
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    // "width": "120px",
                    "attrcode": "name",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000114'],/* 国际化处理： 结构名称*/
                    "width":"400px",
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "1",
                    "required": false,
                    "scale": "0",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "dataType",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000115'],/* 国际化处理： 类型*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "2",
                    "required": false,
                    "scale": "0",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "length",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000116'],/* 国际化处理： 长度*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "3",
                    "required": false,
                    "scale": "0",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "refModelName",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "input",
                    "label": $appRoot && $appRoot.state.json['public_lang-000117'],/* 国际化处理： 参照*/
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "4",
                    "required": false,
                    "scale": "0",
                    "visible": true
                },
                {
                    "hyperlinkflag": false,
                    "islock": false,
                    "istotal": false,
                    "width": "120px",
                    "attrcode": "search",
                    "color": "#555555",
                    "containlower": false,
                    "datatype": "1",
                    "disabled": false,
                    "editAfterFlag": false,
                    "fieldDisplayed": "refname",
                    "fieldValued": "refpk",
                    "isDataPowerEnable": true,
                    "isnotmeta": false,
                    "isResLabel": false,
                    "isrevise": false,
                    "isShowUnit": false,
                    "itemtype": "label",
                    "label": "",
                    "maxlength": "20",
                    "onlyLeafCanSelect": false,
                    "position": "4",
                    "required": false,
                    "scale": "0",
                    "visible": false
                }
            ],
            "moduletype": "table",
            "pagination": false,
            "position": "5",
            "code": "listEditMeta",
            "name": $appRoot && $appRoot.state.json['public_lang-000006'],/* 国际化处理： 虚拟大区*/
            "oid": "1001ZE1000000000RQGQ",
            "areaVisible": true,
            "isunfold": true,
            "isnotmeta": false,
            "appcode": "182001016A",
            "pagecode": "182001016A_list",
            "templateCode": "182001016A_list",
            "pageid": "1001ZE1000000000OZJ4"
        }
    }

}
