/*
 * @Author: zhaochyu
 * @PageInfo: 新增
 * @Date: 2018-05-28 19:38:18
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 11:13:38
 */
import { UISTATE, PAGECODE, FIELD, BUTTON } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClick } from '../btnClicks';
export default function(props) {
	//获取表头总行数
	let headrow = props.editTable.getNumberOfRows(PAGECODE.headId);
	//设置页面的状态为编辑态
	this.setState(
		{
			status: UISTATE.edit,
			statusflag: UISTATE.add,
			editflag: headrow
		},
		() => {
			this.toggleShow();
		}
	);
	this.props.editTable.focusRowByIndex(PAGECODE.headId, headrow);
	//设置表头行的编辑性为不可编辑
	for (let i = 0; i < headrow; i++) {
		setTimeout(() => {
			props.editTable.setEditableRowByIndex(PAGECODE.headId, i, false);
		}, 0);
	}
	//为表头新增一行
	props.editTable.addRow(PAGECODE.headId);
	//为表头设置默认值
	props.editTable.setValByKeyAndIndex(
		PAGECODE.headId,
		headrow,
		FIELD.fapportionmode,
		{
			value: '0',
			display: getLangByResId(this, '4004COSTFACTOR-000000')
		} /* 国际化处理： 按数量*/
	);
	props.editTable.setValByKeyAndIndex(
		PAGECODE.headId,
		headrow,
		FIELD.bentercost,
		{
			value: true,
			display: getLangByResId(this, '4004COSTFACTOR-000001')
		} /* 国际化处理： 是*/
	);
	//获取现有表体的总行数，拟将其删除
	let rows = props.editTable.getNumberOfRows(PAGECODE.bodyId);
	//删除表体所有行
	for (let ii = 0; ii < rows; ii++) {
		props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, 0);
	}
	//为表体新增一行
	props.editTable.addRow(PAGECODE.bodyId);
	//为表体赋默认值
	props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.bshow, {
		value: true,
		display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
	});
	props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, 0, FIELD.ishoworder, {
		value: 1 + '',
		display: 1
	});
	//得到表体总行数
	let bodyrow = null;
	bodyrow = props.editTable.getNumberOfRows(PAGECODE.bodyId);
	//设置该行为不可编辑
	props.editTable.setEditableRowByIndex(PAGECODE.bodyId, 0, false);
	let meta = this.props.meta.getMeta();
	let bodymetason = meta[PAGECODE.bodyId];
	let headmetason = meta[PAGECODE.headId];
	let operationbody = {
		attrcode: 'opr',
		itemtype: 'customer',
		label: getLangByResId(this, '4004COSTFACTOR-000002') /* 国际化处理： 操作*/,
		width: '160px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [ BUTTON.AddLine, BUTTON.RowDelete ];
			return props.button.createOprationButton(buttonAry, {
				area: PAGECODE.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, record, index)
			});
			// return (
			// 	<span>
			// 		<a
			// 			style={{
			// 				cursor: 'pointer',
			// 				'padding-right': '10px'
			// 			}}
			// 			onClick={() => {
			// 				bodyrow = this.props.editTable.getNumberOfRows(PAGECODE.bodyId);
			// 				let bodyLinValue = getBodyLineMaxValue(props);
			// 				props.editTable.addRow(PAGECODE.bodyId);
			// 				//为表体赋默认值
			// 				props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.bshow, {
			// 					value: true,
			// 					display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
			// 				});
			// 				props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.ishoworder, {
			// 					value: bodyLinValue + 1 + '',
			// 					display: bodyLinValue + 1 + ''
			// 				});
			// 				bodyrow++;
			// 			}}
			// 		>
			// 			{getLangByResId(this, '4004COSTFACTOR-000004')}
			// 			{/* 国际化处理： 增行*/}
			// 		</a>
			// 		<a
			// 			style={{
			// 				cursor: 'pointer',
			// 				'padding-right': '10px'
			// 			}}
			// 			onClick={(e) => {
			// 				bodyrow = this.props.editTable.getNumberOfRows(PAGECODE.bodyId);
			// 				if (bodyrow > 1) {
			// 					props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, index);
			// 					bodyrow--;
			// 					e.stopPropagation();
			// 				} else if (bodyrow == 1) {
			// 					toast({
			// 						color: 'warning',
			// 						content: getLangByResId(this, '4004COSTFACTOR-000003') /* 国际化处理： 至少存在一行费用物料！*/
			// 					});
			// 				}
			// 			}}
			// 		>
			// 			{getLangByResId(this, '4004COSTFACTOR-000005')}
			// 			{/* 国际化处理： 删行*/}
			// 		</a>
			// 	</span>
			// );
		}
	};
	bodymetason.items.push(operationbody);
	headmetason.items.pop();
	props.meta.setMeta(meta);
	return meta;
}
