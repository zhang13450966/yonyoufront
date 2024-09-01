/*
 * @Author: jiangfw 
 * @PageInfo: 收票主页面 
 * @Date: 2018-10-15 16:48:43 
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-04-12 14:42:17
 */
import React, { Component } from 'react';
import { ajax, createPage } from 'nc-lightapp-front';
import { TRANSFER_TYPE, URL, BILLTYPE, COMMON } from '../constance';
import { getSrcBillType } from '../utils/getSrcBillType';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import Transfer21Table from '../transfer21';
import Transfer45Table from '../transfer45';
import Transfer4TTable from '../transfer4T';
import MultiTransferTable from '../multitransfer';

class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = { type: null };
		initLang(this, [ '4004puinvoice' ], 'pu');
	}

	componentDidMount() {
		let transType;
		let appid;

		let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
		if (busiInfoData) {
			transType = busiInfoData.transType;
			appid = busiInfoData.appid;
		} else {
			transType = this.props.getUrlParam('transType');
			appid = this.props.getUrlParam('appid');
			busiInfoData = { transType, appid };
			setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
		}

		if (undefined == transType) {
			this.getType(null);
		} else {
			this.getType(transType);
		}
	}

	getType = (transType) => {
		let refBillQueryData = { billType: BILLTYPE.invoice, transType: transType };
		ajax({
			url: URL.qryBusiInfo,
			data: refBillQueryData,
			async: false,
			success: (res) => {
				if (res && res.success) {
					let busiInfo = res.data;
					// 以下应该缓存起来，保证返回、退出转单回来继续使用
					let srcBillType = getSrcBillType(busiInfo, 'invoice');
					let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);

					if (srcBillType.length == 0) {
						this.setState({ type: null });
					} else if (srcBillType.length == 1) {
						let billType = srcBillType[0];
						if (billType == BILLTYPE.po_order) {
							busiInfoData.type = TRANSFER_TYPE.transfer21;
							busiInfoData.srcBillType = srcBillType;
							setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
							this.setState({ type: TRANSFER_TYPE.transfer21 });
						} else if (billType == BILLTYPE.purchaseIn) {
							busiInfoData.type = TRANSFER_TYPE.transfer45;
							busiInfoData.srcBillType = srcBillType;
							setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
							this.setState({ type: TRANSFER_TYPE.transfer45 });
						} else if (billType == BILLTYPE.initEstimate) {
							busiInfoData.type = TRANSFER_TYPE.transfer4T;
							busiInfoData.srcBillType = srcBillType;
							setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
							this.setState({ type: TRANSFER_TYPE.transfer4T });
						} else if (billType == BILLTYPE.payplan_order) {
							busiInfoData.type = TRANSFER_TYPE.transfer21Pto25;
							busiInfoData.srcBillType = srcBillType;
							setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
							this.setState({ type: TRANSFER_TYPE.transfer21Pto25 });
						}
					} else {
						busiInfoData.type = TRANSFER_TYPE.invoice;
						busiInfoData.srcBillType = srcBillType;
						setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
						this.setState({ type: TRANSFER_TYPE.invoice });
					}

					// let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
					// busiInfoData.type = this.state.type;
					// busiInfoData.srcBillType = srcBillType;
					// setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
				}
			}
		});
	};

	// react：界面渲染函数
	render() {
		if (!this.state.type) {
			return <h1>{getLangByResId(this, '4004PUINVOICE-000089')}</h1>; /** 未找到相应的业务流 */
		}

		let transferTable;
		if (this.state.type == TRANSFER_TYPE.transfer21) {
			transferTable = <Transfer21Table />;
		} else if (this.state.type == TRANSFER_TYPE.transfer45) {
			transferTable = <Transfer45Table />;
		} else if (this.state.type == TRANSFER_TYPE.transfer4T) {
			transferTable = <Transfer4TTable />;
		} else if (this.state.type == TRANSFER_TYPE.invoice) {
			transferTable = <MultiTransferTable />;
		}

		return transferTable;
	}
}

Invoice = createPage({})(Invoice);
export default Invoice;
