/* 
* @Author: lichaoah  
* @PageInfo:缓存数据管理   
* @Date: 2020-02-24 13:48:20  
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-29 15:04:32
*/
import {
	getCacheDataByPk,
	updateCacheData,
	addCacheData,
	deleteCacheData,
	getDefData,
	setDefData
} from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { TARGET_CARD, TARGET_LIST } from '../../siconst';
function updateCache(props, data, istrue) {
	let pk_target = data.head[TARGET_CARD.formId].rows[0].values.pk_target.value;
	let cacheData = getCacheData(props, pk_target);
	if (cacheData) {
		cacheData.head[TARGET_CARD.formId] = data.head[TARGET_CARD.formId];
		cacheData.bodys[TARGET_CARD.target_org] = data.bodys[TARGET_CARD.target_org];
		cacheData.bodys[TARGET_CARD.target_period] = data.bodys[TARGET_CARD.target_period];
		cacheData.bodys[TARGET_CARD.target_mar] = data.bodys[TARGET_CARD.target_mar];
		cacheData.bodys[TARGET_CARD.target_item] = data.bodys[TARGET_CARD.target_item];
		// cacheData.bodys[TARGET_CARD.target_ratio].rows.map((row) => {
		// 	data.bodys[TARGET_CARD.target_item].rows.some((item) => {
		// 		if (istrue && item.values[TARGET_CARD.clinkyearitemid].value != undefined &&
		// 			item.values[TARGET_CARD.clinkyearitemid].value == row.values[TARGET_CARD.clinkyearitemid].value) {
		// 			//数据合并
		// 			let newvalues = modify(item.values);
		// 			Object.assign(row.values, newvalues);
		// 			return true;
		// 		}
		// 	});
		// });
		// let itemRows = data.bodys[TARGET_CARD.target_item].rows;
		// for(let i = 0;i<itemRows.length; i++){

		// }
	}
	updateCacheData(
		props,
		TARGET_CARD.pk_target,
		pk_target,
		cacheData ? cacheData : data,
		TARGET_CARD.formId,
		TARGET_LIST.dataSource
	);
}
function getCacheData(props, pk_target) {
	return getCacheDataByPk(props, TARGET_LIST.dataSource, pk_target);
}
function addCache(props, pk_target, cacheData) {
	addCacheData(props, TARGET_CARD.pk_target, pk_target, cacheData, TARGET_CARD.formId, TARGET_LIST.dataSource);
}
function deleteCache(props, pk_target) {
	deleteCacheData(props, TARGET_CARD.pk_target, pk_target, TARGET_LIST.dataSource);
}
function getDefCache(key) {
	return getDefData(TARGET_LIST.dataSource, key);
}
function setDefCache(key, data) {
	setDefData(TARGET_LIST.dataSource, key, data);
}
function modify(values) {
	//需要替换的字段
	let array = [
		'clinkyearitemid',
		'nhalfyearrate1',
		'nhalfyearrate2',
		'nmonthrate1',
		'nmonthrate10',
		'nmonthrate11',
		'nmonthrate12',
		'nmonthrate2',
		'nmonthrate3',
		'nmonthrate4',
		'nmonthrate5',
		'nmonthrate6',
		'nmonthrate7',
		'nmonthrate8',
		'nmonthrate9',
		'nquarterrate1',
		'nquarterrate2',
		'nquarterrate3',
		'nquarterrate4'
	];
	let newvalues = {};
	array.forEach((key) => {
		if (values[key].value) {
			newvalues[key] = values[key];
		}
	});
	return newvalues;
}
export { updateCache, getCacheData, addCache, deleteCache, getDefCache, setDefCache, modify };
