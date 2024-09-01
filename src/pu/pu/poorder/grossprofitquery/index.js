/*
 * @Author: zhaochyu
 * @PageInfo: 采购订单毛利预估
 * @Date: 2019-04-15 13:13:19
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-15 14:19:20
 */
import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal } = base;
import { initTemplate } from './init';
import { URL, GROSSPROFITQUEYR } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';
class GrossProfitQuery extends Component {
	constructor(props) {
		super(props);
		props.use.form(GROSSPROFITQUEYR.GROSS_HEAD);
		props.use.table(GROSSPROFITQUEYR.GROSS_BODY);
		this.state = {
			pk: null,
			queryDataFlag: false,
			value: 7
		};
		//前端模型
		this.model = {
			context: null,
			param: null,
			currentIndex: 0
		};
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.queryDataFlag) {
			this.setState({
				queryDataFlag: false
			});
			return;
		}
		if (nextProps && nextProps.grossprofitdata != null && nextProps.showModal) {
			this.model.param = nextProps.grossprofitdata;
			this.queryData(this.model.param);
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (param) => {
		ajax({
			url: URL.grossprofit,
			data: param,
			success: (res) => {
				let { data } = res;
				//	let rowsData = { rows: [] };
				if (data) {
					//初始化模型
					//rowsData = data[GROSSPROFITQUEYR.GROSS_BODY];
					this.props.form.setAllFormValue({
						[GROSSPROFITQUEYR.GROSS_HEAD]: data.head[GROSSPROFITQUEYR.GROSS_HEAD]
					});
					this.props.table.setAllTableData(
						GROSSPROFITQUEYR.GROSS_BODY,
						data.body[GROSSPROFITQUEYR.GROSS_BODY]
					);
				}
			}
		});
	};
	onChange = (e) => {
		this.setState({ value: e });
	};

	render() {
		const { createSimpleTable } = this.props.table;
		const { createForm } = this.props.form;
		return (
			<div>
				<NCModal
					className="gross-profit-modal"
					size="xlg"
					zIndex="212"
					show={this.props.showModal}
					onHide={this.props.onClose}
					fieldid="po_grossprofitquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000113')}</NCModal.Title>
						{/* 国际化处理： 毛利预估*/}
					</NCModal.Header>
					<NCModal.Body className="flex-container">
						<div className="bc-bill-form-area">{createForm(GROSSPROFITQUEYR.GROSS_HEAD, {})}</div>
						<div className="nc-bill-table-area flex-container">
							{/* 列表区域 */}
							{createSimpleTable(GROSSPROFITQUEYR.GROSS_BODY, {
								showIndex: true
							})}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (GrossProfitQuery = createPage({})(GrossProfitQuery));
