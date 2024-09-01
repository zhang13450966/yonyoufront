/* 
* @Author: lichaoah  
* @PageInfo:指标比例控制   
* @Date: 2020-03-12 15:24:05  
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-28 14:52:45
*/
import { TARGET_CARD } from '../../siconst';
import addLineBtnClick from '../btnClicks/addLineBtnClick';
import { setRatioData } from '../dataManange/cardPageDataManange';
export default function itemTypeBodyAfterEvent(props, moduleId, key, value, index, record) {
	this.setState({ showTargetRatio: value != 3 });
	let itemType = value;

	if (itemType && itemType != 3) {
		processTableField(props, itemType);
		if (props.form.getFormStatus(TARGET_CARD.formId) != TARGET_CARD.browse) {
			setRatioData(props, { areacode: TARGET_CARD.target_ratio, rows: [] });
			if (props.cardTable.getVisibleRows(TARGET_CARD.target_ratio).length == 0) {
				addLineBtnClick(props, TARGET_CARD.target_ratio);
			}
			// setDefCache(record.rowid, props.cardTable.getAllData(TARGET_CARD.target_ratio));
			// setTargetRatioData.call(this, props);
		}
	}
}
export function processTableField(props, itemType) {
	handlerFieldVisiable(props, TARGET_CARD.target_ratio, itemType);
	handlerFieldName(props, TARGET_CARD.target_ratio, itemType);
}
function handlerFieldVisiable(props, moduleId, itemType) {
	let fields =
		itemType == 0
			? [
					TARGET_CARD.nmonthrate1,
					TARGET_CARD.nmonthrate2,
					TARGET_CARD.nmonthrate3,
					TARGET_CARD.nmonthrate4,
					TARGET_CARD.nmonthrate5,
					TARGET_CARD.nmonthrate6,
					TARGET_CARD.nmonthrate7,
					TARGET_CARD.nmonthrate8,
					TARGET_CARD.nmonthrate9,
					TARGET_CARD.nmonthrate10,
					TARGET_CARD.nmonthrate11,
					TARGET_CARD.nmonthrate12
				]
			: itemType == 1
				? [
						TARGET_CARD.nquarterrate1,
						TARGET_CARD.nquarterrate2,
						TARGET_CARD.nquarterrate3,
						TARGET_CARD.nquarterrate4
					]
				: itemType == 2 ? [ TARGET_CARD.nhalfyearrate1, TARGET_CARD.nhalfyearrate2 ] : [];
	props.cardTable.hideColByKey(moduleId, [
		TARGET_CARD.nhalfyearrate1,
		TARGET_CARD.nhalfyearrate2,
		TARGET_CARD.nmonthrate1,
		TARGET_CARD.nmonthrate2,
		TARGET_CARD.nmonthrate3,
		TARGET_CARD.nmonthrate4,
		TARGET_CARD.nmonthrate5,
		TARGET_CARD.nmonthrate6,
		TARGET_CARD.nmonthrate7,
		TARGET_CARD.nmonthrate8,
		TARGET_CARD.nmonthrate9,
		TARGET_CARD.nmonthrate10,
		TARGET_CARD.nmonthrate11,
		TARGET_CARD.nmonthrate12,
		TARGET_CARD.nquarterrate1,
		TARGET_CARD.nquarterrate2,
		TARGET_CARD.nquarterrate3,
		TARGET_CARD.nquarterrate4
	]);
	props.cardTable.showColByKey(moduleId, fields);
}
function handlerFieldName(props, moduleId, itemType) {
	let key = itemType == 0 ? 'nmonthrate' : itemType == 1 ? 'nquarterrate' : 'nhalfyearrate';
	let name = itemType == 1 ? 'Q' : '0';
	let year = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.fyearflag).value;
	let meta = props.meta.getMeta();
	meta[moduleId].items.map((item) => {
		if (item.attrcode.indexOf(key) == 0) {
			item.label = year + '-' + name + item.attrcode.substring(key.length, item.attrcode.length) + '(%)';
		}
	});
}
