/*
 * @Author: jiangfw 
 * @PageInfo: 优质优价取价
 * @Date: 2018-06-13 21:16:59 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-18 17:04:22
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
// import { cacheData } from '../utils/cacheData';
// import { updateDtaForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';

export default function clickHphdBtn() {
	let invoice = this.props.createMasterChildDataSimple(this.pageId, this.formId, this.tableId);

	let checkedRows = this.props.cardTable.getCheckedRows(this.tableId);
	if (checkedRows.length == 0) {
		showErrorInfo(
			getLangByResId(this, '4004PUINVOICE-000064'),
			getLangByResId(this, '4004PUINVOICE-000015') /* 国际化处理：出错啦！未选中表体行！*/
		);
		return;
	}

	// 重置表体
	invoice.body.card_body.rows = getRows(checkedRows);
	// let rowIndex = [];
	// checkedRows.map((item) => {
	// 	rowIndex.push(item.index);
	// });

	// let data = {
	// 	data: invoice,
	// 	// checkedRows: rowIndex,
	// 	pagecode: this.pageId
	// };

	ajax({
		url: URL.hphq,
		data: invoice,
		pageid: this.pageId,

		success: (res) => {
			if (res.success && res.data && res.data.body) {
				// this.props.cardTable.updateDiffDataByRowId(AREA.card_body, res.data.body[AREA.card_body]);
				this.props.cardTable.updateDataByRowId(AREA.card_body, res.data.body.card_body, true, false);
				// let config = {
				// 	headAreaId: AREA.card_head,
				// 	bodyAreaId: AREA.card_body,
				// 	bodyPKfield: FIELD.pk_invoice_b
				// };
				// updateDtaForCompareByPk(_this.props, res.data, config);
				// 填充form数据
				// if (res.data.head && res.data.head[_this.formId]) {
				// 	_this.props.form.setAllFormValue({ [_this.formId]: res.data.head[_this.formId] });
				// }
				// 填充子表数据
				// if (res.data.body && res.data.body[_this.tableId]) {
				// 	_this.props.cardTable.setTableData(_this.tableId, res.data.body[_this.tableId]);
				// }
				// 缓存数据
				// cacheData.call(_this, AREA.card_body);
			}
		}
	});
}

function getRows(checkedRows) {
	let rows = [];
	checkedRows.forEach((row) => {
		rows.push(row.data);
	});
	return rows;
}
