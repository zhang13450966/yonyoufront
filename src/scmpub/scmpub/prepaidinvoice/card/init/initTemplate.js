/*
 * @Author: 刘奇 
 * @PageInfo: 卡片界面初始化
 * @Date: 2019-03-05 15:14:32 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-01-27 10:31:20
 */

import { PREPAIDINVOICE_CONST, BUTTON_AREA } from '../../const';
import initCardRowButtons from './initCardRowButtons';
import { referEvent } from '../events';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	props.createUIDom(
		{
			pagecode: PREPAIDINVOICE_CONST.cardPageId
		},
		(data) => {
			if (data) {
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
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([ BUTTON_AREA.Card_Head, BUTTON_AREA.Card_Body ]);
					props.button.setButtons(button);
					this.initData.call(this);
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
		label: getLangByResId(this, '4006PREPAIDINVOICE-000001') /* 国际化处理： 操作*/,
		visible: true,
		itemtype: 'customer',
		fixed: 'right',
		width: 150,
		render: (text, record, index) => {
			return initCardRowButtons.call(this, props, text, record, index);
		}
	};
	meta[PREPAIDINVOICE_CONST.tableId].items.push(porCol);

	// 控制操作信息页签字段不允许编辑
	meta[PREPAIDINVOICE_CONST.tableId].items.map((item) => {
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

	// 控制表体字段不可以编辑
	meta[PREPAIDINVOICE_CONST.tableId].items = meta[PREPAIDINVOICE_CONST.tableId].items.map((item) => {
		if (
			item.attrcode == 'cinvoice_bid' ||
			item.attrcode == 'pk_org' ||
			item.attrcode == 'pk_group' ||
			item.attrcode == 'hid' ||
			item.attrcode == 'ts'
		) {
			item.disabled = true;
		}
		if (item.attrcode == 'vsrccode') {
			item.render = (text, record, index) => {
				if (record && record.values.csrcid && record.values.vsrctype) {
					return (
						<a
							style={{ cursor: 'pointer' }}
							onClick={() => {
								props.openTo(null, {
									billtype: record.values.vsrctype.value,
									//单据类型中的卡片联查
									sence: 4,
									status: 'browse',
									id: record.values.csrcid.value
								});
							}}
						>
							{((record || {}).values.vsrccode || {}).value}
						</a>
					);
				}
			};
			item.renderStatus = 'browse';
		}
		return item;
	});

	// 控制侧拉编辑-表体字段不可以编辑
	meta[PREPAIDINVOICE_CONST.side].items.map((item) => {
		if (
			item.attrcode == 'cinvoice_bid' ||
			item.attrcode == 'pk_org' ||
			item.attrcode == 'pk_group' ||
			item.attrcode == 'hid' ||
			item.attrcode == 'ts'
		) {
			item.disabled = true;
		}
	});

	return meta;
}
