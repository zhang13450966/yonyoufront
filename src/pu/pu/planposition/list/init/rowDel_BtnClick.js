/*
 * @Author: yechd5 
 * @PageInfo: 计划岗物料设置"行"删除处理 
 * @Date: 2018-05-31 09:56:46 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 09:58:18
 */
import { ajax } from 'nc-lightapp-front';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { PLANPOSITION_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export function browserDel(props, record, index) {
	// 浏览态删除，需要弹框提示
	props.button.setPopContent('Delete', getLangByResId(this, '4004PLANPOSITION-000006')); /* 国际化处理： 确认要删除吗？*/
	let indexArr = [];
	let dataArr = [];
	let delObj = {
		status: '3',
		values: {
			ts: {
				display: getLangByResId(this, '4004PLANPOSITION-000001') /* 国际化处理： 时间戳*/
			},
			// 主表主键
			pk_position: {
				display: getLangByResId(this, '4004PLANPOSITION-000002') /* 国际化处理： 主表主键*/,
				value: record.values.pk_position.value
			},
			// 子表主键
			pk_position_b: {
				display: getLangByResId(this, '4004PLANPOSITION-000003') /* 国际化处理： 子表主键*/,
				value: record.values.pk_position_b.value
			},
			pk_org: {
				display: getLangByResId(this, '4004PLANPOSITION-000015') /* 国际化处理： 库存组织*/,
				value: record.values.pk_org.value
			}
		}
	};
	delObj.rowId = record.rowId;
	delObj.values.ts.value = record.values.ts.value;
	delObj.values.pk_position.value = record.values.pk_position.value;
	delObj.values.pk_position_b.value = record.values.pk_position_b.value;
	delObj.values.pk_org.value = record.values.pk_org.value;
	dataArr.push(delObj);
	indexArr.push(record.index);

	let req = {
		pageid: PLANPOSITION_CONST.PAGEID,
		tableId: {
			areaType: 'table',
			pageinfo: null,
			rows: dataArr
		}
	};

	let org = this.state.pk_org.value
	let _this = this;
	ajax({
		url: PLANPOSITION_CONST.DELURL,
		data: req,
		success: function(res) {
			if (res.success) {
				if (res.data && res.data[PLANPOSITION_CONST.TABLEID]) {
					props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, res.data[PLANPOSITION_CONST.TABLEID]);
				} else {
					props.editTable.setTableData(PLANPOSITION_CONST.TABLEID, { rows: [] });
				}

				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg 
					);
				}
				// 按钮控制
				buttonController.call(_this, props, org, PLANPOSITION_CONST.BROWSE)
				showSuccessInfo(getLangByResId(_this, '4004PLANPOSITION-000005')); /* 国际化处理： 删除成功！*/
			}
		}
	});
}

/**
 * 编辑态删除
 * @param {*} props 
 * @param {*} index 
 */
export function editDel(props, index) {
	props.button.setPopContent('Delete', '');
	props.editTable.delRow(PLANPOSITION_CONST.TABLEID, index);
	buttonController.call(this, props, this.state.pk_org.value, PLANPOSITION_CONST.EDIT)
}
