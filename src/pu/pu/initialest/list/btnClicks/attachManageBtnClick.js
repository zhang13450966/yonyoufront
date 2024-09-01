/*
 * @Author: zhaochyu 
 * @PageInfo: 附件管理 
 * @Date: 2018-06-30 14:25:39 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-11-29 17:50:39
 */
import { PAGECODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	//获取当前弹出框状态
	let row = this.props.table.getCheckedRows(PAGECODE.tableId);
	//如果没有选中行，则提示并返回，不进行任何操作
	if (row.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000021') /* 国际化处理： 请选择至少一行！*/
		});
		return;
	} else {
		let flag = this.state.showUploader;
		let vbillcode = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_initialest.value;
		this.setState({
			vbillcode: vbillcode,
			showUploader: !flag
			//target: event.target
		});
	}
}
