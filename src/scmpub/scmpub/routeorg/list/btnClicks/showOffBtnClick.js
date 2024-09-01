/*
 * @Author: 王勇 
 * @PageInfo: 显式停用过滤复选框  
 * @Date: 2020-03-24 10:28:33 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-08-27 11:30:01
 */
import { QUERYAREAINFO, TEMPLATEINFO, REQUESTURL, APPINFO } from '../../const/index';
import { ajax } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../pub/tool/messageUtil';
export default function shoOffBtnClick(props) {
	const checkedFlag = this.state.checked;
	const refpk = this.state.refpk;
	this.setState(
		{
			checked: !checkedFlag,
			refpk: refpk,
			queryFlag: true
		},
		() => {
			dataChange.call(this, refpk, props);
		}
	);
}

function dataChange(refpk, props) {
	let queryInfo;

	queryInfo = props.search.getAllSearchData(QUERYAREAINFO.areaCode);
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
		}
	});
}
