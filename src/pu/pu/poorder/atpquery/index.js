/*
 * @Author: CongKe
 * @PageInfo: 存量查询模态框
 * @Date: 2018-06-28 09:15:54
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:24:37
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal } = base;
import { initTemplate } from './init';
import { URL, STOCKQUERY } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';

class StockQuery extends Component {
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
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
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
					rowsData = data[STOCKQUERY.TABLEID];
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
					fieldid="po_stockquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000009')}</NCModal.Title>
						{/* 国际化处理： 存量查询*/}
					</NCModal.Header>
					<NCModal.Body className="flex-container">
						{createSimpleTable(STOCKQUERY.TABLEID, {
							showIndex: true
						})}
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (StockQuery = createPage({})(StockQuery));
