/*
 * @Author: chaiwx 
 * @PageInfo: 内部结算规则初始化模板  
 * @Date: 2018-04-10 12:21:36 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:18:30
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
	FIELDS,
	TABS
} from '../../constance';
import { buttonClick, commonSearch } from '../btnClicks';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
const { init, initQuery } = transtypeUtils;
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { getDefData, hasListCache } from '../../../../../scmpub/scmpub/pub/cache';
import { getListDisableHotKeyBtn } from '../../../../../scmpub/scmpub/pub/tool/hotKeysUtil';
import searchRefFilter from '../events/searchRefFilter';
import { onSelected } from '../viewControl/rowSelectControl';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.listPagecode //列表页面编码
		},
		callbackFun
	);
	function callbackFun(data) {
		if (data) {
			if (data.context) {
				// 发布交易类型处理 add by guozhq
				init.call(_this, data.context);
			}
			if (data.template) {
				let meta = data.template;
				modifierMeta.call(_this, props, meta);
				props.meta.setMeta(meta);
			}
			if (data.button) {
				let button = data.button;
				props.button.setButtons(button);
				props.button.setPopContent(
					BUTTONID.Delete,
					getLangByResId(_this, '4004Taxinvoice-000006')
				); /* 国际化处理： 确认删除？*/
			}
			// 按钮可用性
			props.button.setDisabled({ [BUTTONID.Refresh]: true });
			onSelected.call(_this, _this.props);
		}
	}
}

function modifierMeta(props, meta) {
	//添加超链接
	meta[AREA.listTableId].items = meta[AREA.listTableId].items.map((item, key) => {
		if (item.attrcode == 'vbillcode') {
			item.render = (text, record, index) => {
				if (record && record.pk_taxinvoice) {
					return (
						<span
							className="code-detail-link"
							onClick={() => {
								props.pushTo(REQUESTURL.toCard, {
									status: 'browse',
									id: record[FIELDS.pk_taxinvoice].value,
									pagecode: PAGECODE.cardPagecode
								});
							}}
						>
							{record[FIELDS.vbillcode].value}
						</span>
					);
				}
			};
		}
		return item;
	});

	meta[AREA.listTableId].items.push({
		label: getLangByResId(this, '4004Taxinvoice-000008') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '180px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let fstatusflag = record[FIELDS.fstatusflag].value;
			let buttonAry = [];
			if (BILLSTATUS.free == fstatusflag) {
				buttonAry = [ BUTTONID.Commit, BUTTONID.Edit, BUTTONID.Delete, BUTTONID.Copy, BUTTONID.ApproveInfo ];
			} else if (BILLSTATUS.nopass == fstatusflag) {
				buttonAry = [ BUTTONID.Edit, BUTTONID.Copy, BUTTONID.ApproveInfo ];
			} else {
				buttonAry = [ BUTTONID.Copy, BUTTONID.ApproveInfo ];
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
			item.attrcode == FIELDS.cdeptid ||
			item.attrcode == FIELDS.cbill_bid_ccostsubjid ||
			item.attrcode == FIELDS.cpsnid ||
			item.attrcode == FIELDS.cbill_bid_cfeecustomerid
		) {
			item.isShowUnit = true;
		}
		// 设置显示停用、人员显示离职
		setRefShowDisabledData(item);
		setPsndocShowLeavePower(item);
	});

	// 查询区参照过滤
	// searchRefFilter(props, meta, AREA.searchId);

	//发布交易类型后，需要控制查询模板交易类型的值和可编辑性
	initQuery.call(this, props, meta, AREA.searchId, FIELDS.ctrantypeid);

	return meta;
}
