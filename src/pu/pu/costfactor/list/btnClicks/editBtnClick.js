/*
 * @Author: zhaochyu 
 * @PageInfo: 修改操作
 * @Date: 2018-05-31 18:53:47 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-11-19 15:21:08
 */
import { ajax } from 'nc-lightapp-front';
import { UISTATE, PAGECODE, URL, BUTTON } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClick } from '../btnClicks';
export default function(props, record, index) {
	this.setState({
		status: UISTATE.edit,
		editflag: index
	});
	//为了和平台的数据结构相符，重新加载一个form和table的模板
	//获取表头的Pk值
	let pk = record.values.pk_costfactor.value;
	//表体总行数
	let bodyrow = null;
	ajax({
		url: URL.listBodyQuery,
		data: {
			pk: pk,
			pagecode: PAGECODE.listpagecode
		},
		success: (res) => {
			let { success, data } = res;
			if (data == undefined) {
				props.editTable.setTableData(PAGECODE.bodyId, {
					rows: []
				});
			} else {
				props.editTable.setTableData(PAGECODE.bodyId, data.list_body);
			}
		}
	});
	setTimeout(() => {
		props.editTable.setStatus(PAGECODE.headId, UISTATE.edit);
	}, 0);

	//获取所操作的行
	let numindex = record.values.numberindex.value;
	//得到表头总行数
	let headrow = props.editTable.getNumberOfRows(PAGECODE.headId);

	//锁定当前行
	this.props.editTable.focusRowByIndex(PAGECODE.headId, index);
	//将原始状态的第几行保存下来
	this.setState({
		editNum: index,
		flag: '0'
	});
	//循环设置当前行可编辑，其他行不可编辑
	for (let i = 1; i <= headrow; i++) {
		setTimeout(() => {
			if (i == numindex) {
				props.editTable.setEditableRowByIndex(PAGECODE.headId, numindex - 1, true);
				props.editTable.setEditableRowKeyByIndex(PAGECODE.headId, index, 'pk_org_v', false);
				props.editTable.setStatus(PAGECODE.bodyId, UISTATE.edit);
			} else {
				props.editTable.setEditableRowByIndex(PAGECODE.headId, i - 1, false);
			}
		}, 0);
	}
	props.button.setButtonVisible([ 'Add', 'Refresh' ], false);
	props.button.setButtonVisible([ 'Save', 'Cancel' ], true);
	let meta = props.meta.getMeta();
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
			// 			// style={{
			// 			// 	cursor: 'pointer',
			// 			// 	'padding-right': '10px'
			// 			// }}
			// 			onClick={() => {
			// 				//得到表体总行数
			// 				bodyrow = props.editTable.getNumberOfRows(PAGECODE.bodyId);
			// 				let bodyLinValue = getBodyLineMaxValue(props);
			// 				props.editTable.addRow(PAGECODE.bodyId);
			// 				props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.bshow, {
			// 					value: true,
			// 					display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
			// 				});
			// 				props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.ishoworder, {
			// 					value: bodyLinValue + 1 + '',
			// 					display: bodyLinValue + 1 + ''
			// 				});
			// 				bodyrow = bodyrow + 1;
			// 			}}
			// 		>
			// 			{getLangByResId(this, '4004COSTFACTOR-000004')}
			// 			{/* 国际化处理： 增行*/}
			// 		</a>
			// 		<a
			// 			// style={{
			// 			// 	cursor: 'pointer',
			// 			// 	'padding-right': '10px'
			// 			// }}
			// 			onClick={(e) => {
			// 				bodyrow = props.editTable.getNumberOfRows(PAGECODE.bodyId);
			// 				if (bodyrow > 1) {
			// 					bodyrow = bodyrow - 1;
			// 					bodyRowBtnclick.call(this, props, index);
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
}
