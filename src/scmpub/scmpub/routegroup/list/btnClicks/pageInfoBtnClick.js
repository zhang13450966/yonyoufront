/*
 * @Author: 王勇 
 * @PageInfo: 列表-分页点击事件  
 * @Date: 2020-01-17 09:50:25 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-23 17:01:24
 */
import { REQUESTURL, APPINFO, VIEWINFO, QUERYAREAINFO, TEMPLATEINFO } from '../../const/index';
import { ajax } from 'nc-lightapp-front';
import buttonController from '../../list/viewController/buttonController';
export default function pageinfoBtnClick(props) {
	let queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);
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
	ajax({
		url: REQUESTURL.listRouteUrl,
		data: queryData,
		success: (res) => {
			res.data[TEMPLATEINFO.listAreaCode].rows.map((k) => {
				k.values.org_id = { value: k.values.pk_group.display };
			});
			props.table.setAllTableData(TEMPLATEINFO.listAreaCode, res.data[TEMPLATEINFO.listAreaCode]);
			buttonController.call(this, props, VIEWINFO.BROWSER_STATUS);
		}
	});
}
