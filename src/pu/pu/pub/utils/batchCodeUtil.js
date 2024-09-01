import { TOBillType } from '../enum';
import { deepClone } from 'nc-lightapp-front';

// ---------------------------------批次号编辑后处理------------------------------------------------
/**
 * 处理批次号返回值
 * @param {*} props
 * @param {*} moduleId
 * @param {*} rows
 * @param {*} clearfields  需要清空字段的数组
 */

function processBatchCodeValue(props, moduleId, rows, clearfields) {
	if (!rows) {
		return;
	}

	if (rows.length == 0) {
		return;
	}
	// add by chaiwx，row.values中存在一个refpk='xxxx'的字段，暂时无用，但会导致后台报错。这里清空一下。
	rows.forEach((row) => {
		if (row && row.values && row.values.refpk) {
			row.values.refpk = {};
		}
	});
	// 构建批次号后台结构
	let grid = {
		model: {
			rows: rows
		}
	};
	return {
		scm_vbatchcode: JSON.stringify(grid),
		scm_clearfields: clearfields
	};
}

function processBatchCodeAfterEdit(props, moduleId, record, index, rows, clearFields) {
	if (!record && !rows) {
		return;
	}
	let returnRows = rows[0]
		? rows[0].preStore ? rows[0].preStore : rows[0].usable ? rows[0].usable : rows[0].addBatch
		: [];
	let newRow = processBatchCodeReturnData(record, returnRows, clearFields);
	if (newRow) {
		let indexArray = [ index + '' ];
		//第一个元素更新，剩余的元素插入
		props.cardTable.updateDataByIndexs(moduleId, newRow[0]);
		if (newRow.length > 0) {
			//从第二个元素开始循环，构建数组用来新增
			let insertRows = [];
			for (let i = 1; i < newRow.length; i++) {
				let insertRow = { index: index + i, data: newRow[i] };
				insertRows.push(insertRow);
				indexArray.push(index + i + '');
			}
			props.cardTable.insertDataByIndexs(moduleId, insertRows);
		}
		return indexArray;
	}
}

/**
 * 处理批次号返回值
 * @param {*} oldRow 
 * @param {*} newRows 
 * @param {*} clearFields 
 */
function processBatchCodeReturnData(oldRow, newRows, clearFields) {
	if (!oldRow || !newRows || !newRows[0]) {
		return oldRow;
	}
	let realRows = [];
	if (newRows.length == 1) {
		realRows.push(processCurRow(oldRow, newRows[0]));
	} else {
		realRows.push(processCurRow(oldRow, newRows[0]));
		for (let i = 1; i < newRows.length; i++) {
			let tempRow = deepClone(oldRow);
			tempRow.status = 2;
			// 清空行号
			clearRowFields(tempRow, clearFields);
			realRows.push(processCurRow(tempRow, newRows[i]));
		}
	}
	return realRows;
}

/**
 * 清空复制的行的相关字段
 * @param {*} row 
 * @param {*} clearFields 
 */
function clearRowFields(row, clearFields) {
	row.values['crowno'] = { value: null, display: null };
	if (clearFields) {
		clearFields.forEach((field) => {
			let scale = row.values[field].scale;
			row.values[field] = { value: null, scale: scale, display: null };
		});
	}
}

/**
 * 处理单行数据
 * @param {*} oldRow 
 * @param {*} newRow 
 */
function processCurRow(oldRow, newRow) {
	if (!oldRow || !newRow) {
		return [ oldRow ];
	}
	oldRow.values['pk_batchcode'] = newRow.values['pk_batchcode'];
	//单据上批次号是参照类型，参照框中是字符串类型，参照类型不许要有display才能显示
	oldRow.values['vbatchcode'] = newRow.values['vbatchcode']
		? { value: newRow.values['vbatchcode'].value, display: newRow.values['vbatchcode'].value }
		: null;
	return oldRow;
}

//----------------------------------批次号编辑前处理---------------------------------------------
/**
 * 处理批次号字段
 * @param {*} props 
 * @param {*} moduleId 区域ID
 * @param {*} key item字段
 * @param {*} headData 当前行数据
 * @param {*} billtype 单据类型
 */
function processBatchCodeItem(props, moduleIds, key, headData, billtype) {
	// 预处理数据
	let headRows = processBatchCodeHeadData(headData, billtype);
	this.setState({
		headRows: headRows
	});
	// 渲染对应的批次号
	let meta = props.meta.getMeta();

	if (moduleIds instanceof Array) {
		moduleIds.forEach((moduleId) => {
			let item = meta[moduleId].items.find((item) => item.attrcode == key);
			item.itemtype = 'refer';
			item.refcode = 'ic/refer/onhand/onhandRef/index.js';
			item.headRows = headRows;
			item.appcode = '400403200';
			item.headTemplateCode = '400403200_batchcodeH';
			item.bodyTemplateCode = '400403200_batchcodeB';
		});
	} else {
		let item = meta[moduleIds].items.find((item) => item.attrcode == key);
		item.itemtype = 'refer';
		item.refcode = 'ic/refer/onhand/onhandRef/index.js';
		item.headRows = headRows;
		item.appcode = '400403200';
		item.headTemplateCode = '400403200_batchcodeH';
		item.bodyTemplateCode = '400403200_batchcodeB';
	}

	//item.undealNumCode = 'onhandshouldnum';
	//item.thisNumCode = 'onhandcurrentnum';
	//item.isSatisfyCode = 'fulfiltype';
	// props.renderItem(meta[moduleId].moduletype, moduleId, key, null);
	props.meta.setMeta(meta);
}

/**
 * 处理批次号表头数据
 * @param {*} headData 
 * @param {*} billtype 
 */
function processBatchCodeHeadData(headData, billtype) {
	let row = { values: {} };
	Object.keys(BATCHCODEHEAD).forEach((key) => {
		let field = BATCHCODEHEAD[key];
		if (field == BATCHCODEHEAD.pk_group) {
			//集团
		} else if (field == BATCHCODEHEAD.cwarehouseid) {
			//仓库
			setWareHouseId(row, headData, field, billtype);
		} else if (field == BATCHCODEHEAD.pk_org) {
			//组织
			setPkOrg(row, headData, field, billtype);
		} else if (field == BATCHCODEHEAD.cmaterialvid) {
			//物料版本
			row.values[field] = headData.values['pk_material'];
		} else if (field == BATCHCODEHEAD.cmaterialvid_name) {
			//物料名称
			row.values[field] = headData.values['pk_material.name'];
		} else if (field == BATCHCODEHEAD.cmaterialvid_materialspec) {
			//物料规格
			row.values[field] = headData.values['pk_material.materialspec'];
		} else if (field == BATCHCODEHEAD.cmaterialvid_materialtype) {
			//物料型号
			row.values[field] = headData.values['pk_material.materialtype'];
		} else if (field == BATCHCODEHEAD.cmaterialoid) {
			//物料
			row.values[field] = headData.values['pk_srcmaterial'];
		} else if (field == BATCHCODEHEAD.onhandshouldassnum) {
			//待处理辅数量
			row.values[field] = headData.values['nastnum'];
		} else if (field == BATCHCODEHEAD.onhandshouldnum) {
			//待处理主数量
			row.values[field] = headData.values['nnum'];
		} else if (field == BATCHCODEHEAD.cvmivenderid) {
			//物权供应商(VMI)
			setVmivenderId(row, headData, field, billtype);
		} else if (field == BATCHCODEHEAD.cvendorid) {
			//供应商
			setCvendoridId(row, headData, field, billtype);
		} else {
			row.values[field] = headData.values[field];
		}
	});
	return { rows: [ row ] };
}

/**
 * 设置组织
 * @param {*} row 
 * @param {*} headData 
 * @param {*} field 
 * @param {*} billtype 
 */
function setPkOrg(row, headData, field, billtype) {
	if (TOBillType.storereq === billtype) {
		//物资需求申请单
		row.values[field] = headData.values['pk_org'];
	} else if (TOBillType.praybill === billtype) {
		//请购单
		row.values[field] = headData.values['pk_org'];
	} else if (TOBillType.pooder === billtype) {
		//采购订单
		row.values[field] = headData.values['pk_reqstoorg'];
	} else if (TOBillType.puinvoice == billtype) {
		// 采购发票
		row.values[field] = headData.values['pk_stockorg'];
	} else {
		//主组织
		row.values[field] = headData.values['pk_org'];
	}
}
/**
 * 设置仓库
 * @param {*} row 
 * @param {*} headData 
 * @param {*} field 
 * @param {*} billtype 
 */
function setWareHouseId(row, headData, field, billtype) {
	if (TOBillType.storereq === billtype) {
		//物资需求申请单
		row.values[field] = headData.values['pk_reqstordoc'];
	} else if (TOBillType.praybill === billtype) {
		//请购单
		row.values[field] = headData.values['pk_reqstor'];
	} else if (TOBillType.pooder === billtype) {
		//采购订单  收货仓库
		row.values[field] = headData.values['pk_recvstordoc'];
	} else if (TOBillType.puinvoice == billtype) {
		// 采购发票
		row.values[field] = headData.values['pk_stordoc'];
	} else if (TOBillType.arrive == billtype) {
		//到货单
		row.values[field] = headData.values['pk_receivestore'];
	} else {
		row.values[field] = headData.values['pk_reqstordoc'];
	}
}
/**
 * 设置供应商
 * @param {*} row 
 * @param {*} headData 
 * @param {*} field 
 * @param {*} billtype 
 */
function setVmivenderId(row, headData, field, billtype) {
	if (TOBillType.storereq === billtype) {
		//row.values[field] = headData.values['cvmivenderid'];
	} else if (TOBillType.puinvoice == billtype) {
		// 采购发票
		// row.values[field] = headData.values['pk_supplier'];
	} else {
		//row.values[field] = headData.values['cvmivenderid'];
	}
}
/**
 * 设置供应商
 * @param {*} row 
 * @param {*} headData 
 * @param {*} field 
 * @param {*} billtype 
 */
function setCvendoridId(row, headData, field, billtype) {
	if (TOBillType.storereq === billtype) {
		row.values[field] = headData.values['cvendorid'];
	} else if (TOBillType.praybill === billtype) {
		//请购单
		row.values[field] = headData.values['pk_suggestsupplier'];
	} else if (TOBillType.pooder === billtype) {
		//采购订单 供应商
		row.values[field] = headData.values['pk_supplier'];
	} else if (TOBillType.puinvoice == billtype) {
		// 采购发票
		row.values[field] = headData.values['pk_supplier'];
	} else if (TOBillType.arrive == billtype) {
		//到货单
		row.values[field] = headData.values['pk_supplier'];
	} else {
		row.values[field] = headData.values[field];
	}
}

const BATCHCODEHEAD = {
	crowno: 'crowno',
	pk_group: 'pk_group', //集团
	cwarehouseid: 'cwarehouseid', //仓库
	pk_org: 'pk_org', //库存组织
	cmaterialvid: 'cmaterialvid', //物料编码
	cmaterialvid_name: 'cmaterialvid.name', //物料名称
	cmaterialvid_materialspec: 'cmaterialvid.materialspec', //规格
	cmaterialvid_materialtype: 'cmaterialvid.materialtype', //型号
	cunitid: 'cunitid', //主单位
	cmaterialoid: 'cmaterialoid', //物料
	castunitid: 'castunitid', //单位
	cffileid: 'cffileid', //特征码
	pk_onhanddim: 'pk_onhanddim', //现存量维度主键
	clocationid: 'clocationid', //货位
	pk_batchcode: 'pk_batchcode', //批次
	vbatchcode: 'vbatchcode', //批次号
	vchangerate: 'vchangerate', //换算率
	cvmivenderid: 'cvmivenderid', //寄存供应商
	ctplcustomerid: 'ctplcustomerid', //货主客户
	cstateid: 'cstateid', //库存状态
	cvendorid: 'cvendorid', //供应商
	cprojectid: 'cprojectid', //项目
	cproductorid: 'cproductorid', //生产厂商
	casscustid: 'casscustid', //客户
	vfree1: 'vfree1', //物料自由属性1
	vfree2: 'vfree2',
	vfree3: 'vfree3',
	vfree4: 'vfree4',
	vfree5: 'vfree5',
	vfree6: 'vfree6',
	vfree7: 'vfree7',
	vfree8: 'vfree8',
	vfree9: 'vfree9',
	vfree10: 'vfree10',
	vhashcode: 'vhashcode', //散列码
	vsubhashcode: 'vsubhashcode', //辅散列码
	ts: 'ts', //时间戳
	onhandshouldassnum: 'onhandshouldassnum', //本次数量
	onhandshouldnum: 'onhandshouldnum' //本次主数量
};

export { processBatchCodeItem, processBatchCodeValue };
