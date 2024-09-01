/*
 * @Author: yechd5 
 * @PageInfo: 物料订单类型行删除处理 
 * @Date: 2018-05-31 09:56:46 
 * @Last Modified by: yechd5
 * @Last Modified time: 2018-11-03 10:07:10
 */
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { MARTRANTYPE_CONST } from '../const';
import buttonController from '../../list/viewController/buttonController'

export function browserDel(props, record, index) {
	props.button.setPopContent('Delete', getLangByResId(this, '4001MARTRANTYPE-000004')); /* 国际化处理： 确认要删除吗？*/
	let delObj = {
		rowId: index,
		status: '3',

		values: {
			ts: {
				display: getLangByResId(this, '4001MARTRANTYPE-000000') /* 国际化处理： 时间戳*/,
				value: record.values.ts.value
			},
			pk_martrantype: {
				display: getLangByResId(this, '4001MARTRANTYPE-000001') /* 国际化处理： 主键*/,
				value: record.values.pk_martrantype.value
			},
			pk_org: {
				display: getLangByResId(this, '4001MARTRANTYPE-000002') /* 国际化处理： 采购组织*/,
				value: record.values.pk_org.value
			}
		}
	};
	let data = {
		pageid: MARTRANTYPE_CONST.PAGEID,
		tableId: {
			areaType: 'table',
			rows: [ delObj ]
		}
	};

	ajax({
		url: MARTRANTYPE_CONST.SAVEURL,
		data,
		success: (res) => {
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
				buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.BROWSE)
				showSuccessInfo(getLangByResId(this, '4001MARTRANTYPE-000003')); /* 国际化处理： 删除成功！*/
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
	props.editTable.delRow(MARTRANTYPE_CONST.TABLEID, index);
	buttonController.call(this, props, this.state.pk_org.value, MARTRANTYPE_CONST.EDIT)
}
