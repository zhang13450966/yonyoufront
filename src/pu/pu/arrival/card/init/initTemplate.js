/*
 * @Author: ligangt
 * @PageInfo: 到货单列表界面元数据初始化
 * @Date: 2018-04-02 13:46:03
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-13 14:12:10
 */
import { tableButtonClick } from '../btnClicks';
import { URL, PAGECODE, COMMON, APPID, AREA, TRANSFER, BUTTONAREA, ALLBUTTONS, FIELD } from '../../constance';
import MeasdocDefaultGridRef from '../../../../../uapbd/refer/material/MeasdocDefaultGridRef';
import PsndocTreeGridRef from '../../../../../uapbd/refer/psninfo/PsndocTreeGridRef';
import RacKDefaultTreeRef from '../../../../../uapbd/refer/busiinfo/RackDefaultTreeRef';
import MaterialMultiVersionGridRef from '../../../../../uapbd/refer/material/MaterialVersionGridRef';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
export default function(callback) {
	let type = this.props.getUrlParam('type');
	if (
		type === 'transfer21' ||
		type === 'transfer61' ||
		type === 'return21' ||
		type === 'return61' ||
		type === 'quickArr'
	) {
		this.props.createUIDom(
			{
				pagecode: PAGECODE.card //页面id
				//appid: APPID //注册按钮的id
			},
			(data) => {
				if (data) {
					transtypeUtils.init.call(this, data.context);
					if (data.button) {
						let button = data.button;
						// RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
						this.props.button.setButtons(button);
					}
					if (data.template) {
						let meta = data.template;
						this.templateid = meta.pageid;
						this.meta = deepClone(meta);
						modifierMeta.call(this, this.props, meta);
						this.props.meta.setMeta(meta);
						this.srcappcode = this.props.getUrlParam('srcappcode');
					}
					callback();
				}
			}
		);
	} else {
		this.props.createUIDom(
			{
				pagecode: PAGECODE.card, //页面id
				appid: APPID //注册按钮的id
			},
			(data) => {
				if (data) {
					transtypeUtils.init.call(this, data.context);
					if (data.button) {
						let button = data.button;

						// RownoUtils.resetRowNo(this.props, this.tableId, 'crowno');
						this.props.button.setButtons(button);
						this.props.button.setButtonVisible(ALLBUTTONS, false);
						this.props.button.setButtonVisible('Quit', false);
					}
					if (data.template) {
						let meta = data.template;
						this.meta = deepClone(meta);
						this.templateid = meta.pageid;

						modifierMeta.call(this, this.props, meta);
						this.props.meta.setMeta(meta);
					}
					if (this.props.getUrlParam('scene') == 'approvesce') {
						// this.setState({ isShowBack: false });
						this.isapprove = 'Y';
					}
					this.srcappcode = this.props.getUrlParam('srcappcode');
					callback();
				}
			}
		);
	}
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	let _this = this;
	let status = props.getUrlParam('status');
	meta[AREA.form].status = status;
	meta[AREA.table].status = status;
	//  参照过滤处理
	meta[AREA.form].items.map((item) => {
		if (item.attrcode === 'ctrantypeid') {
			item.queryCondition = () => {
				let pk_org =
					props.form.getFormItemsValue(AREA.form, 'pk_org') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_org').value; // 调用相应组件的取值API
				let pk_busitype =
					props.form.getFormItemsValue(AREA.form, 'pk_busitype') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_busitype').value;
				return {
					parentbilltype: '23',
					SCM_CONSIDERBUSITYPE: 'Y',
					SCM_BUSITYPE: pk_busitype,
					SCM_BUSIORG: pk_org,
					GridRefActionExt: 'nccloud.web.scmpub.ref.TransTypeRefFilterUtils'
				};
			};
		} else if (item.attrcode == 'pk_receivepsndoc') {
			item.queryCondition = () => {
				let pk_org =
					props.form.getFormItemsValue(AREA.form, 'pk_org') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_org').value; // 调用相应组件的取值API
				return {
					pk_org: pk_org // 这里对record.values.materiel要做一下非空校验
				};
			};
		} else if (item.attrcode == 'pk_pupsndoc') {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org =
					props.form.getFormItemsValue(AREA.form, 'pk_purchaseorg') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_purchaseorg').value; // 调用相应组
				return { pk_org: pk_org, busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else if (item.attrcode == 'pk_dept_v') {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org =
					props.form.getFormItemsValue(AREA.form, 'pk_purchaseorg') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_purchaseorg').value;
				return { pk_org: pk_org, busifuncode: 'pu' }; // 根据pk_org过滤
			};
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org =
					props.form.getFormItemsValue(AREA.form, 'pk_org') == null
						? null
						: props.form.getFormItemsValue(AREA.form, 'pk_org').value; // 调用相应组件的取值API
				return { pk_org: pk_org }; // 根据pk_org过滤
			};
		}
	});

	meta[AREA.body].items.map((item) => {
		// TODO　批次号　物料
		item.col = 4;
		// item.width = 120;
		if (item.attrcode == 'castunitid') {
			item.render = function(text, record, index) {
				console.log(record);
				return MeasdocDefaultGridRef({
					queryCondition: () => {
						return {
							// 这里对record.values.materiel要做一下非空校验
							scm_cmaterialid: (record.values.pk_material || {}).value,
							GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_receivepsndoc') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.pk_group || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
			// } else if (item.attrcode == 'pk_receivestore') {
			// 	item.isShowUnit = false;
			// item.render = function(text, record, index) {
			// 	return StorDocDefaulteGridRef({
			// 		queryCondition: () => {
			// 			let pk_org = (record.values.pk_org || {}).value;
			// 			let condition = {};
			// 			let csourcetypecode = (record.values.csourcetypecode || {}).value;
			// 			let vsourcetrantype = (record.values.vsourcetrantype || {}).value;
			// 			let pk_arrliabcenter = (record.values.pk_arrliabcenter || {}).value;
			// 			condition.pk_org = pk_org;
			// 			condition.csourcetypecode = csourcetypecode;
			// 			condition.vsourcetrantype = vsourcetrantype;
			// 			condition.pk_arrliabcenter = pk_arrliabcenter;
			// 			condition.GridRefActionExt = 'nccloud.web.pu.arrival.ref.ReceiveStoreRefSqlBuilder';
			// 			return condition;
			// 		}
			// 	});
			// };
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.values.pk_group || {}).value
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_rack') {
			item.render = function(text, record, index) {
				return RacKDefaultTreeRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value,
							pk_store: (record.values.pk_receivestore || {}).value,
							TreeRefActionExt: 'nccloud.web.pu.arrival.ref.StoragedocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_material') {
			item.render = function(text, record, index) {
				item.refName = getLangByResId(_this, '4004ARRIVAL-000037'); /* 国际化处理： 物料替换件参照*/
				return MaterialMultiVersionGridRef({
					queryCondition: () => {
						let warehouse = record.values.pk_receivestore;
						let pk_org = record.values.pk_org;
						let condition = {};
						condition.pk_org = pk_org.value;
						let csourcebillbid = record.values.csourcebid;
						condition.GridRefActionExt = 'nccloud.web.pu.arrival.ref.MaterialRefSqlBuilder';
						if (csourcebillbid && csourcebillbid.value) {
							condition.csourcebillbid = csourcebillbid.value;
						}
						let bpresent = record.values.bpresent;
						if (bpresent && bpresent.value) {
							condition.bpresent = bpresent.value;
						}
						let cmaterialvid = record.values.pk_material;
						if (cmaterialvid && cmaterialvid.value) {
							condition.cmaterialvid = cmaterialvid.value;
						}
						return condition;
					}
				});
			};
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, 'pk_org').value;
				return { pk_org: pk_org }; // 根据pk_org过滤
			};
		}
	});

	meta['childform1'].items.map((item) => {
		// TODO　批次号　物料
		item.col = 4;
		// item.width = 120;
		if (item.attrcode == 'castunitid') {
			item.render = function(text, record, index) {
				console.log(record);
				return MeasdocDefaultGridRef({
					queryCondition: () => {
						return {
							// 这里对record.values.materiel要做一下非空校验
							scm_cmaterialid: (record.values.pk_material || {}).value,
							GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_receivepsndoc') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.pk_group || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_receivestore') {
			// item.render = function(text, record, index) {
			// 	return StorDocDefaulteGridRef({
			// 		queryCondition: () => {
			// 			return {
			// 				pk_org: (record.values.pk_org || {}).value
			// 			};
			// 		}
			// 	});
			// };
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.values.pk_group || {}).value
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_rack') {
			item.render = function(text, record, index) {
				return RacKDefaultTreeRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value,
							pk_store: (record.values.pk_receivestore || {}).value,
							TreeRefActionExt: 'nccloud.web.pu.arrival.ref.StoragedocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_material') {
			item.render = function(text, record, index) {
				item.refName = getLangByResId(_this, '4004ARRIVAL-000037'); /* 国际化处理： 物料替换件参照*/
				return MaterialMultiVersionGridRef({
					queryCondition: () => {
						let warehouse = record.values.pk_receivestore;
						let pk_org = record.values.pk_org;
						let condition = {};
						condition.pk_org = pk_org.value;
						let csourcebillbid = record.values.csourcebid;
						condition.GridRefActionExt = 'nccloud.web.pu.arrival.ref.MaterialRefSqlBuilder';
						if (csourcebillbid && csourcebillbid.value) {
							condition.csourcebillbid = csourcebillbid.value;
						}
						let bpresent = record.values.bpresent;
						if (bpresent && bpresent.value) {
							condition.bpresent = bpresent.value;
						}
						let cmaterialvid = record.values.pk_material;
						if (cmaterialvid && cmaterialvid.value) {
							condition.cmaterialvid = cmaterialvid.value;
						}
						return condition;
					}
				});
			};
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, 'pk_org').value;
				return { pk_org: pk_org }; // 根据pk_org过滤
			};
		}
	});

	meta['childform2'].items.map((item) => {
		// TODO　批次号　物料
		item.col = 4;
		// item.width = 120;
		if (item.attrcode == 'castunitid') {
			item.render = function(text, record, index) {
				console.log(record);
				return MeasdocDefaultGridRef({
					queryCondition: () => {
						return {
							// 这里对record.values.materiel要做一下非空校验
							scm_cmaterialid: (record.values.pk_material || {}).value,
							GridRefActionExt: 'nccloud.web.scmpub.ref.MeasdocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_receivepsndoc') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.pk_group || {}).value // 这里对record.values.materiel要做一下非空校验
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_receivestore') {
			// item.render = function(text, record, index) {
			// 	return StorDocDefaulteGridRef({
			// 		queryCondition: () => {
			// 			return {
			// 				pk_org: (record.values.pk_org || {}).value
			// 			};
			// 		}
			// 	});
			// };
		} else if (item.attrcode == 'creporterid') {
			item.render = function(text, record, index) {
				return PsndocTreeGridRef({
					queryCondition: () => {
						return {
							pk_group: (record.values.pk_group || {}).value
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_rack') {
			item.render = function(text, record, index) {
				return RacKDefaultTreeRef({
					queryCondition: () => {
						return {
							pk_org: (record.values.pk_org || {}).value,
							pk_store: (record.values.pk_receivestore || {}).value,
							TreeRefActionExt: 'nccloud.web.pu.arrival.ref.StoragedocRefFilterUtils'
						};
					}
				});
			};
		} else if (item.attrcode == 'pk_material') {
			item.render = function(text, record, index) {
				item.refName = getLangByResId(_this, '4004ARRIVAL-000037'); /* 国际化处理： 物料替换件参照*/
				return MaterialMultiVersionGridRef({
					queryCondition: () => {
						let warehouse = record.values.pk_receivestore;
						let pk_org = record.values.pk_org;
						let condition = {};
						condition.pk_org = pk_org.value;
						let csourcebillbid = record.values.csourcebid;
						condition.GridRefActionExt = 'nccloud.web.pu.arrival.ref.MaterialRefSqlBuilder';
						if (csourcebillbid && csourcebillbid.value) {
							condition.csourcebillbid = csourcebillbid.value;
						}
						let bpresent = record.values.bpresent;
						if (bpresent && bpresent.value) {
							condition.bpresent = bpresent.value;
						}
						let cmaterialvid = record.values.pk_material;
						if (cmaterialvid && cmaterialvid.value) {
							condition.cmaterialvid = cmaterialvid.value;
						}
						return condition;
					}
				});
			};
		} else {
			item.isShowUnit = false;
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, 'pk_org').value;
				return { pk_org: pk_org }; // 根据pk_org过滤
			};
		}
	});

	let porCol = {
		itemtype: 'customer',
		attrcode: 'opr',
		label: getLangByResId(_this, '4004ARRIVAL-000038') /* 国际化处理： 操作*/,
		visible: true,
		width: '200px',
		fixed: 'right',
		render(text, record, index) {
			let status = props.cardTable.getStatus(AREA.body);
			let billstatus = props.form.getFormItemsValue(AREA.head, 'fbillstatus').value;
			let buttonAry = [ 'Expend', 'DeleteLine', 'CopyLine', 'CheckLine' ];
			if (status == 'edit') {
				if (_this.state.isCopyLine) {
					buttonAry = [ 'PastToThis' ];
				} else {
					buttonAry = [ 'Expend', 'DeleteLine', 'CopyLine', 'SetPiece' ];
				}
			} else if (billstatus == 0) {
				buttonAry = [ 'Expend', 'SetPiece' ];
			} else if (billstatus == 1) {
				buttonAry = [ 'Expend', 'SetPiece' ];
			} else if (billstatus == 2) {
				buttonAry = [ 'Expend', 'SetPiece' ];
			} else if (billstatus == 3) {
				buttonAry = [ 'Expend', 'CheckLine', 'SetPiece' ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: BUTTONAREA.cardbodyinner,
				buttonLimit: 3,
				onButtonClick: (props, key) => tableButtonClick.call(_this, props, key, text, record, index)
			});
		}
	};
	meta[AREA.body].items.push(porCol);
	// 行号排序处理
	columnSortUtils.numberSort(meta, AREA.body, FIELD.crowno);

	return meta;
}
