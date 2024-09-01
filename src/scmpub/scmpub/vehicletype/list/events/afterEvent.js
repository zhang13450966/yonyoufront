import { PAGEID, AREA, URL, FILED } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import { createGridAfterEventData } from '../../../pub/tool/afterEditUtil';
import { addBtnClick } from '../btnClicks/addBtnClick';

export default function(props, moduleId, key, value, changedrows, index) {
	//编辑状态，并且点击行是最后一行，编辑后新增一行
	let status = this.props.editTable.getStatus(AREA.listTable);
	let rowindex = this.props.editTable.getClickRowIndex(AREA.listTable).index;
	let allRowsNumber = props.editTable.getNumberOfRows(moduleId);
	if (status == 'edit' && rowindex == allRowsNumber - 1 && key == 'vvhcltypecode') {
		addBtnClick.bind(this, props)();
	}
	let numkey = [ 'nload', 'ncubage', 'nlength', 'nwidth', 'nheight' ];
	if (numkey.includes(key)) {
		let type = this.props.getUrlParam(FILED.type);
		let pagecode = PAGEID.pagecodeorg;
		if (type == 1) {
			pagecode = PAGEID.pagecodegroup;
		}
		let data = createGridAfterEventData(props, pagecode, AREA.listTable, moduleId, key, changedrows, index);

		ajax({
			url: URL.edit,
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
}
