/*
 * @Author: jiangfw 
 * @PageInfo: 初始化采购订单拉单模板
 * @Date: 2018-06-15 14:05:20 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 13:16:49
 */
import { PAGECODE, APPCODE, AREA } from '../../constance';
import ref21Filter from '../../refFilter/ref21Filter';
import addRefresh from '../../utils/addRefresh';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.poorder, //应用编码
			pagecode: PAGECODE.ref21_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_21 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref21Filter.call(_this, _this.props, meta);
					if (_this.props.initData) {
						_this.props.meta.addMeta(meta, setDefaultData.bind(_this, _this.props));
					} else {
						_this.props.meta.addMeta(meta);
					}
				}
			}
		}
	);

	addRefresh(_this.props);
}

function setDefaultData(props) {
	let initData = props.initData;
	if (initData.cfanaceorgoid && initData.cfanaceorgoid.value && props.isRefAddLine) {
		// 结算财务组织
		props.search.setSearchValByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', initData.cfanaceorgoid);
		props.search.setSearchValByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', true);
	} else {
		props.search.setSearchValByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', null);
		props.search.setDisabledByField(AREA.search21, 'pk_order_b.pk_psfinanceorg', false);
	}

	if (initData.pk_purchaseorg && initData.pk_purchaseorg.value && props.isRefAddLine) {
		// 采购组织
		props.search.setSearchValByField(AREA.search21, 'pk_org', initData.pk_purchaseorg);
		props.search.setSearchValByField(AREA.search21, 'pk_org', initData.pk_purchaseorg, 'normal');
		props.search.setSearchValByField(AREA.search21, 'pk_org', initData.pk_purchaseorg, 'super');
		props.search.setDisabledByField(AREA.search21, 'pk_org', true);
	} else {
		props.search.setSearchValByField(AREA.search21, 'pk_org', null);
		props.search.setDisabledByField(AREA.search21, 'pk_org', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.search21, 'cvendorid', initData.pk_supplier);
		props.search.setSearchValByField(AREA.search21, 'cvendorid', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.search21, 'cvendorid', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.search21, 'cvendorid', true);
	} else {
		props.search.setSearchValByField(AREA.search21, 'cvendorid', null);
		props.search.setDisabledByField(AREA.search21, 'cvendorid', false);
	}
}
