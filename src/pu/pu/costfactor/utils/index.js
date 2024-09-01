/*
 * @Author: zhaochyu
 * @PageInfo: 获取表头表格和表体表格的数据
 * @Date: 2018-06-07 09:40:49
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 11:08:47
 */
import { ajax } from 'nc-lightapp-front';
import { buttonClick } from '../list/btnClicks';
import { PAGECODE, URL, BUTTON } from '../constance';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function masterChildData(props) {
	let length = props.editTable.getAllData(PAGECODE.headId).rows.length - 1;
	let headdata = props.editTable.getAllRows(PAGECODE.headId, false)[length];
	let headcheck = props.editTable.getAllRows(PAGECODE.headId, false);
	let olddata = props.editTable.getAllRows(PAGECODE.bodyId, false);
	let head_empty = props.editTable.checkRequired(PAGECODE.headId, headcheck);
	if (!head_empty) {
		return;
	}
	let body_empty = props.editTable.checkRequired(PAGECODE.bodyId, olddata);
	if (!body_empty) {
		return;
	}
	let pk_costfactor = olddata[0].values.pk_costfactor;
	let bodydata = [];
	olddata.forEach((element) => {
		if (element.status != '3') {
			if (element.values.pk_costfactor == null) {
				element.values.pk_costfactor = pk_costfactor;
			}
			bodydata.push(element);
		}
	});
	let saveData = {
		pageid: PAGECODE.cardpagecode,
		head: {
			[PAGECODE.headId]: {
				areaType: 'form',
				rows: [],
				areacode: PAGECODE.headId
			}
		},
		body: {
			[PAGECODE.bodyId]: {
				areaType: 'table',
				rows: [],
				areacode: PAGECODE.bodyId
			}
		}
	};
	let metaObj = props.meta.getMeta();
	if (
		metaObj[PAGECODE.headId] &&
		metaObj[PAGECODE.headId].moduletype &&
		metaObj[PAGECODE.headId].moduletype === 'table'
	) {
		let headrow = { status: headdata.status, values: headdata.values };
		saveData.head[PAGECODE.headId].rows.push(headrow);
	}
	if (
		metaObj[PAGECODE.bodyId] &&
		metaObj[PAGECODE.bodyId].moduletype &&
		metaObj[PAGECODE.bodyId].moduletype === 'table'
	) {
		saveData.body[PAGECODE.bodyId].rows = bodydata;
	}
	return saveData;
}
export function masterHeadAfterEventData(props) {
	let length = props.editTable.getAllData(PAGECODE.headId).rows.length - 1;
	let headdata = props.editTable.getAllData(PAGECODE.headId).rows[length];
	let olddata = props.editTable.getAllData(PAGECODE.bodyId);
	let pk_costfactor = olddata.rows[0].values.pk_costfactor;
	let bodydata = [];
	let bodylength = olddata.rows.length;
	olddata.rows.forEach((element) => {
		if (element.status != '3') {
			if (element.values.pk_costfactor == undefined) {
				element.values.pk_costfactor = { display: null, scale: '-1', value: null, disabled: 'off' };
			}
			bodydata.push(element);
		}
	});
	let saveData = {
		pageid: PAGECODE.cardpagecode,
		head: {
			[PAGECODE.headId]: {
				areaType: 'form',
				rows: [],
				areacode: PAGECODE.headId
			}
		},
		body: {
			[PAGECODE.bodyId]: {
				areaType: 'table',
				rows: [],
				areacode: PAGECODE.bodyId
			}
		}
	};
	let metaObj = props.meta.getMeta();
	if (
		metaObj[PAGECODE.headId] &&
		metaObj[PAGECODE.headId].moduletype &&
		metaObj[PAGECODE.headId].moduletype === 'table'
	) {
		let headrow = { status: headdata.status, values: headdata.values };
		saveData.head[PAGECODE.headId].rows.push(headrow);
	}
	if (
		metaObj[PAGECODE.bodyId] &&
		metaObj[PAGECODE.bodyId].moduletype &&
		metaObj[PAGECODE.bodyId].moduletype === 'table'
	) {
		saveData.body[PAGECODE.bodyId].rows = bodydata;
	}
	return saveData;
}
export function headAfterEventData(props, moduleId, key, before) {
	let cardData = {};
	cardData = masterHeadAfterEventData(props);
	return {
		attrcode: key,
		newvalue: before[0].newvalue,
		oldvalue: before[0].oldvalue,
		card: cardData
	};
}
export function getUpdata(props, flag) {
	let length = props.editTable.getAllData(PAGECODE.headId).rows.length - 1;
	//校验方法得到表头数据
	let headdata = null;
	let olddata = null;
	if (flag) {
		headdata = props.editTable.getAllRows(PAGECODE.headId, false)[length];
		olddata = props.editTable.getAllRows(PAGECODE.bodyId);
	} else {
		headdata = props.editTable.getAllData(PAGECODE.headId).rows[length];
		olddata = props.editTable.getAllData(PAGECODE.bodyId).rows;
	}

	let pk_costfactor = olddata[0].values.pk_costfactor;
	let bodydata = [];
	olddata.forEach((element) => {
		if (element.values.pk_costfactor == null) {
			element.values.pk_costfactor = pk_costfactor;
		}
		bodydata.push(element);
	});
	let saveData = {
		pageid: PAGECODE.cardpagecode,
		head: {
			[PAGECODE.headId]: {
				areaType: 'form',
				rows: [],
				areacode: PAGECODE.headId
			}
		},
		body: {
			[PAGECODE.bodyId]: {
				areaType: 'table',
				rows: [],
				areacode: PAGECODE.bodyId
			}
		}
	};
	// 获取meta中所有项
	let metaObj = props.meta.getMeta();
	if (
		metaObj[PAGECODE.headId] &&
		metaObj[PAGECODE.headId].moduletype &&
		metaObj[PAGECODE.headId].moduletype === 'table'
	) {
		let headrow = { status: headdata.status, values: headdata.values };
		saveData.head[PAGECODE.headId].rows.push(headrow);
	}
	if (
		metaObj[PAGECODE.bodyId] &&
		metaObj[PAGECODE.bodyId].moduletype &&
		metaObj[PAGECODE.bodyId].moduletype === 'table'
	) {
		saveData.body[PAGECODE.bodyId].rows = bodydata;
	}
	return saveData;
}
//保存后的状态
export function setSaveDateState(props) {
	let length = props.editTable.getAllData(PAGECODE.headId).rows.length - 1;
	let headdata = props.editTable.getAllData(PAGECODE.headId).rows[length];
	let pk = headdata.values.pk_costfactor.value;
	ajax({
		url: URL.listBodyQuery,
		data: { pk: pk, pagecode: PAGECODE.listpagecode },
		success: (res) => {
			let { success, data } = res;
			props.editTable.focusRowByIndex(PAGECODE.headId, length);
			if (data == undefined) {
				props.editTable.setTableData(PAGECODE.bodyId, { rows: [] });
			} else {
				props.editTable.setTableData(PAGECODE.bodyId, data.list_body);
			}
		}
	});
}
//去掉增行删行，加上修改删除
export function AddLineSwithcUpdate(props) {
	let meta = this.props.meta.getMeta();
	let bodymetason = meta[PAGECODE.bodyId];
	let headmetason = meta[PAGECODE.headId];
	let operationhead = {
		attrcode: 'opr',
		itemtype: 'customer',
		label: getLangByResId(this, '4004COSTFACTOR-000002') /* 国际化处理： 操作*/,
		width: '120px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			//默认必输 //锁定操作列
			let buttonAry = [ BUTTON.Edit, BUTTON.Delete ];
			return props.button.createOprationButton(buttonAry, {
				area: PAGECODE.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, record, index)
			});
			// return (
			// 	<span
			// 		className="row-edit"
			// 		onClick={(e) => {
			// 			e.stopPropagation();
			// 		}}
			// 	>
			// 		<a
			// 			className="row-edit-option"
			// 			style={{
			// 				cursor: 'pointer',
			// 				'padding-right': '10px'
			// 			}}
			// 			onClick={() => {
			// 				editBtnClick.call(this, props, record, index);
			// 				e.stopPropagation();
			// 				e.nativeEvent.stopImmediatePropagation();
			// 			}}
			// 		>
			// 			{getLangByResId(this, '4004COSTFACTOR-000008')}
			// 			{/* 国际化处理： 修改*/}
			// 		</a>
			// 		<NCPopconfirm
			// 			trigger="click"
			// 			placement="top"
			// 			content={getLangByResId(this, '4004COSTFACTOR-000007')} /* 国际化处理： 确定要删除这条信息吗？*/
			// 			onClose={rowDeleteBtnClick.bind(this, props, record, index)}
			// 		>
			// 			<a
			// 				className="row-edit-option"
			// 				style={{
			// 					cursor: 'pointer',
			// 					'padding-right': '10px'
			// 				}}
			// 			>
			// 				{getLangByResId(this, '4004COSTFACTOR-000009')}
			// 				{/* 国际化处理：删除*/}
			// 			</a>
			// 		</NCPopconfirm>
			// 	</span>
			// );
		}
	};
	// let operationbody = {
	// 	attrcode: 'opr',
	// 	itemtype: 'customer',
	// 	fixed: 'right',
	// 	label: getLangByResId(this, '4004COSTFACTOR-000002') /* 国际化处理： 操作*/,
	// 	width: '160px',
	// 	visible: true,
	// 	render(text, record, index) {
	// 		//默认必输 //锁定操作列
	// 		return (
	// 			<span>
	// 				<a
	// 					style={{
	// 						cursor: 'pointer',
	// 						'padding-right': '10px'
	// 					}}
	// 					onClick={() => {
	// 						props.editTable.addRow(PAGECODE.bodyId);
	// 					}}
	// 				>
	// 					{getLangByResId(this, '4004COSTFACTOR-000004')}
	// 					{/* 国际化处理： 增行*/}
	// 				</a>
	// 				<a
	// 					style={{
	// 						cursor: 'pointer',
	// 						'padding-right': '10px'
	// 					}}
	// 					onClick={props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId)}
	// 				>
	// 					{getLangByResId(this, '4004COSTFACTOR-000005')}
	// 					{/* 国际化处理： 删行*/}
	// 				</a>
	// 			</span>
	// 		);
	// 	}
	// };
	headmetason.items.push(operationhead);
	bodymetason.items.pop();
	this.props.meta.setMeta(meta);
}
//获取表体行上显示顺序的最大值
export function getBodyLineMaxValue(props) {
	let bodydata = props.editTable.getAllRows(PAGECODE.bodyId, false);
	let bodydatarow = [];
	bodydata.forEach((element) => {
		if (element.status != '3') {
			bodydatarow.push(element);
		}
	});
	let temp = parseInt(bodydatarow[0].values.ishoworder.value);
	for (let i = 1; i < bodydatarow.length; i++) {
		if (parseInt(bodydatarow[i].values.ishoworder.value) > temp) {
			temp = parseInt(bodydatarow[i].values.ishoworder.value);
		}
	}
	return temp;
}
