/*
 * @Author: jiangfw 
 * @PageInfo: 初始化期初暂估单拉单界面 
 * @Date: 2018-06-25 14:39:36 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:29:39
 */
import { PAGECODE, APPCODE, AREA } from '../../constance';
import ref4TFilter from '../../refFilter/ref4TFilter';
import addRefresh from '../../utils/addRefresh';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.initialest, //应用编码
			pagecode: PAGECODE.ref4T_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_4T = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref4TFilter.call(_this, _this.props, meta);
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
		props.search.setSearchValByField(AREA.search4T, 'pk_org', initData.cfanaceorgoid);
		props.search.setSearchValByField(AREA.search4T, 'pk_org', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(AREA.search4T, 'pk_org', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(AREA.search4T, 'pk_org', true);
	} else {
		props.search.setSearchValByField(AREA.search4T, 'pk_org', null);
		props.search.setDisabledByField(AREA.search4T, 'pk_org', false);
	}

	if (initData.pk_stockorg && initData.pk_stockorg.value && props.isRefAddLine) {
		// 库存组织
		props.search.setSearchValByField(AREA.search4T, 'pk_stockorg', initData.pk_stockorg);
		props.search.setSearchValByField(AREA.search4T, 'pk_stockorg', initData.pk_stockorg, 'normal');
		props.search.setSearchValByField(AREA.search4T, 'pk_stockorg', initData.pk_stockorg, 'super');
		props.search.setDisabledByField(AREA.search4T, 'pk_stockorg', true);
	} else {
		props.search.setSearchValByField(AREA.search4T, 'pk_stockorg', null);
		props.search.setDisabledByField(AREA.search4T, 'pk_stockorg', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.search4T, 'pk_supplier', initData.pk_supplier);
		props.search.setSearchValByField(AREA.search4T, 'pk_supplier', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.search4T, 'pk_supplier', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.search4T, 'pk_supplier', true);
	} else {
		props.search.setSearchValByField(AREA.search4T, 'pk_supplier', null);
		props.search.setDisabledByField(AREA.search4T, 'pk_supplier', false);
	}
}
