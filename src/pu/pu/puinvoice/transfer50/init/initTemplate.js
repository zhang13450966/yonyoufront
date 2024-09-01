/*
 * @Author: jiangfw 
 * @PageInfo: 消耗汇总收票界面初始化
 * @Date: 2018-06-10 22:08:14 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2019-02-16 18:35:59
 */
import ref50Filter from '../../refFilter/ref50Filter';
import { APPCODE, PAGECODE, BUTTONID, AREA } from '../../constance';
// import addRefresh from '../../utils/addRefresh';
export default function() {
	let _this = this;
	_this.props.createUIDom(
		{
			// appcode: APPCODE.transfer50, //应用编码
			// pagecode: PAGECODE.ref50_list //页面id
			appcode: APPCODE.vmisum, //应用编码
			pagecode: PAGECODE.ref50_list //页面id
		},
		(templedata) => {
			if (templedata) {
				if (templedata.template) {
					// _this.setState({
					// 	templetid_50: templedata.template.pageid,
					// 	qTempletid_50: templedata.template.ref50_query.oid
					// });
					_this.templetid_50 = templedata.template.pageid;
					_this.qTempletid_50 = templedata.template.ref50_query.oid;

					let meta = templedata.template;
					ref50Filter.call(_this, _this.props, meta);
					if (_this.props.initData) {
						_this.props.meta.setMeta(meta, setDefaultData.bind(_this, _this.props));
					} else {
						_this.props.meta.setMeta(meta);
					}
				}
				if (templedata.button) {
					let button = templedata.button;
					_this.props.button.setButtons(button);
				}
				// let appid = _this.props.getUrlParam('appid');
				// if (appid) {
				// 	_this.props.button.setButtonVisible([ BUTTONID.Back ], false);
				// }
			}
		}
	);
	// addRefresh(_this.props);
}

function setDefaultData(props) {
	let initData = props.initData;
	if (initData.cfanaceorgoid && initData.cfanaceorgoid.value && props.isRefAddLine) {
		// 结算财务组织
		props.search.setSearchValByField(AREA.ref50_query, 'cfanaceorgoid', initData.cfanaceorgoid);
		props.search.setSearchValByField(AREA.ref50_query, 'cfanaceorgoid', initData.cfanaceorgoid, 'normal');
		props.search.setSearchValByField(AREA.ref50_query, 'cfanaceorgoid', initData.cfanaceorgoid, 'super');
		props.search.setDisabledByField(AREA.ref50_query, 'cfanaceorgoid', true);
	} else {
		props.search.setSearchValByField(AREA.ref50_query, 'cfanaceorgoid', null);
		props.search.setDisabledByField(AREA.ref50_query, 'cfanaceorgoid', false);
	}

	if (initData.ccalbodyid && initData.ccalbodyid.value && props.isRefAddLine) {
		// 结算库存组织
		props.search.setSearchValByField(AREA.ref50_query, 'ccalbodyid', initData.ccalbodyid);
		props.search.setSearchValByField(AREA.ref50_query, 'ccalbodyid', initData.ccalbodyid, 'normal');
		props.search.setSearchValByField(AREA.ref50_query, 'ccalbodyid', initData.ccalbodyid, 'super');
		props.search.setDisabledByField(AREA.ref50_query, 'ccalbodyid', true);
	} else {
		props.search.setSearchValByField(AREA.ref50_query, 'ccalbodyid', null);
		props.search.setDisabledByField(AREA.ref50_query, 'ccalbodyid', false);
	}

	if (initData.pk_supplier && initData.pk_supplier.value && props.isRefAddLine) {
		// 供应商
		props.search.setSearchValByField(AREA.ref50_query, 'cvendorid', initData.pk_supplier);
		props.search.setSearchValByField(AREA.ref50_query, 'cvendorid', initData.pk_supplier, 'normal');
		props.search.setSearchValByField(AREA.ref50_query, 'cvendorid', initData.pk_supplier, 'super');
		props.search.setDisabledByField(AREA.ref50_query, 'cvendorid', true);
	} else {
		props.search.setSearchValByField(AREA.ref50_query, 'cvendorid', null);
		props.search.setDisabledByField(AREA.ref50_query, 'cvendorid', false);
	}
}
