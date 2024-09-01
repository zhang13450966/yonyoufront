import { PAGECODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function fileClick(props) {
	let rows = props.table.getCheckedRows(PAGECODE.tableId);
	// 如果没有选中行，则提示并返回，不进行任何操作
	if (rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004SETTLEBILL-000007') /* 国际化处理： 请选择需要操作的数据！*/
		});
		return;
	}
	let billID = rows[0].data.values.pk_settlebill.value;
	let billNo = rows[0].data.values.vbillcode.value;
	let flag = this.state.showUploader;
	this.setState({ billID: billID, billNo: billNo, showUploader: !flag });
}
