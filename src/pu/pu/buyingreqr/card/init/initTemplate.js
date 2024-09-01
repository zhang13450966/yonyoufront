/*
 * @Author: zhangchangqing 
 * @PageInfo: 卡片初始化模板
 * @Date: 2018-04-19 10:34:51 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2021-07-05 11:43:00
 */
import { base, ajax } from 'nc-lightapp-front';
import { buttonClick, pageInfoClick } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { BUYINGREQ_CARD, ATTRCODE, ATTRCODES, BUYINGREQ_CARD_BUTTON, FBILLSTATUS } from '../../siconst';
import { buttonController, btnClickController } from '../viewControl';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';
let { NCPopconfirm } = base;

export default function(props) {
	let _this = this;
	let _props = props;
	this.props.createUIDom(
		{
			pagecode: BUYINGREQ_CARD.cardpageid //卡片页面编码
		},
		callbackFun
	);
	function callbackFun(data) {
		console.dir(data);

		if (data) {
			if (data.template) {
				let meta = data.template;
				_this.setState({
					templetid: data.template.pageid
				});
				modifierMeta.call(_this, _props, meta);
				let status = props.getUrlParam(BUYINGREQ_CARD.status);
				if (status == BUYINGREQ_CARD.add) {
					props.meta.setMeta(meta, () => {
						// buttonCon(props);
					});
					props.initMetaByPkorg(BUYINGREQ_CARD.pk_org_v);
				} else {
					props.meta.setMeta(meta, () => {
						// buttonCon(props);
					});
				}
			}
			if (data.button) {
				let button = data.button;
				props.button.hideButtonsByAreas([ BUYINGREQ_CARD.formId ]);
				props.button.setButtons(button);
				let pk_srcpraybill = props.getUrlParam(ATTRCODE.pk_srcpraybill);
				if (pk_srcpraybill) {
					pageInfoClick.bind(_this, null, null, pk_srcpraybill, null)();
				} else {
					pageInfoClick.bind(_this)();
				}
			}
		}
	}
}
function buttonCon(props) {
	let status = props.getUrlParam(BUYINGREQ_CARD.status);
	if (status === BUYINGREQ_CARD.browse) {
		//浏览
		props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Revise,
				BUYINGREQ_CARD_BUTTON.ReviseHistory,
				BUYINGREQ_CARD_BUTTON.File,
				BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.OnhandQuery,
				BUYINGREQ_CARD_BUTTON.Refresh
			],
			true
		);
		props.button.setButtonVisible([ BUYINGREQ_CARD_BUTTON.Group1, BUYINGREQ_CARD_BUTTON.Group2 ], false);
	} else {
		//编辑态
		props.button.setButtonVisible(
			[ BUYINGREQ_CARD_BUTTON.Group1, BUYINGREQ_CARD_BUTTON.Group2, BUYINGREQ_CARD_BUTTON.OnhandQuery ],
			true
		);
		props.button.setButtonVisible(
			[
				BUYINGREQ_CARD_BUTTON.Revise,
				BUYINGREQ_CARD_BUTTON.ReviseHistory,
				BUYINGREQ_CARD_BUTTON.File,
				BUYINGREQ_CARD_BUTTON.QueryAboutBusiness,
				BUYINGREQ_CARD_BUTTON.Print,
				BUYINGREQ_CARD_BUTTON.Refresh
			],
			false
		);
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
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform2'].items.map((item) => {
		item.isShowUnit = false;
		item.queryCondition = () => {
			let data = props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_org).value; // 调用相应组件的取值API
			return { pk_org: data }; // 根据pk_org过滤
		};
	});
	meta['childform2'].items.find((e) => e.attrcode === 'pk_material').isMultiSelectedEnabled = true;
	let porCol = {
		//attrcode: 'operation',
		label: getLangByResId(this, '4004PRAYBILLR-000017') /* 国际化处理： 操作*/,
		attrcode: 'opr',
		itemtype: 'customer', //默认必输
		fixed: 'right', //锁定操作列
		visible: true,
		width: '200px',
		render: (text, record, index) => {
			let buttonAry = buttonController.setRowButtons.call(this, props, record, index);
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
