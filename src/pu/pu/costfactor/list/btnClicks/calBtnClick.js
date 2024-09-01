/*
 * @Author: zhaochyu
 * @PageInfo: 取消操作
 * @Date: 2018-05-29 18:45:15
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 10:50:41
 */
import { UISTATE, PAGECODE, BUTTON } from '../../constance';
import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { buttonClick } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	showWarningDialog(getLangByResId(this, '4004COSTFACTOR-000016'), getLangByResId(this, '4004COSTFACTOR-000006'), {
		/* 国际化处理： 确认要取消吗？*/
		beSureBtnClick: cancelFunction.bind(this, {
			props: props
		})
	});
}
function cancelFunction(params) {
	let { props } = params;
	this.setState(
		{
			status: UISTATE.browse
		},
		() => {
			this.toggleShow();
		}
	);
	setTimeout(() => {
		this.props.editTable.cancelEdit(PAGECODE.bodyId);
		this.props.editTable.cancelEdit(PAGECODE.headId, () => {
			let editfocusRow = this.state.editNum;
			let addfocusRow = this.state.clickNum;
			if (this.state.flag == '1') {
				this.props.editTable.focusRowByIndex(PAGECODE.headId, addfocusRow);
			} else if (this.state.flag == '0') {
				this.props.editTable.focusRowByIndex(PAGECODE.headId, editfocusRow);
			} else {
				this.props.editTable.focusRowByIndex(PAGECODE.headId, 0);
			}
		});
	}, 0);

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
			//fixed: "right", //锁定操作列 //默认必输
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
			// 			onClick={(e) => {
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
			// 				{/* 国际化处理：
			//   删除*/}
			// 			</a>
			// 		</NCPopconfirm>
			// 	</span>
			// );
		}
	};
	// let operationbody = {
	// 	attrcode: 'opr',
	// 	itemtype: 'customer',
	// 	label: getLangByResId(this, '4004COSTFACTOR-000002') /* 国际化处理： 操作*/,
	// 	width: '160px',
	// 	visible: true,
	// 	fixed: 'right',
	// 	render: (text, record, index) => {
	// 		//fixed: "right", //锁定操作列 //默认必输
	// 		return (
	// 			<span>
	// 				<a
	// 					style={{
	// 						cursor: 'pointer',
	// 						'padding-right': '10px'
	// 					}}
	// 					onClick={() => {
	// 						props.editTable.addRow(PAGECODE.bodyId);
	// 						props.editTable.setValByKeyAndIndex(PAGECODE.bodyId, bodyrow, FIELD.bshow, {
	// 							value: true,
	// 							display: getLangByResId(this, '4004COSTFACTOR-000001') /* 国际化处理： 是*/
	// 						});
	// 						bodyrow++;
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
	// 					onClick={(e) => {
	// 						if (bodyrow > 1) {
	// 							props.editTable.deleteTableRowsByIndex(PAGECODE.bodyId, index);
	// 							bodyrow--;
	// 						} else if (bodyrow == 1) {
	// 							toast({
	// 								color: 'warning',
	// 								content: getLangByResId(this, '4004COSTFACTOR-000003') /* 国际化处理： 至少存在一行费用物料！*/
	// 							});
	// 						}
	// 					}}
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
