/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-06-14 09:03:08
 */
import { ajax } from 'nc-lightapp-front';
import { STOREREQ_LIST, ATTRCODE } from '../../siconst';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//点击查询，获取查询区数据
export default function(isSearch) {
	
	let _this = this;
	let searchVal = this.props.search.getAllSearchData(STOREREQ_LIST.searchId, isSearch); //必输项为空时，返回值为false
	if (isSearch && !searchVal) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(STOREREQ_LIST.searchId, false);
	//如果是查询（isSearch 为true）并且查询条件是false直接返回

	//如果是查询且查询条件正常责添加缓存
	if (isSearch && searchVal) {
		queryInfo.querycondition = searchVal;
		// 将查询条件缓存
		//this.setState({ searchVal: searchVal });
		setDefData(STOREREQ_LIST.transferDataSource, 'searchVal', queryInfo.querycondition);
	}
	//如果是刷新 判断是否存在缓存，没有缓存条件直接返回，存在
	if (!isSearch) {
		if (getDefData(STOREREQ_LIST.transferDataSource, 'searchVal')) {
			queryInfo.querycondition = getDefData(STOREREQ_LIST.transferDataSource, 'searchVal');
		} else {
			return;
		}
	}
	let transtype = getDefData(STOREREQ_LIST.dataSource, 'transtype');
	let data = {
		templetid: this.state.pageId,
		queryInfo: queryInfo,
		pageCode: STOREREQ_LIST.transferList, //页面编码
		userobj: { billtype_qs_key: transtype }
	};
	//得到数据渲染到页面
	ajax({
		url: STOREREQ_LIST.queryTransferURL,
		data: data,
		success: (res) => {
			
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				_this.props.transferTable.setTransferTableValue(
					STOREREQ_LIST.formId,
					STOREREQ_LIST.tableId,
					res.data,
					STOREREQ_LIST.pk_mater_plan,
					STOREREQ_LIST.pk_mater_plan_b
				);
				!isSearch ? showRefreshInfo() : showQueryResultInfoForNoPage(res.data.length);
				transtypeUtils.setValue.call(_this, STOREREQ_LIST.formId, ATTRCODE.ctrantypeid, ATTRCODE.vtrantypecode);
			} else {
				!isSearch ? showRefreshInfo() : showQueryResultInfoForNoPage();
				_this.props.transferTable.setTransferTableValue(
					STOREREQ_LIST.formId,
					STOREREQ_LIST.tableId,
					[],
					STOREREQ_LIST.pk_mater_plan,
					STOREREQ_LIST.pk_mater_plan_b
				);
			}
		}
	});
	//}
}
