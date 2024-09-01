/*
 * @Author: zhaochyu
 * @PageInfo: 列表态审批功能
 * @Date: 2018-04-20 14:23:06
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-04 14:57:05
 */
import { URL, PAGECODE, FIELD, DATASOURCE, HEAD_FIELD } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { getDefData, getCacheDataByPk } from '../../../../../scmpub/scmpub/pub/cache';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { showBatchOprMessage, showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewControl';
export default function(props, key, record, index) {
	let flag = false;
	let id = ''; // 表头主键
	let ts = ''; // 时间戳
	let rows = { rows: [] }; // 上送数据集合
	let arr = [];
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
		arr.push(index);
	} else {
		let checkRows = props.table.getCheckedRows(FIELD.tableArea);
		if (!checkRows || Object.keys(checkRows).length == 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004INITIALEST-000019')
			}); /* 国际化处理： 请先选择需要提交的数据。*/
			return;
		} else {
			checkRows.map((item, index) => {
				ts = item.data.values.ts.value;
				id = item.data.values.pk_initialest.value;
				arr.push([ item.index ]);
				rows.rows.push({
					id,
					ts
				});
			});
		}
	}
	// 调用后台，执行审批操作
	ajax({
		url: URL.approve,
		data: rows,
		success: (res) => {
			if (res && res.success) {
				if (flag) {
					// 审批成功
					showSuccessInfo(getLangByResId(this, '4004INITIALEST-000002')); /* 国际化处理：审批成功*/
				} else {
					showBatchOprMessage(getLangByResId(this, '4004INITIALEST-000002'), res.data); /* 国际化处理： 审批成功*/
				}
				// let cardData = getCacheDataByPk(props, DATASOURCE.dataSource, pk);
				updateCacheDataForList(props, PAGECODE.tableId, FIELD.pk_initialest, res.data, index);
				// 审批成功之后前台跳转到列表态
				//toast({ color: "success", content: "审批成功" });
				//获取当前页签
				let tabCode = getDefData(DATASOURCE.dataSource, FIELD.tabCode);
				buttonController.lineSelected.call(this, props, tabCode);
			} else {
				toast({
					color: 'warning',
					title: getLangByResId(this, '4004INITIALEST-000020'),
					content: res
				}); /* 国际化处理： 审批失败*/
			}
		}
	});
}
