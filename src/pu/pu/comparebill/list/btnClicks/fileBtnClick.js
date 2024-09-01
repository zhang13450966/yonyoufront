/*
 * @Author: chaiwx 
 * @PageInfo: 附件管理 
 * @Date: 2018-04-11 17:49:47 
 * @Last Modified by: qishy
 * @Last Modified time: 2019-05-14 10:47:54
 */
import { AREA, FIELDS } from '../../constance';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	let checkArr = props.table.getCheckedRows(AREA.listTableId);
	if (!checkArr || checkArr.length < 1) {
		showWarningInfo(null, getLangByResId(this, '4004comarebill-000018')); /* 国际化处理： 请选择数据*/
		return;
	}
	let flag = this.state.showUploader;
	let pk_comparebill = checkArr[0].data.values[FIELDS.pk_comparebill].value;
	this.setState({
		pk_comparebill: pk_comparebill,
		showUploader: !flag,
		vbillcode: checkArr[0].data.values[FIELDS.vbillcode].value
	});
}
