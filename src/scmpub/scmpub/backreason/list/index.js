/*
 * 退货理由设置
 * @Author: zhngzh 
 * @Date: 2019-04-16 10:04:07 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-03-26 16:02:15
 */
import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { initTemplate } from './init';
import { btnClick } from './btnClicks';
import { setButtonsEnable } from './viewController';
import bodyAfterEvent from './afterEvents/bodyAfterEvent';
import { PAGECODE, BUTTONAREA, PAGEAREA, UISTATE, FIELDS, BUTTONS } from './constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil';
const { NCAffix, NCDiv } = base;
class BackReason extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(PAGEAREA.list);
		this.state = {
			status: UISTATE.browse //是否是编辑态
		};
		initLang(this, [ '4001backreason' ], 'scmpub', initTemplate.bind(this, this.props));
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

	render() {
		// 主组织配置
		const { editTable, button } = this.props;
		const { createEditTable } = editTable;
		const { createButtonApp } = button;
		return (
			<div className="nc-bill-list">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">{createListTitle(this)}</div>
						<div className="header-button-area">
							{createButtonApp({
								area: BUTTONAREA.list_head,
								ignoreHotkeyCode: [ BUTTONS.Delete ],
								onButtonClick: btnClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				<div className="nc-bill-table-area">
					{createEditTable(PAGEAREA.list, {
						showCheck: true,
						showIndex: true,
						adaptionHeight: true,
						onAfterEvent: bodyAfterEvent.bind(this),
						onSelected: setButtonsEnable.bind(this, this.props, true),
						onSelectedAll: setButtonsEnable.bind(this, this.props, true),
						pkname: FIELDS.pk_backreason
					})}
				</div>
			</div>
		);
	}
}

BackReason = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE,
		bodycode: PAGEAREA.list
	}
})(BackReason);

export default BackReason;
