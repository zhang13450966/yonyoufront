/*
 * @Author: yechd5 
 * @PageInfo: 采购岗物料设置删除处理
 * @Date: 2018-05-10 09:34:06 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-02 11:25:43
 */
import { ajax } from 'nc-lightapp-front';
import { showWarningInfo, showDeleteDialog, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

let pk_org = '';
export default function clickDelBtn(props, index) {
	let org = this.state.pk_org.value
	let _this = this;

	let status = props.editTable.getStatus(BUYPOSITION_CONST.TABLEID);
	// 编辑态删行
	if (status !== undefined && status !== BUYPOSITION_CONST.BROWSE) {
		let selectRow = props.editTable.getCheckedRows(BUYPOSITION_CONST.TABLEID);
		let delindex = [];
		for (let row of selectRow) {
			delindex.push(row.index);
		}
		props.editTable.deleteTableRowsByIndex(BUYPOSITION_CONST.TABLEID, delindex);
		buttonController.call(this, props, org, BUYPOSITION_CONST.EDIT);

	} else {
		// 浏览态调后台删除
		let selectedData = props.editTable.getCheckedRows(BUYPOSITION_CONST.TABLEID);
		if (selectedData.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4004BUYPOSITION-000007')); /* 国际化处理： 请选择数据！*/
			return;
		}
		showDeleteDialog({
			beSureBtnClick: () => {
				const selectedData = props.editTable.getCheckedRows(BUYPOSITION_CONST.TABLEID);
				if (selectedData.length == 0) {
					return;
				}

				let indexArr = [];
				let dataArr = [];
				selectedData.forEach((val) => {
					let delObj = {
						status: '3',
						values: {
							ts: {
								display: getLangByResId(this, '4004BUYPOSITION-000001') /* 国际化处理： 时间戳*/
							},
							// 主表主键
							pk_position: {
								display: getLangByResId(this, '4004BUYPOSITION-000002') /* 国际化处理： 主表主键*/,
								value: val.data.values.pk_position.value
							},
							// 子表主键
							pk_position_b: {
								display: getLangByResId(this, '4004BUYPOSITION-000003') /* 国际化处理： 子表主键*/,
								value: val.data.values.pk_position_b.value
							},
							pk_org: {
								display: getLangByResId(this, '4004BUYPOSITION-000004') /* 国际化处理： 采购组织*/,
								value: val.data.values.pk_org.value
							}
						}
					};
					pk_org = val.data.values.pk_org.value;
					delObj.rowId = val.data.rowId;
					delObj.values.ts.value = val.data.values.ts.value;
					delObj.values.pk_position.value = val.data.values.pk_position.value;
					delObj.values.pk_position_b.value = val.data.values.pk_position_b.value;
					dataArr.push(delObj);
					indexArr.push(val.index);
				});
				let req = {
					pageid: BUYPOSITION_CONST.PAGEID,
					tableId: {
						areaType: 'table',
						pageinfo: null,
						rows: dataArr
					}
				};

				ajax({
					url: BUYPOSITION_CONST.DELURL,
					data: req,
					success: function(res) {
						if (res.success) {
							if (res.data && res.data[BUYPOSITION_CONST.TABLEID]) {
								props.editTable.setTableData(BUYPOSITION_CONST.TABLEID, res.data[BUYPOSITION_CONST.TABLEID]);
							} else {
								props.editTable.setTableData(BUYPOSITION_CONST.TABLEID, { rows: [] });
							}
				
							if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
								props.dealFormulamsg(
									res.formulamsg 
								);
							}
							buttonController.call(_this, props, org, BUYPOSITION_CONST.BROWSE);
							showSuccessInfo(getLangByResId(_this, '4004BUYPOSITION-000005')); /* 国际化处理： 删除成功！*/
						}
					}
				});
			}
		});
	}
}
