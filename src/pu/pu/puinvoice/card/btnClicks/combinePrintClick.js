/*
 * @Author: jiangfw
 * @PageInfo: 打印
 * @Date: 2018-07-07 14:28:12
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-10 16:40:15
 */
import { URL, FIELD, AREA, APPCODE, COMMON, BILLTYPE } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function clickCombinePrintBtn(props) {
	this.combineData = getJsonData.call(this, props);
	this.setState({
		showConditionModal: !this.state.showConditionModal
	});
}

function getJsonData(props) {
	let letfItemKey = [];
	props.meta.getMeta()[AREA.card_body].items.map((item) => {
		if (item.visible) {
			letfItemKey.push(item.attrcode);
		}
	});
	letfItemKey == null ? null : letfItemKey;
	let rightItemKey = [ FIELD.pk_material ];
	let groupColumn = {
		all: letfItemKey,
		right: rightItemKey
	};

	let sumColumn = {
		all: [
			FIELD.norigtaxmny, //价税合计
			FIELD.ncalcostmny, //计成本金额
			FIELD.ncaltaxmny, //计税金额
			FIELD.nnosubtax, //不可抵扣税额
			FIELD.ntax, //本币税额
			FIELD.nmny, //本币无税金额
			FIELD.ntaxmny, //本币价税合计
			FIELD.ngroupmny, //集团本币无税金额
			FIELD.ngrouptaxmny, //集团本币价税合计
			FIELD.nglobalmny, //全局本币无税金额
			FIELD.nglobaltaxmny, //全局本币价税合计

			FIELD.nnum, //主数量
			FIELD.nastnum, // 数量
			FIELD.norigmny //金额
		],
		right: [
			FIELD.nnum, //主数量
			FIELD.nastnum, // 数量
			FIELD.norigmny, //金额
			FIELD.norigtaxmny, // 价税合计
			FIELD.ncalcostmny, // 计成本金额
			FIELD.ncaltaxmny, // 计税金额
			FIELD.nnosubtax, // 不可抵扣税额
			FIELD.ntax, // 税额
			FIELD.nmny, // 本币无税金额
			FIELD.ntaxmny, // 本币价税合计
			FIELD.ngroupmny, // 集团本币无税金额
			FIELD.ngrouptaxmny, // 集团本币价税合计
			FIELD.nglobalmny, // 全局本币无税金额
			FIELD.nglobaltaxmny //全局本币价税合计
		]
	};

	let averageColumn = {
		all: [
			FIELD.nnum, // 主数量
			FIELD.nastnum, // 数量
			FIELD.norigmny, // 金额
			FIELD.norigtaxmny, //价税合计
			FIELD.ncalcostmny, //计成本金额
			FIELD.ncaltaxmny, //计税金额
			FIELD.nnosubtax, //不可抵扣税额
			FIELD.ntax, //本币税额
			FIELD.nmny, //本币无税金额
			FIELD.ntaxmny, //本币价税合计
			FIELD.ngroupmny, //集团本币无税金额
			FIELD.ngrouptaxmny, //集团本币价税合计
			FIELD.nglobalmny, //全局本币无税金额
			FIELD.nglobaltaxmny //全局本币价税合计
		],
		right: []
	};

	let weightAverageColumn = {
		all: [
			FIELD.nnum, // 主数量
			FIELD.nastnum, // 数量
			FIELD.norigmny, // 金额
			FIELD.norigtaxmny, //价税合计
			FIELD.ncalcostmny, //计成本金额
			FIELD.ncaltaxmny, //计税金额
			FIELD.nnosubtax, //不可抵扣税额
			FIELD.ntax, //本币税额
			FIELD.nmny, //本币无税金额
			FIELD.ntaxmny, //本币价税合计
			FIELD.ngroupmny, //集团本币无税金额
			FIELD.ngrouptaxmny, //集团本币价税合计
			FIELD.nglobalmny, //全局本币无税金额
			FIELD.nglobaltaxmny, //全局本币价税合计

			FIELD.nastorigprice, //无税单价
			FIELD.nastorigtaxprice //含税单价
		],
		right: [
			FIELD.nastorigprice, //无税单价
			FIELD.nastorigtaxprice //含税单价
		]
	};

	return {
		title: getLangByResId(this, '4004PUINVOICE-000009') /* 国际化处理： 合并显示*/,
		materialClassification: true,
		billPk: props.form.getFormItemsValue(AREA.card_head, FIELD.pk_invoice).value, // 主键值
		materialPKColumn: FIELD.pk_material,
		numKey: FIELD.nnum,
		billTitle:
			getLangByResId(this, '4004PUINVOICE-000010') +
			props.form.getFormItemsValue(AREA.card_head, FIELD.vbillcode).value /* 国际化处理： 采购发票合并打印*/,
		headCode: AREA.card_head, //页面头区域
		bodyCode: AREA.card_body, //页面子区域
		columnArea: AREA.card_body, //参数字段所在区域（根据字段翻译名称使用，一般为子表区域）
		groupColumn: groupColumn,
		sumColumn: sumColumn,
		averageColumn: averageColumn,
		weightAverageColumn: weightAverageColumn,
		meta: this.meta, // 当前卡片页面meta
		// meta: props.meta.getMeta(), // 当前卡片页面meta
		funcode: APPCODE.puinvoice,
		nodekey: COMMON.combinePrintNodeKey, //模板节点标识
		combineUrl: URL.combine, //合并action
		printUrl: URL.combintPrint, //打印action
		appcode: this.props.getAppCode() == '400401614' ? APPCODE.puinvoice : this.props.getAppCode(),
		billtype: BILLTYPE.invoice,
		scene: this.props.getUrlParam('scene')
	};
}
