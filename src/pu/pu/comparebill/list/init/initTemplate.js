/*
 * @Author: qishy 
 * @PageInfo:业务对账单列表模板初始化
 * @Date: 2019-05-07 15:11:23 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:10:37
 */

import {
	AREA,
	PAGECODE,
	BUTTONAREA,
	REQUESTURL,
	BUTTONID,
	CACHDATASOURCE,
	BILLSTATUS,
	CACHKEY,
	FIELDS
} from '../../constance';
import { buttonClick } from '../btnClicks';
import searchRefFilter from '../events/searchRefFilter';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { onSelected } from '../viewControl/rowSelectControl';
import BillCodeHyperLink from 'scmpub/scmpub/components/BillCodeStyle';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.listPagecode //列表页面编码
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
					props.button.setPopContent(
						BUTTONID.Delete,
						getLangByResId(this, '4004comarebill-000009')
					); /* 国际化处理： 确认删除？*/
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(this, props, meta);
					props.meta.setMeta(meta, () => {
						onSelected.call(this, props);
						setData.call(this, props);
					});
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	// //添加超链接
	meta[AREA.listTableId].items = meta[AREA.listTableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record.pk_comparebill) {
					return (
						<BillCodeHyperLink
							value={record[FIELDS.vbillcode].value}
							onClick={() => {
								// e.stopPropagation();
								props.pushTo(REQUESTURL.toCard, {
									status: 'browse',
									id: record[FIELDS.pk_comparebill].value,
									pagecode: PAGECODE.cardPagecode
								});
							}}
						/>
					);
				}
			};
		}
		return item;
	});

	meta[AREA.listTableId].items.push({
		label: getLangByResId(this, '4004comarebill-000017') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let forderstatus = record[FIELDS.forderstatus].value;
			let buttonAry = [];
			if (BILLSTATUS.free == forderstatus) {
				buttonAry = [ BUTTONID.Send, BUTTONID.Confirm, BUTTONID.Edit, BUTTONID.Delete ];
			} else if (BILLSTATUS.send == forderstatus) {
				buttonAry = [ BUTTONID.UnSend, BUTTONID.Confirm ];
			} else {
				buttonAry = [ BUTTONID.Invoice, BUTTONID.UnConfirm ];
			}

			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.list_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(this, props, key, text, record, index),
				ignoreHotkeyCode: getListDisableHotKeyBtn()
			});
		}
	});

	meta[AREA.searchId].items.map((item) => {
		if (
			item.attrcode == FIELDS.pk_supplier ||
			item.attrcode == FIELDS.pk_comparebill_b_pk_material_v ||
			item.attrcode == FIELDS.pk_comparebill_b_pk_material_v_pk_marbasclass ||
			item.attrcode == FIELDS.cemployeeid ||
			item.attrcode == FIELDS.pk_dept
		) {
			item.isShowUnit = true;
		}
		// 设置显示停用、人员显示离职
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
	});
	// 查询区参照过滤
	searchRefFilter(props, meta, AREA.searchId);

	return meta;
}

function setData(props) {
	if (!hasListCache(props, CACHDATASOURCE.dataSourceList)) {
		if (getDefData(CACHDATASOURCE.dataSourceList, CACHKEY.Dlinksce)) {
			props.table.setAllTableData(AREA.listTableId, { rows: [] });
		}
	}
}
