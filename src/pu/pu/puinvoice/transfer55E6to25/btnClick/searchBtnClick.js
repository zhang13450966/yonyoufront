/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: zhr
 * @Last Modified time: 2022-05-16 15:43:15
 */
import { ajax, base, toast } from 'nc-lightapp-front';
const { NCMessage } = base;
import { AREA, FIELD, COMMON, URL, PK, PAGECODE } from '../../constance';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//点击查询，获取查询区数据
export default function(isSearch) {
	let _this = this;
	let searchVal = this.props.search.getAllSearchData(AREA.search55E6, isSearch); //必输项为空时，返回值为false
	if (isSearch && !searchVal) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(AREA.search55E6, false);
	//如果是查询（isSearch 为true）并且查询条件是false直接返回

	//如果是查询且查询条件正常责添加缓存
	if (isSearch && searchVal) {
		queryInfo.querycondition = searchVal;
		// 将查询条件缓存
		//this.setState({ searchVal: searchVal });
		setDefData(COMMON.TransferCacheKey, 'searchVal', queryInfo.querycondition);
	}
	//如果是刷新 判断是否存在缓存，没有缓存条件直接返回，存在
	if (!isSearch) {
		if (getDefData(COMMON.TransferCacheKey, 'searchVal')) {
			queryInfo.querycondition = getDefData(COMMON.TransferCacheKey, 'searchVal');
		} else {
			return;
		}
	}
	let transtype = getDefData(COMMON.PuinvoiceCacheKey, 'transtype');
	let data = {
		templetid: this.state.pageId,
		queryInfo: queryInfo,
		pageCode: PAGECODE.ref55E6_list, //页面编码
		userobj: { billtype_qs_key: transtype }
	};
	//得到数据渲染到页面
	ajax({
		url: URL.ref55E6Query,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				_this.props.transferTable.setTransferTableValue(
					AREA.head55E6,
					AREA.body55E6,
					res.data,
					PK.head55E6pk,
					PK.body55E6ok
				);
				if (!isSearch) {
					showRefreshInfo();
				} else {
					showQueryResultInfoForNoPage(res.data.length);
				}
				transtypeUtils.setValue.call(_this, AREA.head55E6, FIELD.ctrantypeid, FIELD.vtrantypecode);
			} else {
				if (!isSearch) {
					showRefreshInfo();
				} else {
					showQueryResultInfoForNoPage();
				}
				//showWarningDialog(null, getLangByResId(_this, '4004PRAYBILL-000045')); /* 国际化处理： 查询结果为空*/

				_this.props.transferTable.setTransferTableValue(
					AREA.head55E6,
					AREA.body55E6,
					[],
					PK.head55E6pk,
					PK.body55E6ok
				);
			}
		}
	});
	//}
}
