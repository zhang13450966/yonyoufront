/*
 * @Author: jiangfw
 * @PageInfo: 初始化期初暂估单拉单界面
 * @Date: 2018-06-25 14:39:36
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-09-21 16:30:51
 */
import ref61Filter from '../../refFilter/ref61Filter';
import { PAGECODE, APPCODE, AREA } from '../../constance';
import addRefresh from '../../utils/addRefresh';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.puinvoice, //应用编码
			pagecode: PAGECODE.ref61_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_61 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref61Filter.call(_this, _this.props, meta, _this.props.initData);
					if (_this.props.initData) {
						_this.props.meta.addMeta(meta, setDefaultData.bind(_this, _this.props, _this.queryArea));
					} else {
						_this.props.meta.addMeta(meta);
					}
				}
			}
		}
	);

	addRefresh(_this.props);
}

function setDefaultData(props, queryArea) {
	let initData = props.initData;
	if (initData.cfanaceorgoid && initData.cfanaceorgoid.value && props.isRefAddLine) {
		// 结算财务组织
		props.search.setSearchValByField(queryArea, 'pk_financeorg', initData.cfanaceorgoid);
		props.search.setSearchValByField(queryArea, 'pk_financeorg', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(queryArea, 'pk_financeorg', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(queryArea, 'pk_financeorg', true);
	} else {
		props.search.setSearchValByField(queryArea, 'pk_financeorg', null);
		props.search.setDisabledByField(queryArea, 'pk_financeorg', false);
	}

	if (initData.pk_purchaseorg && initData.pk_purchaseorg.value && props.isRefAddLine) {
		// 采购组织
		props.search.setSearchValByField(queryArea, 'pk_org', initData.pk_purchaseorg);
		props.search.setSearchValByField(queryArea, 'pk_org', initData.pk_purchaseorg, 'normal');
		props.search.setSearchValByField(queryArea, 'pk_org', initData.pk_purchaseorg, 'super');
		props.search.setDisabledByField(queryArea, 'pk_org', true);
	} else {
		props.search.setSearchValByField(queryArea, 'pk_org', null);
		props.search.setDisabledByField(queryArea, 'pk_org', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(queryArea, 'pk_supplier', initData.pk_supplier);
		props.search.setSearchValByField(queryArea, 'pk_supplier', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(queryArea, 'pk_supplier', initData.pk_supplier, 'super');
		props.search.setDisabledByField(queryArea, 'pk_supplier', true);
	} else {
		props.search.setSearchValByField(queryArea, 'pk_supplier', null);
		props.search.setDisabledByField(queryArea, 'pk_supplier', false);
	}
}
