/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-12 16:40:53
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-25 16:00:32
 */
import Position from '../../position/list';
import React from 'react';
import { createPage } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

import ReactDOM from 'react-dom';
import { POSITION_CONST } from '../../position/const';
class PurchasePosition extends Position {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
		this.nodecode = '40010520';
	}

	getMainOrgConfig = () => {
		return {
			ref: 'mainOrg',
			placeholder: getLangByResId(this, '4004POSITION-000004') /* 国际化处理： 库存组织*/,
			refPath: 'org/PurchaseOrgGridRef/index.js',
			queryGridUrl: '/nccloud/uapbd/org/PurchaseOrgGridRef.do'
		};
	};

	getAppname = () => {
		return getLangByResId(this, '4004POSITION-000025');
	};
}

PurchasePosition = createPage({
	billinfo: [
		{
			billtype: 'grid',
			tabletype: 'cardTable',
			pagecode: POSITION_CONST.PAGECODE,
			bodycode: POSITION_CONST.UPTABLEID
		},
		{
			billtype: 'grid',
			tabletype: 'cardTable',
			pagecode: POSITION_CONST.PAGECODE,
			bodycode: POSITION_CONST.DOWNTABLEID
		}
	],
	// Tab快捷键适配
	orderOfHotKey: [ POSITION_CONST.UPTABLEID, POSITION_CONST.DOWNTABLEID ]
})(PurchasePosition);

ReactDOM.render(<PurchasePosition />, document.querySelector('#app'));
