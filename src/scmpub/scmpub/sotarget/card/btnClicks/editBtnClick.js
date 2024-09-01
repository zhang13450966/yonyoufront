/* * @Author: lichaoah  
* @PageInfo:销售指标设置按钮   
* @Date: 2020-02-19 09:33:29  
 * @Last Modified by: sunxxf
 * @Last Modified time: 2020-12-21 14:03:29
*/
import { TARGET_CARD, TARGET_CARD_BUTTON } from '../../siconst';
import { viewController } from '../viewControl';
export default function(props) {
	viewController.call(this, props, TARGET_CARD.edit);
	let blowsetflag = props.form.getFormItemsValue(TARGET_CARD.formId, TARGET_CARD.blowsetflag).value;
	if (true == blowsetflag) {
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, false);
	} else {
		props.button.setButtonVisible(TARGET_CARD_BUTTON.InnerDelLine_org, true);
	}

	props.form.setFormItemsDisabled(TARGET_CARD.formId, { pk_org: true });
}
