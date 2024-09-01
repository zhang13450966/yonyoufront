/*
 * @Author: yechd5 
 * @PageInfo: 删除按钮点击实现
 * @Date: 2018-04-12 09:41:25 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 10:09:00
 */
import { ajax } from 'nc-lightapp-front';
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo, showWarningInfo, showDeleteDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickDelBtn(props, index) {
	let org = this.state.pk_org.value
	let _this = this;
	let status = props.editTable.getStatus(MARTRANTYPE_CONST.TABLEID);
	// 编辑态删行
	if (status !== undefined && status !== MARTRANTYPE_CONST.BROWSE) {
		let selectRow = props.editTable.getCheckedRows(MARTRANTYPE_CONST.TABLEID);
		let delindexs = [];
		for (let row of selectRow) {
			delindexs.push(row.index);
		}
		props.editTable.deleteTableRowsByIndex(MARTRANTYPE_CONST.TABLEID, delindexs);
		buttonController.call(this, props, org, MARTRANTYPE_CONST.EDIT);
	} else {
		// 浏览态调后台删除
		let selectedData = props.editTable.getCheckedRows(MARTRANTYPE_CONST.TABLEID);
		if (selectedData.length == 0) {
			showWarningInfo(null, getLangByResId(this, '4001MARTRANTYPE-000005')); /* 国际化处理： 请选择数据！*/
			return;
		}
		showDeleteDialog({
			beSureBtnClick: () => {
				const selectedData = props.editTable.getCheckedRows(MARTRANTYPE_CONST.TABLEID);
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
								display: getLangByResId(this, '4001MARTRANTYPE-000000') /* 国际化处理： 时间戳*/
							},
							pk_martrantype: {
								display: getLangByResId(this, '4001MARTRANTYPE-000001') /* 国际化处理： 主键*/
							},
							pk_org: {
								display: getLangByResId(this, '4001MARTRANTYPE-000002') /* 国际化处理： 采购组织*/
							}
						}
					};
					delObj.rowId = val.data.rowId;
					delObj.values.ts.value = val.data.values.ts.value;
					delObj.values.pk_martrantype.value = val.data.values.pk_martrantype.value;
					delObj.values.pk_org.value = val.data.values.pk_org.value;
					dataArr.push(delObj);
					indexArr.push(val.index);
				});

				let req = {
					pageid: MARTRANTYPE_CONST.PAGEID,
					tableId: {
						areaType: 'table',
						pageinfo: null,
						rows: dataArr
					}
				};

				ajax({
					url: MARTRANTYPE_CONST.SAVEURL,
					data: req,
					success: function(res) {
						if (res.success) {
							if (res.data && res.data[MARTRANTYPE_CONST.TABLEID]) {
								props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, res.data[MARTRANTYPE_CONST.TABLEID]);
							} else {
								props.editTable.setTableData(MARTRANTYPE_CONST.TABLEID, { rows: [] });
							}
							// 适配公式
							if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
								props.dealFormulamsg(
									res.formulamsg 
								);
							}
							
							buttonController.call(_this, props, org, MARTRANTYPE_CONST.BROWSE);
							showSuccessInfo(getLangByResId(_this, '4001MARTRANTYPE-000003')); /* 国际化处理： 删除成功！*/
						}
					}
				});
			}
		});
	}
}
