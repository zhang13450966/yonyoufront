import { FIELD, STATUS, PAGECODE } from '../../constance';
import { togglePageShow } from '../afterEvents';
import { viewController } from '../viewController';
export default function editBtnClick() {
	this.setState({ status: STATUS.edit });
	// this.props.form.setFormStatus(PAGECODE.cardhead, STATUS.edit);
	// this.props.cardTable.setStatus(PAGECODE.cardbody, STATUS.edit);
	// this.props.cardTable.setStatus(PAGECODE.cardbodyano, STATUS.edit);
	let billStatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus);
	billStatus = billStatus && billStatus.value;
	// togglePageShow.call(this, this.props, STATUS.edit, billStatus);
	viewController.call(this, this.props, STATUS.edit, billStatus);
}
