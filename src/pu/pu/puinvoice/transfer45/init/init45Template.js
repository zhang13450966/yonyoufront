/*
 * @Author: jiangfw 
 * @PageInfo: 初始化采购入库单拉单模板
 * @Date: 2018-06-25 14:39:03 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-01-22 15:39:14
 */
import { PAGECODE, APPCODE, AREA } from '../../constance';
import ref45Filter from '../../refFilter/ref45Filter';
import addRefresh from '../../utils/addRefresh';

export default function(props, initData) {
	let _this = this;
	_this.props.createUIDom(
		{
			appcode: APPCODE.purchaseIn, //应用编码
			pagecode: PAGECODE.ref45_list //卡片页面编码
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					_this.templetid_45 = templedata.template.pageid;

					let meta = templedata.template;
					// 添加参照过滤
					ref45Filter.call(_this, _this.props, meta);
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
		props.search.setSearchValByField(AREA.search45, 'cfanaceorgoid', initData.cfanaceorgoid);
		props.search.setSearchValByField(AREA.search45, 'cfanaceorgoid', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(AREA.search45, 'cfanaceorgoid', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(AREA.search45, 'cfanaceorgoid', true);
	} else {
		props.search.setSearchValByField(AREA.search45, 'cfanaceorgoid', null);
		props.search.setDisabledByField(AREA.search45, 'cfanaceorgoid', false);
	}

	if (initData.pk_org && initData.pk_org.value && props.isRefAddLine) {
		// 库存组织
		props.search.setSearchValByField(AREA.search45, 'pk_org', initData.pk_org);
		props.search.setSearchValByField(AREA.search45, 'pk_org', initData.pk_org, 'normal');
		props.search.setSearchValByField(AREA.search45, 'pk_org', initData.pk_org, 'super');
		props.search.setDisabledByField(AREA.search45, 'pk_org', true);
	} else {
		props.search.setSearchValByField(AREA.search45, 'pk_org', null);
		props.search.setDisabledByField(AREA.search45, 'pk_org', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.search45, 'cgeneralbid.cvendorid', initData.pk_supplier);
		props.search.setSearchValByField(AREA.search45, 'cgeneralbid.cvendorid', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.search45, 'cgeneralbid.cvendorid', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.search45, 'cgeneralbid.cvendorid', true);
	} else {
		props.search.setSearchValByField(AREA.search45, 'cgeneralbid.cvendorid', null);
		props.search.setDisabledByField(AREA.search45, 'cgeneralbid.cvendorid', false);
	}
}
