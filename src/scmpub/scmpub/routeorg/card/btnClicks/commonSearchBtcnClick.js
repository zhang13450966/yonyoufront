/*
 * @Author: 王勇 
 * @PageInfo: 卡片翻页查询  
 * @Date: 2020-02-13 18:52:19 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-08-08 14:50:19
 */
import { ajax } from 'nc-lightapp-front';
import { VIEWINFO, REQUESTURL, CARDTEMPLATEINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import groupButtonController from '../viewController/groupButtonController';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setBlankPageButtons } from '../viewController/buttonController';

export default function commonSearchBtcnClick(props, crouteid, type) {
	/**
     * 后续可以用缓存就行优化
     */
	setTimeout(() => {
		if (crouteid == undefined || !crouteid) {
			props.beforeUpdatePage();
			props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
			props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });
			props.BillHeadInfo.setBillHeadInfoVisible({
				showBillCode: false
			});
			props.updatePage(CARDTEMPLATEINFO.headAreaCode, CARDTEMPLATEINFO.bodyAreaCode);
			setBlankPageButtons.call(this, this.props, VIEWINFO.BROWSER_STATUS);
			return;
		}
		let info = {
			pk_route: crouteid,
			pagecode: CARDTEMPLATEINFO.templateCode
		};
		ajax({
			url: REQUESTURL.loadRouteUrl,
			data: info,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(res.formulamsg);
				}
				props.beforeUpdatePage();
				if (res.data.carddata === undefined || res.data.carddata == null) {
					showErrorInfo(null, getLangByResId(this, '4001ROUTE-000032')); /* 国际化处理： 数据已经被删除，请返回列表界面！*/
				} else if (res.data.carddata.head && res.data.carddata.body) {
					props.form.setAllFormValue({
						[CARDTEMPLATEINFO.headAreaCode]: res.data.carddata.head[CARDTEMPLATEINFO.headAreaCode]
					});
					props.cardTable.setTableData(
						CARDTEMPLATEINFO.bodyAreaCode,
						res.data.carddata.body[CARDTEMPLATEINFO.bodyAreaCode],
						true
					);
				}
				props.updatePage(CARDTEMPLATEINFO.headAreaCode, CARDTEMPLATEINFO.bodyAreaCode);
				let pk_org = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.pk_org).display;
				if (pk_org !== undefined && pk_org !== null && pk_org !== ' ') {
					buttonController.call(this, this.props, VIEWINFO.BROWSER_STATUS);
				} else {
					groupButtonController.call(this, this.props, VIEWINFO.BROWSER_STATUS);
				}
			}
		});
	}, 0);
}
