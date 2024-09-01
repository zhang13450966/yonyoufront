/*
 * @Author: zhaochyu
 * @PageInfo: 销量查询模态框
 * @Date: 2019-04-09 14:08:13
 * @Last Modified by: guoylei
 * @Last Modified time: 2022-04-22 20:26:50
 */
import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal, NCFormControl, NCButton, NCDiv, NCHotKeys } = base;
import { initTemplate } from './init';
import { URL, SALESQUERY } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import './index.less';

class SalesQuery extends Component {
	constructor(props) {
		super(props);
		props.use.table(SALESQUERY.TABLEID);
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
		if (nextProps && nextProps.salesquerydata != null && nextProps.showModal) {
			this.model.param = nextProps.salesquerydata;
			this.queryData(this.model.param);
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (param) => {
		ajax({
			url: URL.salesquery,
			data: param,
			success: (res) => {
				let { data } = res;
				if (data) {
					//初始化模型
					let rowsData = data[SALESQUERY.TABLEID];
					this.props.table.setAllTableData(SALESQUERY.TABLEID, rowsData);
				}
			}
		});
	};

	onChange = (e) => {
		this.setState({ value: e });
	};

	handleClick = (a) => {
		let re = /^[0-9]*[1-9][0-9]*$/;
		if (!re.test(this.state.value)) {
			showWarningInfo(null, getLangByResId(this, '4004POORDER-000118'));
			return;
		}
		let querydata = this.model.param;
		querydata.infos.map((item) => {
			item.iqueryday = this.state.value;
		});
		this.queryData(querydata);
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
					fieldid="po_salesqquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000109')}</NCModal.Title>
						{/* 国际化处理： 平均销售量查询*/}
					</NCModal.Header>
					<NCModal.Body className="flex-container">
						<NCDiv areaCode="SEARCH" fieldid="salequery">
							<span className="day-input">
								{getLangByResId(this, '4004POORDER-000110')}
								<NCFormControl
									value={this.state.value}
									onChange={this.onChange}
									// type="number"
									// min="0"
									// step="1"
								/>
								{getLangByResId(this, '4004POORDER-000111')}
								{/* 国际化处理： 最近几天销量*/}
							</span>
							<NCHotKeys
								keyMap={{
									editActionSign: [ 'enter' ]
								}}
								handlers={{
									editActionSign: (e, ...others) => {
										this.handleClick.bind(this)();
									}
								}}
								// 是否启用组件
								enabled={true}
								// 是否为聚焦触发
								focused={true}
								// 默认display 可以设置 inline-block 等dispaly属性
								display="inline-block"
							>
								<NCButton
									fieldid="poordersalequery_btn"
									shape="border"
									colors="primary"
									onClick={this.handleClick}
								>
									{getLangByResId(this, '4004POORDER-000112')}
								</NCButton>
							</NCHotKeys>
						</NCDiv>
						<div className="flex-container">
							{/* 列表区域 */}
							{createSimpleTable(SALESQUERY.TABLEID, {
								showIndex: true
							})}
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (SalesQuery = createPage({})(SalesQuery));
