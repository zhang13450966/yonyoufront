import React, { Component } from 'react';
import classnames from 'classnames';
import { base, pageTo } from 'nc-lightapp-front';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import PercentCircle, { SmallCircle } from '../PercentCircle';
import { FIELDS_MAP } from '../../constance';
import { STATUS } from '../../../poorder/constance';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
let { NCRow, NCCol } = base;

class MilestoneOrder extends Component {
	constructor() {
		super();
		this.state = {
			fieldsOpen: false
		};
		initLang(this, [ '4004milestoneboard' ], 'pu');
	}

	componentDidMount() {
		// 缩放浏览器窗口时强制刷新, 否则显示设置的展开收起在窗口大小变化时可能会不显示
		window.addEventListener('resize', this.resize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}

	resize = () => this.forceUpdate();

	// 进度圈跳转目标节点信息
	getLinkNode = ({ page, pk, ispredata }) => {
		if ('1001Z01000000000F04J' == page) {
			return {
				pagename: '采购合同维护', // 界面不展示, 不需要处理多语
				appcode: '400400604',
				pagecode: '400400604_list',
				path: '/ct/ct/purdaily/main/index.html#/list',
				pk
			};
		} else if ('1001Z01000000000F04K' == page) {
			return {
				pagename: '采购订单维护',
				appcode: '400400800',
				pagecode: '400400800_list',
				path: '/pu/pu/poorder/main/index.html#/list',
				pk
			};
		} else if ('1001Z01000000000F04L' == page || '1001Z01000000000F04M' == page) {
			return {
				pagename: '采购发票维护',
				appcode: '400401600',
				pagecode: '400401600_list',
				path: '/pu/pu/puinvoice/main/index.html#/list',
				pk
			};
		} else if ('1001Z01000000000F04N' == page) {
			return {
				pagename: '到货单维护',
				appcode: '400401200',
				pagecode: '400401200_list',
				path: '/pu/pu/arrival/main/index.html#/list',
				pk
			};
		} else if ('1001Z01000000000F04O' == page || '1001Z01000000000F04P' == page) {
			return {
				appname: '采购入库单',
				appcode: '400800800',
				pagecode: '400800800_list',
				path: '/ic/ic/purchasein/main/index.html#/list',
				pk
			};
		} else if (ispredata != undefined && !ispredata) {
			return {
				appname: '进度确认单',
				appcode: '400401400',
				pagecode: '400401400_list',
				path: '/pu/pu/planconfirm/main/index.html#/list',
				pk
			};
		}
	};

	// 订单号和详情跳转
	pageJump = ({ page, pk, pk_org, vbillcode }) => {
		let url = '',
			params = {};
		if (page === 'order') {
			// 跳转采购订单卡片
			url = '/pu/pu/poorder/main/index.html#/card';
			params = {
				appcode: '400400800',
				pagecode: '400400800_card',
				pk,
				status: 'browse'
			};
		} else if (page === 'payPlan') {
			// 跳转采购订单付款计划
			url = '/pu/pu/orderpayplan/list/index.html';
			params = {
				appcode: '400400806',
				pagecode: '400400806_list',
				pk,
				pk_org: JSON.stringify(pk_org),
				vbillcode: vbillcode
			};
		}
		pageTo.openTo(url, params);
	};

	// 判断是否显示展开收起
	calcDom = () => {
		let bodyWidth = document.body.clientWidth; // 浏览器窗口宽度
		let columns; // 展示字段在栅格系统下显示多少列
		if (bodyWidth < 992) {
			columns = 2; // sm
		} else if (bodyWidth >= 992 && bodyWidth < 1200) {
			columns = 3; // md
		} else {
			columns = 4; // lg
		}
		let rows = Math.ceil(this.props.displayFields.length / columns); // 展示字段在栅格系统下显示多少行
		return {
			ncRowHeight: rows * 30, // 30: 每行的高度
			toggleVisible: rows > 1 // 大于 1 行时显示展开收起图标
		};
	};

	render() {
		let { displayFields, order } = this.props;
		// 设置订单对应的付款计划主键
		let soardvosTopayplan = order.soardvos;
		let pk_order_payplans = [];
		soardvosTopayplan.forEach((pk) => {
			pk_order_payplans.push(pk.pk_order_payplan);
		});
		let { fieldsOpen } = this.state;
		let { ordertotalpercentage: totalPercent, soardvos } = order;
		let classNames = classnames({
			'order-wrapper': true,
			finished: totalPercent >= 100,
			processing: totalPercent > 0 && totalPercent < 100,
			'not-start': totalPercent <= 0
		});
		let { toggleVisible, ncRowHeight } = this.calcDom();
		return (
			<div className={classNames}>
				<div className="milestone-order">
					<div
						ref={(dom) => (this.dom = dom)}
						className={`milestone-order-header${fieldsOpen ? ' open' : ''}`}
						style={{ height: fieldsOpen ? ncRowHeight : 30 }}
					>
						<SmallCircle value={totalPercent} />
						<NCRow className="display-fields">
							{displayFields.map((key, index) => {
								return (
									<NCCol sm={12} md={8} lg={6} key={index} className="field-item">
										<span className="field-name">{getLangByResId(this, FIELDS_MAP[key])}：</span>
										<span className="field-value">
											{/* 订单号跳转采购订单卡片 */}
											{key === 'vbillcode' ? (
												<span
													className="a-link"
													onClick={() =>
														this.pageJump({
															page: 'order',
															pk: order.pk_order
														})}
												>
													{order[key]}
												</span>
											) : (
												order[key]
											)}
										</span>
									</NCCol>
								);
							})}
						</NCRow>
						<div className="extra">
							<i
								style={{ display: toggleVisible ? 'inline-block' : 'none' }}
								className="iconfont icon-bottom"
								onClick={() => this.setState({ fieldsOpen: !fieldsOpen })}
							/>
							{/* 跳转付款计划节点 */}
							<span
								className="a-link"
								onClick={() =>
									this.pageJump({
										page: 'payPlan',
										pk: JSON.stringify(pk_order_payplans),
										pk_org: { display: order.pk_org, value: order.pk_orgValue },
										vbillcode: order.vbillcode
									})}
							>
								{/* 国际化处理：详情 */}
								{getLangByResId(this, '4004MILESTONEBOARD-000006')}
							</span>
						</div>
					</div>
					<div className="milestone-progress">
						{soardvos.map((item) => {
							return (
								<PercentCircle
									value={item.feffdatetypepercentage}
									name={item.feffdatetypeName}
									link={this.getLinkNode({
										page: item.pk_feffdatetype,
										pk: item.srcPk_feffdatetype,
										ispredata: item.ispredata
									})}
									size={[ 140, 140 ]}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default MilestoneOrder;
