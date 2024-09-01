/*
 * @Author: xiahui 
 * @PageInfo: 横向多页签组件
 * @Date: 2019-04-26 15:32:39 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-03-09 15:39:15
 */
import React, { Component } from 'react';
import { base, createPage } from 'nc-lightapp-front';
import { initTemplate } from './init';

const { NCModal, NCTabs } = base;
const { Header, Title, Body } = NCModal;
const { NCTabPane } = NCTabs;

class MulTabPane extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(this.props.headcode);

		this.state = {
			bodyname: []
		};

		this.props.bodycode.map((code, index) => {
			props.use.editTable(code);
		});
		
	}

	componentWillMount(){
		initTemplate.call(this, this.props);
	}

	componentWillReceiveProps(nextProps) {
		let { show, data, headcode, showBodyData } = nextProps;
		if (show && data) {
			// 初始化表头数据
			let rows = [];
			data.map((card) => {
				rows.push(card.head[headcode].rows[0]);
			});
			this.props.editTable.setTableData(headcode, { rows: rows });
			//销售合同默认显示表体数据
			if (showBodyData) {
				this.onRowClick.call(this, nextProps, headcode, undefined, 0);
			}
		}
	}

	onRowClick = (props, moduleId, record, index) => {
		let { data, bodycode } = props;
		// 设置表体数据
		bodycode.map((code) => {
			props.editTable.setTableData(code, { rows: [] });
			props.editTable.setTableData(code, data[index].bodys[code]);
		});
	};

	render() {
		const { editTable } = this.props;
		const { createEditTable } = editTable;
		let { show, title, headcode, bodycode } = this.props;
		

		return (
			<div>
				<NCModal id="tabpane" size="xlg" show={show} onHide={this.props.close}>
					<Header closeButton>
						<Title>{title}</Title>
					</Header>
					<Body>
						<div style={{ display: "flex", height: "100%", "flex": "auto", "flex-direction": "column" }}>
							<div style={{ display: "flex", height: 240 }}>
								{createEditTable(headcode, {
									adaptionHeight: true,
									onRowClick: this.onRowClick.bind(this),
									onRowDoubleClick: this.onRowClick.bind(this, this.props, headcode)
								})}
							</div>

							<NCTabs
								fieldid="tabs-area"
								navtype="turn"
								contenttype="moveleft"
								defaultActiveKey={bodycode[0]}
								flex={true}
							>
								{bodycode.map((code, index) => {
									return (
										<NCTabPane tab={this.state.bodyname[index]} key={code} fieldid={code + '_tab'}>
											{createEditTable(code, {
												adaptionHeight: true
											})}
										</NCTabPane>
									);
								})}
							</NCTabs>
						</div>
					</Body>
				</NCModal>
			</div>
		);
	}
}

export default (MulTabPane = createPage({})(MulTabPane));
