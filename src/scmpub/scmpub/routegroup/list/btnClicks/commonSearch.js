/*
 * @Author: 王勇 
 * @PageInfo: 返回列表查询  
 * @Date: 2020-03-25 14:42:49 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-23 16:56:41
 */
import { QUERYAREAINFO, TEMPLATEINFO, REQUESTURL, VIEWINFO, APPINFO } from '../../const/index';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import buttonController from '../../list/viewController/buttonController';

export default function commonSearch(props) {
	let queryInfo;
	queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);

	if (!queryInfo) {
		return;
	}
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
		showOff: this.state.checked
	};
	// this.setState({
	// 	queryData: queryData
	// })
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
				res.data[TEMPLATEINFO.listAreaCode].rows.map((k) => {
					k.values.org_id = { value: k.values.pk_group.display };
				});
				props.table.setAllTableData(TEMPLATEINFO.listAreaCode, res.data[TEMPLATEINFO.listAreaCode]);
			}
			this.isSearched = true;
			this.oldSearchVal = queryInfo;
			// 控制按钮状态
			buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
		}
	});
}
