/*
 * @Author: jiangfw 
 * @PageInfo: 初始化期初暂估单拉单界面 
 * @Date: 2018-06-25 14:39:36 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:54:49
 */
import ref47Filter from '../../refFilter/ref47Filter';
import { PAGECODE, APPCODE, AREA } from '../../constance';
import addRefresh from '../../utils/addRefresh';

export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.subcontIn, //应用编码
			pagecode: PAGECODE.ref47_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_47 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref47Filter.call(_this, _this.props, meta);
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
		props.search.setSearchValByField(AREA.search47, 'pk_org.pk_financeorg', initData.cfanaceorgoid);
		props.search.setSearchValByField(AREA.search47, 'pk_org.pk_financeorg', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(AREA.search47, 'pk_org.pk_financeorg', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(AREA.search47, 'pk_org.pk_financeorg', true);
	} else {
		props.search.setSearchValByField(AREA.search47, 'pk_org.pk_financeorg', null);
		props.search.setDisabledByField(AREA.search47, 'pk_org.pk_financeorg', false);
	}

	if (initData.pk_stockorg && initData.pk_stockorg.value && props.isRefAddLine) {
		// 库存组织
		props.search.setSearchValByField(AREA.search47, 'pk_stockorg', initData.pk_stockorg);
		props.search.setSearchValByField(AREA.search47, 'pk_stockorg', initData.pk_stockorg, 'normal');
		props.search.setSearchValByField(AREA.search47, 'pk_stockorg', initData.pk_stockorg, 'super');
		props.search.setDisabledByField(AREA.search47, 'pk_stockorg', true);
	} else {
		props.search.setSearchValByField(AREA.search47, 'pk_stockorg', null);
		props.search.setDisabledByField(AREA.search47, 'pk_stockorg', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.search47, 'cvendorid', initData.pk_supplier);
		props.search.setSearchValByField(AREA.search47, 'cvendorid', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.search47, 'cvendorid', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.search47, 'cvendorid', true);
	} else {
		props.search.setSearchValByField(AREA.search47, 'cvendorid', null);
		props.search.setDisabledByField(AREA.search47, 'cvendorid', false);
	}
}
