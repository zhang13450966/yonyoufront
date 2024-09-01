/*
 * @Author: 刘奇 
 * @PageInfo: 查询方法
 * @Date: 2019-03-21 14:35:39 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-05-08 13:38:17
 */

import { REF4804_CONST, FIELD } from '../const';
import { ajax } from 'nc-lightapp-front';
import { buttonControl } from '../viewController/buttonController';
import {
	showQueryResultInfoForNoPage,
	showRefreshInfo,
	showNoQueryResultInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, queryInfo, isRefresh) {
	ajax({
		url: REF4804_CONST.serachUrl,
		data: queryInfo,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				if (data) {
					//有时候会出现cdelivbill_hid主键相同而其他字段不同的数据，为了区分这样的数据，创建一个新主键 cdelivbill_hid_index加以区分
					res.data[REF4804_CONST.singleTableId].rows.forEach((row, index) => {
						row.values.cdelivbill_hid_index = {
							value: row.values[REF4804_CONST.pk_head].value + '_' + row.values[FIELD.ctakefeeid].value
						};
					});
					let rowData = data[REF4804_CONST.singleTableId];
					this.props.transferTable.setTransferTableValue(
						REF4804_CONST.singleTableId,
						'',
						rowData,
						'cdelivbill_hid_index',
						''
					);
					if (isRefresh && isRefresh == REF4804_CONST.refreshShowinfo) {
						showRefreshInfo();
					} else if (isRefresh && isRefresh == REF4804_CONST.refreshNOinfo) {
					} else {
						showQueryResultInfoForNoPage(rowData ? rowData.rows.length : null);
					}
				} else {
					this.props.transferTable.setTransferTableValue(
						REF4804_CONST.singleTableId,
						'',
						{ rows: [] },
						REF4804_CONST.pk_head,
						''
					);
					if (isRefresh && isRefresh == REF4804_CONST.refreshNOinfo) {
					} else {
						showNoQueryResultInfo();
					}
				}
				buttonControl.call(this, props);
				this.setState({
					ntotalnum: 0,
					ntotalmny: 0
				});
			}
		}
	});
}
