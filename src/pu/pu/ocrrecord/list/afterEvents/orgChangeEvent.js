/*
 * @Author: zhangbfk 
 * @PageInfo: 组织切换事件  
 * @Date: 2018-04-24 14:49:31 
 * @Last Modified by: zhangbfk
 * @Last Modified time: 2019-04-16 10:45:53
 */
import { AREA, BUTTONSTATE } from '../../constance';
import { buttonCntrol } from '../init/btnEnable';

export default function(props, refValue) {
	orgChange.call(this, props, refValue);
}

function orgChange(props, refValue) {
	let rows = props.editTable.getNumberOfRows(AREA.tableArea);
	if (rows > 0) {
		//清空界面数据
		let delRows = new Array();
		for (let row = 0; row < rows; row++) {
			delRows.push(row);
		}
		props.editTable.deleteTableRowsByIndex(AREA.tableArea, delRows);
	}
	let pk_org = refValue.refpk;
	this.setState({
		CostRegionRef: refValue //界面成本域回显使用
	});
	this.pk_org = pk_org;
	if (pk_org) {
		buttonCntrol.call(this, BUTTONSTATE.HASORG, false);
	} else {
		buttonCntrol.call(this, BUTTONSTATE.HASORG, true);
	}
}
