/*
 * @Author: chaiwx 
 * @PageInfo: 卡片页初始化  
 * @Date: 2018-04-10 12:23:59 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-12-29 14:22:16
 */
import { ajax } from 'nc-lightapp-front';
import {
	CACHKEY,
	AREA,
	PAGECODE,
	REQUESTURL,
	BUTTONID,
	BUTTONAREA,
	OPTIONS,
	CACHDATASOURCE,
	FIELDS,
	BILLSTATUS
} from '../../constance';
import { mainOrgInit } from '.';
import { buttonClick } from '../btnClicks';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
import { updateCacheData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
const { init } = transtypeUtils;
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonControl } from '../viewControl/buttonControl';
import headRefFilter from '../events/headRefFilter';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.cardPagecode //页面id
		},
		function(data) {
			if (data) {
				if (data.context) {
					// 发布交易类型处理 add by guozhq
					init.call(_this, data.context);
					_this.contexts = data.context;
				}
				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([ BUTTONAREA.card_head, BUTTONAREA.card_body ]);
					props.button.setOprationBtnsRenderStatus([ BUTTONAREA.card_body_inner ], false);
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, props, meta);
					props.meta.setMeta(meta, () => {
						// 设置数据
						setData.call(_this, props, data);
					});
				}
			}
		}
	);
}

function setData(props, templateData) {
	let status = props.getUrlParam('status');

	// 如果是单据追溯过来的，缓存起来，用于返回按钮（如果缓存未空，显示空白页面）
	let scene = props.getUrlParam('scene');
	setDefData(CACHDATASOURCE.dataSourceList, CACHKEY.Dlinksce, scene);

	if (status == 'add') {
		// 新增
		buttonControl.call(this, props);
		mainOrgInit.call(this, props, templateData.context);
	} else {
		// 非新增
		let option = props.getUrlParam('option');
		let url = REQUESTURL.queryCard;

		if (option && option == OPTIONS.copy) {
			// 复制
			url = REQUESTURL.copy;
		}

		ajax({
			url: url,
			data: { pks: [ props.getUrlParam('id') ], pageid: PAGECODE.cardPagecode },
			success: (res) => {
				if (res.data) {
					// 效率优化开启
					props.beforeUpdatePage();

					if (res.data.head) {
						props.form.EmptyAllFormValue(AREA.cardFormId);
						props.form.setAllFormValue({ [AREA.cardFormId]: res.data.head[AREA.cardFormId] });
					}
					if (res.data.body) {
						props.cardTable.setTableData(AREA.cardTableId, res.data.body[AREA.cardTableId]);
					}
					// 复制，主组织不可编辑
					if (option == OPTIONS.copy || status == 'edit') {
						props.form.setFormItemsDisabled(AREA.cardFormId, { [FIELDS.pk_org_v]: true });
					}
					if (url == REQUESTURL.queryCard) {
						// 如果是查看，缓存数据
						updateCacheData(
							props,
							FIELDS.pk_taxinvoice,
							res.data.head.head.rows[0].values.pk_taxinvoice.value,
							res.data,
							AREA.cardFormId,
							CACHDATASOURCE.dataSourceList
						);
					}
					buttonControl.call(
						this,
						props,
						res.data.head[AREA.cardFormId].rows[0].values[FIELDS.fstatusflag].value
					);

					// 效率优化开关关闭
					props.updatePage(AREA.cardFormId, AREA.cardTableId);
				}
			},
			error: (res) => {
				showErrorInfo(null, res.message);
				props.setUrlParam({ status: 'browse', id: '' });
				buttonControl.call(this, props);
			}
		});
	}
}

function modifierMeta(props, meta) {
	let _this = this;
	let status = props.getUrlParam('status');
	meta[AREA.cardFormId].status = status;
	meta[AREA.cardTableId].status = status;
	//物料多选
	meta[AREA.cardTableId].items.find((e) => e.attrcode === FIELDS.cmaterialvid).isMultiSelectedEnabled = true;
	meta[AREA.childform2].items.find((e) => e.attrcode === FIELDS.cmaterialvid).isMultiSelectedEnabled = true;

	// 操作列
	meta[AREA.cardTableId].items.push({
		label: getLangByResId(_this, '4004Taxinvoice-000008') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '160px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			// 复制按钮点击时，设置操作列按钮可见性
			let buttonAry;
			if (props.getUrlParam('status') === 'browse') {
				let fstatusflag = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.fstatusflag).value;
				buttonAry = [ BUTTONID.Open ];
				if (record.values[FIELDS.crowno] && record.values[FIELDS.crowno].value) {
					if (BILLSTATUS.audit == fstatusflag && !record.values[FIELDS.bfeecloseflag].value) {
						// 审核状态能做行关闭动作
						buttonAry.push(BUTTONID.LineClose);
					} else if (
						BILLSTATUS.close == fstatusflag ||
						(BILLSTATUS.audit == fstatusflag && record.values[FIELDS.bfeecloseflag].value)
					) {
						// 显示条件：1.整单关闭；2.整单审批通过且行关闭
						buttonAry.push(BUTTONID.LineOpen);
					}
				}
			} else {
				// 根据是否有复制数据，设置可见性
				if (_this.copyRowDatas) {
					buttonAry = [ BUTTONID.PasteLine ];
				} else {
					buttonAry = [
						BUTTONID.Open,
						BUTTONID.DeleteFeeLine,
						BUTTONID.DeleteMatLine
						// BUTTONID.CopyLine,
						// BUTTONID.InsertLine
					];
				}
			}
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => buttonClick.call(_this, props, key, text, record, index)
			});
		}
	});

	meta[AREA.cardFormId].items.map((item) => {
		item.isShowUnit = false;
	});

	let fixAssts = [ 'casscustid', 'cprojectid', 'cproductorid', 'cvendorid' ];
	meta[AREA.cardTableId].items.map((item) => {
		item.isShowUnit = false;
		// item.isSort = false; //禁止列排序
		if (item.attrcode.indexOf('vfree') == 0 || fixAssts.includes(item.attrcode)) {
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(AREA.cardFormId, FIELDS.pk_org).value;
				return { pk_org: data };
			};
		}
	});

	// headRefFilter(props, meta, AREA.cardFormId);

	// 行号排序处理;
	columnSortUtils.numberSort(meta, AREA.cardTableId, FIELDS.crowno);

	return meta;
}
