/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线新增  
 * @Date: 2020-01-17 09:46:18 
 * @Last Modified by: 王勇
 * @Last Modified time: 2020-03-26 10:36:34
 */
import { TEMPLATEINFO,ROUTEURL, VIEWINFO,CARDTEMPLATEINFO } from '../../const/index';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
export default function addBtnClick(props) {

	let crouteid = null;
	const seldatas = props.table.getAllTableData(TEMPLATEINFO.listAreaCode).allpks;

	if(seldatas.length > 0 ){
		crouteid =  seldatas[0];
		
		changeUrlParam(props, {
			id: crouteid,
			status: VIEWINFO.ADD_STATUS,
			pk_org: '',
			pk_group: '',
		});
	}
	props.pushTo(ROUTEURL.Card_URL, {
		pagecode: CARDTEMPLATEINFO.templateCode,
		status: VIEWINFO.ADD_STATUS,
		id: '',
		firstID: crouteid,
		checked: this.state.checked,
		queryFlag: this.state.queryFlag,
	});


}