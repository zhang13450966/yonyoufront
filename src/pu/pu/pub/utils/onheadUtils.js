/**
 * 库存单据存量查拣前处理数据
 * @param {单据类型} billtype
 * @param {表头数据} head
 * @param {行数据} rows
 * @param {表头字段集合} headDims
 */
export function processBeforeOnHand(billtype, head, rows, headDims, indexToRowMap) {
	if (!billtype || !rows || !rows.rows || !rows.rows[0]) {
		return [];
	}
	let realRows = [];
	//过滤掉物料为空的行
	rows.rows.forEach((item) => {
		if (item && item.values && item.values.cmaterialvid && item.values.cmaterialvid.value) {
			realRows.push(item);
		}
	});
	//先获取表头维度字段
	if (head && headDims) {
		realRows.forEach((rowItem) => {
			headDims.forEach((dimItem) => {
				if (head.rows[0].values[dimItem]) {
					rowItem.values[dimItem] = head.rows[0].values[dimItem];
				}
			});
			//组装拆卸形态转换  仓库在表体 字段与存量查拣页面中对应不上 需要处理下
			if (billtype == '4L' || billtype == '4M' || billtype == '4N' || billtype == '20' || billtype == '422X') {
				rowItem.values.cwarehouseid = rowItem.values.cbodywarehouseid;
			}
		});
	}

	//盘点单不考虑数量
	if (billtype == '4R') {
		return rows;
	}
	let specialList = [ '4K', '4Q', '4N', '4O', '4P', '4L', '4M', '4455' ];
	if (specialList.indexOf(billtype) >= 0) {
		realRows.forEach((item) => {
			item.values.onhandshouldnum = item.values.nnum || { value: null };
			item.values.onhandshouldassnum = item.values.nassistnum || { value: null };
			item.values.onhandcurrentnum = {};
			item.values['cmaterialoid.pk_measdoc'] = item.values.cunitid;
			item.values['cmaterialvid.pk_measdoc.name'] = item.values.cunitid;
			// item = clearEmptyColumn(item);
			// item.values.fulfiltype = { value: '已满足' };
		});
	} else {
		realRows.forEach((item) => {
			item.values.onhandshouldnum = item.values.nshouldnum || { value: null };
			item.values.onhandshouldassnum = item.values.nshouldassistnum || { value: null };
			item.values.onhandcurrentnum = item.values.nnum || { value: null };
			item.values['cmaterialoid.pk_measdoc'] = item.values.cunitid;
			if (item.values.nnum && item.values.nshouldnum) {
				if (item.values.nnum.value > item.values.nshouldnum.value) {
					item.values.fulfiltype = { value: '已超出' }; /* 国际化处理： 已超出*/
				} else {
					item.values.fulfiltype = { value: '已满足' }; /* 国际化处理： 已满足*/
				}
			} else {
				item.values.fulfiltype = { value: '' };
			}
			// item = clearEmptyColumn(item);
		});
	}
	return { rows: realRows, indexToRowMap };
}
