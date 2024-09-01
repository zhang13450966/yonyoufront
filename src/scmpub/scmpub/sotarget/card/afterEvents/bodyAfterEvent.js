/* 
* @Author: lichaoah  
* @PageInfo:返利指标设置表体编辑事件   
* @Date: 2020-02-18 16:06:33  
 * @Last Modified by: qishy
 * @Last Modified time: 2021-03-15 13:54:43
*/
import { TARGET_CARD } from '../../siconst';
import targetNameBodyAfterEvent from './targetNameBodyAfterEvent';
import itemTypeBodyAfterEvent from './itemTypeBodyAfterEvent';

export default function bodyAfterEvent(props, moduleId, key, value, changedrows, index, record) {
	switch (moduleId) {
		case TARGET_CARD.target_mar: //物料维度
			switch (key) {
				case TARGET_CARD.cmarcombineid: //物料组合
					break;
			}
			break;
		case TARGET_CARD.target_ratio: //指标项比例
			switch (key) {
				case TARGET_CARD.clinkyearitemid: //关联年指标
					if (value == '00001') {
						props.cardTable.setValByKeyAndRowId(
							TARGET_CARD.target_item,
							this.target_item_rowid,
							TARGET_CARD.clinkyearitemid,
							{ value: null, display: null }
						);
					} else {
						props.cardTable.setValByKeyAndRowId(
							TARGET_CARD.target_item,
							this.target_item_rowid,
							TARGET_CARD.clinkyearitemid,
							{ value, display: value }
						);
					}

					break;
			}
			break;
		case TARGET_CARD.target_item: //指标项
			switch (key) {
				case TARGET_CARD.fitemtypeflag: //指标项类别
					itemTypeBodyAfterEvent.call(this, props, moduleId, key, value, index, record);
					break;
				case TARGET_CARD.vtargetname: //指标项名称
					targetNameBodyAfterEvent.call(this, props, moduleId, key, value, index);
					break;
			}
			break;
	}
}
