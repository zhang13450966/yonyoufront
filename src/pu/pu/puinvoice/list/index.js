/*
 * @Author: jiangfw
 * @PageInfo: 采购发票列表界面
 * @Date: 2018-04-24 16:02:29
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-05-26 10:34:41
 */
import React, { Component } from 'react';
import { createPage, base, high } from 'nc-lightapp-front';
import { initTemplate } from './init';
import './index.less';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import {
	COMMON,
	AREA,
	URL,
	FIELD,
	MODAL_ID,
	PAGECODE,
	UISTATE,
	HEAD_VDEF,
	BODY_VBDEF,
	VFREE
} from '../constance/index';
import commonSerach from './btnClicks/commonSearch';
const { NCTabsControl, NCDiv } = base;
import multiCorpRefHandler from '../../../../scmpub/scmpub/pub/tool/MultiCorpRefHandler';
import { getDefData, setDefData } from '../../../../scmpub/scmpub/pub/cache';
import getDefArray from '../utils/getDefArray';
import searchBtnClick from './btnClicks/searchBtnClick';
import { createListTitle } from '../../../../scmpub/scmpub/pub/tool/titleUtil.js';
import pageInfoClick from './btnClicks/pageInfoClick';
import batchCommitBtnClick from './btnClicks/batchCommitBtnClick';
import ApprovalTrans from 'uap/common/components/approvalTrans';
import { transtypeUtils } from '../../../../scmpub/scmpub/pub/tool';
import { btnController, btnClickController } from './viewControl';
import InvoiceLink from 'sscivm/ivmpub/components/invoice-link';
import ApproveDetail from 'uap/common/components/ApproveDetail';
import NCUploader from 'uap/common/components/NCUploader';
import InvoiceUploader from 'sscivm/ivmpub/components/invoice-uploader';

const { BillTrack, DagreChart } = high;
let dataSource = COMMON.PuinvoiceCacheKey;

class PuInvoiceList extends Component {
	constructor(props) {
		super(props);
		this.currentTab = AREA.toCommit;
		this.tableId = AREA.list_head;
		this.pageId = PAGECODE.invoiceList;
		this.queryArea = AREA.queryArea;
		this.transType; //交易类型发布的小应用才有

		props.use.search(this.queryArea);
		props.use.table(this.tableId);

		this.state = {
			searchVal: null, //查询条件缓存
			toCommitNum: '0', //待提交数量
			approvingNum: '0', //审批中数量
			currentLocale: 'en-US',
			showTrack: false, //单据追溯展示标志
			showApproveInfo: false, //审批详情展示标志
			showUploader: false, //附件管理展示标志
			target: null, //弹出的上传控件以target位置为基准，不传默认页面正中央
			billcode: '', //发票号
			vbillcode: null, //单据号
			// 提交即指派参数
			compositedisplay: false,
			compositedata: null,
			showLinkFee: false,
			pk_invoice: null,
			sscivmInvoiceData: {},
			dagreData: null,
			billtype: '' //交易类型
		};
		// 提交数据
		this.commitInfo = {
			record: null,
			index: null
		};
		initLang(this, [ '4004puinvoice' ], 'pu', initTemplate.bind(this, this.props));
	}

	componentDidMount() {}

	// 待提交、审批中、全部页签，tab页签切换回调函数
	tabChange = (tabCode) => {
		// this.currentTab = tabCode;
		setDefData(dataSource, COMMON.CurrentTab, tabCode);
		commonSerach.call(this, tabCode, getDefData(dataSource, AREA.queryArea), '0'); // 调用查询方法
	};

	//双击进卡片
	doubleClick = (record) => {
		// 清除缓存
		setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, null);
		let pk_invoice = record.pk_invoice.value;
		// this.props.pushTo(URL.card + '#status=browse&id=' + pk_invoice);
		this.props.pushTo(URL.card, { status: UISTATE.browse, id: pk_invoice, pagecode: PAGECODE.invoiceCard });
	};

	//关闭审批详情
	closeApprove = () => {
		this.setState({
			showApproveInfo: false
		});
	};

	onAfterEvent(props, field, val) {
		if (field == FIELD.pk_org) {
			let fields = new Array();
			fields = fields.concat([
				/**表头字段 */
				FIELD.pk_supplier, //供应商
				// FIELD.pk_bizpsn, //采购员
				// FIELD.pk_dept, //采购部门
				FIELD.pk_paytosupplier, //付款单位
				FIELD.pk_payterm, //付款协议
				FIELD.corigcurrencyid, //币种
				FIELD.billmaker, //制单人
				FIELD.approver, //审批人
				FIELD.csendcountryid, //发货国家/地区
				FIELD.crececountryid, //收货国家/地区
				FIELD.ctaxcountryid, //报税国家/地区
				/**表体字段 */
				'invoicebody.pk_apfinanceorg', //应付财务组织
				'invoicebody.pk_srcmaterial', //物料
				'invoicebody.pk_srcmaterial.pk_marbasclass', //物料基本分类
				FIELD.pk_usedept, //使用部门
				'invoicebody.pk_stordoc.pk_org', //库存组织
				'invoicebody.pk_stordoc', //仓库
				'invoicebody.casscustid', //客户
				'invoicebody.cproductorid', //生产厂商
				'invoicebody.cprojectid' //项目
			]);
			// 表头自定义项
			fields = fields.concat(HEAD_VDEF);
			// 表体自定义项
			let body_vdef = getDefArray('invoicebody', BODY_VBDEF);
			fields = fields.concat(body_vdef);
			// 自由辅助属性
			let body_vfree = getDefArray('invoicebody', VFREE);
			fields = fields.concat(body_vfree);

			multiCorpRefHandler(props, val, AREA.queryArea, fields);
		}
	}

	/**
    * 格式化单据追溯渲染的数据
    */
	dataFormat = (data) => {
		return data.map((item) => {
			let {
				billID,
				billCode = '',
				type,
				billTypeName = '',
				transTypeName,
				isShowTranstypeName = false,
				isForward,
				label,
				transtype
			} = item;
			let sourceList = item.source;
			let forwardList = item.target;
			let data = this.suitableLableText(billTypeName, billCode, transTypeName, isShowTranstypeName);
			if (typeof isShowTranstypeName === 'string') {
				isShowTranstypeName = isShowTranstypeName === 'Y';
			}
			return {
				title: data.title,
				label: getLangByResId(this, '4004PUINVOICE-000088'), //单据编号
				billno: data.billno,
				tooltipLabel: getLangByResId(this, '4004PUINVOICE-000088'), //单据编号
				id: billID,
				type: type,
				isOrigin: this.state.pk_invoice === billID,
				transtype,
				source: sourceList || [],
				target: forwardList || [],
				isForward,
				// billCode,
				billTypeName,
				isShowTranstypeName,
				transTypeName
			};
		});
	};

	/**
     * 单据追溯图的节点显示的单据名称和单据编号超的长度过长处理：
     * 	a单据标题极值10个字符，超出...。
            b单据编号极值16个字符，超出折行，超过两行...
            c存在...隐藏更多信息，鼠标移入展示全部内容，移出气泡范围隐藏。
            d长 宽 高固定，宽136px，高50px。标题字号13，编码字号12。元素样式美化
     */
	suitableLableText = (billTypeName, billCode, transTypeName, isShowTranstypeName) => {
		let halfCode1, halfCode2, newHalfCode2, billCodeText, billTypeNameText, transTypeNameText;
		if (billCode.length > 12) {
			//单据编号超过一行
			halfCode1 = billCode.slice(0, 12);
			halfCode2 = billCode.slice(12, billCode.length);
			newHalfCode2;
			let halfCode2Len = halfCode2.length;
			if (halfCode2Len > 12) {
				//据编号超过两行
				newHalfCode2 = halfCode2.slice(0, 11) + '...';
			}
		} else {
			//单据编号没有超过一行
			halfCode1 = billCode;
		}
		billCodeText = `${halfCode1}\n${newHalfCode2 || halfCode2 || ''}`;
		if (isShowTranstypeName === 'Y' && transTypeName) {
			if (transTypeName.length > 10) {
				//单据标题极值10个字符，超出..
				transTypeNameText = transTypeName.slice(0, 10) + '...';
			}
			return {
				title: transTypeNameText || transTypeName,
				billno: billCodeText
			};
		} else {
			if (billTypeName.length > 10) {
				//单据标题极值10个字符，超出..
				billTypeNameText = billTypeName.slice(0, 10) + '...';
			}
			return {
				title: billTypeNameText || billTypeName,
				billno: billCodeText
			};
		}
	};

	// 处理 NCTabsControl 组件的的 defaultkey
	getDefaultKey = () => {
		let tabcode = AREA.toCommit;
		let currentTab = getDefData(dataSource, COMMON.CurrentTab);
		if (currentTab) {
			tabcode = currentTab;
		}
		// 里程碑看板跳转过来，直接跳转全部页签
		let srcpk = this.props.getUrlParam(FIELD.pk);
		if (srcpk) {
			tabcode = AREA.all;
		}
		if (tabcode == AREA.toCommit) {
			return 0;
		} else if (tabcode == AREA.approving) {
			return 1;
		} else {
			return 2;
		}
	};

	handleClick() {}

	renderCompleteEvent = () => {
		transtypeUtils.setQueryDefaultValue.call(this, this.props, AREA.queryArea, FIELD.ctrantypeid);
		let pk_org = this.props.search.getSearchValByField(AREA.queryArea, FIELD.pk_org);
		if (pk_org && pk_org.value && pk_org.value.firstvalue) {
			let value = pk_org.value.firstvalue;
			let arr = value.split(',');
			arr = arr.map((item) => {
				return { refpk: item };
			});
			this.onAfterEvent(this.props, FIELD.pk_org, arr);
		}
	};

	getAssginUsedr = (assign) => {
		//重新执行提交操作重新执行提交操作
		let { record, index } = this.commitInfo;
		batchCommitBtnClick.call(this, this.props, record, index, assign);
		this.setState({ compositedisplay: false });
	};

	// 附件管理关闭
	onHideUploader = () => {
		this.setState({
			showUploader: false
		});
	};

	dagreSelected = (pk, billtype) => {
		this.props.openTo(null, { billtype: billtype, id: pk, sence: 4, status: 'browse' });
	};

	render() {
		const { table, search, modal } = this.props;
		const { NCCreateSearch } = search;
		const { createSimpleTable } = table;
		const { socket } = this.props;
		const { createModal } = modal;
		let { toCommitNum, approvingNum, showUploader, target, showLinkFee, billtype } = this.state;

		return (
			<div className="nc-bill-list">
				{socket.connectMesg({
					tableAreaCode: AREA.list_head,
					// tablePkName: FIELD.pk_invoice
					billpkname: FIELD.pk_invoice,
					billtype: '25'
				})}
				<NCDiv areaCode={NCDiv.config.HEADER} className="nc-bill-header-area">
					<div className="header-title-search-area">
						{createListTitle(this)}
						{/* 国际化处理：采购发票*/}
					</div>
					<div className="header-button-area">
						{this.props.button.createButtonApp({
							area: AREA.list_head,
							onButtonClick: btnClickController.bind(this)
						})}
						<BillTrack
							show={this.state.showTrack}
							close={() => {
								this.setState({ showTrack: false });
							}}
							pk={this.state.pk_invoice}
							type="25"
						/>
						{/* <NCSetColBtn
							onClick={() => {
								this.handleClick;
							}}
						/> */}
					</div>
				</NCDiv>
				{/* 查询区 */}
				<div className="nc-bill-search-area">
					{NCCreateSearch(AREA.queryArea, {
						pkname: FIELD.pk_invoice,
						clickSearchBtn: searchBtnClick.bind(this),
						onAfterEvent: this.onAfterEvent.bind(this, this.props),
						renderCompleteEvent: this.renderCompleteEvent,
						statusChangeEvent: this.renderCompleteEvent,
						dataSource: dataSource,
						defaultConditionsNum: 4
					})}
				</div>
				{/* 列表区 */}
				<div className="tab-definInfo-area">
					<NCTabsControl defaultKey={this.getDefaultKey()}>
						<div key={0} clickFun={() => this.tabChange(AREA.toCommit)}>
							{`${getLangByResId(this, '4004PUINVOICE-000053')}(${toCommitNum})`}
							{/* 国际化处理： 待提交*/}
						</div>
						<div key={1} clickFun={() => this.tabChange(AREA.approving)}>
							{`${getLangByResId(this, '4004PUINVOICE-000054')}(${approvingNum})`}
							{/* 国际化处理： 审批中*/}
						</div>
						<div key={2} clickFun={() => this.tabChange(AREA.all)}>
							{getLangByResId(this, '4004PUINVOICE-000055')}
							{/* 国际化处理： 全部*/}
						</div>
					</NCTabsControl>
					{/* <div className="">
						<NCTabs
							navtype="turn"
							contenttype="moveleft"
							tabBarPosition="top"
							defaultActiveKey={this.state.currentTab}
							onChange={this.tabChange.bind(AREA.toCommit)}
						>
							<NCTabPane tab={'待提交' + ' (' + toCommitNum + ')'} key={AREA.toCommit} />
							<NCTabPane tab={'审批中' + ' (' + approvingNum + ')'} key={AREA.approving} />
							<NCTabPane tab="全部" key={AREA.all} />
						</NCTabs>
					</div> */}
				</div>
				<div className="nc-bill-table-area">
					{createSimpleTable(this.tableId, {
						//显示序号
						showIndex: true,
						showCheck: true,
						handlePageInfoChange: pageInfoClick.bind(this),
						onRowDoubleClick: this.doubleClick.bind(this),
						onSelected: btnController.bind(this, this.props),
						onSelectedAll: btnController.bind(this, this.props),
						dataSource: dataSource,
						pkname: FIELD.pk_invoice,
						componentInitFinished: btnController.bind(this, this.props)
					})}
				</div>
				{/* 审批详情 */}
				<div>
					<ApproveDetail
						show={this.state.showApproveInfo}
						close={this.closeApprove}
						billtype={billtype}
						billid={this.state.pk_invoice}
					/>
				</div>
				{/* 附件管理 */}
				<div>
					{showUploader && (
						<NCUploader
							billId={this.state.pk_invoice}
							billNo={this.state.billcode}
							billcode={this.state.pk_invoice}
							pk_billtypecode={'25'}
							target={target}
							placement={''}
							onHide={this.onHideUploader}
						/>
					)}
				</div>
				{this.state.sscivmInvoiceData &&
				Object.keys(this.state.sscivmInvoiceData) && (
					<div>
						<InvoiceLink {...this.state.sscivmInvoiceData} table={this.props.table} />
					</div>
				)}
				{/* 提交即指派组件引用 */}
				{this.state.compositedisplay && (
					<ApprovalTrans
						title={getLangByResId(this, '4004PUINVOICE-000028')} /* 国际化处理： 指派*/
						data={this.state.compositedata}
						display={this.state.compositedisplay}
						getResult={this.getAssginUsedr}
						cancel={() => {
							this.setState({ compositedisplay: false });
						}}
					/>
				)}
				{/* 消息模态框 */}
				{/* {createModal(MODAL_ID.MessageDlg, {
					size: 'xlg',
					content: this.state.msgContent
				})} */}
				{/* 联查费用发票模态框 */}
				{showLinkFee && (
					<div
						className={`bill-track-max bill-track-invoice ${showLinkFee
							? 'show-bill-track'
							: 'hide-bill-track'}`}
						style={{ height: showLinkFee ? '450px' : '0' }}
					>
						<div className="title nc-theme-common-font-c">
							<span className="name">{getLangByResId(this, '4004PUINVOICE-000031')}</span>
							{/* 国际化处理： 联查费用发票*/}
							<span
								className="close-icon iconfont icon icon-guanbi"
								onClick={() => {
									this.props.close && this.props.close();
									this.setState({
										showLinkFee: false
									});
								}}
							/>
						</div>
						{this.state.dagreData ? (
							<DagreChart
								selectedId={this.state.pk_invoice}
								list={this.dataFormat(this.state.dagreData || [])}
								onSelect={this.dagreSelected}
								showMax={true}
							/>
						) : (
							''
						)}
					</div>
				)}
				{/* 电子发票 */}
				<InvoiceUploader {...this.state.sscivmInvoiceData} />
				{createModal(MODAL_ID.freezeModal)}
				{createModal('code-config')}
				{createModal('printService', {
					className: 'print-service'
				})}
				<iframe id="printServiceframe" name="printServiceframe" style={{ display: 'none' }} />
			</div>
		);
	}
}
PuInvoiceList = createPage({
	billinfo: {
		billtype: 'grid',
		pagecode: PAGECODE.invoiceList,
		bodycode: AREA.list_head
	}
})(PuInvoiceList);
// ReactDOM.render(<PuInvoiceList />, document.querySelector('#app'));
export default PuInvoiceList;
