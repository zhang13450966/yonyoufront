/*
 * @Author: zhangchangqing 
 * @PageInfo: 删除按钮事件
 * @Date: 2018-04-19 10:36:58 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-07-21 14:26:03
 */
import { STOREREQ_CARD } from '../../siconst';
import { processBeforeOnHand } from '../../../pub/utils/onheadUtils';

export default function clickBtn(props) {
	let head = props.form.getAllFormValue(STOREREQ_CARD.formId);
	let body = this.props.cardTable.getCheckedRows(STOREREQ_CARD.tableId);
	body = body.map((item) => item.data);
	if (body.length == 0) {
		body = this.props.cardTable.getAllRows(STOREREQ_CARD.tableId);
	}
	//需要知道传的是第几行的数据
	let rowAndrowid = new Map();
	let indexToRowMap = new Map();
	let allrows = this.props.cardTable.getVisibleRows(STOREREQ_CARD.tableId);
	for (let i = 0; i < allrows.length; i++) {
		rowAndrowid.set(allrows[i].rowid, i);
	}
	for (let j = 0; j < body.length; j++) {
		indexToRowMap.set(body[j].rowid, rowAndrowid.get(body[j].rowid));
	}
	body.forEach((item) => {
		item.values.cmaterialvid = item.values.pk_material;
		item.values['cmaterialvid.name'] = item.values['pk_material.name'];
		item.values['cmaterialvid.materialspec'] = item.values['pk_material.materialspec'];
		item.values['cmaterialvid.materialtype'] = item.values['pk_material.materialtype'];
		item.values['nshouldassistnum'] = item.values['nastnum'];
		item.values['nshouldnum'] = item.values.nnum;
		item.values.cmaterialoid = item.values.pk_srcmaterial;
		item.values.cbodywarehouseid = item.values.pk_reqstordoc;
	});
	let onHandRows = processBeforeOnHand('422X', head, { rows: body }, [ 'pk_org', 'pk_reqstordoc' ], indexToRowMap);
	this.setState({
		headRows: onHandRows
	});
	this.toggleOnhandShow(); //	控制弹窗的显示隐藏
}
