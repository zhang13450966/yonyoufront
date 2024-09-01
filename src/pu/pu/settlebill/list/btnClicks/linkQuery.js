import { PAGECODE } from '../../constance';
export default function linkQuery(props) {
	let pk = this.props.table.getCheckedRows(PAGECODE.tableId)[0].data.values.pk_settlebill.value;
	this.setState({ pk: pk, showTrack: true });
}
