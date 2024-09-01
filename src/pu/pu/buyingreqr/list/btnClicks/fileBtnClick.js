/*
 * @Author: zhangchangqing 
 * @PageInfo: 附件管理按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-06-11 15:21:07
 */
import { BUYINGREQ_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let formId = BUYINGREQ_LIST.formId; //'head';

export default function fileBtnClick(props) {
	// 获取选中行

	let rows = props.table.getCheckedRows(formId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004PRAYBILLR-000004') /* 国际化处理： 请选择需要操作的数据！*/
		});
		return;
	}
	let billId;
	let pk_srcpraybill = rows[0].data.values.pk_srcpraybill.value;
	// 打开附件时,不论版本,单据状态如何变化,保证附件关联的是原始主键
	if (pk_srcpraybill) {
		billId = pk_srcpraybill;
	} else {
		billId = rows[0].data.values.pk_praybill.value;
	}
	let vbillcode = rows[0].data.values.vbillcode.value;
	let flag = this.state.showUploader;
	this.setState({
		billId: billId,
		vbillcode: vbillcode,
		showUploader: !flag
		// target: event.target
	});
}
