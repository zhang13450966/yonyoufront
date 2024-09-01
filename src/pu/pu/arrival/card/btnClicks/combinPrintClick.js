import { AREA, FIELD, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function(props) {
	let jsonData = getJsonData.call(this, props);
	this.setState({
		showConditionModal: true,
		jsonData: jsonData
	});
}

function getJsonData(props) {
	// let letfItemKey = [];
	// props.meta.getMeta()[AREA.body].items.map((item) => {
	// 	if (item.visible && item.attrcode != 'pk_material') {
	// 		letfItemKey.push(item.attrcode);
	// 	}
	// });
	// letfItemKey = letfItemKey == null ? [] : letfItemKey;
	// let rightItemKey = [ 'pk_material' ];
	//物料分类、行号、物料名称、型号、规格、单位、数量、计划到货日期、累计合格主数量、累计不合格主数量、结算利润中心、收货利润中心、途耗数量、收货仓库、赠品、来源订单行是否赠品、物料编码
	let letfItemKey = [];
	props.meta.getMeta()[AREA.body].items.map((item) => {
		if (item.visible) {
			letfItemKey.push(item.attrcode);
		}
	});
	let groupColumn = {
		all: letfItemKey,
		right: [
			// FIELD.nnum, //主数量
			// FIELD.nastnum, //数量
			// FIELD.nelignum, //合格主数量
			// FIELD.nnotelignum, //不合格主数量
			// FIELD.nwastnum //途耗主数量
			FIELD.pk_material //物料编码
		]
	};

	let sumColumn = {
		all: [
			FIELD.norigmny, //金额
			FIELD.norigtaxmny, //价税合计
			FIELD.ntax, //税额
			FIELD.nmny, //本币无税金额
			FIELD.ntaxmny, //本币加税合计
			FIELD.nnum, //主数量
			FIELD.nastnum, //数量
			FIELD.nelignum, //合格主数量
			FIELD.nnotelignum, //不合格主数量
			FIELD.nwastnum //途耗主数量
		],
		right: [
			FIELD.nnum, //主数量
			FIELD.nastnum, //数量
			FIELD.nelignum, //合格主数量
			FIELD.nnotelignum, //不合格主数量
			FIELD.nwastnum //途耗主数量
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
			FIELD.nelignum, //合格主数量
			FIELD.nnotelignum, //不合格主数量
			FIELD.nwastnum //途耗主数量
		],
		right: []
	};

	let weightAverageColumn = {
		all: [
			FIELD.norigmny, //金额
			FIELD.norigtaxmny, //价税合计
			FIELD.ntax, //税额
			FIELD.nmny, //本币无税金额
			FIELD.ntaxmny, //本币加税合计
			FIELD.nnum, //主数量
			FIELD.nastnum, //数量
			FIELD.nelignum, //合格主数量
			FIELD.nnotelignum, //不合格主数量
			FIELD.nwastnum //途耗主数量
		],
		right: []
	};

	return {
		title: getLangByResId(this, '4004ARRIVAL-000015') + ': ' + this.state.vbillcode /* 国际化处理： 合并显示*/,
		materialClassification: true,
		billPk: props.form.getFormItemsValue(AREA.form, FIELD.pk_arriveorder).value, // 主键值
		materialPKColumn: FIELD.pk_material,
		numKey: FIELD.nnum,
		billTitle: getLangByResId(this, '4004ARRIVAL-000016') + ': ' + this.state.vbillcode /* 国际化处理： 到货单合并打印*/,
		headCode: AREA.form, //页面头区域
		bodyCode: AREA.body, //页面子区域
		columnArea: AREA.body, //参数字段所在区域（根据字段翻译名称使用，一般为子表区域）
		groupColumn: groupColumn,
		sumColumn: sumColumn,
		averageColumn: averageColumn,
		weightAverageColumn: weightAverageColumn,
		meta: this.meta, // 当前卡片页面meta
		//funcode: null, //小应用编码
		nodekey: null, //模板节点标识
		combineUrl: URL.combin, //合并action
		printUrl: URL.combinprint, //打印action
		appcode: this.props.getAppCode()
	};
}
