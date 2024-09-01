/*
 * @Author: ligangt 
 * @PageInfo: 查询按钮点击  
 * @Date: 2018-04-18 10:39:11 
 * @Last Modified by: zhangchqf
 * @Last Modified time: 2019-04-17 09:32:24
 */
import { ajax, base } from 'nc-lightapp-front';
const { NCMessage } = base;
import { STOREREQ_LIST } from '../../siconst';
//点击查询，获取查询区数据
export default function() {
	
	//let searchVal = this.props.search.getAllSearchData(STOREREQ_LIST.searchId);
	let searchVal = this.state.searchVal;
	if (!searchVal) {
		return;
	}
	let queryInfo = this.props.search.getQueryInfo(STOREREQ_LIST.searchId);
	let pageinfo = {
		pageSize: 10,
		pageIndex: 0
	};
	let _this = this;
	searchVal = (searchVal && searchVal.conditions) || null;
	let data = {
		conditions: searchVal,
		pagecode: STOREREQ_LIST.transferList,
		querycondition: queryInfo.querycondition,
		templetid: this.state.pageId,
		pageInfo: pageinfo,
		queryAreaCode: STOREREQ_LIST.searchId,
		oid: queryInfo.oid,
		queryType: 'simple'
	};
	//得到数据渲染到页面
	ajax({
		url: STOREREQ_LIST.queryTransferURL,
		data: data,
		success: (res) => {
			
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				_this.props.dealFormulamsg(res.formulamsg);
			}
			if (res.data) {
				_this.props.transferTable.setTransferTableValue(
					STOREREQ_LIST.formId,
					STOREREQ_LIST.tableId,
					res.data,
					STOREREQ_LIST.pk_mater_plan,
					STOREREQ_LIST.pk_mater_plan_b
				);
			} else {
				NCMessage.create({
					content: getLangByResId(this, '4004STOREREQ-000055'),
					color: 'success',
					position: 'top'
				}); /* 国际化处理： 查询结果为空*/
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
}
