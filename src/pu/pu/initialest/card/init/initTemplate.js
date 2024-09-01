/*
 * @Author: zhaochyu
 * @PageInfo: 卡片态初始化
 * @Date: 2018-05-03 16:17:15
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-08 20:55:31
 */
import excelImportconfig from 'uap/common/components/excelImportconfig';
import {
	PAGECODE,
	UISTATE,
	AREA,
	FIELD,
	CARD_BUTTON,
	BODY_FIELD,
	URL,
	HEAD_FIELD,
	DATASOURCE,
	VDEF,
	VBDEF
} from '../../constance';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import btnClickController from '../viewControl/btnClickController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import afterEvent from '../afterEvents/orgChangeEvent';
import { buttonController } from '../viewControl';
import { pageInfoClick } from '../btnClicks';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import { rateTypeSellFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default function(props) {
	let excelimportconfig = excelImportconfig(props, 'pu', '4T', true, URL.import, {
		noTips: true,
		isSelfDefineImport: true
	});
	props.createUIDom(
		{
			pagecode: PAGECODE.cardpagecode //页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					//交易类型引用
					transtypeUtils.init.call(this, data.context);
					let meta = data.template;
					meta = modifierMeta.call(this, props, meta);
					let status = props.getUrlParam(FIELD.cardStatus);
					let pk = props.getUrlParam(FIELD.cardId);
					let billstatus = props.getUrlParam(FIELD.fbillstatus);
					if ((status == UISTATE.edit && pk == null) || status == UISTATE.add) {
						props.meta.setMeta(meta, function() {
							props.initMetaByPkorg(HEAD_FIELD.pk_org_v);
						});
					} else if (status != UISTATE.browse) {
						props.meta.setMeta(meta);
						setTimeout(() => {
							props.form.setFormItemsDisabled(AREA.cardFormArea, {
								pk_org_v: true
							});
						}, 0);
					} else {
						props.meta.setMeta(meta);
					}
				}
				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([ PAGECODE.cardhead, PAGECODE.cardbody ]);
					props.button.setButtons(button);
					props.button.setUploadConfig(CARD_BUTTON.Import, excelimportconfig);
					buttonController.lineSelected.call(this, this.props);
					pageInfoClick.call(this, this.props);
					let statu = props.getUrlParam(FIELD.cardStatus);
					setTimeout(() => {
						let pk_org_v = data.context.pk_org_v;
						let pk_org_vName = data.context.org_v_Name;
						setDefData(DATASOURCE.dataSource, FIELD.org, pk_org_v);
						setDefData(DATASOURCE.dataSource, FIELD.orgName, pk_org_vName);
						if (statu == UISTATE.add) {
							buttonController.lineSelected.call(this, this.props, true);
							if (pk_org_v) {
								afterEvent.call(
									this,
									this.props,
									PAGECODE.cardhead,
									HEAD_FIELD.pk_org_v,
									{ value: pk_org_v, display: pk_org_vName },
									{ value: null }
								);
							}
						}
					}, 0);
				}
			}
		}
	);
}

function modifierMeta(props, meta) {
	//表单参照过滤
	meta[PAGECODE.cardhead].items.map((item) => {
		//主组织权限过滤
		if (item.attrcode == HEAD_FIELD.pk_org_v) {
			item.queryCondition = () => {
				return {
					TreeRefActionExt: URL.orgv_permissions
				};
			};
		} else if (item.attrcode == HEAD_FIELD.pk_stordoc) {
			//根据库存组织过滤仓库
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_stockorg).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_stockorg过滤
			};
		} else if (item.attrcode == HEAD_FIELD.ctrantypeid) {
			//期初暂估类型过滤
			item.queryCondition = () => {
				let pk_org = (props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org) || {}).value;
				let pk_busitype =
					props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_busitype) == null
						? null
						: props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_busitype).value;
				return {
					parentbilltype: PAGECODE.billType,
					SCM_CONSIDERBUSITYPE: 'Y',
					pk_org: pk_org,
					SCM_BUSITYPE: pk_busitype,
					GridRefActionExt: URL.extrefsqlbuilder
				};
			};
		} else if (item.attrcode == HEAD_FIELD.pk_supplier) {
			//根据主组织过滤供应商
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		} else if (item.attrcode == HEAD_FIELD.pk_dept_v) {
			//根据采购组织过滤采购部门
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_purchaseorg).value;
				return { pk_org: data, busifuncode: FIELD.pu };
			};
		} else if (item.attrcode == HEAD_FIELD.pk_bizpsn) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_purchaseorg).value;
				let pk_dept = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_dept).value;
				return { pk_org: pk_org, pk_dept: pk_dept, busifuncode: FIELD.pu };
			};
		} else if (item.attrcode == HEAD_FIELD.pk_managepsn) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_stockorg).value;
				return { pk_org: pk_org, busifuncode: FIELD.st };
			};
		} else if (item.attrcode == HEAD_FIELD.fbillstatus) {
			//设置单据状态不可编辑
			props.form.setFormItemsDisabled(PAGECODE.cardhead, {
				[HEAD_FIELD.fbillstatus]: true
			});
		} else if (VDEF.includes(item.attrcode)) {
			//根据主组织过滤自定义项
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		} else if (item.attrcode == HEAD_FIELD.cratetype) {
			//汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter();
			};
		}
	});

	//表体参照过滤
	meta[PAGECODE.cardbody].items.map((item) => {
		item.col = 4;
		// item.width = 120;
		if (item.attrcode == BODY_FIELD.pk_material) {
			item.isMultiSelectedEnabled = true;
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org);
				return {
					pk_org: pk_org.value,
					GridRefActionExt: URL.materialsqlbuilder
				};
			};
		} else if (item.attrcode == BODY_FIELD.casscustid || item.attrcode == BODY_FIELD.casscustvid) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org);
				return { pk_org: pk_org.value };
			};
		} else if (VBDEF.includes(item.attrcode)) {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org);
				return { pk_org: pk_org.value };
			};
		} else if (item.attrcode == BODY_FIELD.vbatchcode) {
		} else {
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_org).value;
				return { pk_org: pk_org == null ? pk_org : pk_org };
			};
		}
	});
	let status = props.getUrlParam(FIELD.cardStatus);
	meta[PAGECODE.cardhead].status = status;
	meta[PAGECODE.cardbody].status = status;
	//表体侧拉物料多选
	meta[BODY_FIELD.childform1].items.find((e) => e.attrcode === BODY_FIELD.pk_material).isMultiSelectedEnabled = true;
	let porCol = {
		label: getLangByResId(this, '4004INITIALEST-000018') /* 国际化处理： 操作*/,
		width: '180px',
		itemtype: 'customer',
		visible: true,
		fixed: 'right',
		attrcode: 'opr',
		render: (text, record, index) => {
			//默认必输 //锁定操作列
			let buttonAry = buttonController.setRowButtons.call(this, props);
			return props.button.createOprationButton(buttonAry, {
				area: AREA.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[PAGECODE.cardbody].items.push(porCol);
	//行号处理
	columnSortUtils.numberSort(meta, PAGECODE.cardbody, BODY_FIELD.crowno);
	return meta;
}
//判断是否来自采购订单
function fromOrder(props) {
	let rows = null;
	if (!props.cardTable.getNumberOfRows(PAGECODE.cardbody)) {
		return false;
	}
	rows = props.cardTable.getNumberOfRows(PAGECODE.cardbody);
	for (let i = 0; i < rows; i++) {
		let pk_order_b = props.cardTable.getValByKeyAndIndex(PAGECODE.cardbody, i, BODY_FIELD.pk_order_b);
		if (pk_order_b.value && pk_order_b.value != null) {
			return true;
		}
	}
	return false;
}
