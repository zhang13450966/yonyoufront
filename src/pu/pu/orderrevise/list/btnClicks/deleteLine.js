/*
 * @Author: CongKe
 * @PageInfo: 页面功能描述
 * @Date: 2018-05-02 15:53:07
 * @Last Modified by: zhr
 * @Last Modified time: 2021-07-12 14:19:07
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE, FIELD, LIST_BUTTON } from '../../constance';
import { deleteCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
export default function deleteLine(props, record) {
	doDelete.call(this, props, record);
}
function doDelete(props, record) {
	let delRows = [];
	let datas = {
		pks: record.pk_order.value,
		ts: record.ts.value
	};
	delRows.push(datas);
	let data = {
		deleteInfo: delRows,
		pagecode: PAGECODE.listcode
	};
	ajax({
		url: URL.delete,
		data: data,
		success: (res) => {
			if (res.success) {
				deleteCacheDataForList(props, PAGECODE.list_head, record.pk_order.value);
				props.table.deleteTableRowsByIndex(PAGECODE.list_head, record.numberindex.value - 1);
				// toast({content: getLangByResId(this, '4004POORDER-000043')});
				/* 国际化处理： 删除成功！*/
				showSuccessInfo(getLangByResId(this, '4004ORDERREVISE-000040'));
				buttonController.initButtons.call(this, this.props);
			} else {
				toast({
					color: 'success',
					content: getLangByResId(this, '4004ORDERREVISE-000041') /* 国际化处理： 删除失败！*/
				});
				// showErrorInfo
			}
		}
	});
}
