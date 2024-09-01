/*
 * @Author: 王勇 
 * @PageInfo: 返回列表查询  
 * @Date: 2020-03-25 14:42:49 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-09-29 17:35:18
 */
import { QUERYAREAINFO, TEMPLATEINFO, REQUESTURL, VIEWINFO, APPINFO } from '../../const/index';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
import buttonController from '../../list/viewController/buttonController';

export default function commonSearch(props) {
	//NCC-120799快速查询条件物流组织没有值时,新增数据后回到列表界面处理组织显示，
	//查询区必输项没填时，调search.getAllSearchData方法会提示，为回避提示使用getSearchValByField判断
	let sorg = props.search.getSearchValByField(QUERYAREAINFO.areaCode, 'pk_org');
	if (!sorg.display) {
		let allTable = props.table.getAllTableData(TEMPLATEINFO.listAreaCode);
		allTable.rows.map((k) => {
			if (k.values.pk_org_v.value) {
				k.values.org_id = { value: k.values.pk_org_v.display };
			} else {
				k.values.org_id = { value: k.values.pk_group.display };
			}
		});
		props.table.setAllTableData(TEMPLATEINFO.listAreaCode, allTable);
		return;
	}
	let queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);
	if (!queryInfo) {
		return;
	}
	let pageInfo = props.table.getTablePageInfo(TEMPLATEINFO.listAreaCode);

	let queryData = {
		appcode: APPINFO.appCode,
		pagecode: APPINFO.pageCode,
		node: 'org',
		queryAreaCode: QUERYAREAINFO.areaCode,
		querycondition: queryInfo,
		querytype: 'tree',
		pageInfo: pageInfo,
		oid: '1001Z81000000000HSFX',
		showOff: this.state.checked
		// refpk: this.state.refpk
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
					if (k.values.pk_org_v.value) {
						k.values.org_id = { value: k.values.pk_org_v.display };
					} else {
						k.values.org_id = { value: k.values.pk_group.display };
					}
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
