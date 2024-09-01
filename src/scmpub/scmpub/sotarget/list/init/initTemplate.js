/*
 * @Author: zhangchqf 
 * @PageInfo:  页面初始化控制
 * @Date: 2020-02-11 20:39:26 
 * @Last Modified by: qishy
 * @Last Modified time: 2021-02-05 10:18:36
 */

import { TARGET_LIST, TARGET_LIST_BUTTON, ATTRCODE } from '../../siconst';
import { buttonController, btnClickController } from '../viewControl';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';

export default function(props) {
	let callbackFun = (data) => {
		if (data) {
			if (data.template) {
				let meta = data.template;
				modifierMeta.call(this, props, meta);
				props.meta.setMeta(meta, () => {
					buttonController.setListButtonVisiable.bind(this, this.props)();
					let disableArrdef = {
						[TARGET_LIST_BUTTON.Refresh]: true //刷新
					};
					props.button.setDisabled(disableArrdef);
				});
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				props.button.setPopContent(
					TARGET_LIST_BUTTON.deleteRow,
					getLangByResId(this, '4001TARGET-000033')
				); /* 国际化处理： 确定要删除吗？*/
			}
			this.forceUpdate();
		}
	};
	//查询按钮使用
	props.createUIDom(
		{
			pagecode: TARGET_LIST.listpageid //卡片页面编码 appid: TARGET_LIST.appid //应用主键
		},
		callbackFun
	);
}

function modifierMeta(props, meta) {
	meta[TARGET_LIST.formId].status = TARGET_LIST.browse;
	meta[TARGET_LIST.searchId].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		//设置表头请购类型参照过滤 根据单据类型
		if (item.attrcode == ATTRCODE.pk_org) {
			//主组织过滤--树形结构
			item.queryCondition = () => {
				return { TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.creator) {
			//计划部门 根据pk_org 过滤 业务人员来源
			item.isShowUnit = false;
			item.queryCondition = () => {
				let data = props.search.getSearchValByField(TARGET_LIST.searchId, TARGET_LIST.pk_org);
				data = data != null ? (data.value.firstvalue.includes(',') ? null : data.value.firstvalue) : null;
				return { pk_org: data };
			};
		}
	});

	let porCol = {
		label: getLangByResId(this, '4001TARGET-000003') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let buttonAry = buttonController.setRowButtons();
			return props.button.createOprationButton(buttonAry, {
				area: TARGET_LIST_BUTTON.list_inner,
				buttonLimit: 3,
				ignoreHotkeyCode: [ TARGET_LIST_BUTTON.deleteRow ],
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	// 将操作列添加到列表态的table中
	meta[TARGET_LIST.formId].items.push(porCol);
	return meta;
}
