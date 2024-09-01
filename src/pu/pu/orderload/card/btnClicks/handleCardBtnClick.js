/*
 * @Author: CongKe
 * @PageInfo: 装运/反装运
 * @Date: 2019-04-19 10:40:28
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-25 17:00:50
 */
import { ajax } from 'nc-lightapp-front';
import pageInfoClick from './pageInfoClick';
import { PAGECODE, AREA, FIELDS, DATASOURCECACHE } from '../../constance';
import { getNextId, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(props, url) {
	let data = props.createMasterChildDataSimple(PAGECODE.CARDPAGECODE, AREA.cardFormId, AREA.cardTableId);
	// 只保留勾选的数据
	let checkedRows = [];
	data.body[AREA.cardTableId].rows.map(row => {
		if (row.selected) {
			checkedRows.push(row);
		}
	});
	let isAllChecked = false;
	if (data.body[AREA.cardTableId].rows.length == checkedRows.length) {
		// 表体全部勾选
		isAllChecked = true;
	}
	data.body[AREA.cardTableId].rows = checkedRows;

	ajax({
		url: url,
		data: data,
		success: res => {
			if (res.success) {
				props.cardTable.selectAllRows(AREA.cardTableId, false);
				let pk = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_order).value;
				if (isAllChecked) {
					// 根据当前id,获取下个id
					let nextId = getNextId(props, pk, DATASOURCECACHE.dataSourceListCacheKey);
					// 删除当前页缓存数据
					deleteCacheData(props, FIELDS.pk_order, pk, DATASOURCECACHE.dataSourceListCacheKey);
					pk = nextId;
				}
				if (!pk) {
					// 最后一条数据，清空URL
					props.setUrlParam({ id: null });
				}
				// 刷新页面
				pageInfoClick.call(this, props, pk, false, false);
			}
		},
	});
}
