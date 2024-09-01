/* 
* @Author: lichaoah  
* @PageInfo:删行   
* @Date: 2020-02-25 13:15:11  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-28 15:02:23
*/
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setCardButtonDisable } from '../viewControl/buttonController';
import { TARGET_CARD } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function delLineBtnClick(props, tableId) {
	let checkedRows = props.cardTable.getCheckedRows(tableId);
	if (!checkedRows || checkedRows.length == 0) {
		showErrorInfo(undefined, getLangByResId(this, '4001TARGET-000029'));/* 国际化处理： 请选择要删除的单据行*/
		return;
	}
	// 判断指标项是否被引用
	let indexs = [];
	checkedRows.forEach((row) => {
		indexs.push(row.index);
	});
	if (tableId == TARGET_CARD.target_item) {
		let isError = false;
		indexs.forEach((index) => {
			let value = props.cardTable.getValByKeyAndIndex(tableId, index, TARGET_CARD.vtargetname);
			// 如果年指标已经被引用不许删除
			let allChildRows = this.state.showTargetRatio
				? props.cardTable.getVisibleRows(TARGET_CARD.target_ratio)
				: [];
			// 获取当前显示的数据
			let allShowRows = props.cardTable.getVisibleRows(TARGET_CARD.target_item);
			let allShowRowids = [];
			allShowRows.forEach((element) => {
				allShowRowids.push(element.rowid);
			});
			//缓存中是否引用
			Object.keys(this.target_item_cache).forEach((element) => {
				if (allShowRowids.indexOf(element) > 0) {
					allChildRows.push(...this.target_item_cache[element].rows);
				}
			});
			let isUsed = false;
			allChildRows.forEach((item) => {
				if (
					item.values.clinkyearitemid &&
					item.values.clinkyearitemid.display &&
					item.values.clinkyearitemid.display == value.value
				) {
					showErrorInfo(undefined, getLangByResId(this, '4001TARGET-000027') + value.value + getLangByResId(this, '4001TARGET-000028'));/* 国际化处理： 年指标：,已经被关联不允许删除*/
					isError = true;
				}
			});
		});
		if (isError) {
			return;
		}
	}
	this.setState({ showTargetRatio: false });
	props.cardTable.delRowsByIndex(tableId, indexs);
	//按钮控制
	setCardButtonDisable.call(this, props);
}
