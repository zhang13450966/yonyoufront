/*
 * @Author: jiangfw
 * @PageInfo: 委外收票主页面
 * @Date: 2018-10-15 16:48:43
 * @Last Modified by: raoczh
 * @Last Modified time: 2021-02-25 11:36:28
 */
import React, { Component } from 'react';
import { ajax, createPage } from 'nc-lightapp-front';
import { TRANSFER_TYPE, URL, BILLTYPE, COMMON } from '../constance';
//import { showWarningInfo } from '../../../../scmpub/scmpub/pub/tool/messageUtil';
import MultiTransferTable from '../sctransfer';
import Transfer61Table from '../transfer61';
import { initLang, getLangByResId } from '../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { getSrcBillType } from '../utils/getSrcBillType';
import Transfer47Table from '../transfer47';
import { setDefData, getDefData } from '../../../../scmpub/scmpub/pub/cache';

class ScInvoice extends Component {
	constructor(props) {
		super(props);
		// this.appid;
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
		ajax({
			url: URL.mergerequest,
			async: false,
			data: [
				{
					rqUrl: '/scmpub/pub/sysinitgroup.do', //模块是否启用
					rqJson: '[ "4012" ]',
					rqCode: 'moduleInfo'
				},
				{
					rqUrl: '/pu/pub/refbillqueryaction.do', //查询业务流信息
					rqJson: `{ billType: '25',transType:${transType},includeUnCloud:true}`,
					rqCode: 'busiInfo'
				}
			],
			success: (res) => {
				if (res && res.success) {
					let data = res.data;
					let isScEnable = data.moduleInfo['4012'];
					// this.isScEnable = isScEnable;
					// setDefData(COMMON.TransferCacheKey, 'isScEnable', isScEnable);
					
					let busiInfo = data.busiInfo;

					// 以下应该缓存起来，保证返回、退出转单回来继续使用
					let srcBillType = getSrcBillType(busiInfo, 'scInvoice');
					let busiInfoData = getDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData);
					if (isScEnable) {
						if (srcBillType.length == 0) {
							this.setState({ type: null });
						} else if (srcBillType.length == 1) {
							let billType = srcBillType[0];
							if (billType == BILLTYPE.sc_order) {
								busiInfoData.type = TRANSFER_TYPE.transfer61;
								setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
								this.setState({ type: TRANSFER_TYPE.transfer61 });
							} else if (billType == BILLTYPE.subcontIn) {
								busiInfoData.type = TRANSFER_TYPE.transfer47;
								setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
								this.setState({ type: TRANSFER_TYPE.transfer47 });
							}
						} else if (srcBillType.length == 2) {
							busiInfoData.type = TRANSFER_TYPE.transferSc;
							setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
							this.setState({ type: TRANSFER_TYPE.transferSc });
						}

						// busiInfoData.type = this.state.type;
						// setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);

						// if (busiInfo && busiInfo.length > 0) {
						// if (false) {
						// setDefData(COMMON.TransferCacheKey, 'scTransferType', TRANSFER_TYPE.transferSc);
						// this.type = TRANSFER_TYPE.transferSc;
						// this.setState({ type: TRANSFER_TYPE.transferSc });
						// reqTemplate.call(this, meta);
						// 添加刷新按钮
						// addRefresh(props);
						// } else {
						// this.type = TRANSFER_TYPE.transfer61;
						// this.setState({ type: TRANSFER_TYPE.transfer61 });
						// setDefData(COMMON.TransferCacheKey, 'scTransferType', TRANSFER_TYPE.transfer61);
						// init61Template.call(this);
						// }
					} else {
//						showWarningInfo(
//							getLangByResId(this, '4004PUINVOICE-000064'),
//							getLangByResId(this, '4004PUINVOICE-000065')
//						); /* 国际化处理： 出错啦!,委外模块未启用*/
						busiInfoData.type = TRANSFER_TYPE.transfer47;
						setDefData(COMMON.TransferCacheKey, COMMON.BusiInfoData, busiInfoData);
						this.setState({ type: TRANSFER_TYPE.transfer47 });
					}
				}
			}
		});
	};

	// react：界面渲染函数
	render() {
		if (!this.state.type) {
			return <h1>{getLangByResId(this, '4004PUINVOICE-000089')}</h1>; /** 未找到相应的业务流 */
		}

		// let transType = this.props.getUrlParam('transType');
		// this.appid = this.props.getUrlParam('appid');

		let transferTable;
		if (this.state.type == TRANSFER_TYPE.transferSc) {
			transferTable = <MultiTransferTable />;
		} else if (this.state.type == TRANSFER_TYPE.transfer61) {
			transferTable = <Transfer61Table />;
		} else if (this.state.type == TRANSFER_TYPE.transfer47) {
			transferTable = <Transfer47Table />;
		}

		return transferTable;
	}
}

ScInvoice = createPage({})(ScInvoice);
export default ScInvoice;
