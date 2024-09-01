/*
 * @Author: zhangchqf
 * @PageInfo: 请购单价格论证表
 * @Date: 2019-04-15 16:57:03
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-23 17:59:03
 */

import React, { Component } from 'react';
import { base, createPage, ajax, print, timeFunctionTranslater } from 'nc-lightapp-front';
const { NCModal, NCRangePickerClient, NCButton } = base;
import { initTemplate } from './init';
import { BUYINGREQ_CARD, BUYINGREQ_LIST, ATTRCODE } from '../siconst';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getDefData } from '../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import './index.less';

class Price extends Component {
	constructor(props) {
		super(props);
		props.use.table(BUYINGREQ_CARD.price_form);
		this.state = {
			templetid: '',
			dbilldate: {
				display: [ '#month(0)#', '#day(0)#' ],
				value: [ timeFunctionTranslater('#month(0)#'), timeFunctionTranslater('#day(0)#', { flag: false }) ]
			},
			pk: null,
			queryDataFlag: false,
			value: ''
		};
		//前端模型
		this.model = {
			context: null,
			param: null,
			currentIndex: 0
		};
		initLang(this, [ '4004praybill', '4004pub' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentWillReceiveProps(nextProps) {
		let showModal = this.props.showModal;
		if (showModal) {
			this.queryData(this.state.dbilldate.display);
		}
	}

	/**
	 * 查询数据
	 */
	queryData = (date) => {
		let queryCondition = {
			firstvalue: timeFunctionTranslater(date[0]),
			secondvalue: timeFunctionTranslater(date[1], { flag: false })
		};
		let pk_praybill = getDefData(BUYINGREQ_LIST.dataSource, 'pricekeyword');
		let data = {
			templetid: this.state.templetid,
			//keyword: this.props.getUrlParam(BUYINGREQ_CARD.id),
			//拉单页面联查价格论证表
			keyword: pk_praybill,

			pageid: BUYINGREQ_CARD.pricePage,
			queryCondition: queryCondition
		};
		ajax({
			url: BUYINGREQ_CARD.querypriceURL,
			data: data,
			success: (res) => {
				let { success, data } = res;
				let rowsData = { rows: [] };
				if (data) {
					//初始化模型
					rowsData = data[BUYINGREQ_CARD.price_form];
					this.props.table.setAllTableData(BUYINGREQ_CARD.price_form, rowsData);
				}
			}
		});
	};
	onChange = (e) => {
		this.setState({ value: e });
	};

	handleClick = (a) => {
		let pk_praybill = getDefData(BUYINGREQ_LIST.dataSource, 'pricekeyword');
		//let pk = this.props.getUrlParam(BUYINGREQ_CARD.id);
		let pks = [];
		pks.push(pk_praybill);
		pks.push(timeFunctionTranslater(this.state.dbilldate.display[0]));
		pks.push(timeFunctionTranslater(this.state.dbilldate.display[1], { flag: false }));
		print(
			'pdf', //支持两类: 'html'为模板打印, 'pdf'为pdf打印
			BUYINGREQ_LIST.priceprintURL,
			{
				funcode: '400400400', //小应用编码
				nodekey: '40040040010', //模板节点标识
				oids: pks // 功能节点的数据主键   oids含有多个元素(['1001A41000000000A9LR','1001A410000000009JDD'])时为批量打印,
			}
		);
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
					fieldid="buyingreqprice"
				>
					<NCModal.Header closeButton={true}>
						<NCModal.Title>{getLangByResId(this, '4004PRAYBILL-000065')}</NCModal.Title>
						{/* 国际化处理： 价格论证表*/}
					</NCModal.Header>
					<div className="modal-backsettle-search">
						<div className="item-name">{getLangByResId(this, '4004PRAYBILL-000066')}</div>
						<NCRangePickerClient
							{...this.props}
							required={true}
							showTimeFunction={true}
							placeholder={getLangByResId(this, '4004PRAYBILL-000066')}
							value={this.state.dbilldate.display}
							onChange={(date, value, display) => {
								if (Array.isArray(date) && date.length > 1) {
									this.setState({
										dbilldate: {
											value: value,
											display: date
										}
									});
									this.queryData(date);
								} else {
									this.setState({
										dbilldate: {
											value: [],
											display: []
										}
									});
									this.queryData(date);
								}
							}}
						/>
					</div>
					<NCModal.Body className="flex-container">
						{/* 列表区域 */}
						{createSimpleTable(BUYINGREQ_CARD.price_form, {
							showIndex: true
						})}
					</NCModal.Body>
					<NCModal.Footer>
						<NCButton fieldid="buyingreq_btn" colors="primary" onClick={this.handleClick}>
							{getLangByResId(this, '4004PRAYBILL-000067')}
						</NCButton>
					</NCModal.Footer>
				</NCModal>
			</div>
		);
	}
}
export default (Price = createPage({})(Price));
