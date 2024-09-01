/*
 * @Author: CongKe 
 * @PageInfo: 页面功能描述 
 * @Date: 2018-05-02 15:53:07 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-06-21 17:21:20
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { deleteLine } from './index';

export default function deleteBtnClick(props, record) {
	if (record && record.pk_order) {
		deleteLine.call(this, props, record);
	} else {
		let rows = props.table.getCheckedRows(PAGECODE.tableId);
		// 如果没有选中行，则提示并返回，不进行任何操作
		if (rows.length <= 0) {
			toast({
				color: 'warning',
				content: getLangByResId(this, '4004POORDER-000068') /* 国际化处理： 请选择需要删除的数据！*/
			});
			return;
		}
		showDeleteDialog({
			/* 国际化处理： 删除,确定要删除吗？*/
			beSureBtnClick: doDelete.bind(this, props, rows)
		});
	}
}

function doDelete(props, rows) {
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004ORDERREVISE-000018') /* 国际化处理： 请选择需要删除的数据！*/
		});
		return;
	}
	// 获取待删除表格行的行号
	let indexs = rows.map((item) => {
		return item.index;
	});
	// 执行删除操作
	let delRows = [];
	rows.map((item) => {
		let data = {
			pks: item.data.values.pk_storereq.value,
			ts: item.data.values.ts.value
		};
		delRows.push(data);
	});
	ajax({
		url: URL.delete,
		data: delRows,
		success: (res) => {
			if (res.success) {
				delRows.forEach((pks, ts) => {
					deleteCacheDataForList(props, PAGECODE.list_head, pks);
				});
				toast({
					color: 'success',
					content:
						getLangByResId(this, '4004ORDERREVISE-000019') +
						delRows.length +
						getLangByResId(this, '4004ORDERREVISE-000020') /* 国际化处理： 删除成功,条！*/
				});
			} else {
				toast({
					color: 'success',
					content:
						getLangByResId(this, '4004ORDERREVISE-000021') +
						delRows.length +
						getLangByResId(this, '4004ORDERREVISE-000020') /* 国际化处理： 删除失败,条！*/
				});
			}
		}
	});
}
