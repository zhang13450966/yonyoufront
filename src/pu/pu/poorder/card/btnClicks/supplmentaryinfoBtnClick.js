/*
 * @Author: zhaochyu 
 * @PageInfo:侧拉显示当前存量和价格
 * @Date: 2019-05-16 14:09:55 
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-18 16:51:26
 */
import { PAGECODE } from '../../constance';
export default function supplementaryinfo(props, record, index) {
	let data = null;
	let querypricedata = null;
	let supplementCunit = null;
	if (!record || !record.values.pk_srcmaterial || !record.values.pk_srcmaterial.value) {
		this.setState({
			showSupplementinfo: true,
			supplementinfoData: null
		});
		return;
	}
	data = {
		pk_group: record.values.pk_group.value,
		pk_org: record.values.pk_org.value,
		// 如果是空字符串传到后台会日期转换报错
		dplandate: record.values.dplanarrvdate.value ? record.values.dplanarrvdate.value : null,
		cmaterialoid: record.values.pk_srcmaterial.value,
		cwarehouseid: record.values.pk_recvstordoc.value,
		vbatchcode: record.values.vbatchcode.value,
		vfree1: record.values.vfree1.value,
		vfree2: record.values.vfree2.value,
		vfree3: record.values.vfree3.value,
		vfree4: record.values.vfree4.value,
		vfree5: record.values.vfree5.value,
		vfree6: record.values.vfree6.value,
		vfree7: record.values.vfree7.value,
		vfree8: record.values.vfree8.value,
		vfree9: record.values.vfree9.value,
		vfree10: record.values.vfree10.value,
		cprojectid: record.values.cprojectid.value,
		cproductorid: record.values.cproductorid.value,
		casscustid: record.values.casscustid.value,
		cvendorid: record.values.pk_supplier.value
	};
	querypricedata = {
		pk_org: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_org').value,
		corigcurrencyid: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'corigcurrencyid').value,
		pk_supplier: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_supplier').value,
		dbilldate: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'dbilldate').value,
		pk_transporttype: this.props.form.getFormItemsValue(PAGECODE.cardhead, 'pk_transporttype').value,
		pk_material: record.values.pk_material.value,
		cdevareaid: record.values.cdevareaid.value,
		crowno: record.values.crowno.value,
		cproductorid: record.values.cproductorid.value,
		cqualitylevelid: record.values.cqualitylevelid.value,
		pk_srcmaterial: record.values.pk_srcmaterial.value,
		pk_psfinanceorg: record.values.pk_psfinanceorg.value,
		ccontractrowid: record.values.ccontractrowid.value,
		csourcetypecode: record.values.csourcetypecode.value,
		csourcebid: record.values.csourcebid.value,
		castunitid: record.values.castunitid.value
	};
	supplementCunit = record.values.castunitid.display;
	this.setState({
		showSupplementinfo: true,
		supplementinfoData: { atosuppdto: data, querypricedata: querypricedata },
		supplementCunit: supplementCunit
	});
}
