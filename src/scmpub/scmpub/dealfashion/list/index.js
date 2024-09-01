/*
 * @Author: lichao 
 * @PageInfo: 处理方式 
 * @Date: 2019-03-12 15:57:54 
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-13 13:50:15
 */
import React, { Component } from 'react';
import { createPage, base, getBusinessInfo } from 'nc-lightapp-front';
const { NCAffix, NCDiv } = base;
import { buttonClick } from './btnClicks';
import { STATUS, AREACODE, BUTTONAREACODE, BUTTONS, PAGECODE } from '../constance';
import { initTemplate } from './init';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
class DealFashion extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(AREACODE);
		initLang(this, [ '4001dealfashion' ], 'scmpub', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		//关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(AREACODE);
			status = status == STATUS.browse ? STATUS.browse : STATUS.edit;
			if (status === STATUS.edit) {
				return getLangByResId(this, '4001DEALFASHION-000004'); /* 国际化处理： 当前单据未保存，您确认离开此页面?*/
			}
		};
	}

	selectedChange(props, moduleId, newVal, oldVal) {
		if (newVal == 0) {
			props.button.setButtonDisabled([ BUTTONS.Delete ], true);
		} else {
			props.button.setButtonDisabled([ BUTTONS.Delete ], false);
		}
	}

	addRowDefaultValue() {
		let businessInfo = getBusinessInfo();
		return {
			pk_group: { value: businessInfo.groupId, display: businessInfo.groupName }
		};
	}
	render() {
		const { editTable, button } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		return (
			<div id="saleinvoice-list">
				<div className="nc-bill-list">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createListTitle(this)}
								{/* 国际化处理： 处理方式*/}
							</div>
							{/* 按钮区 */}
							<div className="header-button-area">
								{createButtonApp({
									area: BUTTONAREACODE.listHead,
									onButtonClick: buttonClick.bind(this)
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头区 */}
					<div className="nc-bill-table-area">
						{createEditTable(AREACODE, {
							isAddRow: true,
							showCheck: true,
							showIndex: true,
							adaptionHeight: true,
							addRowDefaultValue: this.addRowDefaultValue.bind(this),
							selectedChange: this.selectedChange.bind(this)
							//onAfterEvent: AfterEvent.bind(this),
							//onSelected: setButtonUsability.bind(this, this.props, true, null, false),
							//onSelectedAll: setButtonUsability.bind(this, this.props, true, null, false),
							//onBeforeEvent: beforeEvent.bind(this),
							//isAddRow: true
						})}
					</div>
				</div>
			</div>
		);
	}
}

DealFashion = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: AREACODE
	}
})(DealFashion);

export default DealFashion;
