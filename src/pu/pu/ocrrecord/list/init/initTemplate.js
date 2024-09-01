/*
 * @Author: zhangbfk 
 * @PageInfo: 模板初始化  
 * @Date: 2018-04-26 20:48:12 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:39:55
 */

import { btnClick } from '../btnClicks';
import { PAGECODE, AREA, UISTATE, BUTTONID, BUTTONSTATE } from '../../constance';
import referFilter from '../referFilter';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { btnVisibleCtrl, buttonCntrol } from '../init/btnEnable';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				buttonCntrol.call(this, BUTTONSTATE.INIT, true);
				btnVisibleCtrl.call(this, UISTATE.browse);
				this.popContentShow(props, UISTATE.browse);
			}
		}
	);
}

function modifierMeta(props, meta) {
	//设置浏览态
	meta[AREA.tableArea].status = UISTATE.browse;
	let op = {
		label: getLangByResId(this, '2014BEGINVARIANCE-000012') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [ 'Delete' ];
			return props.button.createOprationButton(buttonAry, {
				area: 'list_inner',
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClick.call(this, props, key, text, record, index)
			});
		}
	};
	meta[AREA.tableArea].items.push(op);
	meta[AREA.searchArea].items.map((item, key) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
	});
	// referFilter.call(this, meta);
	return meta;
}
