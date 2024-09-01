/*
 * @Author: CongKe 
 * @PageInfo: 采购订单关闭请求处理
 * @Date: 2018-05-09 11:25:32 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-19 14:54:37
 */
import { ajax, toast } from 'nc-lightapp-front';
import { URL, PAGECODE } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';

/**
 * @param {*} props 
 * @param {*} url 请求链接
 * @param {*} closedata 数据
 */
export default function commonClose(url, closedata, type, rowidPkMap) {
	ajax({
		url: url,
		data: closedata,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			let color = 'warning'; /* 国际化处理： 失败！*/
			let content = type + getLangByResId(this, '4004ORDERCLOSE-000016');
			// 去掉勾选
			this.props.editTable.selectAllRows(PAGECODE.tableId, false);
			if (data && data[PAGECODE.tableId]) {
				let rowsData = data[PAGECODE.tableId].rows;
				let updpks = [];
				let successNum = 0;
				// 根据子表pk去更新返回数据对应pk的rowid
				rowsData.map((item) => {
					item.rowid = rowidPkMap.get(item.rowid);
					updpks.push(item.values.pk_order_b.value);
				});
				closedata.closedto.map((item) => {
					if (updpks.includes(item.pks)) {
						successNum++;
					}
				});
				this.props.editTable.updateDataByRowId(PAGECODE.tableId, { rows: rowsData });
				buttonController.selectedChange.call(this, this.props);
				color = 'success'; /* 国际化处理： 成功,条！*/
				content =
					type +
					getLangByResId(this, '4004ORDERCLOSE-000014') +
					successNum +
					getLangByResId(this, '4004ORDERCLOSE-000015');
			}
			toast({ color: color, content: content });
		},
		error: (ress) => {
			//该单据已经被他人修改，请刷新界面，重做业务
			toast({ color: 'danger', content: ress.message });
		}
	});
}
