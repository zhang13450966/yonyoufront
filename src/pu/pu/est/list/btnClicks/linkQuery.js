import { PAGECODE } from '../../constance';
export default function linkQuery(props) {
	let pk = this.props.editTable.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_stockps.value;
	this.setState({ pk: pk, showTrack: true });
}
