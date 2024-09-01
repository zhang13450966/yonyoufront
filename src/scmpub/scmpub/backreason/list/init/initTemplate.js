/*
 * @Author: zhngzh 
 * @Date: 2019-04-22 10:15:56 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2019-07-10 16:41:12
 */
import { PAGECODE, PAGEAREA, UISTATE, BUTTONS, BUTTONAREA } from '../constance';
import { commonSearch, btnClick } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifier.call(this, props, meta);
					props.meta.setMeta(meta, initPage.bind(this));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

function initPage() {
	commonSearch.call(this, this.props);
}

//增加操作列
function modifier(props, meta) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001BACKREASON-000010') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTONS.Delete ];
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClick.call(this, props, key, record, index, true)
			});
		}
	};
	meta[PAGEAREA.list].items.push(event);

	return meta;
}
