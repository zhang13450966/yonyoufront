import { APPID, PAGECODE, AREA, URL } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool';
import { saveFilterCustomColData } from '../../pub/utils/index';
import { formatNumber } from 'nc-lightapp-front';
import { format } from 'crypto-js';
export default function(props) {
	let _this = this;
	props.createUIDom(
		{
			pagecode: PAGECODE.list //页面id
			//appid: APPID //注册按钮的id
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
					//props.search.setDisabled(AREA.invoiceSearchArea, true);
					//props.search.setDisabled(AREA.stockInSearchArea, true);
					//props.search.setDisabledByField.call(this,AREA.invoiceSearchArea, 'pk_org', false);
					//props.search.setDisabledByField.call(this,AREA.stockInSearchArea, 'pk_stockps_b.pk_financeorg', false);
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
		if (item.attrcode == 'pk_stockps_b.pk_srcmaterial.pk_marbasclass') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_stockps_b.pk_financeorg') ||
					{}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_stockps_b.pk_srcmaterial') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_stockps_b.pk_financeorg') ||
					{}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_stockps_b.pk_supplier') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_stockps_b.pk_financeorg') ||
					{}).value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_stordoc') {
			item.isShowUnit = true;
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(AREA.stockInSearchArea, 'pk_stockps_b.pk_org') || {})
					.value;
				return { pk_org: pk_org.firstvalue };
			};
		} else if (item.attrcode == 'pk_stockps_b.pk_financeorg') {
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
		key: 'invoicecust1',
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
		key: 'invoicecust2',
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
				<div style={{ lineHeight: '14px' }}>
					{getLangByResId(this, '4004SETTLEMENT-000062') /* 国际化处理： 未结算金额*/}
				</div>
			</div>
		),

		attrcode: 'invoicecust3',
		key: 'invoicecust3',
		render(text, record, index) {
			saveFilterCustomColData.call(
				this,
				props,
				AREA.invoiceView,
				'invoicecust3',
				record,
				((record.values.ncansettlenum || {}).value || '') +
					((record.values.cunitid || {}).display || '') +
					(record.values.ncansettlemny || {}).value
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
		label: getLangByResId(this, '4004SETTLEMENT-000059') /* 国际化处理： 入库单号/供应商*/,
		key: 'stockcust1',
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
		key: 'stockcust2',
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
		key: 'stockcust3',
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
