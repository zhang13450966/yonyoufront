/*
* @Author: jiangfw 
* @PageInfo: 表体行编辑缓存数据工具类
* @Date: 2018-08-22 09:40:29 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-17 15:17:23
*/
import { AREA } from '../../constance';
// export function cacheData(this, areaCode) {
export function cacheData(areaCode) {
	return;
	// 转单标识
	let type = this.props.getUrlParam('type');
	if (type) {
		let { listdata } = this.state;
		let curindex = this.curindex;
		const { transferTable, form } = this.props;
		const { setTransferListValueByIndex } = transferTable;
		if (areaCode == AREA.card_head && listdata != '') {
			// 转单表头数据做缓存
			let headVals = form.getAllFormValue(areaCode);
			listdata[curindex].head[AREA.card_head].rows = headVals.rows;
			setTransferListValueByIndex(AREA.card_left, listdata[curindex], curindex);
		} else if (areaCode == AREA.card_body && listdata != '') {
			// 表格数据
			let headVals = form.getAllFormValue(AREA.card_head);
			listdata[curindex].head[AREA.card_head].rows = headVals.rows;
			let bodyVals = this.props.cardTable.getAllData(areaCode);
			listdata[curindex].body[AREA.card_body].rows = bodyVals.rows;
			setTransferListValueByIndex(AREA.card_left, listdata[curindex], curindex);
		}
	}
}
