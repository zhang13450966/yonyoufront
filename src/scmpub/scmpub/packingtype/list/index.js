/*
 * 包装分类
 * @Author: zhngzh 
 * @Date: 2019-04-26 15:47:12 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-03-15 16:04:57
 */
import React, { Component } from 'react';
import { createPage, base, getBusinessInfo } from 'nc-lightapp-front';
import { PAGECODE, BUTTONAREA, PAGEAREA, UISTATE, FIELDS } from './constance';
import { initTemplate } from './init';
import { btnClick } from './btnClicks';
import { buttonController } from './viewController';
import { afterEvent } from './events';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCAffix, NCDiv } = base;
class PackType extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(PAGEAREA.list);
		this.state = {
			status: UISTATE.browse //是否是编辑态
		};
		initLang(this, [ '4001packingtype' ], 'scmpub', initTemplate.bind(this, this.props));
	}
	// 渲染页面前，执行
	componentWillMount() {
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGEAREA.list) || UISTATE.browse;
			if (status == 'edit') {
				return getLangByResId(this, '4008LOCADJUST-000010'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}
	/**
	 * 增行默认值
	 */
	addRowDefaultValue() {
		return {
			pk_group: { display: getBusinessInfo().groupName, value: getBusinessInfo().groupId }
		};
	}
	render() {
		const { editTable, button } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							{/*国际化处理： 包装分类*/}
						</div>
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREA.list_head,
								onButtonClick: btnClick.bind(this),
								ignoreHotkeyCode: [ 'Delete' ]
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-table-area">
					{createEditTable(PAGEAREA.list, {
						showCheck: true,
						showIndex: true,
						isAddRow: false,
						addRowDefaultValue: this.addRowDefaultValue.bind(this),
						onAfterEvent: afterEvent.bind(this),
						onSelected: buttonController.bind(this, this.props, true),
						onSelectedAll: buttonController.bind(this, this.props, true),
						pkname: FIELDS.pk_cpackingid,
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}
PackType = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: {
			[PAGEAREA.list]: 'editTable'
		}
	}
})(PackType);
export default PackType;
