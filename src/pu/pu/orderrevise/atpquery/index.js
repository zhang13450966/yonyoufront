/*
 * @Author: CongKe
 * @PageInfo: 存量查询模态框
 * @Date: 2018-06-28 09:15:54
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-15 11:33:25
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal, NCDiv } = base;
import { initTemplate } from './init';
import { URL, STOCKQUERY } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class StockQuerys extends Component {
	constructor(props) {
		super(props);
		props.use.table(STOCKQUERY.TABLEID);
		this.state = {
			pk: null,
			queryDataFlag: false
		};
		//前端模型
		this.model = {
			context: null,
			param: null,
			currentIndex: 0
		};
		// initTemplate.call(this, props);
		initLang(this, [ '4004orderrevise' ], 'pu', initTemplate.call(this, this.props));
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.queryDataFlag) {
			this.setState({
				queryDataFlag: false
			});
			return;
		}
		if (nextProps && nextProps.stockquerydata != null && nextProps.showModal) {
			this.model.param = nextProps.stockquerydata;
			this.queryData(this.model.param);
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (param) => {
		ajax({
			url: URL.stockquery,
			data: param,
			success: (res) => {
				let { success, data } = res;
				let rowsData = { rows: [] };
				if (data) {
					//初始化模型
					rowsData = data[STOCKQUERY.TABLEID] || data.list_head;
				}
				this.setState(
					{
						queryDataFlag: true
					},
					() => {
						this.props.table.setAllTableData(STOCKQUERY.TABLEID, rowsData);
					}
				);
			}
		});
	};

	render() {
		const { createSimpleTable } = this.props.table;
		return (
			<div>
				<NCModal
					id="to"
					size="xlg"
					zIndex="212"
					show={this.props.showModal}
					onHide={this.props.onClose}
					fieldid="orderreviseatpquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004ORDERREVISE-000000')}</NCModal.Title>
						{/* 国际化处理： 存量查询*/}
					</NCModal.Header>
					<NCModal.Body className="flex-container">
						{/* 列表区域 */}
						{createSimpleTable(STOCKQUERY.TABLEID, {
							showIndex: true
						})}
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (StockQuerys = createPage({})(StockQuerys));
