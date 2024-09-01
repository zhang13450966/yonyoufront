/*
 * @Author: 王勇 
 * @PageInfo: 卡片-模版初始化  
 * @Date: 2020-01-17 09:42:03 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:06:59
 */

import { CARDTEMPLATEINFO, CARDBUTTONINFO } from '../../const/index';
import { innerBtnClicks } from '../btnClicks/index';
import { base } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCSwitch } = base;
export default function(props, status, callback = () => {}) {
	props.createUIDom(
		{
			pagecode: CARDTEMPLATEINFO.templateCode //页面编码
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let template = data.template;
					//添加列表 操作按钮
					template = modifier.call(this, props, template);
					props.meta.setMeta(template);
					callback && callback(props);
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
			let buttonAry = [ CARDBUTTONINFO.innerDelLineBtnCode ];
			return props.button.createOprationButton(buttonAry, {
				area: CARDBUTTONINFO.cardAreaCode,
				buttonLimit: 3,
				onButtonClick: (props, key) => innerBtnClicks.call(this, props, key, text, record, index)
			});
		}
	};

	template[CARDTEMPLATEINFO.bodyAreaCode].items.push(event);
	return template;
}
