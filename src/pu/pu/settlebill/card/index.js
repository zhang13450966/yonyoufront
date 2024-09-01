/**
 * 采购结算单维护
 */
import React, { Component } from 'react';
import { createPage, high, base } from 'nc-lightapp-front';
import buttonClickcontroller from './viewController/btnClickController';
import { pageInfoClick } from './btnClicks/index';
import initTemplate from './init/initTemplate';
import { URL, PAGECODE, BUTTON, STATUS, COMMON } from '../constance';
import { initLang } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import NCUploader from 'uap/common/components/NCUploader';
const { BillTrack } = high;
const { NCDiv } = base;
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';

class SettleBillCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(PAGECODE.cardhead);
		props.use.cardTable(PAGECODE.cardbody);
		this.cardsearchdata;
		this.state = {
			materiels: [],
			tableId: PAGECODE.cardbody,
			status: this.getPageParam(STATUS.status),
			vbillcode: '', //结算单编号
			pk_settlebill: '', //主键
			buttons: '', //按钮组
			pk: '',
			billID: '',
			showTrack: false,
			target: null, //弹出的上传控件一target位置为基准，不传默认页面正中央
			showUploader: false //控制弹框
		};
		initLang(this, [ '4004settlebill' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		pageInfoClick.call(this, this.props);
	}

	onHideUploader = () => {
		this.setState({ showUploader: false });
	};

	back() {
		this.props.pushTo(URL.gotoList, { pagecode: PAGECODE.pagecode });
	}

	//获取url的参数
	getPageParam = (key) => {
		return this.props.getUrlParam(key);
	};

	/**
	 * 创建云原生错误异常界面
	 */
	creatSocketErrorShow = (socket) => {
		return (
			<div>
				{socket.connectMesg({
					headBtnAreaCode: PAGECODE.cardhead, // 表头按钮区域ID
					formAreaCode: PAGECODE.cardhead, // 表头Form区域ID
					billpkname: 'pk_settlebill',
					billtype: '27',
					dataSource: COMMON.settlebillCacheKey
				})}
			</div>
		);
	};

	render() {
		const { cardTable, form, cardPagination, ncmodal, socket } = this.props;
		const { createForm } = form;
		const { createModal } = ncmodal;
		const { createCardPagination } = cardPagination;
		const { createCardTable } = cardTable;
		let { showUploader, target } = this.state;
		const { NCAffix } = base;
		return (
			<div className="nc-bill-card" id="pu_PoOrderCard_Page">
				{/* 创建云原生错误异常界面 */}
				{this.creatSocketErrorShow(socket)}
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号
									backBtnClick: this.back.bind(this)
								})}
							</div>
							{/* 表头按钮区 */}
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: buttonClickcontroller.bind(this)
								})}
							</div>
							{/* 上一页/下一页 */}
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									dataSource: COMMON.settlebillCacheKey
								})}
							</div>
						</NCDiv>
					</NCAffix>

					<div className="bc-bill-form-area">
						{createForm(PAGECODE.cardhead, { expandArr: [ PAGECODE.cardhead ] })}
					</div>
				</div>
				<div className="nc-bill-bottom-area">
					<div className="nc-bill-table-area">
						{/* 结算单详情 */}
						{createCardTable(PAGECODE.cardbody, {
							showIndex: true,
							adaptionHeight: true,
							hideSwitch: () => {
								return false;
							} //隐藏全表展开按钮
						})}
					</div>
				</div>
				<BillTrack
					show={this.state.showTrack}
					close={() => {
						this.setState({ showTrack: false });
					}}
					pk={this.state.pk}
					type="27"
				/>
				{showUploader && (
					<NCUploader
						billId={this.state.billID}
						target={target}
						placement={''}
						onHide={this.onHideUploader}
					/>
				)}
				{createModal(BUTTON.del)}
			</div>
		);
	}
}

SettleBillCard = createPage(
	{
		// initTemplate: initTemplate
	}
)(SettleBillCard);

export default SettleBillCard;
