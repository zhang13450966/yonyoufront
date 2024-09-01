/*
 * @Author: CongKe
 * @PageInfo: 合并显示
 * @Date: 2018-08-20 13:26:46
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-10 17:34:55
 */
import { URL, FIELD, PAGECODE, OrderCache } from '../../constance';
import { ajax, toast } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../../scmpub/scmpub/pub/cache';

export default function combineShow(props) {
	let _this = this;
	this.combineData = getJsonData.call(this, props);
	this.setState({
		showConditionModal: !this.state.showConditionModal
	});
}

function getJsonData(props) {
	let letfItemKey = [];
	props.meta.getMeta()[PAGECODE.cardbody].items.map((item) => {
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
			FIELD.ncalcostmny,
			FIELD.ncaltaxmny,
			FIELD.nnosubtax,
			FIELD.nmny,
			FIELD.ntaxmny,
			FIELD.ngroupmny,
			FIELD.ngrouptaxmny,
			FIELD.nglobalmny,
			FIELD.nglobaltaxmny,
			FIELD.norigmny,
			FIELD.ntax,
			FIELD.norigtaxmny,
			FIELD.nnum,
			FIELD.nastnum
		],
		right: [ FIELD.norigmny, FIELD.ntax, FIELD.norigtaxmny, FIELD.nnum, FIELD.nastnum ]
	};

	let averageColumn = {
		all: [
			FIELD.norigmny, // 金额
			FIELD.ntax, // 税额
			FIELD.norigtaxmny, // 价税合计
			FIELD.nnum, // 主数量
			FIELD.nastnum, // 数量
			FIELD.ncalcostmny, // 计成本金额
			FIELD.ncaltaxmny, // 计税金额
			FIELD.nnosubtax, // 不可抵扣税额
			FIELD.nmny, // 本币无税金额
			FIELD.ntaxmny, // 本币价税合计
			FIELD.ngroupmny, // 集团本币无税金额
			FIELD.ngrouptaxmny, // 集团本币价税合计
			FIELD.nglobalmny, // 全局本币无税金额
			FIELD.nglobaltaxmny
		],
		right: []
	};

	let weightAverageColumn = {
		all: [
			FIELD.norigmny, // 金额
			FIELD.ntax, // 税额
			FIELD.norigtaxmny, // 价税合计
			FIELD.nnum, // 主数量
			FIELD.nastnum, // 数量
			FIELD.ncalcostmny, // 计成本金额
			FIELD.ncaltaxmny, // 计税金额
			FIELD.nnosubtax, // 不可抵扣税额
			FIELD.nmny, // 本币无税金额
			FIELD.ntaxmny, // 本币价税合计
			FIELD.ngroupmny, // 集团本币无税金额
			FIELD.ngrouptaxmny, // 集团本币价税合计
			FIELD.nglobalmny, // 全局本币无税金额
			FIELD.nglobaltaxmny,
			FIELD.nqtorigprice,
			FIELD.nqtorignetprice
		],
		right: [ FIELD.nqtorigprice, FIELD.nqtorignetprice ]
	};
	let funcode = null;
	let nodekey = '400400801';
	let scene = getDefData(OrderCache.OrderCardCache, 'scene');
	if (scene == 'approvesce') {
		// 审批的合并显示打印模板
		funcode = '400400808';
		nodekey = '4004008008';
	} else if (scene == 'freeze' || scene == 'ADD') {
		funcode = '400400800';
	}
	return {
		title: getLangByResId(this, '4004POORDER-000033') /* 国际化处理： 合并显示*/,
		materialClassification: true,
		billPk: props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order).value, // 主键值
		materialPKColumn: FIELD.pk_material,
		numKey: FIELD.nnum,
		billTitle:
			getLangByResId(this, '4004POORDER-000034') +
			props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.vbillcode).value /* 国际化处理： 采购订单合并打印：*/,
		headCode: PAGECODE.cardhead, //页面头区域
		bodyCode: PAGECODE.cardbody, //页面子区域
		columnArea: PAGECODE.cardbody, //参数字段所在区域（根据字段翻译名称使用，一般为子表区域）
		groupColumn: groupColumn,
		sumColumn: sumColumn,
		averageColumn: averageColumn,
		weightAverageColumn: weightAverageColumn,
		meta: this.meta, // 当前卡片页面meta
		funcode: funcode, //小应用编码
		nodekey: nodekey, //模板节点标识
		combineUrl: URL.combine, //合并action
		printUrl: URL.combintPrint, //打印action
		appcode: funcode,
		billtype: PAGECODE.billType
	};
}
