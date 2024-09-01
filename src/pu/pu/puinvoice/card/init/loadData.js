/*
 * @Author: jiangfw
 * @PageInfo: 加载数据
 * @Date: 2018-08-07 18:14:28
 * @Last Modified by: zhangmi
 * @Last Modified time: 2022-01-17 09:56:52
 */
import { TRANSFER_TYPE, AREA, URL, UISTATE, PAGECODE, FIELD, COMMON } from '../../constance';
import { ajax } from 'nc-lightapp-front';
import transfer from './transfer';
import feeInvoiceClick from '../btnClicks/feeInvoiceClick';
import copyUtil from '../btnClicks/copyUtil';
import { transtypeUtils } from '../../../../../scmpub/scmpub/pub/tool';
import btnController from '../viewControl/btnController';
import clickBackBtn from '../btnClicks/backBtnClick';
import { showErrorInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { changeUrlParam } from '../../../../../scmpub/scmpub/pub/cache';
import from2507 from './from2507';
import { showSagaErrorToasts } from '../../../pub/utils/sagaMsgUtils';
import { getDefData, setDefData } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache/cacheDataManager';

export default function() {
	let type = this.props.getUrlParam('type');
	let channelType = this.props.getUrlParam('channelType');
	let copy = this.props.getUrlParam('copy');
	let feeFlag = this.props.getUrlParam('feeFlag'); //费用发票

	if (channelType && channelType == TRANSFER_TYPE.transfer2507) {
		// 对账单推采购发票
		from2507.call(this);
	} else {
		if (type == TRANSFER_TYPE.transfer50) {
			// 消耗汇总拉单
			let transferIds = this.props.transferTable.getTransferTableSelectedId(AREA.head);
			let qTempletid_50 = this.props.getUrlParam('qTempletid_50');
			let url = URL.transfer50to25;
			this.qTempletid_50 = qTempletid_50;
			getTransferValue.call(this, transferIds, url, qTempletid_50);
		} else if (
			type == TRANSFER_TYPE.invoice ||
			type == TRANSFER_TYPE.transfer21 ||
			type == TRANSFER_TYPE.transfer45 ||
			type == TRANSFER_TYPE.transfer4T ||
			type == TRANSFER_TYPE.transfer21Pto25
		) {
			//收票
			transfer.call(this, this.props, type);
		} else if (type == TRANSFER_TYPE.transfer55E6to25) {
			transfer.call(this, this.props, type);
		} else if (
			type == TRANSFER_TYPE.transferSc ||
			type == TRANSFER_TYPE.transfer61 ||
			type == TRANSFER_TYPE.transfer47
		) {
			// 委外收票
			transfer.call(this, this.props, type);
		} else if (copy) {
			// 复制
			copyUtil.call(this);
		} else if (feeFlag) {
			feeInvoiceClick.call(this);
		} else {
			let status = this.props.getUrlParam('status');
			this.setBillHeadInfo();

			getData.call(this, status);
		}
	}
}

//获取整单数据
function getData(status) {
	if (status && status != UISTATE.add) {
		let data = { pks: [ this.props.getUrlParam('id') ], pagecode: this.pageId };

		//暂存保存
		let tempsave = getDefData(COMMON.tempCardCacheKey, 'tempsave');

		//暂存保存，将表头设置为新增
		if (tempsave) {
			//data = { pks: [ getCurrentLastId(COMMON.PuinvoiceCacheKey) ], pagecode: this.pageId };
			setDefData(COMMON.tempCardCacheKey, 'tempsave', false);
		}

		if (!data.pks[0]) {
			this.props.form.EmptyAllFormValue(this.formId);
			this.props.cardTable.setTableData(this.tableId, { rows: [] });
			btnController.call(this, UISTATE.browse);
			return;
		}
		ajax({
			url: URL.queryCard,
			data: data,
			success: (res) => {
				if (data === undefined) {
					this.props.form.EmptyAllFormValue(this.formId);
					this.props.cardTable.setTableData(this.tableId, { rows: [] });
					return;
				}
				if (res.data.head && res.data.body) {
					this.props.form.setAllFormValue({ [this.formId]: res.data.head[this.formId] });
					this.props.cardTable.setTableData(this.tableId, res.data.body[this.tableId]);
					let billcode = res.data.head[this.formId].rows[0].values.vbillcode.value;
					this.setBillHeadInfo(billcode);
				}
				// 复制 清除部分字段
				// if (copyFlag) {
				// 	this.props.form.setFormItemsValue(this.formId, { [FIELD.ctrantypeid]: { value: null } }); //交易类型
				// 	this.props.form.setFormItemsValue(this.formId, { [FIELD.vtrantypecode]: { value: null } }); //交易类型
				// }
				btnController.call(this);
				showSagaErrorToasts(this.props, this.formId, FIELD.pk_invoice);
			},
			error: (res) => {
				showErrorInfo(res.message);
				this.props.form.EmptyAllFormValue(this.formId);
				this.props.cardTable.setTableData(this.tableId, { rows: [] });
				this.props.form.setFormStatus(AREA.card_head, UISTATE.browse);
				this.props.cardTable.setStatus(AREA.card_body, UISTATE.browse);
				changeUrlParam(this.props, {
					status: UISTATE.browse,
					id: null
				});
				btnController.call(this, UISTATE.browse, true);
			}
		});
	} else {
		btnController.call(this);
	}

	this.pk_invoice = this.props.getUrlParam('id'); //主键
}

// 获取消耗汇总转单后的数据
function getTransferValue(ids, url, qTempletid_50) {
	if (ids) {
		let data = {
			data: ids,
			pagecode: PAGECODE.invoiceCard,
			templetid: this.state.templetid_25,
			oid: qTempletid_50,
			// key: 'ic_vmi_outdetail.cvmibid'
			key: 'ic_vmi_sum.cvmihid'
		};
		this.refsourcdata = { transferInfo: [ data ] };
		ajax({
			method: 'POST',
			url: url,
			data: data,
			success: (res) => {
				if (res && res.data) {
					let invoices = res.data;
					this.props.transferTable.setTransferListValue(AREA.card_left, invoices);
					//拉单初始化数据时调用交易类型默认值设置方法
					transtypeUtils.setValue.call(this, AREA.card_head, FIELD.ctrantypeid, FIELD.vtrantypecode);
					// this.props.form.setFormStatus(this.formId, UISTATE.edit);
					// this.props.cardTable.setStatus(this.tableId, UISTATE.edit);

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
		this.props.transferTable.setTransferListValue(AREA.card_left, []);
	}
}
