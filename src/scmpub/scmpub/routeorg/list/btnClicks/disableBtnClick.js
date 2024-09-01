/*
 * @Author: 王勇 
 * @PageInfo: 列表-运输路线停用  
 * @Date: 2020-01-17 09:47:05 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-09-01 20:08:58
 */
import { ajax } from 'nc-lightapp-front';
import { TEMPLATEINFO, REFERFIELD, REQUESTURL, ROUTEVOINFO, CARDBUTTONINFO } from '../../const/index';
import { showSuccessInfo, showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function disableBtnClick(props) {
	const title = getLangByResId(this, '4001ROUTE-000037'); /**停用 */
	const content = getLangByResId(this, '4001ROUTE-000038'); /**停用所选数据？ */
	let seldatas = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
	if (seldatas == null || seldatas.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000007')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	} else {
		showWarningDialog(title, content, {
			beSureBtnClick: beSureBtnClick.bind(this, props)
		});
	}
}

function beSureBtnClick(props) {
	let pks = [];
	let selIndex = [];
	const seldatas = props.table.getCheckedRows(TEMPLATEINFO.listAreaCode);
	seldatas.forEach((row) => {
		let pk_org = row.data.values['pk_org'].value;
		let pk_group = row.data.values[ROUTEVOINFO.pk_group].value;
		if (pk_org !== pk_group) {
			let id = row.data.values[REFERFIELD.crouteid].value;
			pks.push(id);
			selIndex.push(row.index);
		}
	});
	let data = {
		pk_routes: pks,
		node: 'org',
		enable: 'false'
	};
	ajax({
		url: REQUESTURL.enableChangeRouteUrl,
		data: data,
		success: (res) => {
			showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000018') /*停用成功！*/);
			selIndex.forEach((element) => {
				props.table.setValByKeyAndIndex(TEMPLATEINFO.listAreaCode, element, ROUTEVOINFO.bsealflag, {
					value: true,
					display: null
				});
			});
			props.button.setButtonDisabled(CARDBUTTONINFO.disableBtnCode, true);
			props.button.setButtonDisabled(CARDBUTTONINFO.enableBtnCode, false);
			this.setState({});
			// searchBtnClick.call(this, 2, props, this.oldSearchVal,true);
		}
	});
}
