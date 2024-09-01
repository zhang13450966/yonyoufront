/*
 * @Author: 刘奇 
 * @PageInfo: 查询方法
 * @Date: 2019-03-21 14:35:39 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-07-27 10:37:20
 */

import { REF30_CONST } from '../const';
import { ajax } from 'nc-lightapp-front';
import { buttonControl } from '../viewController/buttonController';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, queryInfo, isRefresh) {
	ajax({
		url: REF30_CONST.serachUrl,
		data: queryInfo,
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				this.props.transferTable.setTransferTableValue(
					REF30_CONST.formId,
					REF30_CONST.tableId,
					data,
					REF30_CONST.pk_head,
					REF30_CONST.pk_body
				);
				if (isRefresh) {
					showRefreshInfo();
				} else {
					showQueryResultInfoForNoPage(data ? data.length : null);
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
