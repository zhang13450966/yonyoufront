/*
 * @Author: jiangfw 
 * @PageInfo: 通用列表查询
 * @Date: 2019-03-15 11:20:26 
 * @Last Modified by: zhr
 * @Last Modified time: 2020-03-31 12:24:39
 */
import { ajax } from 'nc-lightapp-front';
import { URL, AREA, FIELD, PAGECODE, CACHE, COMMON, DATASOURCECACHE } from '../../constance/constance';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import buttonController from '../viewController/buttonController';
import { setDefData, getDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function commonSerach(isRefresh, isUnOutPut, isOutPut) {
	// 获取查询条件
	let queryInfo;
	if (!isRefresh) {
		queryInfo = this.props.search.getQueryInfo(AREA.list_query, false);
		// 缓存查询条件
		setDefData(COMMON.OrderOutputCache, 'queryInfo', queryInfo);
		let output = this.props.search.getSearchValByField(AREA.list_query, FIELD.output).value.firstvalue;
		setDefData(DATASOURCECACHE.dataSourceListCacheKey, FIELD.output, output);
	} else {
		queryInfo = getDefData(COMMON.OrderOutputCache, 'queryInfo');
	}
	queryInfo = queryInfo || {};

	// 设置分页信息
	queryInfo.pageInfo = this.props.insertTable.getPageInfo(AREA.head);
	queryInfo.pageCode = PAGECODE.list;
	// 组装查询条件
	let qryData = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.list //页面编码
	};

	ajax({
		url: URL.qryOrderByScheme,
		data: qryData,

		success: (res) => {
			let { success, data } = res;
			if (success && data) {
				// 执行公式
				if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
					this.props.dealFormulamsg(
						res.formulamsg //参数一：返回的公式对象
					);
				}
				this.props.insertTable.setInsertTableValue(
					AREA.head,
					data[AREA.head],
					FIELD.pk_order,
					true // 重置页码
				);
				if (isUnOutPut) {
					showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000002' /* 国际化处理：  反输出成功*/));
				} else if (isOutPut) {
					showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000001' /* 国际化处理：  输出成功*/));
				} else {
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage(data.head.allpks.length);
				}

				// 设置按钮状态
			} else {
				this.props.insertTable.setInsertTableValue(AREA.head, { rows: [] });
				if (isUnOutPut) {
					showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000002' /* 国际化处理：  反输出成功*/));
				} else if (isOutPut) {
					showSuccessInfo(getLangByResId(this, '4004ORDEROUTPUT-000001' /* 国际化处理：  输出成功*/));
				} else {
					isRefresh == true ? showRefreshInfo() : showQueryResultInfoForNoPage();
				}
			}

			buttonController.call(this);
		}
	});
}
