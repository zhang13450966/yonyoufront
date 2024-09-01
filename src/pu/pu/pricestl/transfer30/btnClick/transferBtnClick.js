import { PAGECODE, TRANSFER30, OrderCache, URL, FIELD } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import {
	showSuccessInfo,
	showWarningInfo,
	showErrorDialog,
	showErrorInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function() {
	const { transferTable, search, linkTo } = this.props;
	const { getTransferTableSelectedValue } = transferTable;
	let selectData = getTransferTableSelectedValue(TRANSFER30.LIST_TABLE);
	if (!selectData || selectData[TRANSFER30.LIST_TABLE].length <= 0) {
		showWarningInfo(null, getLangByResId(this, '4004PRICESTL-000032')); /* 国际化处理： 请选择转单数据！*/
		return;
	}
	let ids = this.props.transferTable.getTransferTableSelectedId(TRANSFER30.LIST_TABLE);
	// let org = props.getUrlParam('org');
	let org = getDefData.call(this, OrderCache.OrderCacheKey, TRANSFER30.org);
	if (org == null || org.org == null) {
		org = null;
	} else {
		org = org.org;
	}
	let data = {
		pagecode: TRANSFER30.PAGEID,
		// templetid: getDefData(OrderCache.OrderTransferCache, 'templetid'),
		queryAreaCode: TRANSFER30.SEARCHID,
		oid: org,
		key: 'cgeneralbid',
		data: ids
	};
	let url = TRANSFER30.TRANSFERXTO21ACTION;
	ajax({
		method: 'POST',
		url: url,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			if (res && res.success) {
				// showSuccessInfo(null, getLangByResId(this, '4004PRICESTL-000033')); /* 国际化处理： 生成价格结算单成功*//* 国际化处理： 生成消耗汇总成功!*/

				this.props.pushTo(URL.gotoList, {
					tabcode: FIELD.toCommit,
					ids: res.data,
					transfer: TRANSFER30.CSOURCETYPECODE,
					pagecode: PAGECODE.listcode
				});
			}
		}
		// error: (ress) => {
		// 	showErrorInfo(null, getLangByResId(this, '4004PRICESTL-000034'));
		// }
	});
}
