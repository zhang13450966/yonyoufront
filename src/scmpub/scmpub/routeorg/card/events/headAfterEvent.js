/*
 * @Author: zhangflr 
 * @PageInfo: 表头编辑前事件  
 * @Date: 2020-09-08 10:04:09 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-16 16:00:24
 */

import innerAddLineBtnClick from '../btnClicks/innerAddLineBtnClick';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { ROUTEVOINFO, CARDTEMPLATEINFO, CARDBUTTONINFO, REQUESTURL } from '../../const/index';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function headAfterEvent(props, moduleId, key, value, changedrows, i) {
	if (key == ROUTEVOINFO.pk_org_v) {
		// props.resMetaAfterPkorgEdit(ROUTEVOINFO.pk_org_v);
		props.cardTable.setColEditableByKey(
			CARDTEMPLATEINFO.bodyAreaCode,
			[ ROUTEVOINFO.caddrdocid, ROUTEVOINFO.space, ROUTEVOINFO.nmileage ],
			false
		);
		props.button.setButtonVisible(CARDBUTTONINFO.innerAddLineBtnCode, true);
		props.button.setButtonVisible(CARDBUTTONINFO.delLineBtnCode, true);
		if (changedrows && changedrows.value) {
			if (value && value.value) {
				orgChangeDeal.call(this, props, changedrows, value);
			} else if (value && !value.value) {
				btnStatusController.call(this, props, changedrows, value);
			}
		} else {
			if (value && value.value) {
				beSureBtnClick.call(this, props, false, value);
			} else if (value && !value.value) {
				return;
			}
		}
	}
}

function orgChangeDeal(props, changedrows, value) {
	const title = getLangByResId(this, '4001ROUTE-000029'); /**确认修改 */
	const content = getLangByResId(this, '4001ROUTE-000030'); /**是否修改组织，这样会清空您录入的信息？ */
	showWarningDialog(title, content, {
		beSureBtnClick: beSureBtnClick.bind(this, props, false, value),
		cancelBtnClick: cancelBtnClick.bind(this, props, changedrows)
	});
}

function btnStatusController(props, changedrows, value) {
	const title = getLangByResId(this, '4001ROUTE-000029'); /**确认修改 */
	const content = getLangByResId(this, '4001ROUTE-000030'); /**是否修改组织，这样会清空您录入的信息？ */
	showWarningDialog(title, content, {
		beSureBtnClick: beSureBtnClick.bind(this, props, true, value),
		cancelBtnClick: cancelBtnClick.bind(this, props, changedrows)
	});
}

function beSureBtnClick(props, flag, value) {
	props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
	props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });

	if (flag) {
		props.initMetaByPkorg(ROUTEVOINFO.pk_org_v);
		props.button.setButtonVisible(CARDBUTTONINFO.innerAddLineBtnCode, false);
	} else {
		props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
			[ROUTEVOINFO.pk_org_v]: { value: value.value, display: value.display }
		});
		if (value.values) {
			props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
				[ROUTEVOINFO.pk_org]: { value: value.values.pk_trafficorg.value, display: value.values.name.value }
			});
			this.current_org = { value: value.values.pk_trafficorg.value, display: value.values.name.value };
		} else {
			props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
				[ROUTEVOINFO.pk_org]: { value: null, display: null }
			});
			this.current_org = { value: null, display: null };
		}
		props.resMetaAfterPkorgEdit(ROUTEVOINFO.pk_org_v);
		innerAddLineBtnClick.call(this, props);
	}
}

function cancelBtnClick(props, changedrows) {
	//取消时设置pk_org_v
	props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
		[ROUTEVOINFO.pk_org_v]: { value: changedrows.value, display: changedrows.display },
		[ROUTEVOINFO.pk_org]: { value: this.current_org.value, display: this.current_org.display }
	});
}
