import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function deleteLineBtnClick(props, record) {
	doDelete.call(this, props, record);
}
function doDelete(props, record) {
	let delRows = [];
	let datas = {
		pks: record.pk_pricesettle.value,
		ts: record.ts.value
	};
	delRows.push(datas);
	let data = {
		deleteInfo: delRows
	};
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				deleteCacheDataForList(props, PAGECODE.tableId, record.pk_pricesettle.value);
				props.table.deleteTableRowsByIndex(PAGECODE.tableId, record.numberindex.value - 1);
				toast({
					color: 'success',
					content: getLangByResId(this, '4004PRICESTL-000009') /* 国际化处理： 删除成功*/ /* 国际化处理： 删除成功！*/
				});
			} else {
				toast({
					color: 'success',
					content: getLangByResId(this, '4004PRICESTL-000024') /* 国际化处理： 删除失败*/ /* 国际化处理： 删除失败！*/
				});
			}
		}
	});
}
