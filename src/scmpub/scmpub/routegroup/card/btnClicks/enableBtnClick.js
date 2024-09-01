/*
 * @Author: 王勇 
 * @PageInfo: 卡片-启用运输路线  
 * @Date: 2020-01-17 09:36:57 
 * @Last Modified by: jiangzls
 * @Last Modified time: 2020-12-29 15:03:35
 */
import { ajax } from 'nc-lightapp-front';
import { CARDTEMPLATEINFO, ROUTEVOINFO, REQUESTURL, CARDBUTTONINFO } from '../../const/index';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function enableBtnClick(props) {
	const title = getLangByResId(this, '4001ROUTE-000039'); /**启用 */
	const content = getLangByResId(this, '4001ROUTE-000040'); /**启用用所选数据？ */

	showWarningDialog(title, content, {
		beSureBtnClick: beSureBtnClick.bind(this, props)
	});
}

function beSureBtnClick(props) {
	let pks = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid).value;
	let data = {
		pk_routes: pks,
		node: 'group',
		enable: 'true'
	};

	ajax({
		url: REQUESTURL.enableChangeRouteUrl,
		data: data,
		success: (res) => {
			showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000017')); /* 启用成功！*/
			props.form.setFormItemsValue(CARDTEMPLATEINFO.headAreaCode, {
				[ROUTEVOINFO.bsealflag]: {
					value: false,
					display: null
				}
			});
			props.button.setButtonsVisible(CARDBUTTONINFO.disableBtnCode, true);
			props.button.setButtonsVisible(CARDBUTTONINFO.enableBtnCode, false);
			props.button.setDisabled(CARDBUTTONINFO.disableBtnCode, false);
			props.button.setDisabled(CARDBUTTONINFO.enableBtnCode, true);
		}
	});
}
