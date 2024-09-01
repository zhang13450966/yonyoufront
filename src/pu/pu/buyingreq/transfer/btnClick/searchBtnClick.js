/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-07-31 11:02:32
 */
import { ajax, base, toast } from 'nc-lightapp-front';
const { NCMessage } = base;
import { BUYINGREQ_LIST, ATTRCODE } from '../../siconst';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { showQueryResultInfoForNoPage, showRefreshInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//点击查询，获取查询区数据
export default function(isSearch) {
	
	let _this = this;
	let searchVal = this.props.search.getAllSearchData(BUYINGREQ_LIST.searchId, isSearch); //必输项为空时，返回值为false
	if (isSearch && !searchVal) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(BUYINGREQ_LIST.searchId, false);
	//如果是查询（isSearch 为true）并且查询条件是false直接返回

	//如果是查询且查询条件正常责添加缓存
	if (isSearch && searchVal) {
		queryInfo.querycondition = searchVal;
		// 将查询条件缓存
		//this.setState({ searchVal: searchVal });
		setDefData(BUYINGREQ_LIST.transferDataSource, 'searchVal', queryInfo.querycondition);
	}
	//如果是刷新 判断是否存在缓存，没有缓存条件直接返回，存在
	if (!isSearch) {
		if (getDefData(BUYINGREQ_LIST.transferDataSource, 'searchVal')) {
			queryInfo.querycondition = getDefData(BUYINGREQ_LIST.transferDataSource, 'searchVal');
		} else {
			return;
		}
	}
	let transtype = getDefData(BUYINGREQ_LIST.dataSource, 'transtype');
	let data = {
		templetid: this.state.pageId,
		queryInfo: queryInfo,
		pageCode: BUYINGREQ_LIST.transferList, //页面编码
		userobj: { billtype_qs_key: transtype }
	};
	//得到数据渲染到页面
	ajax({
		url: BUYINGREQ_LIST.queryTransferURL,
		data: data,
		success: (res) => {
			
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				_this.props.transferTable.setTransferTableValue(
					BUYINGREQ_LIST.formId,
					BUYINGREQ_LIST.tableId,
					res.data,
					BUYINGREQ_LIST.pk_storereq,
					BUYINGREQ_LIST.pk_storereq_b
				);
				if (!isSearch) {
					showRefreshInfo();
				} else {
					showQueryResultInfoForNoPage(res.data.length);
				}
				transtypeUtils.setValue.call(
					_this,
					BUYINGREQ_LIST.formId,
					ATTRCODE.ctrantypeid,
					ATTRCODE.vtrantypecode
				);
			} else {
				if (!isSearch) {
					showRefreshInfo();
				} else {
					showQueryResultInfoForNoPage();
				}
				//showWarningDialog(null, getLangByResId(_this, '4004PRAYBILL-000045')); /* 国际化处理： 查询结果为空*/

				_this.props.transferTable.setTransferTableValue(
					BUYINGREQ_LIST.formId,
					BUYINGREQ_LIST.tableId,
					[],
					BUYINGREQ_LIST.pk_storereq,
					BUYINGREQ_LIST.pk_storereq_b
				);
			}
		}
	});
	//}
}
