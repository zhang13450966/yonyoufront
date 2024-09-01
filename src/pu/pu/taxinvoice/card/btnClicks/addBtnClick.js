/*
 * @Author: chaiwx 
 * @PageInfo: 自制  
 * @Date: 2018-04-11 15:20:44 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-01-25 15:20:58
 */
import { AREA } from '../../constance';
import { mainOrgInit } from '../init';
import { buttonControl } from '../viewControl/buttonControl';

export default function(props) {
	props.setUrlParam({ status: 'add', id: null });
	props.form.EmptyAllFormValue(AREA.cardFormId);
	props.cardTable.setTableData(AREA.cardTableId, { rows: [] });

	mainOrgInit.call(this, props, this.contexts);

	buttonControl.call(this, props);
}
