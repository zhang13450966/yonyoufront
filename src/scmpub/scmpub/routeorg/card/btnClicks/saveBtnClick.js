/*
 * @Author: 王勇 
 * @PageInfo: 卡片-运输路线保存  
 * @Date: 2020-01-17 09:41:08 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-22 10:39:19
 */
import { CARDTEMPLATEINFO, CARDBUTTONINFO, VIEWINFO, REQUESTURL, TEMPLATEINFO, ROUTEVOINFO } from '../../const/index';
import buttonController from '../viewController/buttonController';
import { ajax, cardCache } from 'nc-lightapp-front';
import { showErrorInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let { addCache } = cardCache;
export default function saveBtnClick(props) {
	props.cardTable.filterEmptyRows(CARDTEMPLATEINFO.bodyAreaCode, [ 'caddrdocid' ], 'include');
	if (props.cardTable.getVisibleRows(CARDTEMPLATEINFO.bodyAreaCode).length < 2) {
		showErrorInfo(null, getLangByResId(this, '4001ROUTE-000012')); /* 国际化处理： 表体不能为空，至少设置两行！*/
		return;
	}
	let flag = props.validatePageToToast([
		{ name: CARDTEMPLATEINFO.headAreaCode, type: 'form' },
		{ name: CARDTEMPLATEINFO.bodyAreaCode, type: 'cardTable' }
	]);
	if (!flag.allPassed) {
		return;
	}
	let routeInfo = props.createMasterChildData(
		CARDTEMPLATEINFO.templateCode,
		CARDTEMPLATEINFO.headAreaCode,
		CARDTEMPLATEINFO.bodyAreaCode
	);
	this.props.validateToSave(routeInfo, () => {
		ajax({
			url: REQUESTURL.saveRouteUrl,
			data: routeInfo,
			success: (res) => {
				if (res.data.data === undefined || res.data.data == null) {
					//清空----
					props.form.EmptyAllFormValue(CARDTEMPLATEINFO.headAreaCode);
					props.cardTable.setTableData(CARDTEMPLATEINFO.bodyAreaCode, { rows: [] });
					setTimeout(() => {
						props.button.setDisabled({
							[CARDBUTTONINFO.saveBtnCode]: true,
							[CARDBUTTONINFO.cancelBtnCode]: true,
							[CARDBUTTONINFO.innerAddLineBtnCode]: true
						});
					}, 0);
					props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, VIEWINFO.BROWSER_STATUS);
					showErrorInfo(null, getLangByResId(this, '4001ROUTE-000032')); /* 国际化处理： 数据已经被删除，请返回列表界面！*/
				} else {
					const crouteId = res.data.pk;
					let info = {
						pk_route: res.data.pk,
						pagecode: CARDTEMPLATEINFO.templateCode
					};
					ajax({
						url: REQUESTURL.loadRouteUrl,
						data: info,
						success: (res) => {
							let tempData = res.data.carddata;
							let tmpCrouteId = props.form.getFormItemsValue(
								CARDTEMPLATEINFO.headAreaCode,
								ROUTEVOINFO.crouteid
							);
							props.form.setAllFormValue({ head: tempData.head[CARDTEMPLATEINFO.headAreaCode] });
							props.cardTable.setTableData(
								CARDTEMPLATEINFO.bodyAreaCode,
								tempData.body[CARDTEMPLATEINFO.bodyAreaCode],
								false
							);
							props.form.setFormStatus(CARDTEMPLATEINFO.headAreaCode, VIEWINFO.BROWSER_STATUS);
							props.cardTable.setStatus(CARDTEMPLATEINFO.bodyAreaCode, VIEWINFO.BROWSER_STATUS);
							buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
							if (tmpCrouteId == null || tmpCrouteId.value == undefined) {
								addCache(
									crouteId,
									res.data.carddata,
									CARDTEMPLATEINFO.headAreaCode,
									TEMPLATEINFO.cacheKey
								);
							}
							props.cardPagination.setCardPaginationId({ id: crouteId, status: 1 });
							showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000015') /*保存成功！*/);
						}
					});
				}
			}
		});
	});
}
