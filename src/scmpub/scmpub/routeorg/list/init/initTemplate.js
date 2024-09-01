/*
 * @Author: 王勇 
 * @PageInfo: 列表-模版初始化  
 * @Date: 2020-01-17 09:52:43 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-08 15:45:09
 */
import { APPINFO, TEMPLATEINFO, BUTTONINFO, VIEWINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import { innerBtnClicks } from '../btnClicks/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

import referEvent from '../events/referEvent';
import {FILED} from "../../../vehicle/constance";
export default function(props, callback) {
	props.createUIDom(
		{
			pagecode: APPINFO.pageCode //页面编码
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					// props.button.setPopContent(BUTTONINFO.copyBtnCode,getLangByResId(this, '4001ROUTE-000046')/**确认要复制吗？ */);
					props.button.setPopContent(
						BUTTONINFO.delBtnCode,
						getLangByResId(this, '4001ROUTE-000041') /**确认要删除吗？ */
					);

					props.button.setPopContent(
						FILED.StartUse,
						getLangByResId(this, '4001ROUTE-000051')
					); /* 国际化处理：确定要启用吗? */
					props.button.setPopContent(
						FILED.StopUse,
						getLangByResId(this, '4001ROUTE-000052')
					); /* 国际化处理：确定要停用吗?*/

				}
				if (data.template) {
					let template = data.template;
					//分页
					template[TEMPLATEINFO.listAreaCode].pagination = true;
					//添加列表 操作按钮
					template = modifier.call(this, props, template);
					referEvent.call(this, props, template);
					props.meta.setMeta(template);
					if (props.getUrlParam('queryFlag')) {
						this.setState({ queryFlag: true });
					}
					buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
					props.table.selectAllRows(TEMPLATEINFO.listAreaCode, false);
					callback && callback(props);
				}
				//如果有主组织的时候设值主组织默认值
				if (data.context.pk_org) {
					this.pkorg = data.context.pk_org;
					this.pkorg_name = data.context.org_Name;
					this.pkorg_v = data.context.pk_org_v;
					this.pkorg_v_name = data.context.org_v_Name;
				}
			}
		}
	);
}

function modifier(props, template) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001ROUTE-000028') /**操作 */,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = buttongroups.call(this, record);
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONINFO.innerAreaCode,
				buttonLimit: 3,
				// onButtonClick: onButtonClicks.bind(this),
				onButtonClick: innerBtnClicks.bind(this, record, index)
				// onButtonClick: onButtonClicks.bind(this,props,btncode,index),
			});
		}
	};
	template[TEMPLATEINFO.listAreaCode].items.push(event);
	return template;
}

function buttongroups(record) {
	if (record['pk_group'].value === record['pk_org'].value) {
		return [];
	} else if (record.bsealflag.value) {
		return [ BUTTONINFO.editBtnCode, BUTTONINFO.delBtnCode, BUTTONINFO.copyBtnCode, BUTTONINFO.StartUse ];
	} else {
		return [ BUTTONINFO.editBtnCode, BUTTONINFO.delBtnCode, BUTTONINFO.copyBtnCode, BUTTONINFO.StopUse ];
	}
}

function getFieldValue2Arr(props, code) {
	let data = props.search.getSearchValByField(PAGECODE.searchId, code);
	data = ((data && data.value && data.value.firstvalue) || '').split(',');
	let length = data.length;
	if (length > 1) {
		return {};
	}
	return data;
}
