/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-09-13 16:48:50
 */
import { ajax, base, toast } from 'nc-lightapp-front';
const { NCMessage } = base;
import { URL, COMMON, AREA, PAGECODE, TRANSFER } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	showSuccessInfo,
	showQueryResultInfoForNoPage,
	showNoQueryResultInfo
} from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
//点击查询，获取查询区数据
export default function() {
	let searchVal = this.props.search.getAllSearchData(AREA.searchArea);
	if (!searchVal) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(AREA.searchArea, true);
	let pageinfo = {
		pageSize: 10,
		pageIndex: 0
	};
	let _this = this;
	let data = {
		queryInfo: queryInfo,
		// {
		// 	querycondition: searchVal? searchVal : {logic: 'and'}, //查询条件
		// 	pageInfo: pageinfo, //分页信息
		// 	queryAreaCode: AREA.searchArea, //查询区编码
		// 	oid: TRANSFER.subcontoid, //查询模板id，手工添加在界面模板json中，放在查询区，后期会修改
		// 	querytype: 'tree'
		// },
		pageCode: PAGECODE.transferSubcont //页面编码
	};

	_this.searchVal = data;

	//得到数据渲染到页面
	ajax({
		url: URL.querySubcont,
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
