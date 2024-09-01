/*
 * @Author: yechd5 
 * @PageInfo: 计划员物料设置保存处理
 * @Date: 2018-05-10 10:02:22 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-05 15:13:19
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export default function clickSaveBtn(props) {
	// 过滤空行:排除新增默认值和必输项字段
	props.editTable.filterEmptyRows(PLANPOSITION_CONST.TABLEID, [ 'pk_org', 'fflag', 'fpositiontype' ]);

	let allrows = props.editTable.getAllRows(PLANPOSITION_CONST.TABLEID);
	let checkres = props.editTable.checkRequired(PLANPOSITION_CONST.TABLEID, allrows);
	if (!checkres) {
		return;
	}

	// 获取改变的行
	let tableRows = props.editTable.getChangedRows(PLANPOSITION_CONST.TABLEID);
	if (tableRows == undefined) {
		buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.EDIT);
		return;
	} else if (tableRows.length == 0) {
		props.editTable.selectAllRows(PLANPOSITION_CONST.TABLEID, false);
		buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.BROWSE);
		props.button.setPopContent('Delete', getLangByResId(this, '4004PLANPOSITION-000006')); /* 国际化处理： 确认要删除吗？*/
		showSuccessInfo(getLangByResId(this, '4004PLANPOSITION-000010')); /* 国际化处理： 保存成功！*/
		return;
	}

	// 校验物料分类和物料不能同时为空
	let flag = checkMarclassAndMar.call(this, tableRows);
	if (flag) {
		return;
	}
	// 对于“岗位编码 + 岗位名称 + 业务员id”相同的，视为一单，即给此次编辑的行设置相同的主键
	let alldatas = props.editTable.getAllData(PLANPOSITION_CONST.TABLEID);
	preCombineBill.call(this, alldatas, tableRows);

	let req = {};
	if (tableRows.length > 0) {
		let table = {
			areaType: 'table',
			areacode: PLANPOSITION_CONST.TABLEID,
			pageinfo: {
				pageIndex: -1
			},
			rows: tableRows
		};
		req = {
			pageid: PLANPOSITION_CONST.PAGEID,
			table: table
		};
	} else {
		showWarningInfo(null, getLangByResId(this, '4004PLANPOSITION-000011')); /* 国际化处理： 表格不能为空！*/
		return;
	}

	props.validateToSave(req, () => {
		ajax({
			url: PLANPOSITION_CONST.SAVEURL,
			data: req,
			success: (res) => {
				if (res.success) {
					if (res.data && res.data[PLANPOSITION_CONST.TABLEID]) {
						props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, res.data[PLANPOSITION_CONST.TABLEID]);
					} else {
						props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
					}
					// 适配公式
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(
							res.formulamsg 
						);
					}
					props.editTable.selectAllRows(PLANPOSITION_CONST.TABLEID, false);
					buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.BROWSE);
					props.button.setPopContent(
						'Delete',
						getLangByResId(this, '4004PLANPOSITION-000006')
					); /* 国际化处理： 确认要删除吗？*/
					showSuccessInfo(getLangByResId(this, '4004PLANPOSITION-000010')); /* 国际化处理： 保存成功！*/
				}
			},
			// 由于保存前调用了 preCombineBill 方法，给新增的满足条件的行赋了主键，在保存失败的时候需要清除改行的主键,2018-10-19
			error: (res) => {
				for (let z = 0; z < tableRows.length; z++) {
					let changeRowid = tableRows[z].rowid;
					let changeBid = props.editTable.getValByKeyAndRowId(PLANPOSITION_CONST.TABLEID, changeRowid, 'pk_position_b')
						.value;
					if (changeBid == null || changeBid == '' || changeBid == undefined) {
						// 说明是新增的行，则清除表头主键
						props.editTable.setValByKeyAndRowId(PLANPOSITION_CONST.TABLEID, changeRowid, 'pk_position', {
							value: null,
							display: null
						});
					}
				}
				showWarningInfo(getLangByResId(this, '4004PLANPOSITION-000012'), res.message); /* 国际化处理： 保存失败！*/
			}
		});
	});
}

// 校验物料分类/物料采购分类 与 物料 必填且只能填一个
function checkMarclassAndMar(changingRows) {
	let flag = false;
	for (let index = 0; index < changingRows.length; index++) {
		let pk_marbasclass =
			changingRows[index].values.pk_marbasclass == undefined
				? ''
				: changingRows[index].values.pk_marbasclass.value; // 物料基本分类
		let pk_marpuclass =
			changingRows[index].values.pk_marpuclass == undefined ? '' : changingRows[index].values.pk_marpuclass.value; // 物料采购分类
		let pk_material =
			changingRows[index].values.pk_material == undefined ? '' : changingRows[index].values.pk_material.value;
		let pk_srcmaterial =
			changingRows[index].values.pk_srcmaterial == undefined
				? ''
				: changingRows[index].values.pk_srcmaterial.value;

		if (pk_marbasclass == '' && pk_marpuclass == '' && pk_srcmaterial == '' && pk_material == '') {
			flag = true;
			showWarningInfo(null, getLangByResId(this, '4004PLANPOSITION-000013')); /* 国际化处理： 物料分类和物料不能同时为空！*/
			return flag;
		}
	}
}

/**
 * 岗位编码 + 岗位名称 + 业务员id相同的视为一单，即赋相同的表头主键,2018-07-31
 * 
 */
function preCombineBill(alldatas, changeRows) {
	let map = new Map();
	for (let i = 0; i < alldatas.rows.length; i++) {
		if (alldatas.rows[i].values.pk_position.value) {
			let code = alldatas.rows[i].values.code.value;
			let name = alldatas.rows[i].values.name.value;
			let psn = alldatas.rows[i].values.cemployeeid.value;
			let hid = alldatas.rows[i].values.pk_position.value;
			map.set(code + name + psn, hid);
		}
	}
	for (let j = 0; j < changeRows.length; j++) {
		let changeRowHid = changeRows[j].values.pk_position.value;
		if (changeRowHid && changeRowHid != '' && changeRowHid != null) {
			continue;
		}
		let code = changeRows[j].values.code.value;
		let name = changeRows[j].values.name.value;
		let psn = changeRows[j].values.cemployeeid.value;
		let pk_position =
			map.get(code + name + psn) == undefined || map.get(code + name + psn) == ''
				? null
				: map.get(code + name + psn);

		// 给change的行赋主键
		changeRows[j].values.pk_position.value = pk_position;
	}
}
