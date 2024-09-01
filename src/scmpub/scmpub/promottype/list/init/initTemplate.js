import { PAGECODE } from '../constance';
import { AREA, BTNID } from '../constance/index';
import { commonSearch, btnClick } from '../btnClicks';
import { viewController } from '../viewController/index';
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
			viewController.call(this, props);
		}
	);
}

function initPage() {
	commonSearch.call(this, this.props);
}

// 对默认方法中，功能扩充
function modifier(props, meta) {
	//添加操作列
	meta[AREA.tableArea].items.push({
		attrcode: 'opr',
		label: getLangByResId(this, '4001PROMOTTYPE-000005') /* 国际化处理： 操作*/,
		width: 140,
		visible: true,
		fixed: 'right',
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry = [ BTNID.del ];
			return props.button.createOprationButton(buttonAry, {
				area: AREA.list_inner,
				buttonLimit: 2,
				onButtonClick: (props, key) => btnClick.call(this, props, key, record, index)
			});
		}
	});
	return meta;
}
