/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-09-20 13:54:22 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-22 14:21:16
 */
import { BUYINGREQ_CARD, FBILLSTATUS, ATTRCODE, ATTRCODES } from '../../siconst';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function combineShow(props) {
	let _this = this;
	this.combineData = getJsonData.call(this, props);
	this.setState({
		showConditionModal: !this.state.showConditionModal
	});
}

function getJsonData(props) {
	let letfItemKey = [];
	props.meta.getMeta()[BUYINGREQ_CARD.tableId].items.map((item) => {
		if (item.visible) {
			letfItemKey.push(item.attrcode);
		}
	});
	letfItemKey == null ? null : letfItemKey;
	let rightItemKey = [ ATTRCODES.pk_material ];
	let groupColumn = {
		all: letfItemKey,
		right: rightItemKey
	};

	let sumColumn = {
		all: [
			ATTRCODES.naccumulatenum,
			ATTRCODES.nastnum,
			ATTRCODES.ngenct,
			ATTRCODES.nnum,
			ATTRCODES.ntaxmny,
			ATTRCODES.ntaxprice
		],
		right: [
			ATTRCODES.naccumulatenum,
			ATTRCODES.nastnum,
			ATTRCODES.ngenct,
			ATTRCODES.nnum,
			ATTRCODES.ntaxmny,
			ATTRCODES.ntaxprice
		]
	};

	let averageColumn = {
		all: [
			ATTRCODES.naccumulatenum,
			ATTRCODES.nastnum,
			ATTRCODES.ngenct,
			ATTRCODES.nnum,
			ATTRCODES.ntaxmny,
			ATTRCODES.ntaxprice
		],
		right: []
	};

	let weightAverageColumn = {
		all: [
			ATTRCODES.naccumulatenum,
			ATTRCODES.nastnum,
			ATTRCODES.ngenct,
			ATTRCODES.nnum,
			ATTRCODES.ntaxmny,
			ATTRCODES.ntaxprice
		],

		right: []
	};

	return {
		title: getLangByResId(this, '4004PRAYBILL-000012') /* 国际化处理： 合并显示*/,
		materialClassification: true,
		billPk: props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.pk_praybill).value, // 主键值
		materialPKColumn: ATTRCODES.pk_material,
		numKey: ATTRCODES.nnum,
		billTitle:
			getLangByResId(this, '4004PRAYBILL-000013') +
			props.form.getFormItemsValue(BUYINGREQ_CARD.formId, ATTRCODE.vbillcode).value /* 国际化处理： 请购单合并显示： */,
		headCode: BUYINGREQ_CARD.formId, //页面头区域
		bodyCode: BUYINGREQ_CARD.tableId, //页面子区域
		columnArea: BUYINGREQ_CARD.tableId, //参数字段所在区域（根据字段翻译名称使用，一般为子表区域）
		groupColumn: groupColumn,
		sumColumn: sumColumn,
		averageColumn: averageColumn,
		weightAverageColumn: weightAverageColumn,
		meta: this.meta, // 当前卡片页面meta
		funcode: '400400400', //小应用编码
		nodekey: '40040040001', //模板节点标识
		combineUrl: BUYINGREQ_CARD.combine, //合并action
		printUrl: BUYINGREQ_CARD.combintPrint, //打印action
		appcode: this.props.getAppCode() == '400400406' ? '400400400' : this.props.getAppCode(),
		billtype: BUYINGREQ_CARD.billType,
		scene: this.props.getUrlParam('scene')
	};
}
