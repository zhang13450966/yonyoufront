/*
 * @Author: wangceb
 * @PageInfo: 页面功能描述
 * @Date: 2019-03-12 16:40:53
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-01-29 15:45:04
 */
import Position from '../../position/list';
import React from 'react';
import { createPage } from 'nc-lightapp-front';
import { getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

import ReactDOM from 'react-dom';
import { POSITION_CONST } from '../../position/const';
class PlanningPosition extends Position {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {};
		this.nodecode = '40010515';
	}

	getMainOrgConfig = () => {
		return {
			ref: 'mainOrg',
			placeholder: getLangByResId(this, '4004POSITION-000015') /* 国际化处理： 库存组织*/,
			refPath: 'org/StockOrgGridRef/index.js',
			queryGridUrl: '/nccloud/uapbd/org/StockOrgGridRef.do'
		};
	};

	getAppname = () => {
		return getLangByResId(this, '4004POSITION-000021');
	};
}

PlanningPosition = createPage({
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
})(PlanningPosition);

ReactDOM.render(<PlanningPosition />, document.querySelector('#app'));
