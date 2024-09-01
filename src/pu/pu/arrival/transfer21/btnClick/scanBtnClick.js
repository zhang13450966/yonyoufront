/*
 * @Author: ligangt 
 * @PageInfo: 扫码拉单查询
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2020-08-11 14:51:53
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
export default function(value) {
	let cbilltypecode = getDefData(COMMON.arrivalRefBillCachekey, 'cbilltypecode');
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, false);
	let data = {
		queryInfo: queryInfo,
		pageCode: PAGECODE.transferOrder, //页面编码
		appcode: APPCODE.poorder, //应用编码
		templetid: this.state.templetid, //模板id
		userobj: { cbilltypecode: cbilltypecode, value: value }
	};

	clearTransferCache(this.props, COMMON.arrivalRef21CacheKey);

	this.searchVal = data;
	let _this = this;
	//得到数据渲染到页面
	ajax({
		url: URL.queryOrderByPK,
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
