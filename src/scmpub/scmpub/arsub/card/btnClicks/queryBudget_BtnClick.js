/*
 * @Author: 刘奇 
 * @PageInfo: 费用冲抵  
 * @Date: 2019-03-15 14:15:02 
 * @Last Modified by: 刘奇
 * @Last Modified time: 2019-06-24 13:40:32
 */

import { ajax } from 'nc-lightapp-front';
import { ARSUB_CONST, ArsubHeadItem } from '../../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function buttonClick(props) {
	let pks = [ props.form.getFormItemsValue(ARSUB_CONST.formId, ArsubHeadItem.carsubid).value ];
	ajax({
		url: ARSUB_CONST.queryBudgetUrl,
		data: { pks: pks },
		success: (res) => {
			if (res.success) {
				this.setState({
					inspectionSourceData: res.data,
					showInspection: true
				});
			}
		}
	});
}
