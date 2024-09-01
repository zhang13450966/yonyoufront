/*
 * @Author: zhaochyu
 * @PageInfo: 辅助信息组件
 * @Date: 2019-05-16 14:31:04
 * @Last Modified by: hufei
 * @Last Modified time: 2022-05-23 18:15:44
 */
import React, { Component } from 'react';
import { base, ajax, formatNumber } from 'nc-lightapp-front';
import { URL } from '../../constance';
import './index.less';
import Chart from './chart';
const { NCSidebox } = base;
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
class SupplementaryInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				atpdata: {},
				price: {
					contractPrc: null,
					lowestPrice: null,
					newPrice: null,
					supplerPrc: null
				}
			},
			castunitid: null
		};
		initLang(this, [ '4004poorder' ], 'pu');
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.supplementinfoData != null && nextProps.showModal) {
			this.setState({
				castunitid: nextProps.supplementCunit
			});
			this.queryData(nextProps.supplementinfoData);
		} else {
			this.setState({
				data: {
					atpdata: {},
					price: {
						contractPrc: null,
						lowestPrice: null,
						newPrice: null,
						supplerPrc: null
					}
				},
				castunitid: null
			});
		}
	}
	/**
	 * 查询数据
	 */
	queryData = (param) => {
		ajax({
			url: URL.supplementinfo,
			data: param,
			success: (res) => {
				if (res.data) {
					this.setState({
						data: res.data
					});
				}
			}
		});
	};
	render() {
		let { showModal, supplementinfoData, onClose } = this.props;
		return (
			<div>
				<NCSidebox
					show={showModal}
					mask={true}
					maskClosable={true}
					showButton={false}
					width="600px"
					onClose={onClose}
					title={getLangByResId(this, '4004POORDER-000119')} //"辅助信息"
				>
					<div className="sidebox-body-content">
						<h2>{getLangByResId(this, '4004POORDER-000120')}</h2>
						{/*价格 */}
						<span fieldid="pu_contractPrc">
							<span className="field-title">{getLangByResId(this, '4004POORDER-000121')}</span>
							{/* 合同价： */}
							<span className="feild-value">{formatNumber(this.state.data.price.contractPrc)}</span>
						</span>
						<span fieldid="pu_supplerPrc">
							<span className="field-title">{getLangByResId(this, '4004POORDER-000122')}</span>
							{/* 供应商价目表： */}
							<span span className="feild-value">
								{formatNumber(this.state.data.price.supplerPrc)}
							</span>
						</span>
						<span fieldid="pu_newPrice">
							<span className="field-title">{getLangByResId(this, '4004POORDER-000123')}</span>
							{/* 订单最新价： */}
							<span span className="feild-value">
								{formatNumber(this.state.data.price.newPrice)}
							</span>
						</span>
						<span fieldid="pu_lowestPrice">
							<span className="field-title">{getLangByResId(this, '4004POORDER-000124')}</span>
							{/* 订单最低价： */}
							<span span className="feild-value">
								{formatNumber(this.state.data.price.lowestPrice)}
							</span>
						</span>
						<h2>{getLangByResId(this, '4004POORDER-000125')}</h2>
						{/* 存量 */}
						<Chart
							data={this.state.data.atpdata ? this.state.data.atpdata.atpdata : []}
							supplementCunit={this.state.castunitid}
						/>
					</div>
				</NCSidebox>
			</div>
		);
	}
}
export default SupplementaryInfo;
