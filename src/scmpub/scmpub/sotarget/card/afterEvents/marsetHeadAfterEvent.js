/* 
* @Author: lichaoah  
* @PageInfo:物料指标设定方式   
* @Date: 2020-02-18 17:05:58  
 * @Last Modified by: lichaoah
 * @Last Modified time: 2020-03-19 10:41:11
*/

import { TARGET_CARD } from '../../siconst';

export default function(props, moduleId, key, value, oldValue, cardData) {
	let marsetflag = value.value;
	handlerFieldRequire(props, marsetflag);
	handlerFieldVisiable(props, marsetflag);
}

function handlerFieldRequire(props, marsetflag) {
	setFieldNotNull(
		props,
		TARGET_CARD.target_mar,
		[
			TARGET_CARD.cmarbaseclassid,
			TARGET_CARD.cmarcombineid,
			TARGET_CARD.cmarsaleclassid,
			TARGET_CARD.cmaterialid,
			TARGET_CARD.cbrandid,
			TARGET_CARD.cprodlineid
		],
		false
	);
	let field =
		marsetflag == 1
			? [ TARGET_CARD.cprodlineid ]
			: marsetflag == 2
				? [ TARGET_CARD.cbrandid ]
				: marsetflag == 3
					? [ TARGET_CARD.cmarbaseclassid ]
					: marsetflag == 4
						? [ TARGET_CARD.cmarsaleclassid ]
						: marsetflag == 5
							? [ TARGET_CARD.cmaterialid ]
							: marsetflag == 6 ? [ TARGET_CARD.cmarcombineid ] : [];
	setFieldNotNull(props, TARGET_CARD.target_mar, field, true);
}
/**
 * 设置字段必输
 * @param {*} props 
 * @param {*} moduleId 
 * @param {*} fields 
 * @param {*} isNull 
 */
function setFieldNotNull(props, moduleId, fields, isNull) {
	let meta = props.meta.getMeta();
	meta[moduleId].items.map((item) => {
		if (fields.indexOf(item.attrcode) >= 0) {
			item.required = isNull;
		}
	});
}
export function handlerFieldVisiable(props, marsetflag) {
	props.cardTable.hideColByKey(TARGET_CARD.target_mar, [
		TARGET_CARD.cmarbaseclassid,
		TARGET_CARD.cmarcombineid,
		TARGET_CARD.cmarsaleclassid,
		TARGET_CARD.cmaterialid
	]);
	let field =
		marsetflag == 3
			? [ TARGET_CARD.cmarbaseclassid ]
			: marsetflag == 4
				? [ TARGET_CARD.cmarsaleclassid ]
				: marsetflag == 5 ? [ TARGET_CARD.cmaterialid ] : marsetflag == 6 ? [ TARGET_CARD.cmarcombineid ] : [];
	props.cardTable.showColByKey(TARGET_CARD.target_mar, field);
}
