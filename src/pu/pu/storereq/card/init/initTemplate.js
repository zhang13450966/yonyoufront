/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片初始化模板
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-12 17:45:01
 */
import { base, ajax } from 'nc-lightapp-front';
import { getParentURlParme, pageInfoClick } from '../btnClicks';
import { STOREREQ_CARD, ATTRCODE, ATTRCODES, STOREREQ_CARD_BUTTON, FBILLSTATUS, STOREREQ_LIST } from '../../siconst';
import { getUrlParam } from '../../../../../scmpub/scmpub/pub/tool/getParentURlParme';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { afterEvent } from '../afterEvents';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController, btnClickController } from '../viewControl';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
let { NCPopconfirm } = base;

export default function(props) {
	let _this = this;
	let _props = props;
	//通过获取url参数来判断是否走审批
	let param = getUrlParam(STOREREQ_CARD.pageMsgType);
	if (param) {
		this.props.createUIDom(
			{
				pagecode: STOREREQ_CARD.cardpageid //卡片页面编码
			},
			//callbackFun.call(this, data)
			(templedata) => {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					this.meta = deepClone(templedata.template);
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					modifierMeta.call(_this, _this.props, meta);
					let status = this.props.getUrlParam(STOREREQ_CARD.status);
					if (status == STOREREQ_CARD.add) {
						this.props.meta.setMeta(meta, () => {
							buttonCon.bind(_props);
						});
						this.props.initMetaByPkorg(ATTRCODE.pk_org_v);
					} else {
						this.props.meta.setMeta(meta, () => {
							buttonCon.bind(_props);
						});
					}
				}
				if (templedata.button) {
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ STOREREQ_CARD.formId ]);
					this.props.button.setButtons(button);
					pageInfoClick.bind(this)();
				}
			}
		);
	} else {
		this.props.createUIDom(
			{
				pagecode: STOREREQ_CARD.cardpageid //卡片页面编码
			},
			//callbackFun.call(this, data)
			(templedata) => {
				if (templedata.template) {
					this.meta = deepClone(templedata.template);
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					if (templedata.context.paramMap && templedata.context.paramMap.transtype) {
						transtypeUtils.init.call(this, templedata.context);
					}
					modifierMeta.call(_this, _this.props, meta);
					let status = this.props.getUrlParam(STOREREQ_CARD.status);
					if (!status) {
						status = STOREREQ_CARD.add;
					}
					if (status == STOREREQ_CARD.add) {
						this.props.meta.setMeta(
							meta,
							//buttonCon.bind(_props);
							toggleShow.bind(_this, templedata)
						);
						this.props.initMetaByPkorg(ATTRCODE.pk_org_v);
					} else {
						this.props.meta.setMeta(meta, addDataSource.bind(_this, templedata));
					}
				}
				if (templedata.button) {
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ STOREREQ_CARD.formId ]);
					this.props.button.setButtons(button);
					pageInfoClick.bind(this)();
				}
				if (templedata.context.paramMap && templedata.context.paramMap.PU_STOREREQ_TYPE) {
					this.PU_STOREREQ_TYPE = templedata.context.paramMap.PU_STOREREQ_TYPE;
				}
			}
		);
	}
}
function buttonCon() {
	//不用了
	return;
}
function addDataSource(data) {
	// 缓存为了处理卡片的自制
	setDefData(STOREREQ_LIST.dataSource, ATTRCODE.pk_org_v, data.context.pk_org_v);
	setDefData(STOREREQ_LIST.dataSource, 'pk_org_name', data.context.org_v_Name);
}
function toggleShow(data) {
	let status = this.props.getUrlParam(STOREREQ_CARD.status);
	if (!status) {
		status = STOREREQ_CARD.add;
	}
	let copy = this.props.getUrlParam(STOREREQ_CARD.copy);
	let type = this.props.getUrlParam(STOREREQ_CARD.type);
	if (status == STOREREQ_CARD.add && !copy && !type) {
		// 新增
		let pk_org_v = data.context.pk_org_v;
		let org_v_Name = data.context.org_v_Name;
		// 缓存为了处理卡片的自制
		addDataSource(data);
		if (pk_org_v) {
			afterEvent.call(
				this,
				this.props,
				STOREREQ_CARD.formId,
				ATTRCODE.pk_org_v,
				{ value: pk_org_v, display: org_v_Name },
				null,
				{
					refpk: pk_org_v,
					refname: org_v_Name
				}
			);
			this.props.form.setFormItemsDisabled(STOREREQ_CARD.formId, { pk_org_v: false });
		} else {
			this.props.form.setFormItemsValue(STOREREQ_CARD.formId, {
				[ATTRCODE.pk_org_v]: { value: null, display: null }
			});
		}
	}
}
function modifierMeta(props, meta) {
	let status = this.props.getUrlParam(STOREREQ_CARD.status);
	if (!status) {
		status = STOREREQ_CARD.add;
	}
	meta[STOREREQ_CARD.formId].status = status;
	meta[STOREREQ_CARD.tableId].status = status;

	meta[STOREREQ_CARD.formId].items.map((item) => {
		//主组织过滤
		if (item.attrcode == ATTRCODE.pk_org_v) {
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.ctrantypeid) {
			//设置表头物资需求申请类型参照过滤 根据单据类型
			item.queryCondition = () => {
				return { parentbilltype: STOREREQ_CARD.billType };
			};
		} else if (item.attrcode == ATTRCODE.pk_appdepth || item.attrcode == ATTRCODE.pk_appdepth_v) {
			//申请部门 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
				return {
					pk_org: data,
					busifuncode: STOREREQ_CARD.storereq
				};
			};
		} else if (item.attrcode == ATTRCODE.pk_apppsnh) {
			//申请人 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
				let pk_appdepth = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_appdepth).value; // 调用相应组件的取值API
				return {
					pk_org: data,
					pk_dept: pk_appdepth,
					busifuncode: STOREREQ_CARD.storereq
				};
			};
		} else {
			//根据pk_org 过滤其他字段
			item.queryCondition = () => {
				let data = this.props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[STOREREQ_CARD.tableId].items.map((item) => {
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform1'].items.map((item) => {
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform1'].items.find((e) => e.attrcode === 'pk_material').isMultiSelectedEnabled = true;
	meta['card_body'].items.find((e) => e.attrcode === 'pk_material').isMultiSelectedEnabled = true;
	let porCol = {
		//attrcode: 'operation',
		label: getLangByResId(this, '4004STOREREQ-000017') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			//存在值则显示审批中心的按钮
			let param = getParentURlParme(STOREREQ_CARD.pageMsgType);
			let buttonAry = buttonController.setRowButtons.call(this, props, record, param, index);
			return props.button.createOprationButton(buttonAry, {
				area: STOREREQ_CARD_BUTTON.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[STOREREQ_CARD.tableId].items.push(porCol);
	// 行号排序处理
	columnSortUtils.numberSort(meta, STOREREQ_CARD.tableId, ATTRCODES.crowno);
	return meta;
}
