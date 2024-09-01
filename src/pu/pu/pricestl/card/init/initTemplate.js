import { URL, PAGECODE, FIELD, BUTTON, STATUS, OrderCache } from '../../constance';
import { pageInfoClick, btnClick } from '../btnClicks';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { columnSortUtils } from '../../../../../scmpub/scmpub/pub/tool/columnSortUtils';

export default function() {
	this.props.createUIDom(
		{
			pagecode: PAGECODE.cardcode,
		},
		templedata => {
			let templetid = templedata.template.pageid;
			if (templedata.template) {
				let meta = templedata.template;
				modifierMeta.call(this, meta, this.props);
				this.props.meta.setMeta(meta, toggleShow.bind(this, templedata));
			}
			if (templedata.button) {
				let button = templedata.button;
				this.props.button.setButtons(button);
			}
		}
	);
}
function modifierMeta(meta, props) {
	let status = props.getUrlParam(STATUS.status);
	meta[PAGECODE.cardhead].status = status;
	meta[PAGECODE.cardbody].status = status;
	//编辑前 参照过滤
	meta[PAGECODE.cardhead].items.map(item => {
		if (
			item.attrcode == 'pk_supplier' ||
			item.attrcode == 'pk_employee' ||
			item.attrcode == 'pk_dept_v' ||
			item.attrcode == 'pk_dept'
		) {
			item.queryCondition = () => {
				//过滤供应商
				let pk_org = props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: pk_org, busifuncode: 'st' };
			};
		}
	});
	meta[PAGECODE.cardbody].items.map(item => {
		if (item.attrcode == 'pk_material') {
			item.queryCondition = () => {
				//过滤物料版本信息
				let pk_org = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_org).value;
				return { pk_org: pk_org, busifuncode: 'st' };
			};
		}
	});
	let meterial_event = {
		label: getLangByResId(this, '4004PRICESTL-000017') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [];
			let fbillstatus = this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.fbillstatus); //单据状态
			// if (this.props.cardTable.getStatus(PAGECODE.cardbody) === STATUS.browse) {
			buttonAry = [BUTTON.openmeterialbrowse];
			// }
			// } else {
			// 	buttonAry = [ BUTTON.openmeterialedit ];
			// }
			return this.props.button.createOprationButton(buttonAry, {
				area: PAGECODE.material_table_row,
				buttonLimit: 1,
				onButtonClick: (props, key) => btnClick.call(this, props, key, text, record, index),
			});
		},
	};
	let quality_event = {
		label: getLangByResId(this, '4004PRICESTL-000017') /* 国际化处理： 操作*/,
		itemtype: 'customer',
		attrcode: 'opr',
		width: '150px',
		visible: true,
		fixed: 'right',
		render: (text, record, index) => {
			let buttonAry = [];
			buttonAry = [BUTTON.openqualitybrowse];
			return this.props.button.createOprationButton(buttonAry, {
				area: PAGECODE.quality_table_row,
				buttonLimit: 1,
				onButtonClick: (props, key) => btnClick.call(this, props, key, text, record, index),
			});
		},
	};
	meta[PAGECODE.cardbody].items.push(meterial_event);
	meta[PAGECODE.cardbodyano].items.push(quality_event);
	// 行号排序处理
	columnSortUtils.numberSort(meta, PAGECODE.cardbody, FIELD.crowno);
	return meta;
}
function toggleShow(data) {
	// // 修改页面状态
	// let status = this.props.getUrlParam(STATUS.status);
	// let pk = this.props.getUrlParam(FIELD.id);
	// let billstatus = this.props.getUrlParam('billStatus');
	// // togglePageShow.call(this, this.props, status, billstatus);
	pageInfoClick.call(this);
}
