/*
 * @Author: wangceb
 * @PageInfo: 差异更新
 * @Date: 2018-12-26 13:41:11
 * @Last Modified by: CongKe
 * @Last Modified time: 2020-02-17 15:29:27
 */
function updateDtaForCompareByPk(props, bill, config) {
	let { headAreaId, bodyAreaId, bodyPKfield } = config;
	props.form.setAllFormValue({ [headAreaId]: bill.head[headAreaId] });
	bill.head[headAreaId].rows = props.form.getAllFormValue(headAreaId).rows;

	let newBodyData = bill.body[bodyAreaId];
	let oldtabledata = props.cardTable.getVisibleRows(bodyAreaId);
	let rowidPkMap = {};
	oldtabledata.forEach(rowdata => {
		let pk = rowdata.values[bodyPKfield].value;
		rowidPkMap[pk] = rowdata.rowid;
	});

	// 补充后台返回的数据结构的rowid,后台返回结构的rowid为行数据的主键
	newBodyData.rows.forEach(rowdata => {
		let rowid = rowidPkMap[rowdata.rowid];
		rowdata.rowid = rowid;
	});

	let fulltabledata = props.cardTable.updateDataByRowId(bodyAreaId, newBodyData, true);
	bill.body[bodyAreaId] = fulltabledata;

	return bill;
}

/**
 * 一主多子单点差异更新
 * @param {*} props
 * @param {*} grid res.data
 * @param {*} config
 */
function updateGridDataForCompareByPk(props, grid, config) {
	let { AreaId, bodyPKfield } = config;
	let newData = grid[AreaId];
	let oldData = props.editTable.getAllRows(AreaId);
	let rowidPkMap = {};
	oldData.forEach(rowdata => {
		let pk = rowdata.values[bodyPKfield].value;
		rowidPkMap[pk] = rowdata.rowid;
	});
	// 补充后台返回的数据结构的rowid,后台返回结构的rowid为行数据的主键
	newData.rows.forEach(rowdata => {
		let rowid = rowidPkMap[rowdata.rowid];
		rowdata.rowid = rowid;
	});
	//props.editTable.updateDiffDataByRowId(AreaId, newData);
	props.editTable.updateDataByRowId(AreaId, newData);
}

/**
 * 一主多子单点差异更新
 * @param {*} props
 * @param {*} bill res.data
 * @param {*} config {如果不需要处理Rowid需要传isHaveRowid:true,否则不传}
 */
function updateExtBillDataForCompareByPk(props, bill, config) {
	let { headAreaId, bodyIdAndPkMap, baseBack, isHaveRowid } = config;
	props.form.setAllFormValue({ [headAreaId]: bill.head[headAreaId] });
	bill.head[headAreaId].rows = props.form.getAllFormValue(headAreaId).rows;
	bodyIdAndPkMap.forEach((bodyAreaId, bodyPKfield) => {
		let newBodyData = bill.bodys[bodyAreaId];
		if (newBodyData) {
			if (!isHaveRowid) {
				let oldtabledata = props.cardTable.getVisibleRows(bodyAreaId);
				let rowidPkMap = new Map();
				oldtabledata.forEach(rowdata => {
					let pk = rowdata.values[bodyPKfield];
					pk = !pk ? pk : pk.value;
					rowidPkMap.set(pk, rowdata.rowid);
				});
				// 补充后台返回的数据结构的rowid,后台返回结构的rowid为行数据的主键
				newBodyData.rows.forEach(rowdata => {
					if (JSON.stringify(rowdata.values) != '{}' || baseBack) {
						// 后台返回数据 表体pk放置到了rowid上面
						let bpk = rowdata.rowid;
						let rowid = rowidPkMap.get(bpk);
						rowdata.rowid = rowid;
					}
				});
			}
			let fulltabledata;
			if (baseBack) {
				// 后台新增了表体行数据,进行diff更新
				fulltabledata = props.cardTable.updateDiffDataByRowId(bodyAreaId, newBodyData, true, true, false);
			} else {
				fulltabledata = props.cardTable.updateDataByRowId(bodyAreaId, newBodyData, true);
			}
			bill.bodys[bodyAreaId] = fulltabledata;
		}
	});
	return bill;
}
export { updateDtaForCompareByPk, updateExtBillDataForCompareByPk, updateGridDataForCompareByPk };
