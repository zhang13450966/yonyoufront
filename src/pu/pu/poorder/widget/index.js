/*
 * @Author: CongKe
 * @PageInfo: 请购生成采购订单
 * @Date: 2018-06-13 14:14:03
 * @Last Modified by: zhangmi
 * @Last Modified time: 2021-10-14 15:00:48
 */
import React, { Component } from 'react';
import { createPage, ajax, widgetAutoRefresh } from 'nc-lightapp-front';
import { TRANSFER20, URL, OrderCache } from '../constance';
import { clearTransferCache } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import './index.less';
const PO_APPCODE = '400400800';
const SC_APPCODE = '401200000';
class WidGet20Table extends Component {
	constructor(props) {
		super(props);
		this.state = {
			widGetInfo: 0,
			widGetInfoSC: 0,
			puLoading: false,
			scLoading: false
		};
		initLang(this, [ '4004poorder' ], 'pu', () => {
			this.setState(this.state);
		});
	}

	componentDidMount() {
		this.loadPU();
		this.loadSC();
	}

	queryData = (e) => {
		if (this.state.puLoading || this.state.scLoading) return;
		this.setState({ puLoading: true, scLoading: true });
		this.loadPU(e);
		this.loadSC(e);
	};

	loadPU = (e) => {
		// if (this.state.puLoading) return;
		// this.setState({ puLoading: true });
		let queryInfo = {
			oid: '0001Z81000000006ZCP3',
			queryAreaCode: TRANSFER20.SEARCHID,
			querycondition: {
				logic: 'and',
				conditions: null
			},
			querytype: 'tree'
		};
		if (queryInfo.querycondition) {
			let data = {
				queryInfo: queryInfo,
				pageCode: TRANSFER20.PAGEID //页面编码
			};
			//得到数据渲染到页面
			ajax({
				url: URL.widget20to21,
				data: data,
				sysAppcode: PO_APPCODE,
				loading: false,
				success: (res) => {
					if (res.data) {
						this.setState({
							widGetInfo: res.data
						});
					}
					setTimeout(() => {
						this.setState({ puLoading: false });
					}, 1000);
				},
				error: (error) => {
					this.setState({
						widGetInfo: '5000',
						puLoading: false
					});
				}
			});
		}
		e && e.stopPropagation();
	};

	loadSC = (e) => {
		// if (this.state.scLoading) return;
		// this.setState({ scLoading: true });
		let queryInfo = {
			oid: '1001Z81000000006FLZI',
			queryAreaCode: 'list_query',
			querycondition: {
				logic: 'and',
				conditions: null
			},
			querytype: 'tree'
		};
		if (queryInfo.querycondition) {
			let data = {
				queryInfo: queryInfo,
				pageCode: '400400400_20to61' //页面编码
			};
			//得到数据渲染到页面
			ajax({
				url: '/nccloud/sc/scorder/queryTransfer20List.do',
				data: data,
				sysAppcode: SC_APPCODE,
				loading: false,
				success: (res) => {
					if (res.data) {
						this.setState({
							widGetInfoSC: res.data
						});
					}
					setTimeout(() => {
						this.setState({ scLoading: false });
					}, 1000);
				},
				error: (error) => {
					this.setState({
						widGetInfoSC: '5000',
						scLoading: false
					});
				}
			});
		}
		e && e.stopPropagation();
	};

	render() {
		let { widGetInfo, widGetInfoSC, puLoading, scLoading } = this.state;
		return (
			<div className="scm_pu_poorder_widget">
				<div className="widget-wrap">
					<div className="widget-title nc-theme-Widgets-font-c">
						{getLangByResId(this, '4004POORDER-000095') /* 国际化处理： 请购下单*/}
					</div>
					<div className="widget-content">
						<div
							className="widget-content-item"
							onClick={() => {
								clearTransferCache(this.props, OrderCache.OrderTransferCache);
								this.props.openTo('/pu/pu/poorder/main/index.html#/transfer20', {
									appcode: PO_APPCODE,
									scene: 'widget'
								});
							}}
						>
							<div className="item-content">
								{widGetInfo > 999 ? (
									<p className="widget-count">
										999<span className="plus">+</span>
									</p>
								) : (
									<p className="widget-count">{widGetInfo}</p>
								)}
								{/* 国际化处理： 采购 */}
								<p className="widget-label">{getLangByResId(this, '4004POORDER-000115')}</p>
							</div>
						</div>
						<div
							className="widget-content-item"
							onClick={() => {
								clearTransferCache(this.props, OrderCache.OrderTransferCache);
								this.props.openTo('/sc/sc/scorder/main/index.html#/transfer20', {
									appcode: SC_APPCODE,
									scene: 'widget'
								});
							}}
						>
							<div className="item-content">
								{widGetInfoSC > 999 ? (
									<p className="widget-count">
										999<span className="plus">+</span>
									</p>
								) : (
									<p className="widget-count">{widGetInfoSC}</p>
								)}
								{/* 国际化处理： 委外 */}
								<p className="widget-label">{getLangByResId(this, '4004POORDER-000116')}</p>
							</div>
						</div>
					</div>
					<div className="widget-footer">
						{puLoading || scLoading ? (
							<div className="ball-clip-rotate">
								<div />
							</div>
						) : (
							<div className="refresh-icon" onClick={this.queryData} />
						)}
					</div>
				</div>
			</div>
		);
	}
}
const autoRefreshCallback = (_this) => {
	//这里写小部件自动刷新时执行的逻辑
	_this.queryData();
};
WidGet20Table = widgetAutoRefresh('400400810', autoRefreshCallback)(WidGet20Table);
WidGet20Table = createPage({})(WidGet20Table);
// ReactDOM.render(<WidGet20Table />, document.querySelector('#app'));
export default WidGet20Table;
