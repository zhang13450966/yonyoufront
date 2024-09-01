/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置编辑后事件处理 
 * @Date: 2018-05-10 09:40:40 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-17 10:40:34
 */
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST } from '../const';
import { createGridAfterEventData } from '../../../../../scmpub/scmpub/pub/tool/afterEditUtil';

export default function(props, moduleId, key, value, changedrows, index) {
	if (key === 'code') {
		if (value && value != null && value != '') {
			autoAddLine.call(this, props, index, moduleId);
		}
	}
	if (key === 'cemployeeid') {
		if (value.refpk != null) {
			autoAddLine.call(this, props, index, moduleId);
			props.editTable.setValByKeyAndIndex(moduleId, index, key + '.name', {
				value: value.refpk,
				display: value.refname
			});
			props.editTable.setValByKeyAndIndex(moduleId, index, key, {
				value: value.refpk,
				display: value.refcode
			});

			// 1.获取当前编辑行的数据
			let currentCode = props.editTable.getValByKeyAndIndex(moduleId, index, 'code').value;
			let currentName = props.editTable.getValByKeyAndIndex(moduleId, index, 'name').value;
			let currentHid = props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_position').value;
			let currentBid = props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_position_b').value;
			let currentPsnid = value.refpk;
			let currentPsncode = value.refcode;
			let currentPsnName = value.refname;
			// 2.遍历每一行
			// (1)修改-若当前编辑行的表体主键不为空 且 该行的表头主键 + 岗位编码 + 岗位名称 + 业务员id 与 当前编辑行的相等，则刷新其他行的人员信息
			// (2)新增-若当前编辑行的表体主键为空，则不刷新其他行人员信息
			// --无效，改为保存前赋主键--(3)若当前编辑行的表体主键为空，若当前行的岗位编码 + 岗位名称 + 业务员id 与 已有行相等，则给当前编辑行赋主键，否则不赋
			if (currentBid && currentBid != null && currentBid != '') {
				let allData = props.editTable.getAllData(moduleId);
				for (let i = 0; i < allData.rows.length; i++) {
					if (
						allData.rows[i].values.pk_position.value == currentHid &&
						allData.rows[i].values.code.value == currentCode &&
						allData.rows[i].values.name.value == currentName
					) {
						props.editTable.setValByKeyAndIndex(moduleId, i, 'cemployeeid', {
							value: currentPsnid,
							display: currentPsncode
						});
						props.editTable.setValByKeyAndIndex(moduleId, i, 'cemployeeid.name', {
							value: currentPsnName,
							display: currentPsnName
						});
					}
				}
			}
		} else if (value.refpk == null || value.refpk == undefined) {
			// 清空采购员编码时，清空采购员名称（此时无需清空其他行，保存的时候自然会报错）
			props.editTable.setValByKeyAndIndex(moduleId, index, key + '.name', {
				value: null,
				display: null
			});
		}
	}

	// 岗位名称编辑事件
	if (key === 'name') {
		let name_1 = '';
		let name_2 = '';
		let name_3 = '';
		if(value.name){
			name_1 = value.name.value
		}
		if(value.name2){
			name_2 = value.name2.value
		}
		if(value.name3){
			name_3 = value.name3.value
		}
		if (name_1 != '' || name_2 != '' || name_3 != '') {
			autoAddLine.call(this, props, index, moduleId);
		}
		// 当前编辑行的数据
		let currentHid = props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_position').value;
		let currentCode = props.editTable.getValByKeyAndIndex(moduleId, index, 'code').value;
		let currentPsn = props.editTable.getValByKeyAndIndex(moduleId, index, 'cemployeeid').value;
		let currentBid = props.editTable.getValByKeyAndIndex(moduleId, index, 'pk_position_b').value;
		// (1)新增时，当前编辑行的表体主键为空，则无需刷新其他行
		// (2)修改时，当前编辑行的表体主键不为空，若表头主键 + 岗位编码 + 人员id相等，则刷新其他行
		if (currentBid && currentBid != '' && currentBid != null) {
			let allData = props.editTable.getAllData(moduleId);
			for (let i = 0; i < allData.rows.length; i++) {
				if (
					allData.rows[i].values.pk_position.value == currentHid &&
					allData.rows[i].values.code.value == currentCode &&
					allData.rows[i].values.cemployeeid.value == currentPsn
				) {
					props.editTable.setValByKeyAndIndex(moduleId, i, 'name', {
						value: name_1,
						display: name_1
					});
					props.editTable.setValByKeyAndIndex(moduleId, i, 'name2', {
						value: name_2,
						display: name_2
					});
					props.editTable.setValByKeyAndIndex(moduleId, i, 'name3', {
						value: name_3,
						display: name_3
					});
				}
			}
		}
	}

	// 处理单行的物料基本分类、物料采购分类和物料多选增行
	if (key == 'pk_srcmaterial' || key === 'pk_marbasclass' || key === 'pk_marpuclass') {
		if (value.length == 0) {
			let empty = {
				value: '',
				display: ''
			};
			// 清空
			if (key === 'pk_srcmaterial') {
				props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial', empty);
				props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', empty);
				props.editTable.setValByKeyAndIndex(moduleId, index, 'material_code', empty);
				props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial.name', empty);
			}
			if (key === 'pk_marpuclass' || key === 'pk_marbasclass') {
				if (key === 'pk_marpuclass') {
					props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass', empty);
					props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass.name', empty);
					props.editTable.setValByKeyAndIndex(moduleId, index, 'marpuclass_code', empty);
				}
				if (key === 'pk_marbasclass') {
					props.editTable.setValByKeyAndIndex(moduleId, index, 'marbasclass_code', empty);
					props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass.name', empty);
				}
			}
			props.editTable.setValByKeyAndIndex(moduleId, index, key + '.name', empty);
		} else if (value.length == 1) {
			autoAddLine.call(this, props, index, moduleId);
			// 单选赋值
			setSingleSelValue('singleselect', props, key, moduleId, index, value);
		} else if (value.length > 1) {
			// 多选:后根据目前行的岗位、人员信息为选择的其他物料行赋值
			let usermap = new Map();
			let indexArr = [];
			for (let z = 0; z < changedrows.length; z++) {
				indexArr.push(index + z);
			}
			// 物料
			if (key === 'pk_srcmaterial') {
				if (value != undefined && value) {
					// 编辑物料需要给 material_code 赋值(取参照的编码)
					for (let i = 0; i < value.length; i++) {
						usermap.set(value[i].refpk, value[i].refcode);
					}
					let matdata = createGridAfterEventData(
						props,
						BUYPOSITION_CONST.PAGEID,
						BUYPOSITION_CONST.TABLEID,
						moduleId,
						key,
						changedrows,
						index,
						usermap
					);

					afterEdit.bind(this)(props, matdata, index, key);
				}
			}

			// 物料基本分类
			if (key === 'pk_marbasclass') {
				if (value != undefined && value) {
					// 编辑物料基本分类需要给 marbasclass_code 赋值(取参照的编码)
					for (let i = 0; i < value.length; i++) {
						usermap.set(value[i].refpk, value[i].refcode);
					}
					let matbascls = createGridAfterEventData(
						props,
						BUYPOSITION_CONST.PAGEID,
						BUYPOSITION_CONST.TABLEID,
						moduleId,
						key,
						changedrows,
						index,
						usermap
					);
					afterEdit.bind(this)(props, matbascls, index, key);
				}
			}

			// 物料采购分类
			if (key === 'pk_marpuclass') {
				if (value != undefined && value) {
					// 编辑物料采购分类需要给 marpuclass_code 赋值(取参照的编码)
					for (let i = 0; i < value.length; i++) {
						usermap.set(value[i].refpk, value[i].refcode);
					}
					let matpucls = createGridAfterEventData(
						props,
						BUYPOSITION_CONST.PAGEID,
						BUYPOSITION_CONST.TABLEID,
						moduleId,
						key,
						changedrows,
						index,
						usermap
					);
					afterEdit.bind(this)(props, matpucls, index, key);
				}
			}
		}
	}
}

/**
 * 编辑后处理
 * @param {} props 
 * @param {*} req 
 * @param {*} editIndex
 */
function afterEdit(props, req, editIndex, key) {
	ajax({
		url: BUYPOSITION_CONST.AFTEREVENTURL,
		data: req,
		success: (res) => {
			if (res.data) {
				let newRows = res.data.grid[BUYPOSITION_CONST.TABLEID].rows;
				let updateArray = [];
				for (let j = 0; j < newRows.length; j++) {
					let row = newRows[j];
					let obj = { index: editIndex + j, data: row };
					if (j != 0) {
						props.editTable.addRow(BUYPOSITION_CONST.TABLEID, editIndex + 1, false);
					}
					updateArray.push(obj);
				}
				if (updateArray.length > 0) {
					props.editTable.updateDataByIndexs(BUYPOSITION_CONST.TABLEID, updateArray, false, true);
					clearItemValByKey.bind(this)(props, key, editIndex);
				}
				
				// let array = [];
				// for (let k = 0; k < res.data.grid[BUYPOSITION_CONST.TABLEID].rows.length; k++) {
				// 	array.push({
				// 		index: k,
				// 		data: {
				// 			status: res.data.grid[BUYPOSITION_CONST.TABLEID].rows[k].status,
				// 			values: res.data.grid[BUYPOSITION_CONST.TABLEID].rows[k].values
				// 		}
				// 	});
				// }
				// for (let z = 0; z < res.data.grid[BUYPOSITION_CONST.TABLEID].rows.length; z++) {
				// 	props.editTable.setRowStatus(BUYPOSITION_CONST.TABLEID, z, array[z].data.status);
				// }
			}
		}
	});
}

/**
 * 根据编辑的字段清空其他字段值
 * @param {*} props 
 * @param {*} editKey 编辑的字段
 * @param {*} indexs 要清除的index
 */
function clearItemValByKey(props, key, index){
	let empty = {
		value: '',
		display: ''
	};
	if (key === 'pk_srcmaterial') {
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marpuclass', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marpuclass.name', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'marpuclass_code', empty);

		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marbasclass', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marbasclass.name', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'marbasclass_code', empty);
	} else if(key === 'pk_marbasclass'){
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marpuclass', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marpuclass.name', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'marpuclass_code', empty);

		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_material', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'material_code', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_srcmaterial', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_srcmaterial.name', empty);
	} else if(key === 'pk_marpuclass'){
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marbasclass', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_marbasclass.name', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'marbasclass_code', empty);

		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_material', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'material_code', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_srcmaterial', empty);
		props.editTable.setValByKeyAndIndex(BUYPOSITION_CONST.TABLEID, index, 'pk_srcmaterial.name', empty);
	}
		
}

/**
* 参照单选赋值
*/
function setSingleSelValue(type, props, key, moduleId, index, value) {
	let empty = {
		value: '',
		display: ''
	};
	let input = null;
	if (type == 'singleselect') {
		input = value[0];
	} else if (type == 'mulselect') {
		input = value;
	}
	clearItemValByKey.bind(this)(props, key, index);
	if (key === 'pk_srcmaterial') {
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass.name', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'marpuclass_code', empty);

		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass.name', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'marbasclass_code', empty);

		// 设置 material_code
		props.editTable.setValByKeyAndIndex(moduleId, index, 'material_code', {
			value: input.refcode,
			display: input.refcode
		});
		// 设置 pk_material
		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', {
			value: input.refpk,
			display: input.refcode
		});

		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial', {
			value: input.refpk,
			display: input.refcode
		});
		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial.name', {
			value: input.refname,
			display: input.refname
		});
	}
	if (key === 'pk_marbasclass') {
		props.editTable.setValByKeyAndIndex(moduleId, index, 'marbasclass_code', {
			value: input.refcode,
			display: input.refcode
		});
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass.name', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'marpuclass_code', empty);

		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'material_code', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial.name', empty);

		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass', {
			value: input.refpk,
			display: input.refcode
		});
		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass.name', {
			value: input.refname,
			display: input.refname
		});
	}
	if (key === 'pk_marpuclass') {
		props.editTable.setValByKeyAndIndex(moduleId, index, 'marpuclass_code', {
			value: input.refcode,
			display: input.refcode
		});
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marbasclass.name', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'marbasclass_code', empty);

		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_material', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'material_code', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial', empty);
		// props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_srcmaterial.name', empty);

		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass', {
			value: input.refpk,
			display: input.refcode
		});
		props.editTable.setValByKeyAndIndex(moduleId, index, 'pk_marpuclass.name', {
			value: input.refname,
			display: input.refname
		});
	}
}

/**
 * 编辑最后一行时，自动增行
 * @param {} props 
 * @param {*} index 当前编辑的行
 */
function autoAddLine(props, index, moduleId) {
	let allRows = props.editTable.getAllRows(BUYPOSITION_CONST.TABLEID, true);
	let visiablerows = [];
	for (let i = 0; i < allRows.length; i++) {
		if (allRows[i].status == '3') {
			continue;
		}
		visiablerows.push(allRows[i]);
	}
	let len = visiablerows.length;

	if (index == len - 1) {
		props.editTable.addRow(moduleId);
		// 设置采购组织
		props.editTable.setValByKeyAndIndex(moduleId, index + 1, 'pk_org', {
			value: this.state.pk_org.value,
			display: this.state.pk_org.display
		});
		// 设置"应用/排除"
		props.editTable.setValByKeyAndIndex(moduleId, index + 1, 'fflag', {
			value: '1',
			display: getLangByResId(this, '4004BUYPOSITION-000000')
		}); /* 国际化处理： 应用*/
		// 设置岗位类型为“1”，fpositiontype 代表岗位类型：1代表采购岗，0 代表计划岗
		props.editTable.setValByKeyAndIndex(moduleId, index + 1, 'fpositiontype', { value: '1', display: '1' });
	}
}
