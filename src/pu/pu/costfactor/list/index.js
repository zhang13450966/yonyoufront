/*
 * @Author: zhaochyu
 * @PageInfo: 采购成本要素定义列表态
 * @Date: 2018-05-28 14:54:18
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-11 12:03:44
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PAGECODE, UISTATE, URL } from '../constance';
import { createPage, ajax, createPageIcon, base } from 'nc-lightapp-front';
import { buttonClick, simpleClick } from './btnClicks';
import { initTemplate } from './init';
import { afterEvent } from '../afterEvents';
import { bodybeforeEvent, headbeforeEvent } from '../beforeEvent';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { NCDiv, NCAffix } = base;
class Costfactor extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(PAGECODE.headId);
		props.use.editTable(PAGECODE.bodyId);
		this.state = {
			status: UISTATE.browse,
			editNum: '0',
			clickNum: '0',
			flag: '2',
			pk_org: '',
			statusflag: '',
			editflag: ''
		};
		initLang(this, [ '4004costfactor' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {
		this.getData();
		// 关闭浏览器
		window.onbeforeunload = () => {
			let status = this.props.editTable.getStatus(PAGECODE.bodyId) || UISTATE.browse;
			if (status == 'edit') {
				return getLangByResId(this, '4004COSTFACTOR-000017'); /* 国际化处理： 当前单据未保存，您确认离开此页面？*/
			}
		};
	}

	toggleShow = () => {
		let status = this.state.status;
		let flag = status == UISTATE.browse ? false : true;
		this.props.button.setButtonVisible([ 'Add', 'Refresh' ], !flag);
		this.props.button.setButtonVisible([ 'Save', 'Cancel' ], flag);
		this.props.editTable.setStatus(PAGECODE.headId, status);
		this.props.editTable.setStatus(PAGECODE.bodyId, status);
	};
	getData = () => {
		ajax({
			url: URL.listHeadQuery,
			data: { pagecode: PAGECODE.listpagecode },
			success: (res) => {
				let { success, data } = res;
				if (success) {
					if (data && data.list_head && data.list_head.list_head) {
						this.props.editTable.setTableData(PAGECODE.headId, data.list_head.list_head);
						this.props.editTable.focusRowByIndex(PAGECODE.headId, 0);
					}
					if (data && data.list_body && data.list_body.list_body) {
						this.props.editTable.setTableData(PAGECODE.bodyId, data.list_body.list_body);
					}
				}
			}
		});
	};
	render() {
		let { editTable, DragWidthCom, BillHeadInfo } = this.props;
		let { createEditTable } = editTable;
		const { createBillHeadInfo } = BillHeadInfo;
		return (
			<div className="nc-bill-list flex-container" id="costfactor-page">
				<NCAffix>
					<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
						<div className="header-title-search-area">
							{createListTitle(this)}
							{/* 国际化处理： 采购成本要素定义*/}
						</div>
						<div className="header-button-area">
							{this.props.button.createButtonApp({
								area: PAGECODE.headId,
								onButtonClick: buttonClick.bind(this)
							})}
						</div>
					</NCDiv>
				</NCAffix>
				{/* 列表区 */}
				<div className="castfactor-dragwidthcom flex-container nc-bill-table-area">
					<DragWidthCom
						defLeftWid={'65%'}
						leftMinWid={'50%'}
						leftDom={createEditTable(PAGECODE.headId, {
							showIndex: true,
							adaptionHeight: true,
							onRowClick: simpleClick.bind(this),
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: headbeforeEvent.bind(this)
						})}
						rightDom={createEditTable(PAGECODE.bodyId, {
							//handlePageInfoChange: pageInfoClick,
							adaptionHeight: true,
							showIndex: true,
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: bodybeforeEvent.bind(this)
						})}
					/>
				</div>
			</div>
		);
	}
}

let List = createPage({
	billinfo: {
		billtype: 'card',
		pagecode: PAGECODE.listpagecode,
		headcode: PAGECODE.headId,
		bodycode: {
			[PAGECODE.bodyId]: 'cardTable' //此处发生变化了，需要传一个对象
		}
	}
})(Costfactor);

ReactDOM.render(<List />, document.querySelector('#app'));
