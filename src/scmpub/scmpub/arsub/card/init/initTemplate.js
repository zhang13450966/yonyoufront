/*
 * @Author: 刘奇 
 * @PageInfo: 卡片界面初始化
 * @Date: 2019-03-05 15:14:32 
 * @Last Modified by: sunxxf
 * @Last Modified time: 2021-03-28 18:02:15
 */

import { ARSUB_CONST, BUTTON, ArsubHeadItem, ArsubBodyItem } from '../../const';
import { commonSearch_BtnClick, transferBill, searchForCopy_BtnClick } from '../btnClicks';
import initCardRowButtons from './initCardRowButtons';
import { referEvent, head_afterEvent } from '../events';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam } from '../../../pub/cache';
import initPkOrgAfter from './initPkOrgAfter';
import buttonController from '../viewController/buttonController';

// 参照只根据销售组织过滤的字段
const csaleorgid_filter_Fields = [ ArsubHeadItem.cemployeeid, ArsubHeadItem.cdeptvid ];
export default function(props) {
	props.createUIDom(
		{
			pagecode: ARSUB_CONST.cardPageId
		},
		(data) => {
			if (data) {
				// 缓存交易类型
				transtypeUtils.init.call(this, data.context);
				this.contexts = data.context;
				//个性化设置组织放到缓存中
				if (data.context.pk_org) {
					this.org = {
						display: data.context.org_Name,
						value: data.context.pk_org
					};
					this.org_v = {
						display: data.context.org_v_Name,
						value: data.context.pk_org_v
					};
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						setData.call(this, this.props);
					});
				}
				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas(ARSUB_CONST.formId, ARSUB_CONST.tableId);
					props.button.setButtons(button);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	// 处理参照过滤
	referEvent(props, meta);
	let porCol = {
		attrcode: 'opr',
		label: getLangByResId(this, '4006ARSUB-000001') /* 国际化处理： 操作*/,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 150,
		render: (text, record, index) => {
			return initCardRowButtons.call(this, props, text, record, index);
		}
	};
	meta[ARSUB_CONST.tableId].items.push(porCol);

	// 控制表头业务员和部门默认显示业务单元
	meta[ARSUB_CONST.formId].items.map((element) => {
		if (element.attrcode == ArsubHeadItem.cemployeeid || element.attrcode == ArsubHeadItem.cdeptvid) {
			element.isShowUnit = true;
		}
	});
	// 控制操作信息页签字段不允许编辑
	meta[ARSUB_CONST.tableId].items.map((item) => {
		if (
			item.attrcode == 'billmaker' ||
			item.attrcode == 'dmakedate' ||
			item.attrcode == 'approver' ||
			item.attrcode == 'dauditdate' ||
			item.attrcode == 'creator' ||
			item.attrcode == 'creationtime' ||
			item.attrcode == 'modifier' ||
			item.attrcode == 'modifiedtime'
		) {
			item.disabled = true;
		}
	});

	return meta;
}

function setData(props) {
	let buttonType = props.getUrlParam('buttonType');
	let srcid = props.getUrlParam('srcid');
	let carsubid = props.getUrlParam('id');
	if (buttonType && buttonType.indexOf('ref') != -1) {
		transferBill.call(this, props, buttonType);
	} else if (srcid) {
		// 复制单据
		changeUrlParam(props, {
			status: ARSUB_CONST.edit,
			buttonType: BUTTON.copy,
			id: ''
		});
		searchForCopy_BtnClick.call(this, props, srcid);
	} else {
		let carsubid = props.getUrlParam('id');
		if (carsubid) {
			commonSearch_BtnClick.call(this, this.props, carsubid);
		} else {
			if (this.org_v.value && this.org_v.display) {
				this.props.initMetaByPkorg('pk_org_v');
				initPkOrgAfter.call(this, props, this.contexts);
				// head_afterEvent.call(this, this.props, ARSUB_CONST.formId, 'pk_org_v', this.org_v);
			} else {
				buttonController.call(this, props);
				initPkOrgAfter.call(this, props, this.contexts);
			}
		}
	}
}
