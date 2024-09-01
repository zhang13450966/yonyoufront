/*
 * @Author: jiangfw 
 * @PageInfo: 参照采购订单增行
 * @Date: 2018-09-07 08:42:40 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 14:27:41
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, FIELD, MODAL_ID, URL, AREA, BILLTYPE, ADD_ROW_FIELDS } from '../../constance';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { existDifSrcBill } from '../../utils/addRowUtils';
import { cacheData } from '../utils/cacheData';

export default function ref21PAddLineComfirmBtnClick(ids) {
	let props = this.props;
	let refsourcdata = this.refsourcdata; //参照增行要过滤当前页面的数据
	props.modal.close(MODAL_ID.RefAddRowModal);

	if (ids) {
		// 查询参数
		let transferInfo = new Array();
		let info21 = {
			pagecode: PAGECODE.invoiceCard,
			key: BILLTYPE.payplan_order, // 付款计划
			templetid: this.templetid_25,
			data: ids
		};
		transferInfo.push(info21);

		let data = {
			transferInfo
		};

		ajax({
			url: URL.poInvoiceTo21P,
			data: data,
			success: (res) => {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}

				let newInvoices = res.data;
				// if (newInvoices && newInvoices.length == 1) {
				if (newInvoices && newInvoices.length > 0) {
					let combineRows = new Array(); //合并后表体
					let currentBodys = props.cardTable.getAllData(AREA.card_body); //当前表体
					let currentHead = props.form.getAllFormValue(AREA.card_head);
					let flag = existDifSrcBill(newInvoices, currentHead, ADD_ROW_FIELDS, combineRows);
					if (flag) {
						showWarningInfo(
							null,
							getLangByResId(this, '4004PUINVOICE-000019') /* 国际化处理： 来源表头数据与当前表头数据不一致，无法参照增行！*/
						);
						return;
					}
					if (refsourcdata && refsourcdata.transferInfo) {
						refsourcdata.transferInfo[0].data = [
							...transferInfo[0].data,
							...refsourcdata.transferInfo[0].data
						];
					}
					// 合并原来表体行
					currentBodys.rows.map((item) => {
						item.values.crowno = { display: null, value: null };
						combineRows.push(item);
					});
					currentBodys.rows = combineRows;

					props.cardTable.setTableData(AREA.card_body, currentBodys);
					//设置行号
					// setTimeout(() => {
					RownoUtils.setRowNo(props, AREA.card_body, FIELD.crowno);
					// }, 10);

					//缓存数据
					cacheData.call(this, AREA.card_body);
				}
			}
		});
	}
}
