/*
 * @Author: zhangchangqing 
 * @PageInfo: 附件管理按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: wanguoyu
 * @Last Modified time: 2020-07-28 13:30:48
 */
import { TARGET_LIST } from '../../siconst';
import { ajax, toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let formId = TARGET_LIST.formId; //'head';

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
	let billId = rows[0].data.values.pk_target.value;
	let vcode = rows[0].data.values.vcode.value;
	let flag = this.state.showUploader;
	this.setState({
		billId: billId,
		vcode: vcode,
		showUploader: !flag
	});
}
