/*
 * @Author: lichao 
 * @PageInfo: 模板加载  
 * @Date: 2019-03-12 15:59:43 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2021-10-12 18:01:21
 */
import { buttonClick } from '../btnClicks';
import { PAGECODE, AREACODE, BUTTONAREACODE, STATUS, BUTTONS, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { viewController } from '../viewController';
import { ajax } from 'nc-lightapp-front';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setPopContent(
						BUTTONS.Delete,
						getLangByResId(this, '4001DEALFASHION-000006')
					); /* 国际化处理： 确定要删除吗？*/
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, initTableData.call(this, props));
				}
			}
		}
	);
}
function initTableData(props) {
	ajax({
		url: URL.query,
		data: PAGECODE,
		success: (res) => {
			if (res.success) {
				let rows = [];
				if (res.data) rows = res.data[AREACODE].rows;
				props.editTable.setTableData(AREACODE, { rows });
				viewController.call(this, props, STATUS.browse);
			}
		}
	});
}
/**
 * 列表数据后处理修饰
 * @param  meta 
 * @param {*} props 
 */
function modifierMeta(props, meta) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001DEALFASHION-000007') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTONS.Delete ];
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREACODE.listInner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index),
				ignoreHotkeyCode: getListDisableHotKeyBtn()
			});
		}
	};
	meta[AREACODE].items.push(event);
}
