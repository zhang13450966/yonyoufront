/* * @Author: lichaoah  
* @PageInfo:主组织编辑后   
* @Date: 2020-02-18 17:05:58  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-29 09:33:20
*/
import { ajax } from 'nc-lightapp-front';
import { setMainOrgEdit } from '../viewControl/viewController';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { createExtBillHeadAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import { processExtBillCardHeadEditResult } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';
import buttonController from '../viewControl/buttonController';
import headAfterEvent from './headAfterEvent';
import { TARGET_CARD } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function (props, moduleId, key, value, oldValue) {
	if (key === 'pk_org') {
		let pk_org_old = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.pk_org);
		// 主组织清空事件
		if (!value.value) {
			showWarningDialog(getLangByResId(this, '4001TARGET-000008'),/* 国际化处理： 确认修改*/
				getLangByResId(this, '4001TARGET-000009'), {/* 国际化处理： 是否清除发货组织，这样会清空您录入的信息？*/
				beSureBtnClick: doClear.bind(this),
				cancelBtnClick: () => {
					props.form.setFormItemsValue(TARGET_CARD.formId, {
						pk_org: { value: pk_org_old.value, display: pk_org_old.display }
					});
				}
			});
		} else if (value.value) {
			let cardData = createExtBillHeadAfterEventData(
				props,
				TARGET_CARD.cardpageid,
				TARGET_CARD.formId,
				[
					TARGET_CARD.target_org,
					TARGET_CARD.target_mar,
					TARGET_CARD.target_period,
					TARGET_CARD.target_item,
					TARGET_CARD.target_ratio
				],
				moduleId,
				key,
				value
			);
			if (oldValue && oldValue.value) {
				/* 国际化处理： 确认修改,是否修改发货组织，这样会清空您录入的信息？*/
				showWarningDialog(getLangByResId(this, '4001TARGET-000008'),/* 国际化处理： 确认修改*/
					getLangByResId(this, '4001TARGET-000009'), {/* 国际化处理：是否修改发货组织，这样会清空您录入的信息？*/
					beSureBtnClick: processOrgAfterEvent.bind(this, props, moduleId, key, value, cardData),
					cancelBtnClick: () => {
						props.form.setFormItemsValue(TARGET_CARD.formId, {
							pk_org: { value: pk_org_old.value, display: pk_org_old.display }
						});
					}
				});
			} else {
				processOrgAfterEvent.call(this, props, moduleId, key, value, cardData);
			}
		}
	}
}

function processOrgAfterEvent(props, moduleId, key, value, cardData) {
	ajax({
		url: TARGET_CARD.headAfterEventUrl,
		data: cardData,
		success: (res) => {
			processExtBillCardHeadEditResult(
				props,
				moduleId,
				[
					TARGET_CARD.target_org,
					TARGET_CARD.target_period,
					TARGET_CARD.target_mar,
					TARGET_CARD.target_item,
					TARGET_CARD.target_ratio
				],
				res.data
			);
			setMainOrgEdit.call(this, props);
			headAfterEvent(
				props,
				TARGET_CARD.formId,
				TARGET_CARD.fmarsetflag,
				props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.fmarsetflag)
			);
			//更新按钮状态
			buttonController.call(this, props, TARGET_CARD.edit);
		}
	});
}
function doClear(props, moduleId, key, oldValue) {
	setTimeout(() => {
		this.props.form.EmptyAllFormValue(TARGET_CARD.formId);
		this.props.cardTable.resetTableData(TARGET_CARD.target_org);
		this.props.cardTable.resetTableData(TARGET_CARD.target_period);
		this.props.cardTable.resetTableData(TARGET_CARD.target_mar);
		this.props.cardTable.resetTableData(TARGET_CARD.target_item);
		this.props.cardTable.resetTableData(TARGET_CARD.target_ratio);
		// 单据有主组织，新增时, 将其他字段设置为不可编辑
		this.props.initMetaByPkorg();

		this.props.form.setFormItemsValue(moduleId, { [key]: { value: oldValue.value, display: oldValue.display } });
	}, 0);
}
