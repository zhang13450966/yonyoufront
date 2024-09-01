import { TARGETADJ_CARD, ATTRCODE } from '../../siconst';
import pageInfoClick from '../btnClicks/pageInfoClick';
/**
 * modify by huoyzh
 * @param {*} props 
 * @param {*} data 
 */
export default function refreshBtnClick(props, data) {
	let pk = this.props.getUrlParam(TARGETADJ_CARD.id);
	pk = pk ? pk : props.form.getFormItemsValue(TARGETADJ_CARD.formId, ATTRCODE.pk_targetadj).value;
	pageInfoClick.call(this, this.props, pk, 'refresh');
}
