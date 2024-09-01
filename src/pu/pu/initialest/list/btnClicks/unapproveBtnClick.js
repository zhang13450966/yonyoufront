/*
 * @Author: zhaochyu 
 * @PageInfo: 取消审批
 * @Date: 2018-06-22 15:19:24 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-04 14:59:35
 */
import { URL, PAGECODE, FIELD, DATASOURCE } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function(props, key, record, index) {
	let flag = false;
	let id = ''; // 表头主键
	let ts = ''; // 时间戳
	let rows = { rows: [] }; // 上送数据集合
	rows.pagecode = PAGECODE.listpagecode;
	if (record) {
		// 行操作
		flag = true;
		id = record.pk_initialest.value;
		ts = record.ts.value;
		rows.rows.push({
			id,
			ts
		});
	} else {
		let checkRows = props.table.getCheckedRows(FIELD.tableArea);
		if (!checkRows || Object.keys(checkRows).length == 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004INITIALEST-000028')
			}); /* 国际化处理： 请先选择需要取消审批的数据。*/
			return;
		} else {
			checkRows.map((item, index) => {
				ts = item.data.values.ts.value;
				id = item.data.values.pk_initialest.value;
				rows.rows.push({
					id,
					ts
				});
			});
		}
	}

	// 调用后台，执行提交操作
	ajax({
		url: URL.unapprove,
		data: rows,
		success: (res) => {
			if (res && res.success) {
				if (flag) {
					// 取消审批成功
					showSuccessInfo(getLangByResId(this, '4004INITIALEST-000014')); /* 国际化处理：取消审批成功*/
				} else {
					// 取消审批成功之后前台跳转到列表态
					showBatchOprMessage(getLangByResId(this, '4004INITIALEST-000014'), res.data); /* 国际化处理： 取消审批成功*/
				}
				updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_initialest, res.data, index);
				let tabCode = getDefData(DATASOURCE.dataSource, FIELD.tabCode);
				buttonController.lineSelected.call(this, props, tabCode);
			} else {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004INITIALEST-000029')
				}); /* 国际化处理： 取消审批失败*/
			}
		}
	});
}
