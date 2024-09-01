/*
 * @Author: jiangfw
 * @PageInfo: 存量查询
 * @Date: 2018-06-28 09:15:54
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:42:44
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal } = base;
import { initTemplate } from './init';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { AREA, URL } from './constance/constance';

class StockQuery extends Component {
	constructor(props) {
		super(props);
		props.use.table(AREA.head);
		this.state = {
			queryDataFlag: false
		};
		initLang(this, [ '4004stockquery' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.queryDataFlag) {
			this.setState({
				queryDataFlag: false
			});
			return;
		}
		if (nextProps && nextProps.stockquerydata != null && nextProps.showModal) {
			this.queryData(nextProps.stockquerydata);
		}
	}

	//查询数据
	queryData = (param) => {
		ajax({
			url: URL.stockquery,
			data: param,
			success: (res) => {
				let { success, data } = res;
				let rowsData = { rows: [] };
				if (data) {
					//初始化模型
					rowsData = data[AREA.head];
				}
				this.setState(
					{
						queryDataFlag: true
					},
					() => {
						this.props.table.setAllTableData(AREA.head, rowsData);
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
					fieldid="pub_stockquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004STOCKQUERY-000001') /* 国际化处理： 存量查询*/}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div className="nc-bill-table-area">
							{/* 列表区域 */}
							{createSimpleTable(AREA.head, {
								adaptionHeight: false,
								showIndex: true
							})}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (StockQuery = createPage({})(StockQuery));
