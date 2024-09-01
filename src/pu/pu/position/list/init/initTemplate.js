/*
 * @Author: wangceb
 * @PageInfo: 初始化界面
 * @Date: 2018-05-21 13:27:51
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-10-21 19:05:43
 */

import {
	POSITION_CONST,
	HEAD_OPR_EDTI_BUTTONS,
	HEAD_OPR_BROWSE_BUTTONS,
	BODY_OPR_BROWSE_BUTTONS,
	BODY_OPR_EDIT_BUTTONS
} from '../../const';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import buttonController from '../../list/viewController/buttonController';
import downOperate_buttonClick from '../../list/btnClicks/downBtnClicks/operate_buttonClick';
import upOperate_buttonClick from '../../list/btnClicks/upBtnClicks/operate_buttonClick';
import { ajax, getBusinessInfo } from 'nc-lightapp-front';
import commonSearch_BtnClick from '../btnClicks/commonSearch_BtnClick';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: POSITION_CONST.PAGECODE
		},
		(data) => {
			if (data) {
				if (data.context.pk_org) {
					this.mainorgvalue.refpk = data.context.pk_org;
					this.mainorgvalue.refname = data.context.org_Name;
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, initData.bind(this));
					getBusiParam.call(this, props);
					buttonController.call(this, props, POSITION_CONST.BROWSER_STATUS);
				}
			}
		}
	);
}

function initData() {
	if (!this.mainorgvalue.refpk) {
		return;
	}
	commonSearch_BtnClick.call(this, this.mainorgvalue);
}

// 读取集团级业务参数 PO85 并隐藏字段
function getBusiParam(props) {
	// 获取业务参数信息
	let businessInfo = getBusinessInfo();
	let params = {};
	params.pk_org = businessInfo.groupId;
	params.initCodes = [ 'PO85' ];
	ajax({
		// 批量查询业务参数设置
		url: '/nccloud/baseapp/param/paBatchQry.do',
		data: params,
		success: (res) => {
			if (res.data.PO85 && res.data.PO85 === 'pu_marclass' && this.nodecode === '40010520') {
				// 隐藏“物料基本分类”
				props.cardTable.hideColByKey(POSITION_CONST.DOWNTABLEID, [
					'pk_marbasclass',
					'pk_marbasclass.name',
					'marbasclass_code'
				]);
			} else {
				// 隐藏“物料采购分类”
				props.cardTable.hideColByKey(POSITION_CONST.DOWNTABLEID, [
					'pk_marpuclass',
					'pk_marpuclass.name',
					'marpuclass_code'
				]);
			}
		}
	});
}

function modifierMeta(props, meta) {
	meta[POSITION_CONST.UPTABLEID].items.push({
		attrcode: 'opr',
		label: getLangByResId(this, '4004POSITION-000023') /* 国际化处理： 操作*/,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 130,

		render: (text, record, index) => {
			let showButtons = null;
			if (this.props.cardTable.getStatus(POSITION_CONST.UPTABLEID) === POSITION_CONST.BROWSER_STATUS) {
				showButtons = HEAD_OPR_BROWSE_BUTTONS;
			} else {
				showButtons = HEAD_OPR_EDTI_BUTTONS;
			}
			return props.button.createOprationButton(showButtons, {
				onButtonClick: (props, key) => upOperate_buttonClick.call(this, props, key, text, record, index),
				area: POSITION_CONST.UPOPR_BTNAREA,
				buttonLimit: 3,
				ignoreHotkeyCode: getListDisableHotKeyBtn()
			});
		}
	});

	meta[POSITION_CONST.DOWNTABLEID].items.push({
		attrcode: 'opr',
		label: getLangByResId(this, '4004POSITION-000023') /* 国际化处理： 操作*/,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 130,

		render: (text, record, index) => {
			let showButtons = null;
			if (this.props.cardTable.getStatus(POSITION_CONST.UPTABLEID) === POSITION_CONST.BROWSER_STATUS) {
				showButtons = BODY_OPR_BROWSE_BUTTONS;
			} else {
				showButtons = BODY_OPR_EDIT_BUTTONS;
			}
			return props.button.createOprationButton(showButtons, {
				onButtonClick: (props, key) => downOperate_buttonClick.call(this, props, key, text, record, index),
				area: POSITION_CONST.DOWNOPR_BTNAREA,
				buttonLimit: 3
			});
		}
	});

	return meta;
}
