/*
 * @Author: jiangfw
 * @PageInfo: 卡片肩部按钮操作
 * @Date: 2019-04-17 16:11:35 
 * @Last Modified by: liujia9
 * @Last Modified time: 2019-04-18 10:05:15
 */
import { ajax } from 'nc-lightapp-front';
import { PAGECODE, AREA, FIELD, DATASOURCE } from '../../constance';
import pageInfoClick from './pageInfoClick';
import { getNextId, deleteCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props, url) {
	let data = props.createMasterChildDataSimple(PAGECODE.CARD, AREA.CARD_FORM, AREA.CARD_TABLE);
	// 只保留勾选的数据
	let checkedRows = [];
	data.body[AREA.CARD_TABLE].rows.map((row) => {
		if (row.selected) {
			checkedRows.push(row);
		}
	});

	if (checkedRows.length == 0) {
		showWarningInfo(getLangByResId(this, '4004ORDERCONFIRM-000000' /* 国际化处理：  输出成功*/));
		return;
	}

	let isAllChecked = false;
	if (data.body[AREA.CARD_TABLE].rows.length == checkedRows.length) {
		// 表体全部勾选
		isAllChecked = true;
	}
	data.body[AREA.CARD_TABLE].rows = checkedRows;

	ajax({
		url: url,
		data: data,
		success: (res) => {
			if (res.success) {
				let pk = props.form.getFormItemsValue(AREA.CARD_FORM, FIELD.PK_ORDER).value;
				if (isAllChecked) {
					// 根据当前id,获取下个id
					let nextId = getNextId(props, pk, DATASOURCE.LIST);
					// 删除当前页缓存数据
					deleteCacheData(props, FIELD.PK_ORDER, pk, DATASOURCE.LIST);
					pk = nextId;
				}

				// 刷新页面
				pageInfoClick.call(this, props, pk, true, false);
			}
		}
	});
}
