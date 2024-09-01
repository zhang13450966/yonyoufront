/*
 * @Author: gaoxiaoqiang 
 * @PageInfo: 卡片初始化模板 
 * @Date: 2019-04-18 10:25:15 
 * @Last Modified by: qishy
 * @Last Modified time: 2020-07-27 09:13:32
 */
import { TARGETBILL_CONST, BUTTON_AREA, BUTTONS, FIELD, CARD_BODY_INNER_BUTTONS } from '../../const';
import { getCardDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil.js';
import { getLangByResId } from '../../../pub/tool/multiLangUtil';
import { getDefData, setDefData } from '../../../pub/cache';
import { referEvent } from '../events';
import { deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import buttonController from '../viewController/buttonController';
import operate_buttonClick from '../btnClicks/operate_buttonClick';
let tableId = TARGETBILL_CONST.tableId;
let pagecode = TARGETBILL_CONST.cardPageId;
export default function (props) {
	props.createUIDom(
		{
			pagecode: pagecode //卡片页面编码
		},
		(data) => {
			if (data) {
				//个性化设置组织放到缓存中
				if (data.context.org_Name && data.context.pk_org) {
					let org = {
						display: data.context.org_Name,
						value: data.context.pk_org
					};
					setDefData(TARGETBILL_CONST.TargetBillCacheKey, FIELD.pk_org, org);
				}

				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([BUTTON_AREA.Card_Head, BUTTON_AREA.Card_Body]);
					props.button.setUploadConfig(BUTTONS.IMPORTEXCEL, {});
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					this.meta = deepClone(meta);
					props.meta.setMeta(meta);
					props.setUrlParam({
						status: TARGETBILL_CONST.browse
					});
					props.form.setFormStatus(TARGETBILL_CONST.formId, TARGETBILL_CONST.edit);
					//新增态销售组织默认值
					let pk_orgCache = getDefData(TARGETBILL_CONST.TargetBillCacheKey, FIELD.pk_org);
					if (
						pk_orgCache &&
						pk_orgCache.value &&
						pk_orgCache.display &&
						!props.form.getFormItemsValue(TARGETBILL_CONST.formId, FIELD.pk_org).value
					) {
						props.form.setFormItemsValue(TARGETBILL_CONST.formId, {
							pk_org: { value: pk_orgCache.value, display: pk_orgCache.display }
						});
					}
					// }
					buttonController.call(this);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	//处理参照过滤
	referEvent.call(this, props, meta);
	//添加表格操作列
	let porCol = {
		attrcode: 'opr',
		label: getLangByResId(this, '4001TARGETBILL-000006'),  /* 国际化处理： 操作*/
		itemtype: 'customer',
		fixed: 'right',
		width: '200px',
		visible: true,
		render: (text, record, index) => {
			let status = props.cardTable.getStatus(TARGETBILL_CONST.tableId);
			let showBtns = null;
			if (status === TARGETBILL_CONST.browse) {
				showBtns = CARD_BODY_INNER_BUTTONS.BROWSE;
			} else {
				showBtns = CARD_BODY_INNER_BUTTONS.EDIT;
			}
			return props.button.createOprationButton(CARD_BODY_INNER_BUTTONS.EDIT, {
				area: BUTTON_AREA.Card_Body_Inner,
				buttonLimit: 3,
				ignoreHotkeyCode: getCardDisableHotKeyBtn(),
				onButtonClick: (props, key) => operate_buttonClick.call(this, props, key, text, record, index)
			});
		}
	};
	meta[tableId].items.push(porCol);
	return meta;
}
