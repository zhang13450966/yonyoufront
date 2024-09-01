/*
 * @Author: jiangfw 
 * @PageInfo: 卡片界面初始化  
 * @Date: 2018-04-25 20:36:56 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-26 15:01:39
 */
import { AREA, UISTATE, FIELD, BUTTONID, PAGECODE, COMMON, APPCODE, BILLTYPE, SCENE } from '../../constance';
import { btnController } from '../viewControl';
import addHeadRefFilters from '../../refFilter/headRefFilter';
import loadData from './loadData';
import addBodyRefFilter from '../../refFilter/bodyRefFilter';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { afterEvent } from '../afterEvents';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { refBillQueryCache } from '../../../pub/refBillQueryCache/refBillQueryCache';
import btnClickController from '../viewControl/btnClickController';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function() {
	let props = this.props;
	let _this = this;
	let scene = _this.props.getUrlParam('scene');
	_this.scene = scene;
	if (scene == SCENE.approvesce) {
		//采购发票审批场景
		props.createUIDom(
			{
				// appcode: APPCODE.puinvoiceAppr, //应用编码
				pagecode: PAGECODE.invoiceCard //卡片页面编码
			},
			(data) => {
				if (data) {
					if (data.button) {
						let button = data.button;
						props.button.hideButtonsByAreas([ AREA.card_head ]);
						props.button.setButtons(button);
					}
					// _this.scene = scene;
					if (data.context.paramMap) {
						_this.PU_INVOICE_TYPE = data.context.paramMap.PU_INVOICE_TYPE;
					}
					// 交易类型添加逻辑,将交易类型缓存到state中
					// transtypeUtils.init.call(_this, data.context);
					if (data.template) {
						let meta = data.template;
						_this.meta = deepClone(meta);
						meta = modifierMeta.call(_this, props, meta);
						props.meta.setMeta(meta, () => {
							setPk_org_v.call(_this, data), btnController.call(_this);
						});
						if (props.getUrlParam('status') == UISTATE.add && !props.getUrlParam('feeFlag')) {
							props.initMetaByPkorg(FIELD.pk_org_v);
						} else {
							loadData.call(_this);
						}
					}
					// if (data.button) {
					// 	let button = data.button;
					// 	props.button.hideButtonsByAreas([ AREA.card_head ]);
					// 	props.button.setButtons(button);
					// }
				}
			}
		);
	} else {
		props.createUIDom(
			{
				// appcode: APPCODE.puinvoice, //应用编码
				pagecode: PAGECODE.invoiceCard //卡片页面编码
			},
			(data) => {
				if (data) {
					if (data.button) {
						let button = data.button;
						props.button.hideButtonsByAreas([ AREA.card_head ]);
						props.button.setButtons(button);
					}

					if (data.context.paramMap) {
						_this.PU_INVOICE_TYPE = data.context.paramMap.PU_INVOICE_TYPE;
					}
					// 交易类型添加逻辑,将交易类型缓存到state中
					transtypeUtils.init.call(_this, data.context);
					if (data.context.paramMap && data.context.paramMap.transtype) {
						_this.transType = data.context.paramMap.transtype;
					}
					if (data.template) {
						_this.templetid_25 = data.template.pageid;
						let meta = data.template;
						_this.meta = deepClone(meta);
						meta = modifierMeta.call(_this, props, meta);
						props.meta.setMeta(meta, () => {
							setPk_org_v.call(_this, data), btnController.call(_this), setTransType.call(_this);
						});
						if (props.getUrlParam('status') == UISTATE.add && !props.getUrlParam('feeFlag')) {
							props.initMetaByPkorg(FIELD.pk_org_v);
						} else {
							loadData.call(_this);
						}
					}

					// 交易类型发布的小应用新增按钮可用性
					let refBillQueryData = { billType: BILLTYPE.invoice, includeUnCloud: true };
					if (data.context.paramMap && data.context.paramMap.transtype) {
						refBillQueryData.transType = data.context.paramMap.transtype;
					}
					refBillQueryCache(refBillQueryData, COMMON.PuinvoiceCacheKey, COMMON.RefBillTypeInfo);
				}
			}
		);
	}
}

function setTransType() {
	let transtypecode = this.props.getUrlParam('transtypecode');
	if (transtypecode) {
		let billtypename = this.props.getUrlParam('billtypename');
		let billtypeid = this.props.getUrlParam('billtypeid');
		this.props.form.setFormItemsValue(this.formId, {
			[FIELD.ctrantypeid]: { value: billtypeid, display: billtypename },
			[FIELD.vtrantypecode]: { value: transtypecode, display: transtypecode }
		});
		setDefData(COMMON.PuinvoiceCacheKey, 'transtypecode', transtypecode);
		setDefData(COMMON.PuinvoiceCacheKey, 'billtypeid', billtypeid);
		setDefData(COMMON.PuinvoiceCacheKey, 'billtypename', billtypename);
	}
}

/**
 * 设置默认值
 * @param 
 */
function setPk_org_v(data) {
	let feeFlag = this.props.getUrlParam('feeFlag');
	if (!feeFlag) {
		let status = this.props.getUrlParam('status');
		// 新增
		let pk_org_v = data.context.pk_org_v;
		let org_v_Name = data.context.org_v_Name;
		// 缓存为了处理卡片的自制
		setDefData(COMMON.PuinvoiceCacheKey, FIELD.pk_org_v, pk_org_v);
		setDefData(COMMON.PuinvoiceCacheKey, 'org_v_Name', org_v_Name);
		if (status == UISTATE.add) {
			// addDataSource(data);
			if (pk_org_v && org_v_Name) {
				afterEvent.call(
					this,
					this.props,
					this.formId,
					FIELD.pk_org_v,
					{ value: pk_org_v, display: org_v_Name },
					null,
					{
						refpk: pk_org_v,
						refname: org_v_Name
					}
				);
				this.props.form.setFormItemsDisabled(this.formId, { pk_org_v: false });
			} else {
				this.props.form.setFormItemsValue(this.formId, {
					[FIELD.pk_org_v]: { value: null, display: null }
				});
			}
		}
	}
}

function modifierMeta(props, meta) {
	let _this = this;
	let status = props.getUrlParam('status');
	meta[AREA.card_head].status = status;
	meta[AREA.card_body].status = status;
	meta[AREA.card_body].showcheck = true;

	//添加操作列
	let oprCol = {
		attrcode: 'opr',
		label: getLangByResId(_this, '4004PUINVOICE-000032') /* 国际化处理： 操作*/,
		visible: true,
		width: '150px',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		render(text, record, index) {
			let status = props.getUrlParam('status');
			let buttonAry = null;
			if (status == UISTATE.add || status == UISTATE.edit) {
				// 编辑态
				buttonAry = [ BUTTONID.Unfold, BUTTONID.DeleteLine, BUTTONID.InsertLine, BUTTONID.PasteHere ];
			} else {
				// 浏览态
				buttonAry = [ BUTTONID.Unfold ];
			}

			return props.button.createOprationButton(buttonAry, {
				area: AREA.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, buttonid) => btnClickController.call(_this, props, buttonid, record, index)
			});
		}
	};
	meta[AREA.card_body].items.push(oprCol);
	// 添加表头参照过滤
	addHeadRefFilters.call(_this, props, meta);
	// 添加表体参照过滤
	addBodyRefFilter.call(_this, props, meta);
	// 行号排序处理
	columnSortUtils.numberSort(meta, AREA.card_body, FIELD.crowno);
	return meta;
}
