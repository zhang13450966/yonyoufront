/*
 * @Author: chaiwx 
 * @PageInfo: 附件管理 
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 13:20:31
 */
import { AREA, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004Taxinvoice-000009')); /* 国际化处理： 请选择数据*/
		return;
	}
	let flag = this.state.showUploader;
	let pk_taxinvoice = checkArr[0].data.values[FIELDS.pk_taxinvoice].value;
	this.setState({
		pk_taxinvoice: pk_taxinvoice,
		showUploader: !flag,
		// target: event.target,
		vbillcode: checkArr[0].data.values[FIELDS.vbillcode].value
	});
}
