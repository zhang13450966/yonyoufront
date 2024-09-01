/*
 * @Author: wangceb 
 * @PageInfo: 费用兑付明细 公共组件
 * @Date: 2018-04-04 13:10:26 
 * @Last Modified by: guozhq
 * @Last Modified time: 2021-01-13 13:06:25
 */

import React, { Component } from 'react';
import { createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { buttonClick, btn_Controller } from './btnClicks';
import { TRANSPORTSTATUS_CONST } from './const';
import './index.less';

class TransportStatusDlg extends Component {
	constructor(props) {
		super(props);
		props.use.table(TRANSPORTSTATUS_CONST.TABLEID);
		this.state = {};
		initTemplate.call(this, this.props);
	}

	render() {
		let { table } = this.props;
		let { createSimpleTable } = table;
		return (
			<div className="transport-status-dlg">
				<div className="transport-status-table flex-container">
					{createSimpleTable(TRANSPORTSTATUS_CONST.TABLEID, {
						showCheck: true,
						selectedChange: btn_Controller.bind(this),
						onSelectedAll: btn_Controller.bind(this),
						onSelected: btn_Controller.bind(this),
						inModal: true
					})}
				</div>
				<div className="transport-status-footer">
					{this.props.button.createButtonApp({
						area: 'list_bottom',
						onButtonClick: buttonClick.bind(this)
					})}
				</div>
			</div>
		);
	}
}

TransportStatusDlg = createPage({})(TransportStatusDlg);

export default TransportStatusDlg;
