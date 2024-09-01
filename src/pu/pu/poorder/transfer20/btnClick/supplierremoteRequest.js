/*
 * @Author: CongKe 
 * @PageInfo: 确认供应商、配额分配
 * @Date: 2018-09-20 14:06:24 
 * @Last Modified by: CongKe
 * @Last Modified time: 2019-03-06 17:18:48
 */
import { ajax, toast } from 'nc-lightapp-front';
import { TRANSFER20 } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function supplierremoteRequest(url, content) {
	let rows = this.props.transferTable.getTransferTableSelectedValue(null, true);
	rows = rows && rows.po_praybill ? rows.po_praybill : null;
	if (rows == null || rows.length <= 0) {
		toast({
			color: 'warning',
			content: getLangByResId(this, '4004POORDER-000051') /* 国际化处理： 请选择行！*/
		});
		return;
	}

	let json = [];
	if (rows) {
		//勾选的所有主子数据
		for (let i = 0; i < rows.length; i++) {
			let headRows = rows[i].head.po_praybill,
				bodyRows = rows[i].body.pk_praybill_b;
			headRows.rows.forEach((item) => {
				delete item.values.headKey;
				delete item.values.key;
				delete item.values.rowIndex;
			});
			bodyRows.rows.forEach((item, index) => {
				if (item.values.num) {
					item.values.num.value = item.values.num.value + ''; //数字转string
				}
				delete item.values.key;
				delete item.values.headKey;
				delete item.values.parentRowId;
				delete item.values.rowIndex;
				if (Object.keys(item.values).length == 0) {
					bodyRows.rows.splice(index, 1); //删除空行
				}
			});
			let jdata = {
				head: {
					model: headRows
				},
				body: {
					model: bodyRows
				},
				pageid: TRANSFER20.PAGEID,
				templetid: this.state.templetid
			};
			json.push(jdata);
		}
	}
	if (url == null || json == null) {
		return;
	}
	ajax({
		url: url,
		data: json,
		method: 'post',
		success: (res) => {
			if (res && res.success && res.data) {
				let conddata = {};
				let backdata = res.data;
				backdata.forEach((item) => {
					let parentCoode = item.head.po_praybill.rows[0].values.pk_praybill.value;
					conddata[parentCoode] = {};
					item.body.pk_praybill_b.rows.forEach((eleitem) => {
						//计算： 可订货主数量=请购单主数量-累计订货主数量
						//num=nnum-naccumulatenum
						let nnum = eleitem.values.nnum.value;
						let scale = eleitem.values.nnum.scale;
						let naccumulatenum =
							eleitem.values.naccumulatenum == undefined ? 0 : eleitem.values.naccumulatenum.value;
						let caninnum = nnum - naccumulatenum;
						eleitem.values.num = { value: caninnum, scale: scale };
						//组装数据以便于页面展示
						let childCode = eleitem.values.pk_praybill_b.value;
						conddata[parentCoode][childCode] = eleitem.values;
					});
				});
				this.props.transferTable.updateTransferTableValue(
					TRANSFER20.LIST_TABLE,
					TRANSFER20.LIST_TABLE_CHILD,
					conddata,
					'pk_praybill',
					'pk_praybill_b'
				);

				// toast({ color: 'success', content: content+'成功!' });
			}
		}
	});
}
