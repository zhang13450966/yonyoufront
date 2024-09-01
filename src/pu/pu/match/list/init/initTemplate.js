/*
 * @Author: xiahui 
 * @PageInfo: 三单匹配-列表模板 
 * @Date: 2019-05-14 15:34:54 
 * @Last Modified by: xiahui
 * @Last Modified time: 2019-06-28 14:12:43
 */
import { PAGECODE, AREA, FIELDS } from '../../constance';
import { invoiceSearch, matchedSearch } from '../btnClicks';
import { setPsndocShowLeavePower, setRefShowDisabledData } from '../../../../../scmpub/scmpub/pub/tool/refUtils';

export default function(props) {
	props.createUIDom(
		{
			pagecode: PAGECODE.listPagecode
		},
		(data) => {
			if (data) {
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
				if (data.template) {
					let meta = data.template;
					meta = modifyMeta.call(this, props, meta);
					props.meta.setMeta(meta);
				}

				setDefaultData.call(this, props);
			}
		}
	);
}

function modifyMeta(props, meta) {
	// 修改列渲染样式
	meta[AREA.invoiceId].items = meta[AREA.invoiceId].items.map((item, key) => {
		if (item.attrcode === FIELDS.basicunit) {
			// 主单位
			// 设置编辑时，界面显示名称
			item.fieldDisplayed = 'refname';
		}
		return item;
	});

	searchRefFilter(props, meta, AREA.searchId);

	return meta;
}

// 查询区参照过滤
function searchRefFilter(props, meta, moduleId) {
	meta[moduleId].items.map((item) => {
		// 显示离职人员
		setPsndocShowLeavePower(item);
		// 显示停用
		setRefShowDisabledData(item);

		if (item.attrcode === FIELDS.pk_supplier) {
			item.isShowUnit = true;
			// 供应商
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(moduleId, FIELDS.pk_financeorg) || {}).value;
				return {
					pk_org: (pk_org || {}).firstvalue
				};
			};
		} else if (item.attrcode === FIELDS.pk_srcmaterial) {
			// 物料
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(moduleId, FIELDS.pk_financeorg) || {}).value;
				return {
					pk_org: (pk_org || {}).firstvalue,
					SCM_DISCOUNTFLAG: 'N',
					SCM_FEEFLAG: 'N',
					GridRefActionExt: 'nccloud.web.scmpub.ref.MaterialRefFilterUtils'
				};
			};
		} else if (item.attrcode === FIELDS.pk_stordoc) {
			// 仓库
			item.queryCondition = () => {
				let pk_org = (props.search.getSearchValByField(moduleId, FIELDS.pk_financeorg) || {}).value;
				return {
					pk_org: (pk_org || {}).firstvalue
				};
			};
		}
	});
}

/**
 * 设置默认数据
 * @param {*} props 
 */
function setDefaultData(props) {
	// 设置表格可编辑
	props.editTable.setStatus(AREA.invoiceId, 'edit');
	props.editTable.setStatus(AREA.stockinId, 'edit');

	// 获取参数，组建发票主键，设置当前默认页签
	let pks = props.getUrlParam('pks'); // 发票主键，以','分割
	let scene = props.getUrlParam('scene'); // 当前页面类型，'match'为三单匹配,'view'为查看匹配结果

	this.invoicePks = pks.split(',');
	if (scene == 'match') {
		this.state.tab = 1;
		invoiceSearch.call(this, props, true);
	} else {
		this.state.tab = 2;
		matchedSearch.call(this, props);
	}
}
