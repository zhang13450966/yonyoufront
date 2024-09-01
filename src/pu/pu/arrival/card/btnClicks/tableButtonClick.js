import { ajax, base, toast } from 'nc-lightapp-front';
import { URL, AREA, PAGECODE } from '../../constance';
import { rowCopyPasteUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools/rowCopyPasteUtils';
import setPieceBtnClick from './setPieceBtnClick';
import { RownoUtils } from '../../../../../scmpub/scmpub/pub/tool/cardTableTools';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function tableButtonClick(props, key, text, record, index) {
	switch (key) {
		case 'CopyLine':
			break;
		case 'DeleteLine':
			props.cardTable.delRowsByIndex(AREA.body, index);
			this.props.cardTable.delRowsByIndex(AREA.body, rowparam);
			let checks = props.cardTable.getCheckedRows(AREA.body);
			if (!checks || checks == null || checks.length == 0) {
				this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], true);
			} else {
				this.props.button.setButtonDisabled([ 'CopyLines', 'DeleteLine' ], false);
			}
			break;
		case 'Expend':
			let status = props.cardTable.getStatus(AREA.body);
			if (status == 'edit') {
				props.cardTable.openModel(AREA.body, 'edit', record, index);
			} else {
				props.cardTable.toggleRowView(AREA.body, record);
			}
			break;
		case 'PastToThis': // 物料 粘贴至此
			rowCopyPasteUtils.pasteRowsToIndex.call(
				this,
				props,
				AREA.body,
				index,
				[ 'CopyLines', 'DeleteLine', 'ResetRowno' ],
				[ 'PastToThis', 'PastToLast', 'CancelPast' ],
				[ 'crowno', 'pk_arriveorder_b' ]
			);
			RownoUtils.setRowNo(props, AREA.body, 'crowno');
			this.setState({ isCopyLine: false });
			break;
		case 'CheckLine':
			ajax({
				method: 'post',
				url: URL.verify,
				data: {
					pageid: PAGECODE.card,
					pkTsParams: [ { pk: record.values.pk_arriveorder_b.value, ts: record.values.ts.value } ]
				},
				success: (res) => {
					if (res && res.data && res.data.body) {
						props.cardTable.updateDataByIndexs(AREA.body, [
							{ index: index, data: res.data.body[AREA.body].rows[0] }
						]);
					}
					if (res && res.data && res.data.head) {
						props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
					}
					toast({ content: getLangByResId(this, '4004ARRIVAL-000013'), color: 'success' }); /* 国际化处理： 报检成功*/
				}
			});
			break;
		case 'LetGoLine':
			// TODO
			break;
		case 'GenAssertLine':
			ajax({
				method: 'post',
				url: URL.verify,
				data: {
					pageid: PAGECODE.card,
					pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
				},
				success: (res) => {
					if (res && res.data && res.data.body) {
						props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
					}
					if (res && res.data && res.data.head) {
						props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
					}
					tost({
						content: getLangByResId(this, '4004ARRIVAL-000009'),
						color: 'success'
					}); /* 国际化处理： 生成设备卡片成功*/
				}
			});
			break;
		case 'DelAssertLine':
			ajax({
				method: 'post',
				url: URL.verify,
				data: {
					pageid: PAGECODE.card,
					pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
				},
				success: (res) => {
					if (res && res.data && res.data.body) {
						props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
					}
					if (res && res.data && res.data.head) {
						props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
					}
					tost({
						content: getLangByResId(this, '4004ARRIVAL-000010'),
						color: 'success'
					}); /* 国际化处理： 删除设备卡片成功*/
				}
			});
			break;
		case 'GenTransLine':
			ajax({
				method: 'post',
				url: URL.verify,
				data: {
					pageid: PAGECODE.card,
					pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
				},
				success: (res) => {
					if (res && res.data && res.data.body) {
						props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
					}
					if (res && res.data && res.data.head) {
						props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
					}
					tost({ content: getLangByResId(this, '4004ARRIVAL-000011'), color: 'success' }); /* 国际化处理： 生成转固单成功*/
				}
			});
			break;
		case 'DelTransLine':
			ajax({
				method: 'post',
				url: URL.verify,
				data: {
					pageid: PAGECODE.card,
					pkTsParams: [ { pk: record.pk_arriveorder.value, ts: record.ts.value } ]
				},
				success: (res) => {
					if (res && res.data && res.data.body) {
						props.cardTable.setTableData(AREA.body, res.data.body[AREA.body]);
					}
					if (res && res.data && res.data.head) {
						props.form.setAllFormValue({ [AREA.head]: res.data.head[AREA.head] });
					}
					tost({ content: getLangByResId(this, '4004ARRIVAL-000019'), color: 'success' }); /* 国际化处理： 删除转固单成功*/
				}
			});
			break;
		case 'SetPiece': //成套件
			setPieceBtnClick.call(this, props, record, index);
			break;

		default:
			break;
	}
}
