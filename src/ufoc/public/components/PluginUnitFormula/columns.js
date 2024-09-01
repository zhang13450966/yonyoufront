

export default function () {

    return {
        funDesc: {
            items: [
                {
                    itemtype: "label",
                    visible: true,
                    label: $appRoot && $appRoot.state.json['public_lang-000136'],/* 国际化处理： 参数名称*/
                    attrcode: "paramName",
                    width: "50%",
                },
                {
                    itemtype: "label",
                    visible: true,
                    label: $appRoot && $appRoot.state.json['public_lang-000137'],/* 国际化处理： 参数描述*/
                    attrcode: "paramDesc",
                    width: "50%",
                },
            ],
            moduletype: "table",
        },
         // 关键字模板
        "conditionsMeta":{
            "items":[
                {
                    "hyperlinkflag":false,
                    "islock":false,
                    "istotal":false,
                    "width":"120px",
                    "attrcode":"theLeftExpressionType",
                    "color":"#555555",
                    "containlower":false,
                    "datatype":"203",
                    "disabled":false,
                    "editAfterFlag":false,
                    "fieldDisplayed":"refname",
                    "fieldValued":"refpk",
                    "isDataPowerEnable":true,
                    "isnotmeta":false,
                    "isResLabel":false,
                    "isrevise":false,
                    "isShowUnit":false,
                    "itemtype":"select",
                    "label":$appRoot && $appRoot.state.json['public_lang-000138'],/* 国际化处理： 左表达式类型*/
                    "maxlength":"20",
                    "onlyLeafCanSelect":false,
                    "position":"1",
                    "required":false,
                    "scale":"0",
                    "visible":true,
                    options:[
                        {
                            "display": $appRoot && $appRoot.state.json['public_lang-000139'],/* 国际化处理： 字符串*/
                            "value": "1"
                        },
                        {
                            "display": $appRoot && $appRoot.state.json['public_lang-000140'],/* 国际化处理： 关键字条件*/
                            "value": "2"
                        },
                        {
                            "display": $appRoot && $appRoot.state.json['public_lang-000141'],/* 国际化处理： 函数示例参照*/
                            "value": "3"
                        }
                    ]
                },
                {
                    "hyperlinkflag":false,
                    "islock":false,
                    "istotal":false,
                    "width":"120px",
                    "attrcode":"theLeftExpressionValue",
                    "color":"#555555",
                    "containlower":false,
                    "datatype":"204",
                    "disabled":false,
                    "editAfterFlag":false,
                    "fieldDisplayed":"refcode/refname",
                    "fieldValued":"refpk",
                    "isDataPowerEnable":true,
                    "isnotmeta":false,
                    "isResLabel":false,
                    "isrevise":false,
                    "isShowUnit":false,
                    "itemtype":"refer",
                    "label":$appRoot && $appRoot.state.json['public_lang-000142'],/* 国际化处理： 左表达式值*/
                    "maxlength":"20",
                    "metadataProperty":$appRoot && $appRoot.state.json['public_lang-000143'],/* 国际化处理： ufoe.关键字组合.code+name*/
                    "onlyLeafCanSelect":false,
                    "position":"2",
                    "refcode":"ufoe/refer/inner/KeywordRef/index",
                    "required":false,
                    "scale":"0",
                    "visible":true
                },
                {
                    "hyperlinkflag":false,
                    "islock":false,
                    "istotal":false,
                    "width":"120px",
                    "attrcode":"operator",
                    "color":"#555555",
                    "containlower":false,
                    "datatype":"1",
                    "disabled":false,
                    "editAfterFlag":false,
                    "fieldDisplayed":"refname",
                    "fieldValued":"refpk",
                    "isDataPowerEnable":true,
                    "isnotmeta":false,
                    "isResLabel":false,
                    "isrevise":false,
                    "isShowUnit":false,
                    "itemtype":"input",
                    "label":$appRoot && $appRoot.state.json['public_lang-000072'],/* 国际化处理： 操作符*/
                    "maxlength":"20",
                    "onlyLeafCanSelect":false,
                    "position":"3",
                    "required":false,
                    "scale":"0",
                    "visible":true
                },
                {
                    "hyperlinkflag":false,
                    "islock":false,
                    "istotal":false,
                    "width":"120px",
                    "attrcode":"theRightExpressionType",
                    "color":"#555555",
                    "containlower":false,
                    "datatype":"203",
                    "disabled":false,
                    "editAfterFlag":false,
                    "fieldDisplayed":"refname",
                    "fieldValued":"refpk",
                    "isDataPowerEnable":true,
                    "isnotmeta":false,
                    "isResLabel":false,
                    "isrevise":false,
                    "isShowUnit":false,
                    "itemtype":"select",
                    "label":$appRoot && $appRoot.state.json['public_lang-000144'],/* 国际化处理： 右表达式类型*/
                    "maxlength":"20",
                    "onlyLeafCanSelect":false,
                    "position":"4",
                    "required":false,
                    "scale":"0",
                    "visible":true,
                    options:[
                        {
                            "display": $appRoot && $appRoot.state.json['public_lang-000139'],/* 国际化处理： 字符串*/
                            "value": "1"
                        },
                        {
                            "display": $appRoot && $appRoot.state.json['public_lang-000141'],/* 国际化处理： 函数示例参照*/
                            "value": "2"
                        }
                    ]
                },
                {
                    "hyperlinkflag":false,
                    "islock":false,
                    "istotal":false,
                    "width":"120px",
                    "attrcode":"theRightExpressionValue",
                    "color":"#555555",
                    "containlower":false,
                    "datatype":"1",
                    "disabled":false,
                    "editAfterFlag":false,
                    "fieldDisplayed":"refname",
                    "fieldValued":"refpk",
                    "isDataPowerEnable":true,
                    "isnotmeta":false,
                    "isResLabel":false,
                    "isrevise":false,
                    "isShowUnit":false,
                    "itemtype":"input",
                    "label":$appRoot && $appRoot.state.json['public_lang-000145'],/* 国际化处理： 右表达式值*/
                    "maxlength":"20",
                    "onlyLeafCanSelect":false,
                    "position":"5",
                    "required":false,
                    "scale":"0",
                    "visible":true
                }
            ],
            "moduletype":"table",
            "pagination":false,
            "position":"3",
            "code":"conditionsMeta",
            "name":$appRoot && $appRoot.state.json['public_lang-000037'],/* 国际化处理： 条件参数*/
            "oid":"1001ZE10000000003LMU",
            "areaVisible":true,
            "isunfold":true,
            "isnotmeta":false
        }
    };
}

