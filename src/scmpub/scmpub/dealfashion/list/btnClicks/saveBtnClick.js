/*
 * @Author: lichao 
 * @PageInfo:批量保存
 * @Date: 2019-03-08 14:21:43 
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-19 20:19:45
 */

import { ajax } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, STATUS, AREACODE } from '../../constance';
import { getChangedRows, breaseUpdateTableDatas } from '../../../pub/tool/editTableTools';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../pub/tool/messageUtil';
import { viewController } from '../viewController';

export default function saveButton(props) {
	const { filterEmptyRows, checkRequired, getAllRows } = props.editTable;
	filterEmptyRows(AREACODE, [ FIELD.pk_group ]);

	let flag = checkRequired(AREACODE, getAllRows(AREACODE));
	if (!flag) {
		return;
	}
	let changedRows = getChangedRows(props, AREACODE);
	//过滤空行后，如果有不为空的再保存
	let datas = {};
	if (changedRows && changedRows.length > 0) {
		datas = {
			pageid: PAGECODE,
			model: {
				areaType: 'table',
				areacode: AREACODE,
				PageInfo: {},
				rows: changedRows
			}
		};
	} else {
		viewController.call(this, props, STATUS.browse);
		return;
	}
	this.props.validateToSave(datas, () => {
		ajax({
			url: URL.save,
			method: 'post',
			data: datas,
			success: (res) => {
				if (res && res.success) {
					if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
						props.dealFormulamsg(res.formulamsg);
					}
					// 更新行数据
					// let { editTable } = props;
					//使用updateDataByIndexs 更新状态
					if (res.data) {
						// let updateRows = res.data ? res.data[AREACODE].rows : [];
						// updateEditTableRows(props, AREACODE, updateRows);// 这个方法会将行状态修改为1，浏览态的行状态应该是0
						// NCC-81284，修正更新行数据的逻辑，更新数据，并设置行状态为浏览态
						let updateData = res.data ? res.data[AREACODE] : { rows: [] };
						breaseUpdateTableDatas.call(this, props, { tableId: AREACODE, data: updateData });
					} else {
						// 设置缓存，false和true表示是否更新表格，只是删除数据保存，直接更新缓存
						props.editTable.resetTableCaches(AREACODE, true);
					}
					// 恢复浏览态
					// 提示成功
					showSuccessInfo(getLangByResId(this, '4001DEALFASHION-000003')); /* 国际化处理： 保存成功！*/
					viewController.call(this, props, STATUS.browse);
				}
			}
		});
	});
}
