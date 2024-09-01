/*
 * @Author: CongKe
 * @PageInfo: 到货计划模态框
 * @Date: 2018-06-28 09:15:54
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-03-23 11:46:50
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { base, createPage, ajax } from 'nc-lightapp-front';
const { NCModal, NCDiv } = base;
import { initTemplate } from './init';
import { STATUS, LIST_BUTTON, URL, ARRIVEPLAN } from '../constance';
import { afterEvent } from './afterEvent';
import { beforeEvent } from './beforeEvents';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonClickController, buttonController, btnClickController } from './viewController/index';

class ArrivePlan extends Component {
	constructor(props) {
		super(props);
		props.use.editTable(ARRIVEPLAN.TABLEID);
		this.state = {
			state: STATUS.browse,
			pk_order: null,
			queryDataFlag: true
		};
		//前端模型 编辑前参数
		this.model = {
			pk_org: null,
			pk_customer: null,
			pk_supplier: null,
			context: null,
			pk_order: null,
			currentIndex: 0
		};
		initLang(this, [ '4004poorder' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillMount() {
		// 关闭浏览器
		window.addEventListener('beforeunload', this.handleBeforeUnload);
	}

	componentWillUnmount() {
		// 组件卸载时移除事件监听, 防止内存泄漏
		window.removeEventListener('beforeunload', this.handleBeforeUnload);
	}

	handleBeforeUnload = (event) => {
		this.setState({ queryDataFlag: true });
		let status = this.props.editTable.getStatus(ARRIVEPLAN.TABLEID);
		if (status == STATUS.edit) {
			event.returnValue = getLangByResId(this, '4004POORDER-000054');
		}
	};

	componentWillReceiveProps(nextProps) {
		if (this.props.showModal && nextProps.showModal && this.state.queryDataFlag) {
			let pk_order = nextProps.pk_order;
			if (pk_order) {
				this.model.pk_order = pk_order;
				this.model.pk_org = nextProps.pk_org;
				this.model.pk_customer = nextProps.pk_customer;
				this.model.pk_supplier = nextProps.pk_supplier;
				this.queryData(pk_order);
			}
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (pk_order) => {
		ajax({
			url: URL.arriveplanquery,
			data: {
				pks: [ pk_order ],
				pageid: ARRIVEPLAN.PAGECODE
			},
			success: (res) => {
				let { success, data } = res;
				let rowsData = { rows: [] };
				this.setState({ queryDataFlag: false });
				if (data) {
					rowsData = data[ARRIVEPLAN.TABLEID];
				}
				rowsData.rows.forEach((row) => {
					row.values.crownobb1.display = row.values.crownobb1.value;
				});
				this.props.editTable.setTableData(ARRIVEPLAN.TABLEID, rowsData);
				setTimeout(() => {
					buttonController.togglePageShow.call(this, this.props, STATUS.browse);
				}, 0);
			}
		});
		buttonController.initButtonVisible.call(this);
	};

	render() {
		const { createEditTable } = this.props.editTable;
		return (
			<div>
				<NCModal
					id="to"
					size="xlg"
					show={this.props.showModal}
					onHide={() => {
						let status = this.props.editTable.getStatus(ARRIVEPLAN.TABLEID);
						this.props.onClose(status);
					}}
					fieldid="po_arriveplanmodal"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004POORDER-000007')}</NCModal.Title>
					</NCModal.Header>
					<NCModal.Body>
						<div className="nc-bill-list">
							<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
								<div className="header-button-area">
									{this.props.button.createButtonApp({
										area: ARRIVEPLAN.LIST_TITLE,
										onButtonClick: buttonClickController.bind(this),
										modalRelation: 'to'
									})}
								</div>
							</NCDiv>

							<div className="nc-bill-table-area">
								{/* 列表区域 */}
								{createEditTable(ARRIVEPLAN.TABLEID, {
									height: 465,
									showIndex: true, //显示序号
									showCheck: true,
									inModal: true,
									onBeforeEvent: beforeEvent.bind(this),
									onAfterEvent: afterEvent.bind(this),
									onSelected: buttonController.selectedChange.bind(this),
									onSelectedAll: buttonController.selectedChange.bind(this)
									// adaptionHeight: true
								})}
							</div>
						</div>
					</NCModal.Body>
				</NCModal>
			</div>
		);
	}
}
export default (ArrivePlan = createPage({})(ArrivePlan));
