/* 
* @Author: lichaoah  
* @PageInfo:   
* @Date: 2020-02-25 14:51:03  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-28 15:02:14
*/
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setCardButtonDisable } from '../viewControl/buttonController';
import { TARGET_CARD } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function delInnerBtnClick(props, tableId, index) {
	if (tableId == TARGET_CARD.target_item) {
		let value = props.cardTable.getValByKeyAndIndex(tableId, index, TARGET_CARD.vtargetname);
		// 如果年指标已经被引用不许修改
		let allChildRows = this.state.showTargetRatio ? props.cardTable.getVisibleRows(TARGET_CARD.target_ratio) : [];
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
		let isError = false;
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
		if (isError) {
			return;
		}
	}
	this.setState({ showTargetRatio: false });
	props.cardTable.delRowsByIndex(tableId, index);
	//按钮控制
	setCardButtonDisable.call(this, props);
}
