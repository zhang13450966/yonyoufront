/*
 * 促销类型定义
 * @Author: liangzhyf 
 * @Date: 2019-04-15 14:21:59 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-13 13:52:05
 */
import ReactDOM from 'react-dom';
import { initTemplate } from './init';
import { btnClick } from './btnClicks';
import React, { Component } from 'react';
import { setButtonsEnable } from './viewController';
import { PAGECODE, AREA, UISTATE } from './constance';
import { createPage, base } from 'nc-lightapp-front';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
const { NCAffix, NCDiv } = base;
export default class Promottype extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(AREA.tableArea);
		this.state = {
			status: UISTATE.browse //是否是编辑态
		};
		initLang(this, [ '4001promottype' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	// 渲染页面前，执行
	componentWillMount() {
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(AREA.tableArea);
			if (status && status == UISTATE.edit) {
				return getLangByResId(this, '4008LOCADJUST-000010');
			}
		};
	}

	render() {
		const { button, editTable } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{/*国际化处理： 促销类型定义*/}
							{createListTitle(this)}
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: AREA.list_head,
								onButtonClick: btnClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 列表区 */}
				<div className="nc-bill-table-area">
					{createEditTable(AREA.tableArea, {
						showIndex: true,
						showCheck: true,
						isAddRow: true,
						adaptionHeight: true,
						onSelected: setButtonsEnable.bind(this, this.props, true),
						onSelectedAll: setButtonsEnable.bind(this, this.props, true)
					})}
				</div>
			</div>
		);
	}
}

Promottype = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: AREA.tableArea
	}
})(Promottype);

ReactDOM.render(<Promottype />, document.querySelector('#app'));
