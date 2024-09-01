/*
 * @Author: zhaochyu 
 * @PageInfo: 取消复制行
 * @Date: 2018-07-19 21:33:12 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-04 10:36:16
 */
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import { PAGECODE, BODY_FIELD, CARD_BUTTON } from '../../constance';
import { buttonController } from '../viewControl';
export default function(props) {
	rowCopyPasteUtils.cancel.call(this, props, PAGECODE.cardbody, BODY_FIELD.cardInitBtn, BODY_FIELD.cardPastBtn);
	buttonController.setRowCancelButton.call(this, this.props);
	this.setState({ flag: 0 });
}
