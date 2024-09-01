import { PAGECODE, FIELD } from '../../constance';
export default function rowClick(props, moduleId, record, index) {
	if (moduleId === PAGECODE.cardbody) {
		// this.state.dbaseprice = record.values.dbaseprice.value;
		// this.state.vschemefrmlname = record.values.vschemefrmlname.value;
		// this.state.nschemecalvalue = record.values.nschemecalvalue.value;
		this.setState({
			dbaseprice: record.values.dbaseprice.value,
			vschemefrmlname: record.values.vschemefrmlname.value,
			nschemecalvalue: record.values.nschemecalvalue.value
		});
	}
}
