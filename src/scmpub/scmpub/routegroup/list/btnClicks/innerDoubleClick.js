/*
 * @Author: 王勇 
 * @PageInfo: 列表-操作列双击运输路线    
 * @Date: 2020-01-17 09:49:16 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-03-26 10:36:42
 */
import { QUERYAREAINFO,ROUTEURL, VIEWINFO,CARDTEMPLATEINFO } from '../../const/index';

export default function innerEditBtnClick(props,record) {
	let id = record.crouteid.value
	let pk = id;
	const queryData = props.search.getAllSearchData(QUERYAREAINFO.areaCode);

	props.pushTo(ROUTEURL.Card_URL, {
		pagecode: CARDTEMPLATEINFO.templateCode,
		status: VIEWINFO.BROWSER_STATUS,
		id: pk,
		queryData: queryData,
		checked: this.state.checked,
		queryFlag: this.state.queryFlag,
	});

}