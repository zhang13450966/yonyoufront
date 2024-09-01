/*
 * @Author: wangceb 
 * @PageInfo: 单据模板js 
 * @Date: 2018-04-12 10:55:42 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:12:47
 */
import { SPLITPRINT_CONST } from '../const';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';

export default function(props) {
	const templet = {
		code: SPLITPRINT_CONST.TABLEID,
		name: getLangByResId(this, '4001SPLITPRINTING-000003') /* 国际化处理： 分单打印依据模板*/,
		[SPLITPRINT_CONST.TABLEID]: {
			items: [
				{
					width: null,
					attrcode: 'dataItemKey',
					disabled: true,
					itemtype: 'input',
					label: getLangByResId(this, '4001SPLITPRINTING-000004') /* 国际化处理： 数据项key*/,
					max: null,
					maxlength: '20',
					visible: false
				},
				{
					width: null,
					attrcode: 'type',
					disabled: true,
					itemtype: 'input',
					label: getLangByResId(this, '4001SPLITPRINTING-000005') /* 国际化处理： 类型*/,
					max: null,
					maxlength: '20',
					visible: false
				},
				{
					width: null,
					attrcode: 'dataItem',
					disabled: true,
					itemtype: 'input',
					label: getLangByResId(this, '4001SPLITPRINTING-000006') /* 国际化处理： 数据项*/,
					max: null,
					maxlength: '20',
					visible: true
				},
				{
					width: null,
					attrcode: 'values',
					disabled: false,
					itemtype: 'number',
					label: getLangByResId(this, '4001SPLITPRINTING-000007') /* 国际化处理： 时距取值*/,
					max: null,
					maxlength: '20',
					visible: true
				},
				{
					width: null,
					attrcode: 'isSplit',
					disabled: false,
					itemtype: 'checkbox_switch',
					label: getLangByResId(this, '4001SPLITPRINTING-000008') /* 国际化处理： 是否作为分单依据*/,
					max: null,
					maxlength: '20',
					visible: true
				},
				{
					width: null,
					attrcode: 'isHeadPos',
					disabled: true,
					itemtype: 'checkbox_switch',
					label: getLangByResId(this, '4001SPLITPRINTING-000009') /* 国际化处理： 是否表头*/,
					max: null,
					maxlength: '20',
					visible: false
				}
			],
			moduletype: 'table',
			pagination: false,
			code: SPLITPRINT_CONST.TABLEID,
			name: getLangByResId(this, '4001SPLITPRINTING-000003') /* 国际化处理： 分单打印依据模板*/
		}
	};
	props.meta.setMeta(templet, initData.bind(this));
}

//请求列表数据
function initData() {
	let showdata = null;
	if (this.props.data.params == undefined || this.props.data.params == null) {
		showdata = { rows: [] };
	} else {
		showdata = this.props.data.params[SPLITPRINT_CONST.TABLEID];
	}
	this.props.editTable.setStatus(SPLITPRINT_CONST.TABLEID, 'edit');
	this.props.editTable.setTableData(SPLITPRINT_CONST.TABLEID, showdata);
}
