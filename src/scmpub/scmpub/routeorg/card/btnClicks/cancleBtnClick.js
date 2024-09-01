/*
 * @Author: 王勇 
 * @PageInfo: 卡片-取消按钮 
 * @Date: 2020-01-17 09:35:04 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-01 11:18:48
 */
import { CARDTEMPLATEINFO, ROUTEURL, VIEWINFO, REQUESTURL, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import groupButtonController from '../viewController/groupButtonController';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function cancleBtnClick(props) {
	const title = getLangByResId(this, '4001ROUTE-000042'); /**取消 */
	const content = getLangByResId(this, '4001ROUTE-000043'); /**确定要取消吗？ */

	showWarningDialog(title, content, {
		beSureBtnClick: beSureBtnClick.bind(this, props)
	});
}

function beSureBtnClick(props) {
	window.onbeforeunload = null; //关闭弹出框提示
	props.resMetaAfterPkorgEdit();
	let pk = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid);
	let pk_route = null;
	if (pk == null || pk.value == null) {
		pk_route = props.getUrlParam('id');
	} else {
		pk_route = pk.value;
	}
	if (pk_route == null || pk_route == '') {
		props.pushTo(ROUTEURL.List_URL, {});
		return;
	}
	let info = {
		pk_route: pk_route,
		pagecode: CARDTEMPLATEINFO.templateCode
	};
	ajax({
		url: REQUESTURL.loadRouteUrl,
		data: info,
		success: (res) => {
			if (res.data.carddata) {
				let tempData = res.data.carddata;
				props.form.setAllFormValue({
					[CARDTEMPLATEINFO.headAreaCode]: tempData.head[CARDTEMPLATEINFO.headAreaCode]
				});
				props.cardTable.setTableData(
					CARDTEMPLATEINFO.bodyAreaCode,
					tempData.body[CARDTEMPLATEINFO.bodyAreaCode],
					false
				);
				let pk_org = tempData.head[CARDTEMPLATEINFO.headAreaCode].rows[0].values.pk_org.display;
				if (pk_org !== null && pk_org !== ' ') {
					buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				} else {
					groupButtonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				}
			}
		}
	});
}
