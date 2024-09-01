/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-07-19 17:14:40
 */
import { ajax, base, toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { clearTransferCache } from '../../../../../scmpub/scmpub/pub/cache';
const { NCMessage } = base;
import { URL, COMMON, AREA, PAGECODE, TRANSFER, APPCODE } from '../../constance';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
//点击查询，获取查询区数据
export default function() {
	let searchVal = this.props.search.getAllSearchData(AREA.searchArea);
	if (!searchVal) {
		return;
	}
	let cbilltypecode = getDefData(COMMON.arrivalRefBillCachekey, 'cbilltypecode');

	let pageinfo = {
		pageSize: 10,
		pageIndex: 0
	};
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, true);
	let data = {
		queryInfo: queryInfo,
		// {
		// 	querycondition: searchVal? searchVal : {logic: 'and'}, //查询条件
		// 	pageInfo: pageinfo, //分页信息
		// 	queryAreaCode: AREA.searchArea, //查询区编码
		// 	oid: TRANSFER.oid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		// 	querytype: 'tree'
		// },
		// pageCode: PAGECODE.transferlist, //页面编码
		pageCode: PAGECODE.transferOrder, //页面编码
		appcode: APPCODE.poorder, //应用编码
		templetid: this.state.templetid, //模板id
		userobj: { cbilltypecode: cbilltypecode }
	};

	clearTransferCache(this.props, COMMON.arrivalRef21CacheKey);

	this.searchVal = data;
	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.queryOrder,
		data: data,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(
					res.formulamsg //参数一：返回的公式对象
				);
			}
			_this.setState({ ntotalnum: 0 });
			if (res.data) {
				_this.props.transferTable.setTransferTableValue(
					AREA.head,
					AREA.body,
					res.data,
					'pk_order',
					'pk_order_b'
				);
				showQueryResultInfoForNoPage(res.data.length); /* 国际化处理： 查询成功*/
			} else {
				showNoQueryResultInfo();
				_this.props.transferTable.setTransferTableValue(AREA.head, AREA.body, [], 'pk_order', 'pk_order_b');
			}
		}
	});
}
