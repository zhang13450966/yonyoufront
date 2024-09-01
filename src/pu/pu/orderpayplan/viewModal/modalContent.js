/*
 * @Author: heyfn
 * @Description: 付款计划弹框内容组件
 * @Date: 2022-01-21 10:18:35
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-06-09 11:39:57
 */
import React, { Component, Fragment } from 'react';
import { PAGECODE } from '../constance/index';
import { onSelect } from './viewControl/payPlanItemClick';
import initTemplate from './init/initTemplate';
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

let showFlag = false;
class ModalContent extends Component {
	constructor(props) {
		super(props);
		this.showFlag = showFlag;
		props.use.table(PAGECODE.itemBodyCode);
		props.use.table(PAGECODE.itemConfirmBodyCode);
		initLang(this, [ '4004payplan' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillUnmount() {
		let tableDatas = this.props.table.getAllTableData(PAGECODE.itemBodyCode);
		if (!(tableDatas && tableDatas.rows && tableDatas.rows.length > 0)) {
			showFlag = false;
		}
	}

	setShowFlag = () => {
		showFlag = true;
	};
	render() {
		let { table } = this.props;
		let { createSimpleTable } = table;
		return (
			<div className="flex-container" style={{ height: '100%' }}>
				<div className="top-table">
					{createSimpleTable(PAGECODE.itemBodyCode, {
						showCheck: false,
						adaptionHeight: false, //适配行高
						height: 200,
						showIndex: true,
						onRowClick: onSelect.bind(this)
					})}
				</div>
				<div className="bottom-table flex-container" style={{ marginTop: 10 }}>
					{createSimpleTable(PAGECODE.itemConfirmBodyCode, {
						showCheck: false,
						adaptionHeight: true, //适配行高
						showIndex: true
					})}
				</div>
			</div>
		);
	}
}
export default ModalContent;
