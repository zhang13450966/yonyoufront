import { PAGEID, URL, FILED, AREA } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { createGridAfterEventData } from '../../../pub/tool/afterEditUtil';
import { addBtnClick } from '../btnClicks/addBtnClick';

export default function(props, moduleId, key, value, changedrows, index) {
	let numkey = [ 'nemptyload', 'noilconsume', 'nlength', 'nwidth', 'nheight', 'ncubage', 'nload' ];
	if (key == 'fattributeflag') {
		let fattributeflag = changedrows[0].newvalue;
		let indexl = props.editTable.getClickRowIndex(moduleId).index;
		if (fattributeflag.value == '' || fattributeflag.value == 2 || fattributeflag.value == 3) {
			props.editTable.setEditableRowKeyByIndex(moduleId, indexl, 'ccarrierid', true);
		}
	} else if (key == 'cvehicletypeid') {
		if (value.values == null) {
			return;
		}
		let type = this.props.getUrlParam(FILED.type);
		let pagecode = PAGEID.pagecodeorg;
		if (type == 1) {
			pagecode = PAGEID.pagecodegroup;
		}
		let data = createGridAfterEventData(props, pagecode, AREA.listTable, moduleId, key, changedrows, index);

		ajax({
			url: URL.after,
			data: data,
			async: false,
			success: (res) => {
				if (res.data && res.data.grid[moduleId]) {
					res.data.grid[moduleId].rows.forEach((item) => {
						let nlength = item.values.nlength.value ? item.values.nlength : { value: '' };
						let nwidth = item.values.nwidth.value ? item.values.nwidth : { value: '' };
						let nheight = item.values.nheight.value ? item.values.nheight : { value: '' };
						let ncubage = item.values.ncubage.value ? item.values.ncubage : { value: '' };
						let nload = item.values.nload.value ? item.values.nload : { value: '' };
						props.editTable.setValByKeyAndIndex(moduleId, index, 'nlength', nlength);
						props.editTable.setValByKeyAndIndex(moduleId, index, 'nwidth', nwidth);
						props.editTable.setValByKeyAndIndex(moduleId, index, 'nheight', nheight);
						props.editTable.setValByKeyAndIndex(moduleId, index, 'ncubage', ncubage);
						props.editTable.setValByKeyAndIndex(moduleId, index, 'nload', nload);
					});
				}
			}
		});
	} else if (numkey.includes(key)) {
		let type = this.props.getUrlParam(FILED.type);
		let pagecode = PAGEID.pagecodeorg;
		if (type == 1) {
			pagecode = PAGEID.pagecodegroup;
		}
		let data = createGridAfterEventData(props, pagecode, AREA.listTable, moduleId, key, changedrows, index);
		ajax({
			url: URL.after,
			data: data,
			async: false,
			success: (res) => {
				if (res.success && res.data) {
					this.props.editTable.setValByKeyAndIndex(
						moduleId,
						index,
						key,
						res.data.grid[moduleId].rows[0].values[key]
					);
				}
			}
		});
	}
	//编辑状态，并且点击行是最后一行，编辑后新增一行
	let status = this.props.editTable.getStatus(AREA.listTable);
	let index1 = props.editTable.getClickRowIndex(moduleId).index;
	let allRowsNumber = props.editTable.getNumberOfRows(moduleId);
	if (status == 'edit' && index1 == allRowsNumber - 1 && key == 'vvehiclecode') {
		addBtnClick.bind(this, props)();
	}
}
