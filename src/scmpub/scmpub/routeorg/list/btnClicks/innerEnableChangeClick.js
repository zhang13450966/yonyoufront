/*
 * @Author: 王勇 
 * @PageInfo: 页面功能描述  
 * @Date: 2020-03-25 11:20:02 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-31 13:52:19
 */
import { ajax } from 'nc-lightapp-front';
import { TEMPLATEINFO, REQUESTURL, ROUTEVOINFO } from '../../const/index';
import { showSuccessInfo, showWarningInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningDialog } from '../../../pub/tool/messageUtil';
export default function innerEnableChangeClick(props, record, index) {
	const title1 = getLangByResId(this, '4001ROUTE-000037'); /**停用 */
	const content1 = getLangByResId(this, '4001ROUTE-000038'); /**停用所选数据？ */
	const title2 = getLangByResId(this, '4001ROUTE-000039'); /**启用 */
	const content2 = getLangByResId(this, '4001ROUTE-000040'); /**启用所选数据？ */

	let seldatas = props.table.getAllTableData(TEMPLATEINFO.listAreaCode).rows[index];
	let pk_group = seldatas.values.pk_group.value;
	let pk_org = seldatas.values.pk_org.value;
	let value = !record.bsealflag.value;
	if (pk_group == pk_org) {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000050')); /* 国际化处理： 组织节点不能操作集团数据！*/
		return;
	}

	if (seldatas.length == 0) {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000007')); /* 国际化处理： 请选择要操作的单据！*/
		return;
	} else {
		if (value) {
			// showWarningDialog(title1, content1, {
			// 	beSureBtnClick: beSureBtnClick.bind(this, props, value, seldatas, index)
			// });
			beSureBtnClick.call(this, props, value, seldatas, index)
		} else {
			// showWarningDialog(title2, content2, {
			// 	beSureBtnClick: beSureBtnClick.bind(this, props, value, seldatas, index)
			// });
			beSureBtnClick.call(this, props, value, seldatas, index)
		}
	}
}

function beSureBtnClick(props, value, seldatas, index) {
	let pks = [ seldatas.values.crouteid.value ];
	let data = {
		pk_routes: pks,
		node: 'org',
		enable: String(!value)
	};
	ajax({
		url: REQUESTURL.enableChangeRouteUrl,
		data: data,
		success: (res) => {
			if (value) {
				showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000018') /*停用成功！*/);
			} else {
				showSuccessInfo(null, getLangByResId(this, '4001ROUTE-000017') /*启用成功！*/);
			}

			props.table.setValByKeyAndIndex(TEMPLATEINFO.listAreaCode, index, ROUTEVOINFO.bsealflag, { value: value });
			this.setState({
				viewStatus: 'browse'
			});
		}
	});
}
