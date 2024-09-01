import { ajax, base } from 'nc-lightapp-front';
const { NCMessage } = base;
import { AREA } from '../../constance';
import bodyAfterEditHandler from './bodyAfterEditHandler';
import headAfterEditHandler from './headAfterEditHandler';
export default function afterEvent(props, moduleId, key, value, changedrows, index, record) {
	// 表头
	if (moduleId === AREA.head) {
		headAfterEditHandler(props, moduleId, key, value, changedrows, record, index);
		// 表体
	} else if (moduleId === AREA.body) {
		bodyAfterEditHandler(props, moduleId, key, value, changedrows, record, index);
	}
	let type = this.props.getUrlParam('type');
	if (type) {
		let { index, curdata } = this.state;
		const { transferTable } = props;
		const { setTransferListValueByIndex } = transferTable;
		let bodyVals = props.cardTable.getVisibleRows(AREA.body);
		let headVals = props.form.getAllFormValue(AREA.head);
		let curindex = parseInt(index);
		curdata[curindex].body[AREA.body].rows = bodyVals;
		curdata[curindex].head[AREA.head].rows = headVals.rows;
		setTransferListValueByIndex(AREA.leftarea, curdata[curindex], curindex);
	}
}
