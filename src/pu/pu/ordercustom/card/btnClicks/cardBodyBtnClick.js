/*
 * @Author: liujia9 
 * @PageInfo: 卡片肩部按钮操作
 * @Date: 2019-04-17 16:11:35 
 * @Last Modified by: jiangphk
 * @Last Modified time: 2019-05-28 09:12:22
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, FIELDS, DATASOURCECACHE } from '../../constance';
import pageInfoClick from './pageInfoClick';
import { getNextId, deleteCacheData } from 'src/scmpub/scmpub/pub/cache';

export default function(props, url) {
	let data = props.createMasterChildDataSimple(PAGECODE.cardPagecode, AREA.cardFormId, AREA.cardTableId);
	// 只保留勾选的数据
	let checkedRows = [];
	data.body[AREA.cardTableId].rows.map((row) => {
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
		success: (res) => {
			if (res.success) {
				let pk = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_order).value;
				if (isAllChecked) {
					// 根据当前id,获取下个id
					let nextId = getNextId(props, pk, DATASOURCECACHE.dataSourceListCacheKey);
					// 删除当前页缓存数据
					deleteCacheData(props, FIELDS.pk_order, pk, DATASOURCECACHE.dataSourceListCacheKey);
					//更新分页器缓存（1为修改，2为新增，3为删除）
					props.cardPagination.setCardPaginationId({ id: pk, status: 3 });
					pk = nextId;
				}

				// 刷新页面
				pageInfoClick.call(this, props, pk, true, false);
			}
		}
	});
}
