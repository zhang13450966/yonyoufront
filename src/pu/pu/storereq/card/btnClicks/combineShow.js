/*
 * @Author: mikey.zhangchqf 
 * @Date: 2018-09-20 13:54:22 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-11-22 14:21:38
 */
import { STOREREQ_CARD, FBILLSTATUS, ATTRCODE, ATTRCODES, STOREREQ_LIST } from '../../siconst';
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
	props.meta.getMeta()[STOREREQ_CARD.tableId].items.map((item) => {
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
		all: [ ATTRCODES.nnum, ATTRCODES.nastnum, ATTRCODES.ntaxmny, ATTRCODES.naccuoutnum, ATTRCODES.naccuoutreqnum ],
		right: [ ATTRCODES.nnum, ATTRCODES.nastnum, ATTRCODES.ntaxmny, ATTRCODES.naccuoutnum, ATTRCODES.naccuoutreqnum ]
	};

	let averageColumn = {
		all: [ ATTRCODES.nnum, ATTRCODES.nastnum, ATTRCODES.ntaxmny, ATTRCODES.naccuoutnum, ATTRCODES.naccuoutreqnum ],
		right: []
	};

	let weightAverageColumn = {
		all: [ ATTRCODES.nnum, ATTRCODES.nastnum, ATTRCODES.ntaxmny, ATTRCODES.naccuoutnum, ATTRCODES.naccuoutreqnum ],
		right: []
	};

	return {
		title: getLangByResId(this, '4004STOREREQ-000008') /* 国际化处理： 合并显示*/,
		materialClassification: true,
		billPk: props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.pk_storereq).value, // 主键值
		materialPKColumn: ATTRCODES.pk_material,
		numKey: ATTRCODES.nnum,
		billTitle:
			getLangByResId(this, '4004STOREREQ-000009') +
			props.form.getFormItemsValue(STOREREQ_CARD.formId, ATTRCODE.vbillcode).value /* 国际化处理： 物资需求申请单合并显示： */,
		headCode: STOREREQ_CARD.formId, //页面头区域
		bodyCode: STOREREQ_CARD.tableId, //页面子区域
		columnArea: STOREREQ_CARD.tableId, //参数字段所在区域（根据字段翻译名称使用，一般为子表区域）
		groupColumn: groupColumn,
		sumColumn: sumColumn,
		averageColumn: averageColumn,
		weightAverageColumn: weightAverageColumn,
		meta: this.meta, // 当前卡片页面meta
		funcode: '400400000', //小应用编码
		nodekey: '40040000001', //模板节点标识
		combineUrl: STOREREQ_CARD.combine, //合并action
		printUrl: STOREREQ_CARD.combintPrint, //打印action
		appcode:
			this.props.getAppCode() == '400400004' || this.props.getAppCode() == '400400002'
				? '400400000'
				: this.props.getAppCode(),
		billtype: STOREREQ_CARD.billType,
		scene: this.props.getUrlParam('scene')
	};
}
