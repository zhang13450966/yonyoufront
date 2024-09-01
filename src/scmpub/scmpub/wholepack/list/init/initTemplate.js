/*
 * @Author: zhngzh 
 * @Date: 2019-05-08 09:19:09 
 * @Last Modified by: zhaopym
 * @Last Modified time: 2019-07-09 15:20:48
 */
import { PAGECODE, PAGEAREA, UISTATE, BUTTONS, BUTTONAREA, FIELDS } from '../constance';
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
				console.log(data);
				if (data.template) {
					let meta = data.template;
					meta = modifier.call(this, props, meta);
					props.meta.setMeta(meta);
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

//增加操作列
function modifier(props, meta) {
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001WHOLEPACK-000011'),/* 国际化处理： 操作*/
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
	meta[PAGEAREA.list].items.forEach((item) => {
		if (item.attrcode == FIELDS.cpacktypeid) {
			//按组织过滤
			item.queryCondition = () => {
				let data = this.state.pk_org.value;
				let returnData = {};
				if (data) {
					returnData.pk_org = data;
				}
				return returnData;
			};
		}
	});
	return meta;
}
