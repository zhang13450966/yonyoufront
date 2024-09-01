/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片初始化模板
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-27 17:09:29
 */
import excelImportconfig from 'uap/common/components/excelImportconfig';
import { base, ajax } from 'nc-lightapp-front';
import { buttonClick, getParentURlParme, pageInfoClick } from '../btnClicks';
import {
	BUYINGREQ_CARD,
	ATTRCODE,
	ATTRCODES,
	BUYINGREQ_CARD_BUTTON,
	FBILLSTATUS,
	BUYINGREQ_LIST,
	BUYINGREQ_LIST_BUTTON
} from '../../siconst';
import { getUrlParam } from '../../../../../scmpub/scmpub/pub/tool/getParentURlParme';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import { transtypeUtils, deepClone } from '../../../../../scmpub/scmpub/pub/tool';
import { afterEvent } from '../afterEvents';
import { buttonController, btnClickController } from '../viewControl';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
import { yycBtnInit } from '../../../yyc/ext/yycBtnInit';
let { NCPopconfirm } = base;
export default function(props) {
	//通过获取url参数来判断是否走审批
	let _this = this;
	let _props = props;
	let param = getUrlParam(BUYINGREQ_CARD.pageMsgType);
	//设置导入url
	let excelimportconfig = excelImportconfig(
		props,
		BUYINGREQ_LIST.purchaseorg, //模块名称
		BUYINGREQ_LIST.billType, //单据类型
		true,
		BUYINGREQ_LIST.import,
		{
			noTips: true,
			isSelfDefineImport: true
		}
	);
	if (param) {
		this.props.createUIDom(
			{
				pagecode: BUYINGREQ_CARD.cardpageid //卡片页面编码
			},
			(templedata) => {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					this.meta = deepClone(templedata.template);
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					modifierMeta.call(_this, _this.props, meta);
					let status = this.props.getUrlParam(BUYINGREQ_CARD.status);
					if (status == BUYINGREQ_CARD.add) {
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
					props.button.setUploadConfig(BUYINGREQ_LIST_BUTTON.Import, excelimportconfig);
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ BUYINGREQ_CARD.formId ]);
					this.props.button.setButtons(button);
					pageInfoClick.bind(this)();
				}
			}
		);
	} else {
		this.props.createUIDom(
			{
				pagecode: BUYINGREQ_CARD.cardpageid //卡片页面编码
			},
			(templedata) => {
				transtypeUtils.init.call(this, templedata.context);
				if (templedata.template) {
					this.meta = deepClone(templedata.template);
					let meta = templedata.template;
					this.setState({
						templetid: templedata.template.pageid
					});
					modifierMeta.call(_this, _this.props, meta);
					let status = this.props.getUrlParam(BUYINGREQ_CARD.status);
					if (status == BUYINGREQ_CARD.add) {
						this.props.meta.setMeta(meta, toggleShow.bind(_this, templedata));
						this.props.initMetaByPkorg(ATTRCODE.pk_org_v);
					} else {
						this.props.meta.setMeta(meta, addDataSource.bind(_this, templedata));
					}
				}
				if (templedata.button) {
					props.button.setUploadConfig(BUYINGREQ_LIST_BUTTON.Import, excelimportconfig);
					let button = templedata.button;
					this.props.button.hideButtonsByAreas([ BUYINGREQ_CARD.formId ]);
					this.props.button.setButtons(button);
					// 友云采按钮初始化 add by guozhq
					yycBtnInit(this.props);
					// ---------end-----------------
					pageInfoClick.bind(this)();
				}
				if (templedata.context && templedata.context.paramMap) {
					//缓存交易类型,拉单使用
					setDefData(BUYINGREQ_LIST.dataSource, 'transtype', templedata.context.paramMap.transtype);
				}
			}
		);
	}
}
function buttonCon(props) {
	//不用了,暂时先不删除
	return;
}
function addDataSource(data) {
	// 缓存为了处理卡片的自制
	setDefData(BUYINGREQ_LIST.dataSource, ATTRCODE.pk_org_v, data.context.pk_org_v);
	setDefData(BUYINGREQ_LIST.dataSource, 'pk_org_name', data.context.org_v_Name);
}
function toggleShow(data) {
	let status = this.props.getUrlParam(BUYINGREQ_CARD.status);
	let copy = this.props.getUrlParam(BUYINGREQ_CARD.copy);
	let type = this.props.getUrlParam(BUYINGREQ_CARD.type);
	let channelType = this.props.getUrlParam(BUYINGREQ_CARD.channelType);
	if (status == BUYINGREQ_CARD.add && !copy && !type && !channelType) {
		// 新增
		let pk_org_v = data.context.pk_org_v;
		let org_v_Name = data.context.org_v_Name;
		// 缓存为了处理卡片的自制
		addDataSource(data);
		if (pk_org_v && org_v_Name) {
			afterEvent.call(
				this,
				this.props,
				BUYINGREQ_CARD.formId,
				ATTRCODE.pk_org_v,
				{ value: pk_org_v, display: org_v_Name },
				null,
				{
					refpk: pk_org_v,
					refname: org_v_Name
				}
			);
			this.props.form.setFormItemsDisabled(BUYINGREQ_CARD.formId, { pk_org_v: false });
		} else {
			this.props.form.setFormItemsValue(BUYINGREQ_CARD.formId, {
				[ATTRCODE.pk_org_v]: { value: null, display: null }
			});
		}
	}
}
function modifierMeta(props, meta) {
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	meta[BUYINGREQ_CARD.formId].status = status;
	meta[BUYINGREQ_CARD.tableId].status = status;

	meta[BUYINGREQ_CARD.formId].items.map((item) => {
		//主组织过滤
		if (item.attrcode == ATTRCODE.pk_org_v) {
			item.queryCondition = () => {
				return { GridRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgVidRefFilter' };
			};
		} else if (item.attrcode == ATTRCODE.ctrantypeid) {
			//设置表头请购单类型参照过滤 根据单据类型
			item.queryCondition = () => {
				return { parentbilltype: BUYINGREQ_CARD.billType };
			};
		} else if (item.attrcode == ATTRCODE.pk_plandept_v || item.attrcode == ATTRCODE.pk_plandept) {
			//计划部门 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
				return {
					pk_org: data,
					busifuncode: BUYINGREQ_CARD.storereq
				};
			};
		} else if (item.attrcode == ATTRCODE.pk_planpsn) {
			//计划员 按照组织过滤 支持业务人员来源
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
				let pk_plandept = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_plandept).value; // 调用相应组件的取值API
				return {
					pk_org: data,
					pk_dept: pk_plandept,
					busifuncode: BUYINGREQ_CARD.storereq
				};
			};
		} else {
			// 根据pk_org过滤其他字段
			item.queryCondition = () => {
				let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, BUYINGREQ_CARD.pk_org).value; // 调用相应组件的取值API
				return { pk_org: data }; // 根据pk_org过滤
			};
		}
	});
	meta[BUYINGREQ_CARD.tableId].items.map((item) => {
		if (item.attrcode == ATTRCODES.pk_material) {
			item.isMultiSelectedEnabled = true;
		}
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform1'].items.map((item) => {
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = this.props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform1'].items.find((e) => e.attrcode === 'pk_material').isMultiSelectedEnabled = true;

	let porCol = {
		//attrcode: 'operation',
		label: getLangByResId(this, '4004PRAYBILL-000028') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let param = getParentURlParme(BUYINGREQ_CARD.pageMsgType);
			let buttonAry = buttonController.setRowButtons.call(this, props, record, param, index);
			return props.button.createOprationButton(buttonAry, {
				area: BUYINGREQ_CARD_BUTTON.card_body_inner,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	meta[BUYINGREQ_CARD.tableId].items.push(porCol);
	// 行号排序处理
	columnSortUtils.numberSort(meta, BUYINGREQ_CARD.tableId, ATTRCODES.crowno);
	return meta;
}
