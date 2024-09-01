import { CARDBUTTONINFO, CARDTEMPLATEINFO } from '../../const/index';
export default function rowSelectController(props) {
	let selrow = this.props.cardTable.getCheckedRows(CARDTEMPLATEINFO.bodyAreaCode);
	if (selrow.length > 0) {
		this.props.button.setDisabled({
			[CARDBUTTONINFO.delLineBtnCode]: false
		});
	} else {
		this.props.button.setDisabled({
			[CARDBUTTONINFO.delLineBtnCode]: true
		});
	}
}
