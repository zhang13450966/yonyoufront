/*
 * @Author: hufeim 
 * @Description: 里程碑采购进度看板  
 * @Date: 2022-01-20 14:28:42 
 * @Last Modified by: tianzhyw
 * @Last Modified time: 2022-02-17 16:26:21
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createPage, base, createPageIcon, ajax } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import MilestoneOrder from '../components/MilestoneOrder';
import ShowSetting from '../components/ShowSetting';
import { clickSearchBtn, clickRefreshBtn } from './btnClicks';
import { initTemplate } from './init';
import { AREA, URL, FIELD } from '../constance';
import './index.less';
let { NCButton: Button, NCDiv, NCTooltip } = base;

export default class MilestoneBoard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displayFields: [ 'vbillcode', 'pk_supplier', 'ntotalastnum', 'ntotalorigmny' ],
			orders: [], // 查询回来的全部数据
			renderOrders: [], // 前端进行数据分页, 当前页面渲染的部分数据
			pageSize: 30, // 每页渲染的条数
			pageIndex: 0 // 当前渲染的页数
		};
		initLang(this, [ '4004milestoneboard' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {
		this.getDisplayFields();
		this.scrollEvent();
	}

	// 从后台读取用户设置的显示字段
	getDisplayFields = () => {
		ajax({
			url: URL.querySetting,
			loading: false,
			success: ({ data }) => {
				if (data !== '') {
					this.setState({
						displayFields: data.split(',')
					});
				}
			}
		});
	};

	renderCompleteEvent = () => {
		let pk_org = this.props.search.getSearchValByField(AREA.searchArea, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.pk_org, arr);
		}
	};

	// 查询区编辑后
	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			multiCorpRefHandler(props, val, AREA.searchArea, [
				FIELD.cvendorid,
				FIELD.billmaker,
				FIELD.cemployeeid,
				FIELD.pk_dept,
				FIELD.vordertrantype
			]);
		}
	}

	showSetting = () => {
		this.props.modal.show('setting');
	};

	setDisplayFields = (fields) => {
		this.setState({ displayFields: fields });
		ajax({
			url: URL.saveSetting,
			loading: false,
			data: {
				board_detail: fields.join(',')
			},
			success: (res) => console.log(res)
		});
	};

	loadPageOrder = () => {
		let { pageSize, pageIndex, renderOrders, orders } = this.state;
		let from = pageSize * pageIndex,
			to = pageSize * (pageIndex + 1);
		this.setState({
			renderOrders: [ ...renderOrders, ...orders.slice(from, to) ],
			pageIndex: pageIndex + 1
		});
	};

	scrollEvent = () => {
		let loadMore = document.querySelector('.scroll-to-load');
		this.chartArea.addEventListener('scroll', () => {
			let { top } = loadMore.getBoundingClientRect();
			if (top - window.innerHeight < 500) {
				this.loadPageOrder();
			}
		});
	};

	render() {
		let { displayFields, renderOrders, orders } = this.state;
		let { NCCreateSearch } = this.props.search;

		return (
			<div id="milestone-board-page">
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						<div className="BillHeadInfoWrap">
							{createPageIcon()}
							{/* 国际化处理：里程碑采购进度看板*/}
							<span className="bill-info-title">{getLangByResId(this, '4004MILESTONEBOARD-000001')}</span>
						</div>
						{/* 国际化处理：进度%=累计执行数量/总数量 */}
						<NCTooltip overlay={getLangByResId(this, '4004MILESTONEBOARD-000002')} className="title-tip">
							<i className="iconfont icon-bangzhutishi" />
						</NCTooltip>
					</div>
					<div className="header-button-area">
						<div className="button-app-wrapper">
							<Button className="refresh-component" onClick={this.showSetting}>
								<NCTooltip
									overlay={getLangByResId(this, '4004MILESTONEBOARD-000003')} // 国际化处理：显示设置
									placement="bottom"
									delay="500"
								>
									<i className="iconfont icon-shezhi1" />
								</NCTooltip>
							</Button>
							<Button className="refresh-component" onClick={clickRefreshBtn.bind(this)}>
								<i className="iconfont refreshIcon icon-shuaxin1" />
							</Button>
						</div>
					</div>
				</NCDiv>

				<div className="search-area">
					{NCCreateSearch(AREA.searchArea, {
						clickSearchBtn: () => clickSearchBtn.call(this, false),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent
					})}
				</div>

				<div className="chart-area" ref={(dom) => (this.chartArea = dom)}>
					<div className={`no-data-placeholder${renderOrders.length > 0 ? ' hide' : ''}`}>
						<div className="no-data" />
						{/* 国际化处理：暂无数据 */}
						<span className="no-data-title">{getLangByResId(this, '4004MILESTONEBOARD-000024')}</span>
					</div>
					{renderOrders.map((order) => {
						return <MilestoneOrder order={order} displayFields={displayFields} />;
					})}
					<div
						className={`scroll-to-load${renderOrders.length >= orders.length ? ' hide' : ''}`}
						onClick={this.loadPageOrder}
					>
						{getLangByResId(this, '4004MILESTONEBOARD-000027')}
						{/* 国际化处理：加载下一页 */}
					</div>
				</div>
				<ShowSetting
					createModal={this.props.modal.createModal}
					displayFields={displayFields}
					setDisplayFields={this.setDisplayFields}
				/>
			</div>
		);
	}
}
MilestoneBoard = createPage({})(MilestoneBoard);
ReactDOM.render(<MilestoneBoard />, document.querySelector('#app'));
