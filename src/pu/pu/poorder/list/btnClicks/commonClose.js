/*
 * @Author: CongKe 
 * @PageInfo: 采购订单关闭请求处理
 * @Date: 2018-05-09 11:25:32 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-12-07 14:20:14
 */
import { ajax } from 'nc-lightapp-front';
import { URL, FIELD, PAGECODE } from '../../constance';
import { updateCacheDataForList } from '../../../../../scmpub/scmpub/pub/cache';
import { showBatchOprMessage, showSuccessInfo, showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonController } from '../viewController/index';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

/**
 * @param {*} props 
 * @param {*} url 请求链接
 * @param {*} closedata 数据
 */
export default function commonClose(url, closedata, rowindex, contents) {
	let _this = this;
	ajax({
		url: url,
		data: closedata,
		method: 'POST',
		success: (res) => {
			let { success, data } = res;
			if (success) {
				updateCacheDataForList(_this.props, PAGECODE.tableId, FIELD.pk_order, res.data, null);
				buttonController.initButtons.call(this, _this.props, 'close');
				showBatchOprMessage(contents, res.data, {}, contents);
				/**
				 * 变成编辑态时，不保留勾选
				 * selectAllRows(moduleId, checked)
				 * moduleId  区域ID
				 * checked为true    全选
				 * checked为false  全不选
				 */
				this.props.table.selectAllRows(PAGECODE.tableId, false);
			}
		}
	});
}
