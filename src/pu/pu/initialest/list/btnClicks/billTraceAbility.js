/*
 * @Author: zhaochyu 
 * @PageInfo: 单据追溯
 * @Date: 2018-06-30 10:05:09 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-30 15:31:26
 */
import { PAGECODE } from '../../constance';
import { toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function LinkQuery(props) {
	let row = this.props.table.getCheckedRows(PAGECODE.tableId);
	//如果没有选中行，则提示并返回，不进行任何操作
	if (row.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004INITIALEST-000022') /* 国际化处理： 请选择需要单据追溯的行！*/
		});
		return;
	} else {
		let pk = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_initialest.value;
		this.setState({ pk: pk, showTrack: true });
	}
}
