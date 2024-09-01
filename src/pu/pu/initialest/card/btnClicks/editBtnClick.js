/*
 * @Author: zhaochyu
 * @PageInfo: 删行操作
 * @Date: 2018-05-03 11:10:13
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-10 20:20:25
 */
import { ajax } from 'nc-lightapp-front';
import { UISTATE, FIELD, URL, PAGECODE, HEAD_FIELD, DATASOURCE } from '../../constance';
import { updateCacheData, setDefData } from '../../../../../scmpub/scmpub/pub/cache';
import remoteSagasCheck from '../../../pub/remoteCall/remoteSagasCheck';

export default function(props) {
	let pk_initialest = props.form.getFormItemsValue(PAGECODE.cardhead, HEAD_FIELD.pk_initialest).value;
	remoteSagasCheck(URL.sagascheck, { pk: pk_initialest }, () => {
		this.indexstatus[this.curindex] = UISTATE.edit;
		let transfer = this.props.getUrlParam(FIELD.cardStatus) === FIELD.transfer;
		if (transfer) {
			setDefData(DATASOURCE.transferdataSource, pk_initialest, UISTATE.edit);
			buttonControlShow.call(this);
		} else {
			props.pushTo(URL.cardurl, {
				status: UISTATE.edit,
				billStatus: props.getUrlParam(FIELD.fbillstatus),
				id: props.getUrlParam(FIELD.cardId),
				pagecode: PAGECODE.cardpagecode
			});
			this.props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false); //设置翻页不显示
			// this.props.BillHeadInfo.setBillHeadInfoVisible({
			// 	showBackBtn: false //控制显示返回按钮: true为显示,false为隐藏 ---非必传
			// });
			props.form.setFormItemsDisabled(PAGECODE.cardhead, { pk_org_v: true });
			props.cardTable.selectAllRows(PAGECODE.cardbody, false);
			getCardData.call(this, pk_initialest);
			this.toggleShow();
		}
	});
}
//查询卡片数据
export function getCardData(pk) {
	let data = { id: pk, pagecode: PAGECODE.cardpagecode };
	return new Promise((resolve, reject) =>
		ajax({
			url: URL.cardQuery,
			data: data,
			method: 'post',
			success: (res) => {
				//更新缓冲里边的数据
				updateCacheData(this.props, FIELD.pk_initialest, pk, res.data, FIELD.formArea, DATASOURCE.dataSource);
				if (res.data.head) {
					this.props.form.setAllFormValue({
						[PAGECODE.cardhead]: res.data.head[PAGECODE.cardhead]
					});
				}
				if (res.data.body) {
					this.props.cardTable.setTableData(PAGECODE.cardbody, res.data.body[PAGECODE.cardbody]);
				}
				resolve(res.data);
			},
			error: (err) => {
				this.props.form.EmptyAllFormValue(FIELD.formArea);
				this.props.cardTable.setTableData(FIELD.cardTable, { rows: [] });
			}
		})
	);
}
//转单按钮控制
function buttonControlShow() {
	this.props.form.setFormStatus(PAGECODE.cardhead, UISTATE.edit);
	this.props.cardTable.setStatus(PAGECODE.cardbody, UISTATE.edit);
	this.props.button.setButtonVisible(
		[
			'Edit',
			'Delete',
			'Refresh',
			'Approve',
			'More',
			'BillTraceability',
			'Print',
			'Output',
			'Refresh',
			'quitTransfer'
		],
		false
	);
	this.props.button.setButtonVisible(
		[ 'Save', 'Cancel', 'AddLine', 'DeleteLine', 'CopyLine', 'Correct', 'Renumber', 'quitTransfer' ],
		true
	);
}
