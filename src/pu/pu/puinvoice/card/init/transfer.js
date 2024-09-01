import { ajax } from 'nc-lightapp-front';
import { UISTATE, AREA, PK, TRANSFER_TYPE, BILLTYPE, URL, PAGECODE, FIELD } from '../../constance';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import clickBackBtn from '../btnClicks/backBtnClick';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
// import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
let cardPage = PAGECODE.invoiceCard;

export default function(props, transferType) {
	let templetid_25 = this.templetid_25;
	getTransferValue.call(this, props, transferType, templetid_25);
}

function getTransferValue(props, transferType, templetid_25) {
	let ids;
	if (transferType == TRANSFER_TYPE.invoice || transferType == TRANSFER_TYPE.transferSc) {
		//多来源拉单
		ids = props.transferTable.getTransferTableMultiSelectedId();
	} else {
		ids = props.transferTable.getTransferTableSelectedId();
	}

	if (ids) {
		// 查询参数
		let transferInfo = new Array();
		// 请求地址
		let url = '';

		if (transferType == TRANSFER_TYPE.invoice) {
			url = URL.multiInvoice;
			// 给公共主键赋值
			ids.map((v) => {
				v.bodys.map((body) => {
					body['pk'] = body[PK.body21pk];
					if (body[PK.body21pk]) {
						body['pk_name'] = PK.body21pk;
					} else if (body[PK.body45pk]) {
						body['pk'] = body[PK.body45pk];
						body['pk_name'] = PK.body45pk;
					} else if (body[PK.body4Tpk]) {
						body['pk'] = body[PK.body4Tpk];
						body['pk_name'] = PK.body4Tpk;
					}
				});
				if (v.head[PK.head21pk]) {
					v.head['pk'] = v.head[PK.head21pk];
					v.head['pk_name'] = PK.head21pk;
				} else if (v.head[PK.head45pk]) {
					v.head['pk'] = v.head[PK.head45pk];
					v.head['pk_name'] = PK.head45pk;
				} else if (v.head[PK.head4Tpk]) {
					v.head['pk'] = v.head[PK.head4Tpk];
					v.head['pk_name'] = PK.head4Tpk;
				}
			});

			let id21 = []; //采购订单主键
			let id45 = []; //采购入库单主键
			let id4T = []; //期初暂估单主键

			ids.map((item) => {
				if (item.head[PK.head21pk]) {
					id21.push(item);
				} else if (item.head[PK.head45pk]) {
					id45.push(item);
				} else if (item.head[PK.head4Tpk]) {
					id4T.push(item);
				}
			});

			if (id21.length > 0) {
				// 采购订单
				let info21 = {
					pagecode: cardPage,
					key: BILLTYPE.po_order, //采购订单
					templetid: templetid_25,
					data: id21
				};
				transferInfo.push(info21);
			}
			if (id45.length > 0) {
				// 采购入库单
				let info45 = {
					pagecode: cardPage,
					key: BILLTYPE.purchaseIn, // 采购入库单
					templetid: templetid_25,
					data: id45
				};
				transferInfo.push(info45);
			}
			if (id4T.length > 0) {
				// 期初暂估单
				let info4T = {
					pagecode: cardPage,
					key: BILLTYPE.initEstimate, // 期初暂估单
					templetid: templetid_25,
					data: id4T
				};
				transferInfo.push(info4T);
			}
		} else if (transferType == TRANSFER_TYPE.transferSc) {
			url = URL.scInvoiceT;
			// 给公共主键赋值
			ids.map((v) => {
				v.bodys.map((body) => {
					if (body[PK.body61pk]) {
						body['pk'] = body[PK.body61pk];
						body['pk_name'] = PK.body61pk;
					} else if (body[PK.body47pk]) {
						body['pk'] = body[PK.body47pk];
						body['pk_name'] = PK.body47pk;
					}
				});
				if (v.head[PK.head61pk]) {
					v.head['pk'] = v.head[PK.head61pk];
					v.head['pk_name'] = PK.head61pk;
				} else if (v.head[PK.head47pk]) {
					v.head['pk'] = v.head[PK.head47pk];
					v.head['pk_name'] = PK.head47pk;
				}
			});

			let id61 = []; //委外订单主键
			let id47 = []; //委托加工入库单主键

			ids.map((item) => {
				if (item.head[PK.head61pk]) {
					id61.push(item);
				} else if (item.head[PK.head47pk]) {
					id47.push(item);
				}
			});

			if (id61.length > 0) {
				// 采购订单
				let info61 = {
					pagecode: cardPage,
					key: BILLTYPE.sc_order, //委外订单
					templetid: templetid_25,
					data: id61
				};
				transferInfo.push(info61);
			}
			if (id47.length > 0) {
				// 委托加工入库单
				let info47 = {
					pagecode: cardPage,
					key: BILLTYPE.subcontIn, // 委托加工入库单
					templetid: templetid_25,
					data: id47
				};
				transferInfo.push(info47);
			}
		} else if (transferType == TRANSFER_TYPE.transfer21) {
			url = URL.multiInvoice;
			// 给公共主键赋值
			let id21 = []; //采购订单主键
			ids.map((item) => {
				id21.push(item);
			});

			// 委外订单
			let info21 = {
				pagecode: cardPage,
				key: BILLTYPE.po_order, //采购订单
				templetid: templetid_25,
				data: id21
			};
			transferInfo.push(info21);
		} else if (transferType == TRANSFER_TYPE.transfer45) {
			url = URL.multiInvoice;
			// 给公共主键赋值
			let id45 = []; //采购入库单主键
			ids.map((item) => {
				id45.push(item);
			});

			// 委外订单
			let info45 = {
				pagecode: cardPage,
				key: BILLTYPE.purchaseIn, //采购入库单
				templetid: templetid_25,
				data: id45
			};
			transferInfo.push(info45);
		} else if (transferType == TRANSFER_TYPE.transfer4T) {
			url = URL.multiInvoice;
			// 给公共主键赋值
			let id4T = []; //期初暂估单主键
			ids.map((item) => {
				id4T.push(item);
			});

			// 委外订单
			let info4T = {
				pagecode: cardPage,
				key: BILLTYPE.initEstimate, //期初暂估单
				templetid: templetid_25,
				data: id4T
			};
			transferInfo.push(info4T);
		} else if (transferType == TRANSFER_TYPE.transfer47) {
			url = URL.scInvoiceT;
			// 给公共主键赋值
			let id47 = []; //委外订单主键
			ids.map((item) => {
				id47.push(item);
			});

			// 委外订单
			let info47 = {
				pagecode: cardPage,
				key: BILLTYPE.subcontIn, //委托加工入库单
				templetid: templetid_25,
				data: id47
			};
			transferInfo.push(info47);
		} else if (transferType == TRANSFER_TYPE.transfer61) {
			url = URL.scInvoiceT;
			// 给公共主键赋值
			let id61 = []; //委外订单主键
			ids.map((item) => {
				id61.push(item);
			});

			// 委外订单
			let info61 = {
				pagecode: cardPage,
				key: BILLTYPE.sc_order, //委外订单
				templetid: templetid_25,
				data: id61
			};
			transferInfo.push(info61);
		} else if (transferType == TRANSFER_TYPE.transfer21Pto25) {
			url = URL.poInvoiceTo21P;
			// 给公共主键赋值
			let id21P = []; //委外订单主键
			ids.map((item) => {
				id21P.push(item);
			});

			// 委外订单
			let info61 = {
				pagecode: cardPage,
				key: '21P', //委外订单
				templetid: templetid_25,
				data: id21P
			};
			transferInfo.push(info61);
		} else if (transferType == TRANSFER_TYPE.transfer55E6to25) {
			url = URL.poInvoiceTo55E6;
			// 给公共主键赋值
			let id55E6 = [];
			ids.map((item) => {
				id55E6.push(item);
			});
			// GXWW
			let info55E6 = {
				pagecode: cardPage,
				key: '55E6',
				templetid: templetid_25,
				data: id55E6
			};
			transferInfo.push(info55E6);
		}

		if (transferInfo.length < 1) {
			return;
		}
		let data = {
			transferInfo: transferInfo
		};
		this.refsourcdata = data;
		ajax({
			method: 'POST',
			url: url,
			data: data,
			success: (res) => {
				if (res && res.data) {
					let invoices = res.data;

					props.transferTable.setTransferListValue(AREA.card_left, invoices);
					//拉单初始化数据时调用交易类型默认值设置方法
					transtypeUtils.setValue.call(this, AREA.card_head, FIELD.ctrantypeid, FIELD.vtrantypecode);
					// props.cardTable.setStatus(AREA.card_head, UISTATE.edit);
					// props.form.setFormStatus(AREA.card_body, UISTATE.edit);

					// 设置单据来源类型以及缓存数据
					let billTypeIndex = new Map();
					let listdata = new Array();
					for (let i = 0; i < invoices.length; i++) {
						let pk_busitype = invoices[i].head.card_head.rows[0].values.pk_busitype.value;
						let csourcetypecode = invoices[i].body.card_body.rows[0].values.csourcetypecode.value;
						billTypeIndex.set(pk_busitype, csourcetypecode);

						let element = {};
						element.head = invoices[i].head;
						element.body = invoices[i].body;
						element.pageid = invoices[i].pageid;
						listdata.push(element);
					}
					// this.setState({ billTypeIndex, listdata });
					this.billTypeIndex = billTypeIndex;
					this.listdata = listdata;
				}
			},
			error: (error) => {
				clickBackBtn.call(this);
				// backButton.call(_this, error);
				showErrorInfo(getLangByResId(this, '4004PUINVOICE-000080'), error.message); /* 国际化处理： 注意*/
			}
		});
	} else {
		props.transferTable.setTransferListValue(AREA.card_left, []);
	}
}
