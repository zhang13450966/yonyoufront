/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线查询  
 * @Date: 2020-01-17 09:51:18 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:07:59
 */
import { QUERYAREAINFO, TEMPLATEINFO, REQUESTURL, VIEWINFO, APPINFO } from '../../const/index';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo, showSuccessInfo } from '../../../pub/tool/messageUtil';
import buttonController from '../../list/viewController/buttonController';

//点击查询，获取查询区数据  flag=2时，代表是刷新
export default function searchBtnClick(flag, props, searchVal) {
	let queryInfo;
	if (searchVal) {
		queryInfo = flag == 2 ? searchVal : props.search.getAllSearchData(QUERYAREAINFO.areaCode);
	} else {
		queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);
	}
	// if(searchVal){
	// 	 queryInfo = flag == 2 ? searchVal : props.search.getAllSearchData(QUERYAREAINFO.areaCode);
	// }else{
	// 	queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);
	// }
	// let pageInfo = props.table.getTablePageInfo(TEMPLATEINFO.listAreaCode);
	let pageInfo = props.table.getTablePageInfo(TEMPLATEINFO.listAreaCode);

	let queryData = {
		appcode: APPINFO.appCode,
		pagecode: APPINFO.pageCode,
		node: 'group',
		queryAreaCode: QUERYAREAINFO.areaCode,
		querycondition: queryInfo,
		querytype: 'tree',
		pageInfo: pageInfo,
		oid: '1001Z81000000000K5DY',
		showOff: this.state.checked,
		refpk: this.state.refpk
		// oid: QUERYAREAINFO.areaCode,
	};

	this.setState({
		queryFlag: true
	});
	ajax({
		url: REQUESTURL.listRouteUrl,
		data: queryData,
		// data: queryInfo,
		success: (res) => {
			if (res.formulamsg && res.formulamsg instanceof Array && res.formulamsg.length > 0) {
				props.dealFormulamsg(res.formulamsg);
			} else if (res.data === undefined || !res.data) {
				props.table.setAllTableData(TEMPLATEINFO.listAreaCode, { rows: [] });
				showWarningInfo(null, getLangByResId(this, '4001ROUTE-000006')); /* 国际化处理： 未查询出符合条件的数据*/
			} else {
				props.table.setAllTableData(TEMPLATEINFO.listAreaCode, res.data[TEMPLATEINFO.listAreaCode]);
				let len = res.data.head.pageInfo.total;
				if (flag !== 2) {
					showSuccessInfo(
						null,
						'' + getLangByResId(this, '4001ROUTE-000004') + len + getLangByResId(this, '4001ROUTE-000005')
					); /* 国际化处理： 查询成功，共N条*/
				} else {
					showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000014')); /* 国际化处理： 刷新成功*/
				}
			}
			this.isSearched = true;
			this.oldSearchVal = queryInfo;
			// 控制按钮状态
			buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
		}
	});
}
