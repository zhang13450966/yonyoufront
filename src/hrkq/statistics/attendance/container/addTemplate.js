import {formatDate} from 'src/hrpub/common/utils/utils.js';
import React from "react";

export default function addTemplate(template, lang, button = []) {

    let tempBtn = {
        "id": "1002Z710000000000RKX",
        "type": "dropdown",
        "key": "import",
        "title": lang['hrkq-0000084'],
        "area": "import_head",
        "visible": "1",
        "iskeyfunc": false,
        "btncolor": "button_main",
        "isenable": true,
        "order": "3",
        "children": [
            {
                "id": "1002Z710000000000RKY",
                "type": "general_btn",
                "key": "link1",
                "area": "import_head",
                "visible": "1",
                "iskeyfunc": false,
                "btncolor": "button_secondary",
                "isenable": true,
                "order": "4",
                "parentCode": "import",
                "children": [
                    {
                        "id": "1002Z710000000000RKZ",
                        "type": "general_btn",
                        "key": "import2",
                        "title": lang['hrkq-0000086'],
                        "area": "head",
                        "visible": "1",
                        "iskeyfunc": false,
                        "btncolor": "button_secondary",
                        "isenable": true,
                        "order": "5",
                        "parentCode": "link1",
                        "children": []
                    },
                    {
                        "id": "1002Z710000000000RL0",
                        "type": "general_btn",
                        "key": "import3",
                        "title": lang['hrkq-0000087'],
                        "area": "import_head",
                        "visible": "1",
                        "iskeyfunc": false,
                        "btncolor": "button_secondary",
                        "isenable": true,
                        "order": "6",
                        "parentCode": "link1",
                        "children": []
                    }
                ]
            }
        ]
    }

    button = button.concat(tempBtn);

    template['details_list'] = {
        "moduletype": "table",
        "pagination": false,
        "code": "details_list",
        "name": "综合明细列表",
        "oid": "100DZ710000000001HMC",
        items: [
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'staffCode',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000018'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "fixed": "left"
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'staffName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000014'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "fixed": "left"
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'deptName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000012'],
                "maxlength": "40",
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
                "width": "160px",
                "attrcode": 'signtime',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000022'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = row.values['signtime'] && row.values['signtime'].value
                    return (<span>{formatDate(val, ' ', 'm-d-h-m')}</span>);
                }
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "200px",
                "attrcode": 'placeName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000023'],
                "maxlength": "40",
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
                "width": "360px",
                "attrcode": 'addressDetail',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000021'],
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = row.values['addressDetail'] && row.values['addressDetail'].value
                    return (<div className="txt-elips">{val}</div>);
                }
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'isoutside',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000024'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = row.values['isoutside'] && row.values['isoutside'].value
                    return (<span>{(function (val, row, index) {
                        if (row.values['signType'] && row.values['signType'].value == 1) {
                            // 0 1都为内勤
                            switch (row.values['attendanceType'] && row.values['attendanceType'].value) {
                                // 0 GPS
                                case '0':
                                    return lang['hrkq-0000069']
                                // 1 WIFI
                                case '1':
                                    return lang['hrkq-0000069']
                                // 2 外勤
                                case '2':
                                    return lang['hrkq-0000068']
                                // 3 补考勤
                                case '3':
                                    return lang['hrkq-0000070']
                            }
                        }
                        // 导入
                        if (row.values['signType'] && row.values['signType'].value == 2) {
                            return lang['hrkq-0000071']
                        }
                        // 考勤机
                        if (row.values['signType'] && row.values['signType'].value == 3) {
                            return lang['hrkq-0000072']
                        }
                        // 导入
                        if (row.values['signType'] && row.values['signType'].value == 5) {
                            return lang["hrkq-0000100"] /*多语: 新增*/
                        }
                    })(val, row, index)}</span>);
                }
            }]
    }

    template['details_card'] = {
        "moduletype": "form",
        "pagination": false,
        "code": "details_card",
        "name": lang['hrkq-0000134'],
        "oid": "100DZ710000000001HME",
        items: [
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'staffCode',
                "color": "#6E6E77",
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
                "isShowUnit": true,
                "itemtype": "refer",
                "label": lang['hrkq-0000014'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": true,
                "scale": "0",
                "visible": true,
                "fixed": "left",
                "refcode": "uapbd/refer/psninfo/PsndocTreeGridRef/index",
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = row.staffName && row.staffName.display
                    return (<span>{val}</span>);
                }
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "160px",
                "attrcode": 'signtime',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": false,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "datetimepicker",
                "label": lang['hrkq-0000022'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": true,
                "scale": "0",
                "visible": true,
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = text.value
                    return (<span>{dateFormat(val, 'YYYY-MM-dd hh:mm:ss')}</span>);
                }
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "200px",
                "attrcode": 'placeName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": false,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000023'],
                "maxlength": "40",
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
                "width": "360px",
                "maxlength": 100,
                "attrcode": 'addressDetail',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": false,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000021'],
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true
            }]
    }

    template['abnormal_list'] = {
        "moduletype": "table",
        "pagination": false,
        "code": "abnormal_list",
        "name": "异常打卡列表",
        "oid": "100DZ710000000001HMD",
        items: [
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'staffCode',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000018'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "fixed": "left"
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'staffName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000014'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "fixed": "left"
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'deptName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000012'],
                "maxlength": "40",
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
                "width": "160px",
                "attrcode": 'signtime',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000019'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true,
                "renderStatus": "browse",
                "render": (text, row, index) => {
                    let val = row.values['signtime'] && row.values['signtime'].value
                    return (<span>{formatDate(val, ' ', 'm-d-h-m')}</span>);
                }
            },
            {
                "hyperlinkflag": false,
                "islock": false,
                "istotal": false,
                "width": "120px",
                "attrcode": 'placeName',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000020'],
                "maxlength": "40",
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
                "width": "360px",
                "attrcode": 'addressDetail',
                "color": "#6E6E77",
                "containlower": false,
                "datatype": "1",
                "disabled": true,
                "editAfterFlag": false,
                "fieldDisplayed": "refcode",
                "fieldValued": "refpk",
                "isDataPowerEnable": true,
                "isnotmeta": false,
                "isResLabel": false,
                "isrevise": false,
                "isShowUnit": false,
                "itemtype": "input",
                "label": lang['hrkq-0000021'],
                "maxlength": "40",
                "onlyLeafCanSelect": false,
                "position": "1",
                "required": false,
                "scale": "0",
                "visible": true
            }]
    }

    return button;
}

const dateFormat = (date, format, locale) => {
    if (date === null || date === undefined) return '';
    if (isNaN(Number(date))) return date;
    date = new Date(Number(date));
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    };
    if (/(Y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return format;
};