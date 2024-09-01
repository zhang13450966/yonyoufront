/*
 * @Author: yechd5 
 * @PageInfo: 保存按钮点击实现 
 * @Date: 2018-04-12 09:42:56 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-03 16:19:07
 */
import { ajax } from 'nc-lightapp-front';
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSaveBtn(props) {
	// 过滤空行:排除新增默认值和必输项字段
	props.editTable.filterEmptyRows(MARTRANTYPE_CONST.TABLEID, [ 'pk_org' ]);
	let allrows = props.editTable.getAllRows(MARTRANTYPE_CONST.TABLEID);
	let checkres = props.editTable.checkRequired(MARTRANTYPE_CONST.TABLEID, allrows);
	if (!checkres) {
		return;
	}

	let tableRows = props.editTable.getChangedRows(MARTRANTYPE_CONST.TABLEID);
	let allDatas = props.editTable.getAllData(MARTRANTYPE_CONST.TABLEID);
	if (tableRows == undefined) {
		buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.EDIT);
		return;
	} else if (tableRows.length == 0) {
		// 去除复选框的打钩
		props.editTable.selectAllRows(MARTRANTYPE_CONST.TABLEID, false);
		buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE);
		props.button.setPopContent('Delete', getLangByResId(this, '4001MARTRANTYPE-000004')); /* 国际化处理： 确认要删除吗？*/
		showSuccessInfo(getLangByResId(this, '4001MARTRANTYPE-000008')); /* 国际化处理： 保存成功！*/
		return;
	}
	let checkflag = false;
	let cheackArr = [];
	tableRows.forEach((line) => {
		let pk_marbasclass = line.values.pk_marbasclass.value;
		let pk_material = line.values.pk_srcmaterial.value;
		if (!pk_marbasclass && !pk_material) {
			checkflag = true;
			cheackArr.push(line.values.numberindex.value);
		}
	});
	if (checkflag) {
		let warnMsg = '';
		cheackArr.forEach((numberindex) => {
			warnMsg = warnMsg + getLangByResId(this, '4001MARTRANTYPE-000019', numberindex);
			/* 国际化处理：第{0}行[物料基本分类编码]与[物料编码]不能同时为空*/
		});
		showWarningInfo(warnMsg);
		return;
	}
	// 新增前台校验，见nc.ui.scmf.pu.ordertranstype.model.OrderSourceValidationService
	if (allDatas && allDatas.rows.length > 0) {
		let checkData = {};
		let table = {
			areaType: 'table',
			areacode: MARTRANTYPE_CONST.TABLEID,
			pageinfo: {
				pageIndex: -1
			},
			rows: allDatas.rows
		};
		checkData = {
			pageid: MARTRANTYPE_CONST.PAGEID,
			table: table
		};

		ajax({
			url: MARTRANTYPE_CONST.SAVECHECKURL,
			data: checkData,
			success: (res) => {
				if (res.success) {
					if (tableRows == undefined) {
						buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.EDIT);
						return;
					} else if (tableRows.length == 0) {
						buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE);
						props.button.setPopContent(
							'Delete',
							getLangByResId(this, '4001MARTRANTYPE-000004')
						); /* 国际化处理： 确认要删除吗？*/
						showSuccessInfo(getLangByResId(this, '4001MARTRANTYPE-000008')); /* 国际化处理： 保存成功！*/
						return;
					}
					let data = {};
					if (tableRows.length > 0) {
						let table = {
							areaType: 'table',
							areacode: MARTRANTYPE_CONST.TABLEID,
							pageinfo: {
								pageIndex: -1
							},
							rows: tableRows
						};
						data = {
							pageid: MARTRANTYPE_CONST.PAGEID,
							table: table
						};
					} else {
						showWarningInfo(null, getLangByResId(this, '4001MARTRANTYPE-000009')); /* 国际化处理： 表格不能为空！*/
						return;
					}

					this.props.validateToSave(data, () => {
						ajax({
							url: MARTRANTYPE_CONST.SAVEURL,
							data: data,

							success: (res) => {
								if (res.success) {
									if (res.data && res.data[MARTRANTYPE_CONST.TABLEID]) {
										props.editTable.setTableData(
											MARTRANTYPE_CONST.TABLEID,
											res.data[MARTRANTYPE_CONST.TABLEID]
										);
									} else {
										props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
									}
									// 适配公式
									if (
										res.formulamsg &&
										res.formulamsg instanceof Array &&
										res.formulamsg.length > 0
									) {
										props.dealFormulamsg(res.formulamsg);
									}

									// 去除复选框的打钩
									props.editTable.selectAllRows(MARTRANTYPE_CONST.TABLEID, false);
									buttonController.call(
										this,
										props,
										this.state.pk_org.value,
										MARTRANTYPE_CONST.BROWSE
									);
									showSuccessInfo(getLangByResId(this, '4001MARTRANTYPE-000008')); /* 国际化处理： 保存成功！*/
									props.button.setPopContent(
										'Delete',
										getLangByResId(this, '4001MARTRANTYPE-000004')
									); /* 国际化处理： 确认要删除吗？*/
								}
							}
						});
					});
				}
			}
		});
	}
}
