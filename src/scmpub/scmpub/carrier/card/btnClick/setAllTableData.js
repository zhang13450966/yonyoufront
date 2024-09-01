/*
 * @Author: zhangflr 
 * @Date: 2020-11-03 15:39:06 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-11-25 15:23:34
 */
import { getDefData } from '../../../pub/cache';
import { AREA, FILED, CARRIERDATASOURCE } from '../../constance';

function setAllTableDataByCache(id) {
	if (!id) {
		id = this.props.form.getFormItemsValue(AREA.card_head, FILED.ccarrierid).value;
	}
	let data = getDefData(CARRIERDATASOURCE.carrierdatasource, id);
	setAllTableData.call(this, data);
}

function setAllTableData(data) {
	if (data) {
		if (data.driver) {
			this.props.cardTable.setTableData(AREA.driver, data.driver[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.driver, { rows: [] });
		}
		if (data.vehicle) {
			this.props.cardTable.setTableData(AREA.vehicle, data.vehicle[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.vehicle, { rows: [] });
		}
		if (data.vehicletype) {
			this.props.cardTable.setTableData(AREA.vehicletype, data.vehicletype[AREA.listTable], null, true, true);
		} else {
			this.props.cardTable.setTableData(AREA.vehicletype, { rows: [] });
		}
	}
}

function removeAllTableData() {
	this.props.cardTable.setTableData(AREA.driver, { rows: [] });
	this.props.cardTable.setTableData(AREA.vehicle, { rows: [] });
	this.props.cardTable.setTableData(AREA.vehicletype, { rows: [] });
}

function removeHeadCsupplierField() {
	this.props.form.setFormItemsValue(AREA.card_head, {
		'csupplierid.code': { value: null, display: null },
		'csupplierid.shortname': { value: null, display: null },
		'csupplierid.taxpayerid': { value: null, display: null },
		'csupplierid.legalbody': { value: null, display: null },
		'csupplierid.registerfund': { value: null, display: null },
		'csupplierid.zipcode': { value: null, display: null },
		'csupplierid.tel1': { value: null, display: null },
		'csupplierid.tel2': { value: null, display: null },
		'csupplierid.tel3': { value: null, display: null },
		'csupplierid.fax1': { value: null, display: null },
		'csupplierid.fax2': { value: null, display: null },
		'csupplierid.email': { value: null, display: null }
	});
}

function setHeadCsupplierField(supplierData) {
	let supVal = supplierData.rows[0].values;
	this.props.form.setFormItemsValue(AREA.card_head, {
		'csupplierid.code': { value: supVal.code.value },
		'csupplierid.shortname': { value: supVal.shortname.value },
		'csupplierid.taxpayerid': { value: supVal.taxpayerid.value },
		'csupplierid.legalbody': { value: supVal.legalbody.value },
		'csupplierid.registerfund': { value: supVal.registerfund.value },
		'csupplierid.zipcode': { value: supVal.zipcode.value },
		'csupplierid.tel1': { value: supVal.tel1.value },
		'csupplierid.tel2': { value: supVal.tel2.value },
		'csupplierid.tel3': { value: supVal.tel3.value },
		'csupplierid.fax1': { value: supVal.fax1.value },
		'csupplierid.fax2': { value: supVal.fax2.value },
		'csupplierid.email': { value: supVal.email.value }
	});
}

export { setAllTableData, setAllTableDataByCache, removeAllTableData, removeHeadCsupplierField, setHeadCsupplierField };
