import React, { Component } from 'react';
import { createPage, base } from 'nc-lightapp-front';
import { PAGECODE, BUTTON, STATUS, OrderCache } from '../constance';
import { afterEvent } from './afterEvents';
import { beforeEvent } from './beforeEvents';
import { commitBtnClick, saveAndCommitBtnClick } from './btnClicks';
import initTemplate from './init/initTemplate';
import { btnClick, pageInfoClick, rowClick } from './btnClicks';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { createCardTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import './index.less';
const { NCAffix, NCDiv } = base;
class PrinceStlCard extends Component {
	constructor(props) {
		super(props);
		props.use.form(PAGECODE.cardhead);
		props.use.cardTable(PAGECODE.cardbody);
		props.use.cardTable(PAGECODE.cardbodyano);
		this.curindex = 0;
		this.meta;
		this.skipCodes = [];
		this.state = {
			status: this.getPageParam(STATUS.status),
			fbillstatus: '', //单据状态
			compositedisplay: false, //指派参数
			compositedata: null, //指派
			dbaseprice: '', //基准含税单价
			vschemefrmlname: '', //总公式
			nschemecalvalue: '', //总计算结果
			saveAndCommit: false
		};
		initLang(this, [ '4004pricestl' ], 'pu', initTemplate.bind(this, this.props));
	}
	componentDidMount() {}
	//获取url的参数
	getPageParam = (key) => {
		return this.props.getUrlParam(key);
	};
	// 提交指派
	getAssginUsedr = (value) => {
		//判断是提交动作还是保存提交动作
		if (this.state.saveAndCommit == true) {
			saveAndCommitBtnClick.call(this, this.props, this.skipCodes, value);
		} else {
			commitBtnClick.call(this, this.props, value);
		}
		this.setState({ compositedisplay: false, saveAndCommit: false });
		// //重新执行提交操作重新执行提交操作
		// commit.call(this, this.props, value);
		// this.setState({ compositedisplay: false });
	};
	getMeterial = () => {
		let { dbaseprice, vschemefrmlname, nschemecalvalue } = this.state;
		return (
			<div className="table-head-info nc-theme-area-bgc">
				<span className="nc-theme-common-font-c">
					{getLangByResId(this, '4004PRICESTL-000037')}
					<span className="nc-theme-common-font-c">{dbaseprice}</span>
				</span>
				<span className="nc-theme-common-font-c">
					{getLangByResId(this, '4004PRICESTL-000038')}
					<span className="nc-theme-common-font-c">{vschemefrmlname}</span>
				</span>
				<span className="nc-theme-common-font-c">
					{getLangByResId(this, '4004PRICESTL-000039')}
					<span className="nc-theme-common-font-c">{nschemecalvalue}</span>
				</span>
			</div>
		);
	};
	render() {
		const { cardTable, form, cardPagination, transferTable } = this.props;
		const { createForm } = form;
		const { createBillHeadInfo } = this.props.BillHeadInfo;
		const { createTransferList } = transferTable;
		const { createCardPagination } = cardPagination;
		const { createCardTable } = cardTable;
		return (
			<div className="nc-bill-extCard-2">
				<div className="nc-bill-top-area">
					<NCAffix>
						<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
							<div className="header-title-search-area">
								{createCardTitle(this, {
									billCode: '', //单据号单据号
									backBtnClick: btnClick.bind(this, this.props, BUTTON.Back)
								})}
							</div>
							<div className="header-button-area">
								{this.props.button.createButtonApp({
									area: PAGECODE.cardhead,
									onButtonClick: btnClick.bind(this)
								})}
							</div>
							<div className="header-cardPagination-area">
								{createCardPagination({
									handlePageInfoChange: pageInfoClick.bind(this),
									// urlPkname: 'id'
									dataSource: OrderCache.OrderCacheKey
								})}
							</div>
						</NCDiv>
					</NCAffix>
					{/* 表头区 采购订单*/}
					<div className="bc-bill-form-area">
						{createForm(PAGECODE.cardhead, {
							expandArr: [ PAGECODE.cardhead ],
							onAfterEvent: afterEvent.bind(this),
							onBeforeEvent: beforeEvent.bind(this)
						})}
					</div>
				</div>
				{/* 订单详情 */}
				<div className="nc-bill-table-area">
					{createCardTable(PAGECODE.cardbody, {
						showIndex: true,
						tableHeadLeft: this.getMeterial.bind(this), //物料详情
						onRowClick: rowClick.bind(this), //单击行钩子函数
						onAfterEvent: afterEvent.bind(this)
						// adaptionHeight: true
					})}
				</div>
				{/* 提交指派 */}
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004PRICESTL-000016')} /* 国际化处理： 指派*/ /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr.bind(this)}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
				<div className="nc-bill-tableTab-area">
					{createCardTable(PAGECODE.cardbodyano, {
						showIndex: true,
						onAfterEvent: afterEvent.bind(this),
						adaptionHeight: true
					})}
				</div>
			</div>
		);
	}
}
// }
PrinceStlCard = createPage({
	billinfo: {
		billtype: 'extcard', //一主多子
		pagecode: PAGECODE.cardcode,
		headcode: PAGECODE.cardhead,
		bodycode: [ PAGECODE.cardbody, PAGECODE.cardbodyano ]
	}
})(PrinceStlCard);
export default PrinceStlCard;
