/**
 * 封装主子孙的结构
 * @param {*} pagecode 页面pagecode
 * @param {*} headid 主表id
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} isCompress 压缩流量
 */
function createGrandsonData(pagecode, headid, bodyid, childid, isCompress = true) {
	let data = {};
	if (isCompress) {
		data = this.props.createMasterChildDataSimple(pagecode, headid, bodyid);
	} else {
		data = this.props.createMasterChildData(pagecode, headid, bodyid);
	}
	let childData = this.props.cardTable.getAllGrandData({ parentId: bodyid });
	dealChildData(childData, childid);
	data.grandson = childData;
	daleDataPseudocolumn(data, bodyid);
	return data;
}

/**
 * 处理伪列的值 后台需要伪列处理子表孙表关系
 * @param {} data 
 */
function daleDataPseudocolumn(data, bodyid) {
	//处理子表伪列
	data.body[bodyid].rows.forEach((item, i) => {
		if (item.values.pseudocolumn) {
			item.values.pseudocolumn.value = JSON.stringify(i);
		} else {
			item.values.pseudocolumn = { value: JSON.stringify(i) };
		}
	});
	return data;
}

/**
 * 处理孙表数据格式
 * @param {*} childData 
 * @param {*} childid 
 */
function dealChildData(childData, childid) {
	for (let index in childData) {
		let newitem = {};
		newitem.areaType = 'table';
		newitem.areacode = childid;
		newitem.rows = childData[index][childid].rows;
		childData[index] = { [childid]: newitem };
	}
}

/**
 * 孙表数据填充
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} record 孙表数据
 * @param {*} isCache 是否缓存 默认true
 * @param {*} isTop 默认false
 */
function setGrandsonData(bodyid, bodyPkCode, childid, record, isCache = true, isTop = false) {
	let props = this.props;
	Object.keys(record).forEach(function(key) {
		//由于新增的没有主键，所以前台按照rowId对孙表做隔离,先转一下
		let rowId = props.cardTable.getRowIdFromPkcode({
			parentId: bodyid,
			plcodeValue: key
		});
		props.cardTable.setGrandTableData({
			rowid: rowId,
			parentId: bodyid,
			tableId: childid,
			data: { rows: record[key][childid].rows },
			callback: () => {},
			isCache: isCache,
			isTop: isTop
		});
	});
}

/**
 *  孙表数据为空填充
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} isCache 是否缓存 默认true
 * @param {*} isTop 默认false
 */
function setGrandsonNullData(bodyid, childid, isCache = true, isTop = false) {
	let _props = this.props;
	let bodyDatas = _props.cardTable.getAllRows(bodyid);
	bodyDatas.forEach((row) => {
		let rowId = row.rowid;
		_props.cardTable.setGrandTableData({
			rowid: rowId,
			parentId: bodyid,
			tableId: childid,
			data: { rows: [] },
			callback: () => {},
			isCache: isCache,
			isTop: isTop
		});
	});
}

/**
 * 将被改变行的孙表赋值空数据
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} isCache 是否缓存 默认true
 * @param {*} isTop 默认false
 */
function setGrandsonNullDataForRow(bodyid, childid, isCache = true, isTop = false) {
	let _props = this.props;
	let changeRows = _props.cardTable.getChangedRows(bodyid);
	changeRows.forEach((row) => {
		//状态为2的 为新增行
		if (row.status == 2) {
			let flag = true;
			//没建立子孙关系的，需要先建立，有的就不用重新复空
			let grandRows = _props.cardTable.getAllGrandData({ parentId: bodyid });
			Object.keys(grandRows).forEach(function(key) {
				if (key == row.rowid) {
					flag = false;
					return;
				}
			});
			if (flag) {
				_props.cardTable.setGrandTableData({
					rowid: row.rowid,
					parentId: bodyid,
					tableId: childid,
					data: { rows: [] },
					callback: () => {},
					isCache: isCache,
					isTop: isTop
				});
			}
		}
	});
}

/**
 * 获取点击行的表体所对应的孙表数据
 * @param {*} bodyid 
 * @param {*} childid 
 * @param {*} rowid
 */
function getGrandsonDataByBody(bodyid, childid, rowid) {
	let bodyRows = this.props.cardTable.getClickRowIndex(bodyid);
	rowid = rowid ? rowid : bodyRows.record.rowid;
	let grandRows = this.props.cardTable.getAllGrandData({ parentId: bodyid });
	let sonRows = [];
	Object.keys(grandRows).forEach(function(key) {
		if (key == rowid) {
			sonRows = grandRows[key][childid].rows;
		}
	});
	return sonRows;
}

/**
 * 删除子表行时，更新该子表的孙表行状态为删除态
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} rowIds 子表rowids 数组
 */
function delBodyRow(bodyid, childid, rowIds) {
	//根据rowid获取当前子表的孙表数据，并更新状态为删除状态
	let childData = this.props.cardTable.getAllGrandData({ parentId: bodyid });
	Object.keys(childData).forEach(function(key) {
		rowIds.forEach((rid) => {
			if (key == rid) {
				//孙表的rows
				let childrows = childData[key][childid].rows;
				childrows.forEach((crow) => {
					crow.status = 3;
				});
			}
		});
	});
}

/**
 * 孙表空行过滤
 * @param {*} bodyid 子表id
 * @param {*} childid 孙表id
 * @param {*} keys 排除的字段数组
 */
function filterChildEmptyRows(bodyid, childid, keys) {
	let childData = this.props.cardTable.getAllGrandData({ parentId: bodyid });
	Object.keys(childData).forEach(function(key) {
		let newRows = [];
		let rows = childData[key][childid].rows;
		rows.forEach((item, index) => {
			let values = item.values;
			let tempArr = Object.keys(values).filter((item) => item != 'numberindex');
			if (Array.isArray(keys)) {
				tempArr = tempArr.filter((val) => {
					return keys.every((key) => {
						return val !== key;
					});
				});
			}
			// flag 为true 说明每个字段  （要不然不是对象  TODO ? 应该不需要判断, 略）   或者 没值
			let flag = tempArr.every((one) => isWrongFalse(values[one] ? values[one].value : ''));
			if (flag) {
				if (rows[index].status != '2') {
					rows[index].status = '3';
					newRows.push(rows[index]);
				}
			} else {
				newRows.push(rows[index]);
			}
		});
		childData[key][childid].rows = newRows;
	});
}

function isWrongFalse(value) {
	return value == '' || value == null;
}

//----------------------------------------------------------------------------------------------------------
/**
 * 按照平台框架结构组装数据
 * @param {*} props 
 * @param {*} pagecode 
 * @param {*} headAreaCode 
 * @param {*} bodyAreaCode 
 * @param {*} sonAreaCode 
 * @param {*} relatefield 
 */
function createGrandsonDataNew(
	props,
	pagecode,
	headAreaCode,
	bodyAreaCode,
	sonAreaCode,
	relatefield,
	sonfield,
	isfilterDelete = true
) {
	let data = props.createMasterChildDataSimple(pagecode, headAreaCode, bodyAreaCode);
	let sonData = props.cardTable.getAllGrandData({ parentId: bodyAreaCode });

	let newBodyRows = [];
	let rowIds = [];
	let bodyRows = data.body[bodyAreaCode].rows;
	for (let i = 0; i < bodyRows.length; i++) {
		const row = bodyRows[i];
		row.values.pseudocolumn = { value: i + '' };
		if (isfilterDelete && row.status == '3' && row.values[relatefield].value == null) {
			// 如果过滤删除行，则不添加到数组中
		} else {
			rowIds.push(row.rowid);
			newBodyRows.push(row);
		}
	}
	data.body[bodyAreaCode].rows = newBodyRows;

	let newSonRows = [];
	for (let i = 0; i < rowIds.length; i++) {
		const rowId = rowIds[i];
		if (sonData && sonData[rowId] && sonData[rowId][sonAreaCode]) {
			let sonRows = sonData[rowId][sonAreaCode].rows;
			sonRows.forEach((row) => {
				// 用是否包含主键来判断新增行，用status == '2'判断有时会判断错误
				if (row.values[sonfield].value == null || row.values[sonfield].value == '') {
					let bodypk;
					// 新增态判断表体行是否存在主键，如果存在的话，则等于主键，否则等于rowid
					if (props.cardTable.getValByKeyAndRowId(bodyAreaCode, rowId, relatefield)) {
						bodypk = props.cardTable.getValByKeyAndRowId(bodyAreaCode, rowId, relatefield).value;
					}
					if (bodypk) {
						row.values[relatefield] = { value: bodypk, display: null };
					} else {
						row.values[relatefield] = { value: rowId, display: null };
					}
				}
				// 清除伪列数据
				row.values['pseudocolumn'] = { display: null, value: null };
				if (isfilterDelete && row.status == '3' && row.values[sonfield].value == null) {
					// 如果过滤删除行，则不添加到数组中
				} else {
					newSonRows.push(row);
				}
			});
		}
	}
	data.grandSons = {
		[sonAreaCode]: {
			areaType: 'table',
			areacode: sonAreaCode,
			rows: newSonRows
		}
	};
	return data;
}

/**
 * 将孙表设值到对应的数据上
 * @param {*} props 
 * @param {*} bodyData 
 * @param {*} grandData 
 * @param {*} relatefield 
 */
function setGrandSonTableData(
	props,
	bodyAreaCode,
	sonAreaCode,
	data,
	relatefield,
	isDiffUpdate = false,
	isCache = true,
	shouldForceUpdate = false
) {
	if (
		data.body[bodyAreaCode] &&
		data.body[bodyAreaCode].rows &&
		data.grandSons[sonAreaCode] &&
		data.grandSons[sonAreaCode].rows
	) {
		let bodyRows = data.body[bodyAreaCode].rows;
		let grandSonRows = data.grandSons[sonAreaCode].rows;

		let keyMap = {};
		let pseudocolumnKey = [];
		bodyRows.forEach((row) => {
			let pk = row.values[relatefield].value;
			if (!pk) {
				pk = row.values['pseudocolumn'].value;
				pseudocolumnKey.push(pk);
			}
			let rowid = row.rowid;
			keyMap[pk] = rowid;
		});

		let keyMapList = {};
		grandSonRows.forEach((row) => {
			let pk = row.values[relatefield].value;
			// 因为此处取出来的值可能是伪列，也可能是rowid, 也可能是主键
			if (keyMap[pk]) {
				// 是伪列和主键的场景已经再上次遍历中确定
				if (pseudocolumnKey.includes(pk)) {
					// 如果是伪列的话重置为rowid ,因为关联字段在后台只能够识别 主键或rowid
					row.values[relatefield].value = keyMap[pk];
				}
				// 统一使用rowid作为孙表行的归属判断
				pk = keyMap[pk];
			}
			// 如果不在上次遍历中，则认为当前已经是rowid了属于处理过的数据
			if (!keyMapList[pk]) {
				keyMapList[pk] = [];
			}
			keyMapList[pk].push(row);
		});

		for (const relatePk in keyMap) {
			if (keyMap.hasOwnProperty(relatePk)) {
				props.cardTable.setGrandTableData({
					rowid: keyMap[relatePk],
					parentId: bodyAreaCode,
					tableId: sonAreaCode,
					data: { rows: keyMapList[keyMap[relatePk]] },
					shouldForceUpdate: shouldForceUpdate,
					isCache: isCache,
					isDiffUpdate: isDiffUpdate
				});
			}
		}
	}
}

export {
	createGrandsonData,
	createGrandsonDataNew,
	setGrandSonTableData,
	setGrandsonData,
	setGrandsonNullData,
	setGrandsonNullDataForRow,
	getGrandsonDataByBody,
	delBodyRow,
	filterChildEmptyRows
};
