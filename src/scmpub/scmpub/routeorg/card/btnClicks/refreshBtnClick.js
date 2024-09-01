/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线刷新
 * @Date: 2020-01-17 09:40:25 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-09 17:21:47
 */
import { CARDTEMPLATEINFO, VIEWINFO, REQUESTURL, ROUTEVOINFO, CARDBUTTONINFO } from '../../const/index';
import { buttonController, groupButtonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showErrorInfo } from '../../../pub/tool/messageUtil';
import { ajax } from 'nc-lightapp-front';
export default function refreshBtnClick(props) {
	let pk = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid).value;
	let info = {
		pk_route: pk,
		pagecode: CARDTEMPLATEINFO.templateCode
	};
	ajax({
		url: REQUESTURL.loadRouteUrl,
		data: info,
		success: (res) => {
			if (res.data.carddata === undefined || res.data.carddata == null) {
				showErrorInfo(null, getLangByResId(this, '4001ROUTE-000032')); /* 国际化处理： 数据已经被删除，请返回列表界面！*/
				//清空----
				props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
				props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });
				setTimeout(() => {
					props.button.setButtonsVisible({
						[CARDBUTTONINFO.saveBtnCode]: false,
						[CARDBUTTONINFO.cancelBtnCode]: false,
						[CARDBUTTONINFO.innerAddLineBtnCode]: false
					});
					props.button.setDisabled({
						[CARDBUTTONINFO.enableBtnCode]: true,
						[CARDBUTTONINFO.disableBtnCode]: true,
						[CARDBUTTONINFO.editBtnCode]: true,
						[CARDBUTTONINFO.printBtnCode]: true,
						[CARDBUTTONINFO.outputBtnCode]: true,
						[CARDBUTTONINFO.refreshBtnCode]: true,
						[CARDBUTTONINFO.copyBtnCode]: true,
						[CARDBUTTONINFO.delBtnCode]: true,
						[CARDBUTTONINFO.addBtnCode]: false
					});
				}, 0);
			} else if (res.data.carddata.head && res.data.carddata.body) {
				let tempData = res.data.carddata;
				this.props.form.setAllFormValue({ head: tempData.head[CARDTEMPLATEINFO.headAreaCode] });
				this.props.cardTable.setTableData(
					CARDTEMPLATEINFO.bodyAreaCode,
					tempData.body[CARDTEMPLATEINFO.bodyAreaCode],
					false
				);

				let pk_org = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.pk_org).display;
				if (pk_org !== null && pk_org !== ' ') {
					buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				} else {
					groupButtonController.call(this, props, VIEWINFO.BROWSER_STATUS);
				}
				showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000014') /*刷新成功！*/);
			}
		}
	});
}
