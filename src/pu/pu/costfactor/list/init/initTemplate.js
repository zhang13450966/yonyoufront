/*
 * @Author: zhaochyu
 * @PageInfo: 列表页面初始化
 * @Date: 2018-05-28 14:36:23 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-08-19 09:52:49
 */
import { PAGECODE, FIELD, URL, BUTTON } from '../../constance';
import { buttonClick } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	//   let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.listpagecode //页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					this.props.button.setPopContent(
						BUTTON.Delete,
						getLangByResId(this, '4004COSTFACTOR-000007')
					); /* 国际化处理： 确定要删除这条信息吗？*/
				}
				props.button.setButtonVisible([ 'Add' ], true);
				props.button.setButtonVisible([ 'Save', 'Cancel' ], false);
			}
		}
	);
}
function modifierMeta(props, meta) {
	//表体参照过滤
	meta[PAGECODE.bodyId].items.map((item) => {
		if (item.attrcode == FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
			item.queryCondition = () => {
				let length = props.editTable.getAllData(PAGECODE.headId).rows.length - 1;
				let data = props.editTable.getAllData(PAGECODE.headId).rows[length].values.pk_org.value;
				return {
					pk_org: data,
					GridRefActionExt: URL.MaterialSqlBuilder,
					UsualGridRefActionExt: URL.MaterialSqlBuilder
				};
			};
		}
	});
	//表头参照过滤
	meta[PAGECODE.headId].items.map((item) => {
		if (item.attrcode == FIELD.pk_org_v) {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: URL.orgv_permissions
				};
			};
		}
	});

	let tableHeadAreaTemp = meta.list_head;
	let operationhead = {
		attrcode: 'opr',
		itemtype: 'customer',
		label: getLangByResId(this, '4004COSTFACTOR-000002') /* 国际化处理： 操作*/,
		width: '120px',
		visible: true,
		fixed: 'right', //锁定操作列 //默认必输
		render: (text, record, index) => {
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
	tableHeadAreaTemp.items.push(operationhead); // 将操作列添加到列表态的table中
	return meta;
}
