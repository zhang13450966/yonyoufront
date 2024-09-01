/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单卡片页面，初始化
 * @Date: 2021-11-20 09:44:08 
 * @Last Modified by: fangmj7
 * @Last Modified time: 2022-03-31 14:15:29
 */
import { AREA, PAGECODE, OHTER, BTNID, UISTATE, FIELD } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController, btnClickController } from '../viewController';
import { queryCardBtnClick, pageInfoClick } from '../btnClicks';
import { rateTypeSellFilter } from '../../../../../scmpub/scmpub/pub/tool/currencyRateUtil';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.card //页面id
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					meta = modifier.call(this, props, meta);
					props.meta.setMeta(meta, initPage.bind(this, this.props));
				}

				if (data.button) {
					let button = data.button;
					props.button.hideButtonsByAreas([ AREA.cardHeadBtnArea, AREA.cardBodyBtnArea ]);
					props.button.setButtons(button);
				}
				// 统一设置页面状态及按钮
				buttonController.call(this, props);
			}
		}
	);
}

/**
 * 页面扩展
 * @param {*} props 
 * @param {*} meta 
 * @returns 
 */
function modifier(props, meta) {
	meta[AREA.head].items.map((item) => {
		item.isShowUnit = false;
		if (item.attrcode == FIELD.ctranstypeid) {
			item.queryCondition = () => {
				return {
					parentbilltype: OHTER.billtype, // 父单据类型
					istransaction: 'Y' // 是否交易类型
				};
			};
		} else if (item.attrcode == FIELD.cconfirmdeptid || item.attrcode == FIELD.cconfirmdeptvid) {
			/* 确认部门oid 和 确认部门vid */
			item.isShowUnit = false; // 去掉头上的组织输入框
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, FIELD.pk_org);
				return {
					pk_org: pk_org ? pk_org.value : '-', //组织过滤
					busifuncode: OHTER.busifuncode // 业务场景，pu-采购
				};
			};
		} else if (item.attrcode == FIELD.cconfirmpsnid) {
			// 确认人
			// 原nc的业务员的编辑前事件是根据采购组织和采购部门参照过滤的
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, FIELD.pk_org).value;
				let cconfirmdeptid = props.form.getFormItemsValue(AREA.head, FIELD.cconfirmdeptid).value;
				return {
					pk_org: pk_org,
					pk_dept: cconfirmdeptid,
					busifuncode: OHTER.busifuncode
				};
			};
		} else if (item.attrcode == FIELD.cratetype) {
			//汇率类型
			item.queryCondition = () => {
				return rateTypeSellFilter();
			};
		} else {
			// 其它字段直接用主组织过滤
			item.queryCondition = () => {
				let pk_org = props.form.getFormItemsValue(AREA.head, FIELD.pk_org);
				return {
					pk_org: pk_org ? pk_org.value : '-' //组织过滤
				};
			};
		}
		return item;
	});

	// 获取table数据，这里需要对字段展示进行改造，添加操作列
	let tableTemp = meta[AREA.body];
	// 表体扩展
	tableTemp.items.map((item) => {
		return modifierBodyMeta.call(this, props, item);
	});
	// 编辑态展开表体扩展
	meta[AREA.edit].items.map((item) => {
		return modifierBodyMeta.call(this, props, item);
	});
	// 扩展列
	let operation = {
		attrcode: 'opr',
		label: getLangByResId(this, '4004planconfirm-000000') /* 国际化处理： 操作*/,
		fixed: 'right',
		width: '150px',
		visible: true,
		itemtype: 'customer',
		render: (text, record, index) => {
			let buttonAry;
			if (props.cardTable.getStatus(AREA.body) == UISTATE.edit) {
				buttonAry = [ BTNID.OpenCard, BTNID.DeleteLine ];
			} else {
				buttonAry = [ BTNID.OpenCard ];
			}
			return props.button.createOprationButton(buttonAry, {
				area: AREA.cardBodyInnerBtnArea,
				buttonLimit: 3,
				onButtonClick: (props, key) => btnClickController.call(this, props, key, text, record, index)
			});
		}
	};
	tableTemp.items.push(operation);
	return meta;
}

/**
 * 表体扩展
 * @param {*} props 
 * @param {*} item 表体上的各个字段
 * @returns  
 */
function modifierBodyMeta(props, item) {
	item.isShowUnit = false;
	// 表体自定义项等
	item.queryCondition = () => {
		let pk_org = props.form.getFormItemsValue(AREA.head, FIELD.pk_org);
		return {
			pk_org: pk_org ? pk_org.value : null //组织过滤
		};
	};
	return item;
}

/**
 * 初始化页面或者数据
 * @param {*} props 
 */
function initPage(props) {
	// 获取列表传过来的主键
	let id = this.props.getUrlParam(OHTER.id);
	// 获取页面状态，这个状态是列表带入卡片页面的状态
	this.status = props.getUrlParam(OHTER.status) ? props.getUrlParam(OHTER.status) : UISTATE.browse;
	if (id && id == OHTER.source21P) {
		pageInfoClick.call(this);
	} else if (id) {
		queryCardBtnClick.call(this, props, id);
	}
}
