import { APPID, PAGECODE, AREA, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { saveFilterCustomColData } from '../../pub/utils/index';
import { formatNumber } from 'nc-lightapp-front';

export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.vimlist //页面id
		},
		function(data) {
			if (data) {
				if (data.template) {
					let meta = data.template;
					modifierMeta.call(_this, props, meta);
					props.meta.setMeta(meta);
				}
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

/**
 * 自定义元数据样式
 * @param {*} props
 * @param {*} meta
 */
function modifierMeta(props, meta) {
	meta[AREA.invoiceSearchArea].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == 'invoicebody.pk_material.pk_marbasclass') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'invoicebody.pk_srcmaterial.pk_marbasclass') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'invoicebody.pk_srcmaterial') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_supplier') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_org') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'invoicebody.pk_stordoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.invoiceSearchArea, 'pk_stockorg') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_org') {
			item.queryCondition = () => {
				return {
					isDataPowerEnable: true,
					TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
				};
			};
		}
	});
	meta[AREA.stockInSearchArea].items.map((item) => {
		setPsndocShowLeavePower(item);
		setRefShowDisabledData(item);
		if (item.attrcode == 'pk_srcmaterial.pk_marbasclass') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_financeorg') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_srcmaterial') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_financeorg') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_supplier') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_financeorg') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_stordoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_storeorg') || {}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_financeorg') {
			item.queryCondition = () => {
				return {
					isDataPowerEnable: true,
					TreeRefActionExt: 'nccloud.web.scmpub.ref.AppPermissionOrgRefFilter'
				};
			};
		}
	});
	let invoicecust1 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		label: getLangByResId(this, '4004SETTLEMENT-000057') /* 国际化处理： 发票号/供应商*/,
		attrcode: 'invoicecust1',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.invoiceView,
				'invoicecust1',
				record,
				(record.values.vbillcode || {}).value + (record.values.pk_supplier_v || {}).display
			);
			return (
				<div>
					<span>{(record.values.vbillcode || {}).value} </span>
					<br />
					<span>{(record.values.pk_supplier_v || {}).display}</span>
				</div>
			);
		}
	};
	let invoicecust2 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		label: getLangByResId(this, '4004SETTLEMENT-000058') /* 国际化处理： 物料*/,
		attrcode: 'invoicecust2',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.invoiceView,
				'invoicecust2',
				record,
				(record.values.pk_material || {}).display + (record.values['pk_material.name'] || {}).display
			);
			return (
				<div>
					<span>{(record.values.pk_material || {}).display}</span>
					<br />
					<span>{(record.values['pk_material.name'] || {}).display}</span>
				</div>
			);
		}
	};
	let invoicecust3 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		label: (
			<div>
				<div style={{ lineHeight: '14px' }}>
					{getLangByResId(this, '4004SETTLEMENT-000060')}/{getLangByResId(this, '4004SETTLEMENT-000061')}
				</div>
				{/* 国际化处理： 未结算数量,主单位*/}
				<div style={{ lineHeight: '14px' }}>{getLangByResId(this, '4004SETTLEMENT-000062')}</div>
				{/* 国际化处理： 未结算金额*/}
			</div>
		),
		attrcode: 'invoicecust3',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.invoiceView,
				'invoicecust3',
				record,
				((record.values.ncansettlenum || {}).value || '') +
					((record.values.cunitid || {}).display || '') +
					(record.values.ncansettlemny || {}).value || ''
			);
			let ncansettlenum = (record.values.ncansettlenum || {}).value || 0;
			let ncansettlemny = (record.values.ncansettlemny || {}).value || 0;
			return (
				<div>
					<span>{formatNumber(ncansettlenum)}</span>
					<span>{(record.values.cunitid || {}).display || ''}</span>
					<br />
					<span>{formatNumber(ncansettlemny)}</span>
				</div>
			);
		}
	};
	let invoiceFields = [];
	meta[AREA.invoiceView].items.map((item) => {
		if (item.visible) {
			invoiceFields.push(item.attrcode);
		}
		item.visible = false;
	});
	meta[AREA.invoiceView].items.push(invoicecust1);
	meta[AREA.invoiceView].items.push(invoicecust2);
	meta[AREA.invoiceView].items.push(invoicecust3);
	this.state.invoiceFields = invoiceFields;
	let stockFields = [];
	meta[AREA.stockInVIew].items.map((item) => {
		if (item.visible) {
			stockFields.push(item.attrcode);
		}
		item.visible = false;
	});
	this.state.stockFields = stockFields;
	let stockcust1 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		width: 180,
		label: getLangByResId(this, '4004SETTLEMENT-000069') /* 国际化处理： 消耗汇总单号/供应商*/,
		attrcode: 'stockcust1',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.stockInVIew,
				'stockcust1',
				record,
				(record.values.vbillcode || {}).value + (record.values.pk_supplier_v || {}).display
			);
			return (
				<div>
					<span>{(record.values.vbillcode || {}).value} </span>
					<br />
					<span>{(record.values.pk_supplier_v || {}).display}</span>
				</div>
			);
		}
	};
	let stockcust2 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		label: getLangByResId(this, '4004SETTLEMENT-000058') /* 国际化处理： 物料*/,
		attrcode: 'stockcust2',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.stockInVIew,
				'stockcust2',
				record,
				(record.values.pk_material || {}).display + (record.values['pk_material.name'] || {}).display
			);
			return (
				<div>
					<span>{(record.values.pk_material || {}).display}</span>
					<br />
					<span>{(record.values['pk_material.name'] || {}).display}</span>
				</div>
			);
		}
	};
	let stockcust3 = {
		width: '150px',
		itemtype: 'customer',
		visible: true,
		label: (
			<div>
				<span>
					{getLangByResId(this, '4004SETTLEMENT-000060')}/{getLangByResId(this, '4004SETTLEMENT-000061')}
				</span>
				{/* 国际化处理： 未结算数量,主单位*/}
			</div>
		),
		attrcode: 'stockcust3',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.stockInVIew,
				'stockcust3',
				record,
				((record.values.ncansettlenum || {}).value || '') + ((record.values.cunitid || {}).display || '')
			);
			let ncansettlenum = (record.values.ncansettlenum || {}).value || 0;
			return (
				<div>
					<span>{formatNumber(ncansettlenum)}</span>
					<span>{(record.values.cunitid || {}).display || ''}</span>
				</div>
			);
		}
	};
	meta[AREA.stockInVIew].items.push(stockcust1);
	meta[AREA.stockInVIew].items.push(stockcust2);
	meta[AREA.stockInVIew].items.push(stockcust3);
	return meta;
}
