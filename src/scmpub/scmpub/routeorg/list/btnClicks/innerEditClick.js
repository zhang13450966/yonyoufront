/*
 * @Author: 王勇 
 * @PageInfo: 列表-操作列编辑运输路线    
 * @Date: 2020-01-17 09:49:16 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-08 15:58:05
 */
import { ROUTEURL, VIEWINFO, CARDTEMPLATEINFO } from '../../const/index';

export default function innerEditBtnClick(props, record) {
	let id = record.crouteid.value;
	let pk_org = record.pk_org.value;
	let pk_group = record.pk_group.value;
	let pk = id;

	props.pushTo(ROUTEURL.Card_URL, {
		pagecode: CARDTEMPLATEINFO.templateCode,
		status: VIEWINFO.EDIT_STATUS,
		id: pk,
		pk_org: pk_org,
		pk_group: pk_group,
		checked: this.state.checked,
		refpk: this.state.refpk,
		refvalue: this.state.refvalue,
		queryFlag: this.state.queryFlag,
		pkorg: this.pkorg,
		pkorg_name: this.pkorg_name,
		pkorg_v: this.pkorg_v,
		pkorg_v_name: this.pkorg_v_name
	});
}
