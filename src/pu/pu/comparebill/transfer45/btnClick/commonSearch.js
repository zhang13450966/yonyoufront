/*
 * @Author: qishy 
 * @PageInfo: 查询、刷新公共处理方法
 * @Date: 2019-05-05 13:30:50 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-13 13:26:55
 */

import { ajax } from 'nc-lightapp-front';
import { AREA, PAGECODE, REQUESTURL, BUTTONID, CACHDATASOURCE, CACHKEY } from '../../constance';
import {
	showHasQueryResultInfo,
	showNoQueryResultInfo,
	showRefreshInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function(queryInfo, isRefresh) {
	queryInfo.userdefObj = { transType: this.transType, pk_busitype: this.pk_busitype };

	let data = {
		queryInfo: queryInfo,
		pageCode: '400800800_45to2507', //页面编码
		appcode: PAGECODE.appcode45, //应用编码
		templetid: this.props.meta.getMeta().pageid
	};

	// 刷新按钮可用
	this.props.button.setDisabled({ [BUTTONID.Refresh]: false });

	//得到数据渲染到页面
	ajax({
		url: REQUESTURL.ref45Query,
		data: data,
		success: (res) => {
			if (res.data) {
				this.props.transferTable.setTransferTableValue(
					AREA.cardFormId,
					AREA.cardTableId,
					res.data,
					'cgeneralhid',
					'cgeneralbid'
				);
				isRefresh == true ? showRefreshInfo() : showHasQueryResultInfo(res.data.length);
			} else {
				this.props.transferTable.setTransferTableValue(
					AREA.cardFormId,
					AREA.cardTableId,
					[],
					'cgeneralhid',
					'cgeneralbid'
				);
				isRefresh == true ? showRefreshInfo() : showNoQueryResultInfo();
			}
			this.setState({
				ntotalnum: 0
			});
			// 将查询条件缓存
			setDefData(CACHDATASOURCE.dataSourceTransfer, CACHKEY.transferSearchCach, queryInfo);
		}
	});
}
