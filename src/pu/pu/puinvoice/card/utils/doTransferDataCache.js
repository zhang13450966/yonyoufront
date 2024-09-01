/*
* @Author: wangceb 
* @PageInfo: 转单界面数据缓存  
* @Date: 2018-07-01 08:57:45 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-04 14:05:55
*/
import { AREA } from '../../constance';
export default function doTransferDataCache(props) {
	setTimeout(() => {
		// 如果是转单的编辑界面，需要缓存当前数据
		let transfer = this.props.getUrlParam('type');
		// if (transfer != undefined && transfer.indexOf('ref') != -1) {
		if (transfer) {
			const { transferTable, form, cardTable } = this.props;

			const { setTransferListValueByIndex } = transferTable;
			let headVals = form.getAllFormValue(this.formId);
			let bodyVals = cardTable.getAllData(this.tableId);

			this.curindex = parseInt(this.curindex);
			this.listData[this.curindex].head[this.formId].rows = headVals.rows;
			this.listData[this.curindex].body[this.tableId].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.card_left, this.listData[this.curindex], this.curindex);
		}
	}, 0);
}
