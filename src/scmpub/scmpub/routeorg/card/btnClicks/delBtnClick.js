/*
 * @Author: 王勇 
 * @PageInfo: 卡片-删除运输路线  
 * @Date: 2020-01-17 09:35:54 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:11:45
 */
import { ajax } from 'nc-lightapp-front';
import { CARDTEMPLATEINFO, ROUTEVOINFO, REQUESTURL, VIEWINFO, CARDBUTTONINFO, TEMPLATEINFO } from '../../const/index';
import { showSuccessInfo, showSingleDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import commonSearchBtcnClick from '../btnClicks/commonSearchBtcnClick';
export default function delBtnClick(props) {
	showSingleDeleteDialog({
		beSureBtnClick: beSureBtnClick.bind(this, props)
	});
}
async function beSureBtnClick(props) {
	let pks = props.form.getFormItemsValue(CARDTEMPLATEINFO.headAreaCode, ROUTEVOINFO.crouteid).value;
	let info = { pk_routes: pks, node: 'org' };
	ajax({
		url: REQUESTURL.delRouteUrl,
		data: info,
		success: (res) => {
			if (res.data.success) {
				deleteCacheData(props, ROUTEVOINFO.crouteid, pks, TEMPLATEINFO.cacheKey);
				let nextId = props.cardPagination.getNextCardPaginationId({ id: pks, status: 1 });
				props.cardPagination.setCardPaginationId({ id: pks, status: 3 });
				changeUrlParam(props, {
					status: VIEWINFO.BROWSER_STATUS,
					id: nextId,
					buttonType: CARDBUTTONINFO.delBtnCode
				});
				showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000008')); /* 删除成功！*/
				commonSearchBtcnClick.call(this, props, nextId, CARDBUTTONINFO.delBtnCode);
			}
		}
	});
}
