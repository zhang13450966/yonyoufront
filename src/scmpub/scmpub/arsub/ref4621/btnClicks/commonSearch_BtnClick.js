/*
 * @Author: 刘奇 
 * @PageInfo: 查询方法
 * @Date: 2019-03-21 14:35:39 
 * @Last Modified by: liangzhyf
 * @Last Modified time: 2020-12-23 09:54:04
 */

import { REF4621_CONST } from '../const';
import { ajax } from 'nc-lightapp-front';
import { buttonControl } from '../viewController/buttonController';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function clickSerachBtn(props, queryInfo, isRefresh) {
	// 交易类型发布小应用拉单查询根据单据接口定义中的交易类型过滤单据适配
	let transtypecode = transtypeUtils.getTranstypeCode.call(this);
	queryInfo.userdefObj = { transtype: transtypecode };
	ajax({
		url: REF4621_CONST.serachUrl,
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
					REF4621_CONST.formId,
					REF4621_CONST.tableId,
					data,
					REF4621_CONST.pk_head,
					REF4621_CONST.pk_body
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
