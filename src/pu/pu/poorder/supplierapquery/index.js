/*
 * @Author: zhaochyu
 * @PageInfo: 供应商应付
 * @Date: 2019-04-16 14:24:11
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-08-12 16:31:32
 */
import React, { Component } from 'react';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal } = base;
import { initTemplate } from './init';
import { URL, SUPPLIERAP } from '../constance';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
class SupplierApQuery extends Component {
	constructor(props) {
		super(props);
		props.use.table(SUPPLIERAP.TABLEID);
		this.state = {
			queryDataFlag: false
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
		if (nextProps && nextProps.supplierapdata != null && nextProps.showModal) {
			this.model.param = nextProps.supplierapdata;
			this.queryData(this.model.param);
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (param) => {
		ajax({
			url: URL.supplierap,
			data: param,
			success: (res) => {
				let { data } = res;
				if (data) {
					this.props.table.setAllTableData(SUPPLIERAP.TABLEID, data[SUPPLIERAP.TABLEID]);
				}
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
					fieldid="po_aupplierapquery"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000114')}</NCModal.Title>
						{/* 国际化处理： 应付款*/}
					</NCModal.Header>
					<NCModal.Body className="flex-container">
						{createSimpleTable(SUPPLIERAP.TABLEID, {
							showIndex: true
						})}
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (SupplierApQuery = createPage({})(SupplierApQuery));
