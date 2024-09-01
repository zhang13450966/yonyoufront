import { PAGECODE, PAGEAREA, BUTTONS, BUTTONAREA, URL } from '../constance';
import { buttonController } from '../viewController';
import { commonSearch, btnClick } from '../btnClicks';
import { ajax } from 'nc-lightapp-front';
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
					props.meta.setMeta(meta);
					// , initPage.bind(this));
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					buttonController.call(this, this.props);
				}
				//如果有主组织的时候设值主组织默认值
				if (data.context.pk_org) {
					let pk_org = {
						display: data.context.org_Name,
						value: data.context.pk_org
					};
					this.setState(
						{
							pk_org
						},
						() => {
							commonSearch.call(this, this.props);
						}
					);
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
		label: getLangByResId(this, '4001PACKTYPE-000011') /* 国际化处理： 操作*/,
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
	//修改包装箱类型页面长、宽、高、容积、载重等列字段名称
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
