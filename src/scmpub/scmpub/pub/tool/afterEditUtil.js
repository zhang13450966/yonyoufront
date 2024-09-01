/*
 * @PageInfo: 编辑后工具类
 * @Author: guozhq
 * @Date: 2018-12-10 14:37:43
 * @Last Modified by: wangpju
 * @Last Modified time: yyyy-09-Th 06:33:50
 */
import { simplifyData, simplifyDataByFields } from './simplifyDataUtil';
import { object } from 'prop-types';

/**
 * 主子表表体编辑后事件结果集处理
 * @param {*} props
 * @param {*} moduleId 表体区域编码
 * @param {*} data 返回的结果res.data
 * @param {*} i
 */
function processBillCardBodyEditResult(props, moduleId, data, i) {
	// 方案一
	// if (
	// 	data &&
	// 	data.billCard &&
	// 	data.billCard.body &&
	// 	data.billCard.body[moduleId] &&
	// 	data.dataIndexs &&
	// 	data.originalIndexs
	// ) {
	// 	let insertArray = [];
	// 	let updateArray = [];
	// 	data.originalIndexs.forEach((index, j) => {
	// 		let dataIndex = data.dataIndexs[j];
	// 		if (i == index) {
	// 			updateArray.push({ index: index, data: data.billCard.body[moduleId].rows[dataIndex] });
	// 		} else {
	// 			insertArray.push({ index: index, data: data.billCard.body[moduleId].rows[dataIndex] });
	// 		}
	// 	});
	// 	if (updateArray.length > 0) {
	// 		props.cardTable.updateDataByIndexs(moduleId, updateArray);
	// 	}
	// 	if (insertArray.length > 0) {
	// 		props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
	// 	}
	// }
	// 方案二
	if (
		data &&
		data.billCard &&
		data.billCard.body &&
		data.billCard.body[moduleId] &&
		data.billCard.body[moduleId].rows.length > 0
	) {
		let rows = data.billCard.body[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: i + j, data: row };
			if (j == 0) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			props.cardTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
		}
		let newrows = [];
		let allrows = props.cardTable.getAllRows(moduleId, true);
		insertArray.forEach((row) => {
			let newrow = allrows[row.index];
			newrows.push(newrow);
		});
		updateArray.forEach((row) => {
			let newrow = allrows[row.index];
			newrows.push(newrow);
		});
		data.billCard.body[moduleId].rows = newrows;
	}
}
/**
 * 创建一主多子编辑后事件结果(批量编辑)
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCode 表体区域编码
 * @param {*} moduleId 当前区域编码
 * @param {*} key 编辑的Key值
 * @param {*} changedRows
 * @param {*} indexs 编辑的行数
 * @param {*} userobject 自定义对象
 */
function createBodyAfterEventData4BatchMore(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	moduleId,
	key,
	changedRows,
	indexs,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	let lines = [];
	// // 删除display/scale 优化上行流量
	let rows = data.card.bodys[moduleId].rows;
	let newRows = [];
	let changerRows = [];
	let scm_indexs = [];
	for (let index = 0; index < indexs.length; index++) {
		if (rows[indexs[index]]) {
			newRows[index] = rows[indexs[index]];
			lines.push(index);
		}
		if (changedRows[index]) {
			changerRows.push(changedRows[index]);
		}
		if (changedRows[index] && rows[indexs[index]]) {
			scm_indexs.push(index + '');
		}
	}
	data.changedrows = changerRows;
	data.indexs = lines;
	data.card.bodys[moduleId].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.bodys[moduleId] = simplifyData(data.card.bodys[moduleId]);

	// userObject 处理
	userobject = userobject ? userobject : {};

	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = indexs[0] + '';
	userobject['scm_allrownos'] = crownos;
	userobject['indexs'] = indexs;
	// 采购订单物料oid、vid不一致的问题，还有前后端userObject大驼峰小驼峰不一致的问题，导致后台接不到userObject参数 20220705 begin
	userobject['scm_indexs'] = scm_indexs;
	data.userObject = userobject;
	// 采购订单物料oid、vid不一致的问题，还有前后端userObject大驼峰小驼峰不一致的问题，导致后台接不到userObject参数 20220705 end

	return data;
}
/**
 * 主子表表体编辑后事件结果集处理
 * @param {*} props
 * @param {*} moduleId 表体区域编码
 * @param {*} data 返回的结果res.data
 * @param {*} indexs 
 */
function processBillCardBodyEditResult4Batch(props, moduleId, data, indexs) {
	if (
		data &&
		data.billCard &&
		data.billCard.body &&
		data.billCard.body[moduleId] &&
		data.billCard.body[moduleId].rows.length > 0
	) {
		let rows = data.billCard.body[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		let allRows = props.cardTable.getAllRows(moduleId);
		let i = allRows.length;
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: indexs[j], data: row };
			if (indexs[j] < i) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			props.cardTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
		}
	}
}
/**
 * 主子表表体编辑后事件结果集处理  只修改，不新增行
 * @param {*} props
 * @param {*} moduleId 表体区域编码
 * @param {*} data 返回的结果res.data
 * @param {*} i
 */
function processBillCardBodyEditResultNotAddRow(props, moduleId, data, i) {
	// 方案二
	if (
		data &&
		data.billCard &&
		data.billCard.body &&
		data.billCard.body[moduleId] &&
		data.billCard.body[moduleId].rows.length > 0
	) {
		let rows = data.billCard.body[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: i + j, data: row };
			updateArray.push(obj);
		}
		if (updateArray.length > 0) {
			props.cardTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
		}
	}
}

/**
 * 创建主子表编辑后事件结果
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCode 表体区域编码
 * @param {*} moduleId 当前区域编码
 * @param {*} key 编辑的Key值
 * @param {*} changedRows
 * @param {*} i 当前编辑的行
 * @param {*} userobject 自定义对象
 */
function createBodyAfterEventData(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	moduleId,
	key,
	changedRows,
	i,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	data.indexs = [ 0 ];
	// // 删除display/scale 优化上行流量
	let rows = data.card.body[tableAreaCode].rows;
	let newRows = [ rows[i] ];
	data.card.body[tableAreaCode].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);

	// userObject 处理
	userobject = userobject ? userobject : {};

	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = i + '';
	userobject['scm_allrownos'] = crownos;
	data.userobject = userobject;
	return data;
}

/**
 * 创建主子表编辑后事件结果(批量编辑)
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCode 表体区域编码
 * @param {*} moduleId 当前区域编码
 * @param {*} key 编辑的Key值
 * @param {*} changedRows
 * @param {*} indexs 编辑的行数
 * @param {*} userobject 自定义对象
 */
function createBodyAfterEventData4Batch(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	moduleId,
	key,
	changedRows,
	indexs,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	let lines = [];
	// // 删除display/scale 优化上行流量
	let rows = data.card.body[tableAreaCode].rows;
	let newRows = [];
	let changerRows = [];
	let scm_indexs = [];
	for (let index = 0; index < indexs.length; index++) {
		if (rows[indexs[index]]) {
			newRows[index] = rows[indexs[index]];
			lines.push(index + '');
		} else {
			newRows[index] = rows[index];
		}
		if (changedRows[index]) {
			changerRows.push(changedRows[index]);
		}
		if (changedRows[index] && rows[indexs[index]]) {
			scm_indexs.push(index + '');
		}
	}
	data.changedrows = changerRows;
	data.indexs = lines;
	data.card.body[tableAreaCode].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);

	// userObject 处理
	userobject = userobject ? userobject : {};

	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = indexs[0] + '';
	userobject['scm_allrownos'] = crownos;
	userobject['indexs'] = indexs;
	userobject['scm_indexs'] = scm_indexs;
	data.userobject = userobject;
	return data;
}

/**
 * 创建主子表编辑后事件结果(批量编辑)含孙表
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCode 表体区域编码
 * @param {*} moduleId 当前区域编码
 * @param {*} key 编辑的Key值
 * @param {*} changedRows
 * @param {*} indexs 编辑的行数
 * @param {*} userobject 自定义对象
 */
function createBodyAfterEventData4BatchHasSon(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	SonAreaCode,
	bodyRelatedField,
	moduleId,
	key,
	changedRows,
	indexs,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	let lines = [];
	// // 删除display/scale 优化上行流量
	let rows = data.card.body[tableAreaCode].rows;
	let newRows = [];
	let changerRows = [];
	let scm_indexs = [];
	for (let index = 0; index < indexs.length; index++) {
		if (rows[indexs[index]]) {
			newRows[index] = rows[indexs[index]];
			lines.push(index + '');
		} else {
			newRows[index] = rows[index];
		}
		if (changedRows[index]) {
			changerRows.push(changedRows[index]);
		}
		if (changedRows[index] && rows[indexs[index]]) {
			scm_indexs.push(index + '');
		}
	}
	data.changedrows = changerRows;
	data.indexs = lines;
	data.card.body[tableAreaCode].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);

	let allSonRows = [];
	// 处理孙表
	for (let index = 0; index < newRows.length; index++) {
		let rowid = newRows[index].rowid;
		let sonData = props.cardTable.getAllGrandData({ parentId: tableAreaCode });
		let datas = createSonGridData(props, tableAreaCode, SonAreaCode, bodyRelatedField, sonData, rowid);
		let sonRows = datas[SonAreaCode].rows;
		if (sonRows && sonRows.length > 0) {
			allSonRows.push.apply(allSonRows, sonRows);
		}
	}
	data.card.grandSons = {
		[SonAreaCode]: {
			areaType: 'table',
			areacode: SonAreaCode,
			rows: allSonRows
		}
	};
	data.card.grandSons[SonAreaCode] = simplifyData(data.card.grandSons[SonAreaCode]);

	// userObject 处理
	userobject = userobject ? userobject : {};

	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = indexs[0] + '';
	userobject['scm_allrownos'] = crownos;
	userobject['indexs'] = indexs;
	userobject['scm_indexs'] = scm_indexs;
	data.userobject = userobject;
	return data;
}
/**
 * 创建表体编辑后事件（含孙表）
 * @param {*} props 
 * @param {*} pageCode 
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCode 表体区域编码
 * @param {*} SonAreaCode 孙表区域编码
 * @param {*} bodyRelatedField 子孙关联字段
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} changedRows 
 * @param {*} i 
 * @param {*} userobject 
 */
function createBodyAfterEventData4Son(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	SonAreaCode,
	bodyRelatedField,
	moduleId,
	key,
	changedRows,
	i,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	// // 删除display/scale 优化上行流量
	let rows = data.card.body[tableAreaCode].rows;
	let newRows = [ rows[i] ];
	data.card.body[tableAreaCode].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);
	// 处理孙表
	let rowid = rows[i].rowid;
	let sonData = props.cardTable.getAllGrandData({ parentId: tableAreaCode });
	data.card.grandSons = createSonGridData(props, tableAreaCode, SonAreaCode, bodyRelatedField, sonData, rowid);
	data.card.grandSons[SonAreaCode] = simplifyData(data.card.grandSons[SonAreaCode]);
	// userObject 处理
	userobject = userobject ? userobject : {};

	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = i + '';
	userobject['scm_allrownos'] = crownos;
	data.userobject = userobject;
	return data;
}

/**
 * 创建孙表数据
 * @param {*} props 
 * @param {*} tableAreaCode 
 * @param {*} SonAreaCode 
 * @param {*} bodyRelatedField 
 * @param {*} sonData 
 * @param {*} bodyRowId 
 */
function createSonGridData(props, tableAreaCode, SonAreaCode, bodyRelatedField, sonData, bodyRowId, i) {
	let newSonRows = [];
	if (
		sonData[bodyRowId] &&
		sonData[bodyRowId][SonAreaCode] &&
		sonData[bodyRowId][SonAreaCode].rows &&
		sonData[bodyRowId][SonAreaCode].rows.length > 0
	) {
		let rows = sonData[bodyRowId][SonAreaCode].rows;
		for (let j = 0; j < rows.length; j++) {
			const row = rows[j];

			if (i != undefined) {
				if (i == j) {
					// 用孙表的子表主键判断是否新增行，如果孙表的子表有值的话，认为一定是主键或者 rowid
					// 如果没值的话，一定是新增行，需要设置为 rowid
					// 由于前端的状态管理比较混乱，单独用状态等于 2 判断不能覆盖所有新增场景，例如：后台返回新增的数据时，转单页面切换数据时
					if (row.values[bodyRelatedField].value == null || row.status == '2') {
						let bodypk;
						// 新增态判断表体行是否存在主键，如果存在的话，则等于主键，否则等于rowid
						if (props.cardTable.getValByKeyAndRowId(tableAreaCode, bodyRowId, bodyRelatedField)) {
							bodypk = props.cardTable.getValByKeyAndRowId(tableAreaCode, bodyRowId, bodyRelatedField)
								.value;
						}
						if (bodypk) {
							row.values[bodyRelatedField] = { value: bodypk, display: null };
						} else {
							row.values[bodyRelatedField] = { value: bodyRowId, display: null };
						}
					}
					newSonRows.push(row);
					break;
				}
			} else {
				if (row.values[bodyRelatedField].value == null || row.status == '2') {
					let bodypk;
					// 新增态判断表体行是否存在主键，如果存在的话，则等于主键，否则等于rowid
					if (props.cardTable.getValByKeyAndRowId(tableAreaCode, bodyRowId, bodyRelatedField)) {
						bodypk = props.cardTable.getValByKeyAndRowId(tableAreaCode, bodyRowId, bodyRelatedField).value;
					}
					if (bodypk) {
						row.values[bodyRelatedField] = { value: bodypk, display: null };
					} else {
						row.values[bodyRelatedField] = { value: bodyRowId, display: null };
					}
				}
				if (row.status == '3') {
					continue;
				}
				newSonRows.push(row);
			}
		}
	}
	return {
		[SonAreaCode]: {
			areaType: 'table',
			areacode: SonAreaCode,
			rows: newSonRows
		}
	};
}

/**
 * 创建孙表编辑后事件（含子表和表头）
 * @param {*} props 
 * @param {*} pageCode 
 * @param {*} formAreaCode 
 * @param {*} tableAreaCode 
 * @param {*} SonAreaCode 
 * @param {*} bodyRelatedField 
 * @param {*} bodyIndex 表体行
 * @param {*} moduleId 
 * @param {*} key 
 * @param {*} changedRows 
 * @param {*} i 
 * @param {*} userobject 
 */
function createSonAfterEventData4Son(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	SonAreaCode,
	bodyRelatedField,
	bodyIndex,
	moduleId,
	key,
	changedRows,
	i,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, changedRows);
	data.index = 0;
	// // 删除display/scale 优化上行流量
	let rows = data.card.body[tableAreaCode].rows;
	let newRows = [ rows[bodyIndex] ];
	data.card.body[tableAreaCode].rows = newRows;
	// 处理编辑传递单行处理
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);
	// 处理孙表
	let rowid = rows[bodyIndex].rowid;
	let sonData = props.cardTable.getAllGrandData({ parentId: tableAreaCode });
	data.card.grandSons = createSonGridData(props, tableAreaCode, SonAreaCode, bodyRelatedField, sonData, rowid, i);
	data.card.body[SonAreaCode] = simplifyData(data.card.body[SonAreaCode]);
	// userObject 处理
	userobject = userobject ? userobject : {};
	// 补充孙表的区域编码，避免层级太深
	userobject['scm_sonareacode'] = SonAreaCode;
	data.userobject = userobject;
	return data;
}

function processBillCardGrandSonEditResult(props, moduleId, data, i) {
	if (
		data &&
		data.billCard &&
		data.billCard.grandSons &&
		data.billCard.grandSons[moduleId] &&
		data.billCard.grandSons[moduleId].rows.length > 0
	) {
		let rows = data.billCard.grandSons[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: i + j, data: row };
			if (j == 0) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			props.cardTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
		}
	}
}

/**
 * 创建一主多子表编辑后事件结果
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域编码
 * @param {*} tableAreaCodes 表体区域编码，数组
 * @param {*} moduleId 当前区域编码
 * @param {*} key 编辑的Key值
 * @param {*} changedRows
 * @param {*} i 当前编辑的行
 * @param {*} userobject 自定义对象
 */
function createExtBodyAfterEventData(
	props,
	pageCode,
	formAreaCode,
	tableAreaCodes,
	moduleId,
	key,
	changedRows,
	i,
	userobject
) {
	let data = props.createBodyAfterEventData(pageCode, formAreaCode, tableAreaCodes, moduleId, key, changedRows);
	data.index = 0;
	data.indexs = [ 0 ];
	// 处理编辑传递单行处理
	let rows = data.card.bodys[moduleId].rows;
	let newRows = [ rows[i] ];
	data.card.bodys[moduleId].rows = newRows;
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	data.card.bodys[moduleId] = simplifyData(data.card.bodys[moduleId]);
	// userObject 处理
	userobject = userobject ? userobject : {};
	let crownos = [];
	rows.map((row) => {
		if (row.status != '3') {
			crownos.push(row.values['crowno'] ? row.values['crowno'].value : null);
		}
	});
	userobject['scm_originindex'] = i + '';
	userobject['scm_allrownos'] = crownos;
	data.userObject = userobject;
	return data;
}

/**
 * 一主多子表表体编辑后事件结果集处理
 * @param {*} props
 * @param {*} moduleId 表体区域编码
 * @param {*} data 返回的结果res.data.extbillcard
 * @param {*} i
 */
function processExtBillCardBodyEditResult(props, moduleId, data) {
	if (data.extbillcard && data.extbillcard.bodys && data.extbillcard.bodys[moduleId]) {
		let updateArray = [];
		let insertArray = [];
		let insertIndex =
			data.userObject && data.userObject.scm_originindex ? parseInt(data.userObject.scm_originindex) : 1;
		data.extbillcard.bodys[moduleId].rows.forEach((element, i) => {
			if (element.rowid) {
				updateArray.push(element);
			} else {
				insertArray.push({ index: i + insertIndex, data: element });
			}
		});
		props.cardTable.updateDataByRowId(moduleId, { rows: updateArray }, false, false);
		props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
	}
}

/**
 * 一主多子表表体编辑后事件结果集批量处理
 * @param {*} props
 * @param {*} moduleId 表体区域编码
 * @param {*} data 返回的结果res.data.extbillcard
 * @param {*} i
 */
function processExtBillCardBodyEditResult4Batch(props, moduleId, data, indexs) {
	if (data.extbillcard && data.extbillcard.bodys && data.extbillcard.bodys[moduleId]) {
		let updateArray = [];
		let insertArray = [];
		// let insertIndex =
		// 	data.userObject && data.userObject.scm_originindex ? parseInt(data.userObject.scm_originindex) : 1;
		let rows = data.extbillcard.bodys[moduleId].rows;
		let allRows = props.cardTable.getAllRows(moduleId);
		let i = allRows.length;
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: indexs[j], data: row };
			if (indexs[j] < i) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			props.cardTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
		}
		// data.extbillcard.bodys[moduleId].rows.forEach((element, i) => {
		// 	if (element.rowid) {
		// 		updateArray.push(element);
		// 	} else {
		// 		insertArray.push({ index: i + insertIndex, data: element });
		// 	}
		// });
		// props.cardTable.updateDataByRowId(moduleId, { rows: updateArray }, false, false);
		// props.cardTable.insertDataByIndexs(moduleId, insertArray, true);
	}
}

/**
 * 创建表格编辑后事件数据结构
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} areaCode 区域编码
 * @param {*} moduleId
 * @param {*} key
 * @param {*} changedrows
 * @param {*} index
 * @param {*} userobject
 */
function createGridAfterEventData(props, pageCode, areaCode, moduleId, key, changedrows, index, userobject) {
	let meta = props.meta.getMeta();
	let rows = props.editTable.getAllRows(areaCode, false);
	let grid = {
		templetid: meta.pageid,
		pageid: pageCode,
		[areaCode]: {
			areaType: 'table',
			areacode: areaCode,
			rows: [ rows[index] ]
		}
	};
	// 减少上行流量
	grid[areaCode] = simplifyData(grid[areaCode]);
	return {
		attrcode: key,
		changedrows: changedrows,
		grid: grid,
		index: 0,
		indexs: [ 0 ],
		userobject: userobject
	};
}

/**
 * 创建表格编辑后事件数据结构(批处理)
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} areaCode 区域编码
 * @param {*} moduleId
 * @param {*} key
 * @param {*} changedrows
 * @param {*} indexs
 * @param {*} userobject
 */
function createGridAfterEventDataBatch(props, pageCode, areaCode, moduleId, key, changedrows, indexs, userobject) {
	let meta = props.meta.getMeta();
	let rows = props.editTable.getAllRows(areaCode, false);
	let lines = [];
	let newRows = [];
	let changerRows = [];
	let grid = {
		templetid: meta.pageid,
		pageid: pageCode,
		[areaCode]: {
			areaType: 'table',
			areacode: areaCode,
			rows: []
		}
	};
	for (let i = 0; i < indexs.length; i++) {
		if (rows[indexs[i]]) {
			newRows[i] = rows[indexs[i]];
			lines.push(i + '');
		}
		if (changedrows[i]) {
			changerRows.push(changedrows[i]);
		}
	}
	lines.forEach((index) => {
		grid[areaCode].rows.push(newRows[index]);
	});
	// 减少上行流量
	grid[areaCode] = simplifyData(grid[areaCode]);
	return {
		attrcode: key,
		changedrows: changerRows,
		grid: grid,
		index: 0,
		indexs: lines,
		userobject: userobject
	};
}
/**
 * 处理表格编辑后事件结果
 * @param {*} props
 * @param {*} moduleId
 * @param {*} data
 * @param {*} i
 */
function processGridEditResult(props, moduleId, data, i) {
	if (data && data.grid && data.grid[moduleId]) {
		let rows = data.grid[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: i + j, data: row };
			if (j == 0) {
				updateArray.push(obj);
			} else {
				insertArray.push(row);
			}
		}
		if (updateArray.length > 0) {
			props.editTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.editTable.insertRowsAfterIndex(moduleId, insertArray, i);
		}
	}
}
/**
 * 处理表格编辑后事件结果(批处理)
 * @param {*} props
 * @param {*} moduleId
 * @param {*} data
 * @param {*} indexs
 */
function processGridEditResultBatch(props, moduleId, data, indexs) {
	if (data && data.grid && data.grid[moduleId] && data.grid[moduleId].rows.length > 0) {
		let rows = data.grid[moduleId].rows;
		let insertArray = [];
		let updateArray = [];
		let allRows = props.editTable.getAllRows(moduleId);
		let i = allRows.length;
		for (let j = 0; j < rows.length; j++) {
			let row = rows[j];
			let obj = { index: indexs[j], data: row };
			if (indexs[j] < i) {
				updateArray.push(obj);
			} else {
				insertArray.push(obj);
			}
		}
		if (updateArray.length > 0) {
			props.editTable.updateDataByIndexs(moduleId, updateArray);
		}
		if (insertArray.length > 0) {
			props.editTable.insertDataByIndexs(moduleId, insertArray, true);
		}
	}
}
/**
 * 创建表头编辑后事件数据
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域
 * @param {*} tableAreaCode 表体区域
 * @param {*} moduleId 当前区域
 * @param {*} key
 * @param {*} value
 * @param {*} userobject 自定义属性
 * @param {*} bodyFields 需要传递到后台的表体字段数组，如果不传，则传所有字段
 */
function createHeadAfterEventData(
	props,
	pageCode,
	formAreaCode,
	tableAreaCode,
	moduleId,
	key,
	value,
	userobject,
	bodyFields,
	isInclude = true
) {
	let data = props.createHeadAfterEventData(pageCode, formAreaCode, tableAreaCode, moduleId, key, value);
	// 处理上行流量优化
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode]);
	if (bodyFields) {
		data.card.body[tableAreaCode] = simplifyDataByFields(
			data.card.body[tableAreaCode],
			true,
			bodyFields,
			isInclude
		);
	} else {
		data.card.body[tableAreaCode] = simplifyData(data.card.body[tableAreaCode]);
	}

	userobject = userobject ? userobject : {};
	data.userobject = userobject;
	return data;
}

/**
 * 处理表头编辑后事件返回结果的公共方法（处理返回是差异更新的数据）
 * @param {*} props
 * @param {*} formAreaCode
 * @param {*} tableAreaCode
 * @param {*} data
 */
function processBillCardHeadEditResult(props, formAreaCode, tableAreaCode, data) {
	if (data && data.billCard) {
		if (data.billCard.head) {
			props.form.setAllFormValue({ [formAreaCode]: data.billCard.head[formAreaCode] });
		}
		if (data.billCard.body) {
			props.cardTable.updateDiffDataByRowId(tableAreaCode, data.billCard.body[tableAreaCode]);
		}
	}
}

/**
 * 创建一主多子表头编辑后事件数据
 * @param {*} props
 * @param {*} pageCode 页面编码
 * @param {*} formAreaCode 表头区域
 * @param {*} tableAreaCodes 表体区域，数组
 * @param {*} moduleId 当前区域
 * @param {*} key
 * @param {*} value
 * @param {*} userobject 自定义属性
 */
function createExtBillHeadAfterEventData(
	props,
	pageCode,
	formAreaCode,
	tableAreaCodes,
	moduleId,
	key,
	value,
	userobject
) {
	let data = props.createHeadAfterEventData(pageCode, formAreaCode, tableAreaCodes, moduleId, key, value);
	// 处理上行流量优化
	data.card.head[formAreaCode] = simplifyData(data.card.head[formAreaCode], false);
	if (tableAreaCodes instanceof Array) {
		tableAreaCodes.forEach((tableId) => {
			data.card.bodys[tableId] = simplifyData(data.card.bodys[tableId], false);
		});
	}
	userobject = userobject ? userobject : {};
	data.userobject = userobject;
	return data;
}

/**
 * 处理表头编辑后事件返回结果的公共方法（处理返回是差异更新的数据）
 * @param {*} props
 * @param {*} formAreaCode
 * @param {*} tableAreaCodes 表体区域，数组
 * @param {*} data res.data
 */
function processExtBillCardHeadEditResult(props, formAreaCode, tableAreaCodes, data) {
	if (data && data.extbillcard) {
		if (data.extbillcard.head) {
			props.form.setAllFormValue({ [formAreaCode]: data.extbillcard.head[formAreaCode] });
		}
		if (data.extbillcard.bodys) {
			if (tableAreaCodes instanceof Array) {
				tableAreaCodes.forEach((tableId) => {
					if (data.extbillcard.bodys[tableId]) {
						props.cardTable.updateDiffDataByRowId(tableId, data.extbillcard.bodys[tableId]);
					}
				});
			} else {
				props.cardTable.updateDiffDataByRowId(tableAreaCodes, data.extbillcard.bodys[tableAreaCodes]);
			}
		}
	}
}

export {
	createGridAfterEventData,
	createBodyAfterEventData,
	createBodyAfterEventData4Son,
	createSonAfterEventData4Son,
	createHeadAfterEventData,
	createExtBodyAfterEventData,
	processBillCardHeadEditResult,
	processBillCardGrandSonEditResult,
	processBillCardBodyEditResult,
	processBillCardBodyEditResultNotAddRow,
	processGridEditResult,
	processExtBillCardBodyEditResult,
	createExtBillHeadAfterEventData,
	processExtBillCardHeadEditResult,
	createBodyAfterEventData4Batch,
	processBillCardBodyEditResult4Batch,
	createGridAfterEventDataBatch,
	processGridEditResultBatch,
	createBodyAfterEventData4BatchMore,
	processExtBillCardBodyEditResult4Batch,
	createBodyAfterEventData4BatchHasSon
};
