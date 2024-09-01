/*
 * @Author: lichao 
 * @PageInfo: 模板处理  
 * @Date: 2019-03-12 16:07:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-23 09:53:53
 */
import { buttonClick } from '../btnClicks';
import { PAGECODE, FIELD, AREACODE, BUTTONAREACODE, BUTTONS, STATUS } from '../../constance';
import { setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { viewController } from '../viewController';

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
					props.button.setButtonDisabled([ BUTTONS.Print, BUTTONS.Delete, BUTTONS.Output ], true);
					props.button.setPopContent(BUTTONS.HeadDelLine, getLangByResId(this, '4001CENPURULE-000007'));/* 国际化处理： 确定要删除吗？*/
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						viewController.call(this, props, STATUS.browse);
					});
				}
			}
		}
	);
}
/**
 * 列表数据后处理修饰
 * @param  meta 
 * @param {*} props 
 */
function modifierMeta(props, meta) {
	meta[AREACODE.listBody].items.map((item) => {
		setRefShowDisabledData(item);
		if (item.attrcode === FIELD.pk_ctrlorg) {
			item.isMultiSelectedEnabled = true;
		}
	});
	meta[AREACODE.search].items.map((item) => {
		setRefShowDisabledData(item);
		if (item.attrcode === FIELD.ctrantypeid) {
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				return { parentbilltype: 'Z2' };
			};
		}
	});
	//添加表格操作列
	let event = {
		label: getLangByResId(this, '4001CENPURULE-000008'),/* 国际化处理： 操作*/
		attrcode: 'headopr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTONS.Edit, BUTTONS.HeadDelLine ];
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREACODE.headInner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index)
				//ignoreHotkeyCode: [ BUTTONS.DelLine ]
			});
		}
	};
	meta[AREACODE.listHead].items.push(event);
	let event1 = {
		label: getLangByResId(this, '4001CENPURULE-000008'),/* 国际化处理： 操作*/
		attrcode: 'bodyopr',
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let buttonAry = [ BUTTONS.BodyDelLine1, BUTTONS.AddLine1 ];
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREACODE.bodyInner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index)
				//ignoreHotkeyCode: [ BUTTONS.DelLine ]
			});
		}
	};
	meta[AREACODE.listBody].items.push(event1);
}
