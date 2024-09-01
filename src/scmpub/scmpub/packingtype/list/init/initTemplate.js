/*
 * @Author: zhngzh 
 * @Date: 2019-05-08 09:17:47 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 11:03:42
 */
import { PAGECODE, PAGEAREA, BUTTONS, BUTTONAREA, URL } from '../constance';
import { ajax } from 'nc-lightapp-front';
import { buttonController } from '../viewController';
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
					buttonController.call(this, this.props);
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
		label: getLangByResId(this, '4001PACKINGTYPE-000010') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer',
		fixed: 'right',
		width: '100px',
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
	//修改包装分类页面长、宽、高、容积、载重等列字段名称
	metaUiData(meta);
	return meta;
}

function metaUiData(meta) {
	ajax({
		url: URL.uidata,
		async: false,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data) {
					meta[PAGEAREA.list].items.forEach((item) => {
						if (item.attrcode == 'nvolumn') {
							item.label = item.label + '(' + data.V + ')';
						} else if (
							item.attrcode == 'nlength' ||
							item.attrcode == 'nwidth' ||
							item.attrcode == 'nheight'
						) {
							item.label = item.label + '(' + data.L + ')';
						}
					});
				}
			}
		}
	});
}
