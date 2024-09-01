/*
 * @Author: CongKe
 * @PageInfo: 采购订单卡片整单打开/关闭、冻结/解冻
 * @Date: 2018-06-20 18:23:03
 * @Last Modified by: raoczh
 * @Last Modified time: 2020-11-11 16:28:36
 */
import { FIELD, PAGECODE, TRANSFER, OrderCache } from '../../constance';
import { ajax, base } from 'nc-lightapp-front';
import { updateCacheData } from '../../../../../scmpub/scmpub/pub/cache';
import { showResumeModal } from 'scmpub/scmpub/components/ResumeModal';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { buttonController } from '../viewController/index';
import { updateExtBillDataForCompareByPk } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/compareUtils';
import ScriptActionDlg from '../../../pub/ScriptActionDlg';
let reason = '';
let pk = '';

export default function handleOrderBtn(_url, contents, extstr, skipCodes) {
	// 采购订单卡片整单打开/关闭、行关闭/行打开、冻结/解冻、生成协同销售订单
	extstr = extstr == null || extstr == undefined ? '' : extstr;
	let _this = this;
	pk = _this.props.getUrlParam(FIELD.id);
	let transfer = _this.props.getUrlParam(TRANSFER.transfer);
	if (transfer == null) {
		transfer = _this.props.getUrlParam(TRANSFER.channelType);
	}
	if (pk == null || transfer != null) {
		// 转单已保存的数据有主键
		let pk_orders = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.pk_order);
		pk = pk_orders && pk_orders.value;
	}
	let ts = _this.props.form.getFormItemsValue(PAGECODE.cardhead, FIELD.ts).value;
	let allrows = _this.props.cardTable.getAllRows(PAGECODE.cardbody);
	let bodys = [];
	allrows.forEach((row) => {
		bodys.push({
			pks: row.values[FIELD.pk_order_b].value,
			ts: row.values[FIELD.ts].value
		});
	});
	let rows = [];
	let info = {
		pks: pk,
		ts: ts,
		bodys: bodys
	};
	rows.push(info);
	skipCodes = skipCodes ? skipCodes : new Array();
	// 拼装json
	let data = {
		skipCodes: skipCodes,
		closedto: rows,
		pagecode: PAGECODE.cardcode,
		extstr: extstr
	};
	if (contents == getLangByResId(this, '4004POORDER-000023')) {
		/* 国际化处理： 冻结*/
		let getFreezeReason = (val) => {
			reason = val;
		};
		//冻结原因
		this.props.modal.show('MessageDlg', {
			title: getLangByResId(this, '4004POORDER-000044') /* 国际化处理： 冻结原因*/,
			content: (
				<ScriptActionDlg
					changeData={(value) => {
						reason = value;
					}}
					title={getLangByResId(this, '4004POORDER-000130')}
				/>
			),
			size: 'sm',
			beSureBtnClick: beSureBtnClick.bind(this, this.props, _url, data, contents), //点击确定按钮事件
			cancelBtnClick: () => this.props.modal.close('MessageDlg'),
			closeModalEve: () => this.props.modal.close('MessageDlg')
		});
	} else {
		handelBills.call(this, this.props, _url, data, contents);
	}
}

// 弹出框点击确定事件
function beSureBtnClick(props, _url, data, contents) {
	reason = reason == '' ? null : reason;
	data.extstr = reason;
	handelBills.call(this, props, _url, data, contents);
}

function handelBills(props, _url, data, contents, skipCodes) {
	// 发送请求
	skipCodes = skipCodes ? skipCodes : new Array();
	(data['skipCodes'] = skipCodes),
		ajax({
			url: _url,
			data: data,
			success: (res) => {
				if (res.data && res.data.isResume && res.data.isResume == true) {
					showResumeModal.bind(this)(
						this.props,
						'ResumeMessageDlg',
						skipCodes,
						res.data,
						handelBills.bind(this, props, _url, data, contents, skipCodes),
						this.props
					);
					return;
				} else {
					if (res.data) {
						//开关开始
						this.props.beforeUpdatePage();
						let map = new Map();
						map.set('pk_payment', PAGECODE.head_payment);
						map.set('pk_order_b', PAGECODE.cardbody);
						let config = {
							headAreaId: PAGECODE.cardhead,
							bodyIdAndPkMap: map
						};
						updateExtBillDataForCompareByPk(this.props, res.data, config);
						//开关关闭
						props.updatePage(PAGECODE.cardhead, [ PAGECODE.head_payment, PAGECODE.cardbody ]);
						updateCacheData(
							this.props,
							FIELD.pk_order,
							pk,
							res.data,
							PAGECODE.cardhead,
							OrderCache.OrderCacheKey
						);
						showSuccessInfo(contents + getLangByResId(this, '4004POORDER-000045')); /* 国际化处理： 成功！*/
						setTimeout(() => {
							buttonController.togglePageShow.call(this, this.props, null);
						}, 0);
					}
				}
			}
		});
}
