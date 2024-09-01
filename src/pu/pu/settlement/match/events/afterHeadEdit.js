import { ajax, base, toast } from 'nc-lightapp-front';
import { AREA, URL, PAGECODE, SETTLTTYPE } from '../../constance';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
let isEmpty = (value) => {
	if (!value) {
		return true;
	} else if (Array.isArray(value)) {
		return value.length == 0;
	} else {
		return true;
	}
};
function showMatch() {
	let rows = [];
	if (!isEmpty(this.state.selectedDiscount)) {
		rows = rows.concat(this.state.selectedDiscount);
	}
	if (!isEmpty(this.state.selectedFee)) {
		rows = rows.concat(this.state.selectedFee);
	}
	this.props.editTable.setTableData(AREA.feeView, { rows: rows });
	// 退库单(负发票)不处理损耗；发票上的负合理损耗界面结算也不支持;只有同物料处理损耗
	let rowCount = this.props.editTable.getNumberOfRows(this.state.matchcode);
	let settleType = this.state.settleType;
	let hasFeeDistribute = this.state.hasFeeDistribute;
	let hasInoviceDistribute = this.state.hasInoviceDistribute;
	let canStlMnyCol = this.props.editTable.getColValue(this.state.matchcode, 'ncansettlemny');
	let reasonnumCol = this.props.editTable.getColValue(this.state.matchcode, 'nreasonwastenum');
	for (let index = 0; index < rowCount; index++) {
		let canStlMny = canStlMnyCol.value[index];
		let reasonnum = reasonnumCol.value[index];
		if (canStlMny < 0 || reasonnum < 0 || settleType != SETTLTTYPE.SAME_MATERIAL) {
			this.props.editTable.setValByKeyAndIndex(this.state.matchcode, index, 'nreasonwastenum', {
				value: null,
				display: null
			});
		}
	}
	this.props.editTable.setColEditableByKey(
		this.state.matchcode,
		[
			'ncurinvoicesettlenum',
			'ncurinvoicesettlemny',
			'nreasonwastenum',
			'ncurstocksettlenum',
			'nprice',
			'ncurseetlemny'
		],
		true
	);

	let busisys = 'po';
	(this.state.selectedStock || []).forEach((row) => {
		if ('50' == row.values.cbilltypecode.value) {
			busisys = 'voi_consume';
		}
	});
	let binvoiceCol = this.props.editTable.getColValue(this.state.matchcode, 'binvoice');
	let bstockCol = this.props.editTable.getColValue(this.state.matchcode, 'bstock');
	let editStatus = [];
	for (let index = 0; index < rowCount; index++) {
		let binvoice = binvoiceCol.value[index];
		let bstock = bstockCol.value[index];
		let canedit = {};

		if (binvoice) {
			canedit['ncurinvoicesettlenum'] = true;
			this.props.editTable.setEditableRowKeyByIndex(
				this.state.matchcode,
				index,
				[ 'ncurinvoicesettlenum' ],
				true
			);
			let canStlMny = canStlMnyCol.value[index];
			if (settleType == SETTLTTYPE.SAME_MATERIAL && 'po' == busisys && canStlMny > 0) {
				canedit['nreasonwastenum'] = true;
				this.props.editTable.setEditableRowKeyByIndex(this.state.matchcode, index, [ 'nreasonwastenum' ], true);
			}
		}
		if (settleType != SETTLTTYPE.FEE) {
			if (bstock) {
				canedit['ncurstocksettlenum'] = true;
				this.props.editTable.setEditableRowKeyByIndex(
					this.state.matchcode,
					index,
					[ 'ncurstocksettlenum' ],
					true
				);
				if (settleType == SETTLTTYPE.WITHOUT_INVOICE) {
					canedit['nprice'] = true;
					canedit['ncurseetlemny'] = true;
					this.props.editTable.setEditableRowKeyByIndex(
						this.state.matchcode,
						index,
						[ 'nprice', 'ncurseetlemny' ],
						true
					);
				}
				if (settleType == SETTLTTYPE.DIFFERENT_MATERIAL) {
					canedit['ncurinvoicesettlemny'] = true;
					this.props.editTable.setEditableRowKeyByIndex(
						this.state.matchcode,
						index,
						[ 'ncurinvoicesettlemny' ],
						true
					);
				}
			}
		}
		editStatus.push({ key: index, keys: canedit });
	}
	if (Array.isArray(editStatus) && editStatus.length > 0) {
		// this.props.editTable.setEditableKeyEdit(this.state.matchcode, editStatus);
	}

	if (
		(settleType == SETTLTTYPE.SAME_MATERIAL ||
			(settleType == SETTLTTYPE.DIFFERENT_MATERIAL && hasInoviceDistribute) ||
			settleType == SETTLTTYPE.FEE) &&
		!hasFeeDistribute &&
		(!isEmpty(this.state.selectedDiscount) || !isEmpty(this.state.selectedFee))
	) {
		this.props.button.setButtonVisible('FeeDistribute', true);
	} else {
		this.props.button.setButtonVisible('FeeDistribute', false);
	}
	if (
		(settleType == SETTLTTYPE.SAME_MATERIAL ||
			(settleType == SETTLTTYPE.DIFFERENT_MATERIAL && hasInoviceDistribute) ||
			settleType == SETTLTTYPE.FEE) &&
		hasFeeDistribute &&
		(!isEmpty(this.state.selectedDiscount) || !isEmpty(this.state.selectedFee))
	) {
		this.props.button.setButtonVisible('ShowFeeInvoice', true);
	} else {
		this.props.button.setButtonVisible('ShowFeeInvoice', false);
	}

	if (
		this.state.pk_financeorg &&
		((settleType == SETTLTTYPE.DIFFERENT_MATERIAL && (hasInoviceDistribute || hasFeeDistribute)) ||
			(settleType == SETTLTTYPE.FEE && hasFeeDistribute) ||
			settleType == SETTLTTYPE.SAME_MATERIAL ||
			settleType == SETTLTTYPE.WITHOUT_INVOICE)
	) {
		this.props.button.setButtonDisabled('Settle', false);
	} else {
		this.props.button.setButtonDisabled('Settle', true);
	}

	if (settleType == SETTLTTYPE.DIFFERENT_MATERIAL && !hasInoviceDistribute) {
		this.props.button.setButtonVisible('InvoiceDistribute', true);
		this.props.button.setButtonVisible('DistributeByMny', true);
		this.props.button.setButtonVisible('DistributeByNum', true);
	} else {
		this.props.button.setButtonVisible('InvoiceDistribute', false);
		this.props.button.setButtonVisible('DistributeByMny', false);
		this.props.button.setButtonVisible('DistributeByNum', false);
	}
	this.props.editTable.setStatus(this.state.matchcode, 'edit');
}
export default function(props, moduleId, key, value, changedrows, index, record) {
	let event = props.createGridAfterEventData(PAGECODE.list, this.state.matchcode, moduleId, key, changedrows);
	event.grid[this.state.matchcode].rows = event.grid[this.state.matchcode].rows.filter((row) => {
		return row.rowid == changedrows[0].rowid;
	});
	let matchMaterials = this.state.matchmaterial;
	let billbId = record.values.pk_billbid.value;
	let settleType = this.state.settleType;
	let matchMaterial = matchMaterials.filter((vo) => {
		if (vo.pk_billbid == billbId) {
			return true;
		} else {
			return false;
		}
	});
	let editInfo = {
		event: event,
		settleType: settleType,
		matchMaterial: matchMaterial[0]
	};

	switch (key) {
		case 'ncurinvoicesettlenum':
			ajax({
				method: 'post',
				url: URL.matchAferEdit,
				data: editInfo,
				async: false,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(this.state.matchcode, res.data[this.state.matchcode]);
						props.editTable.updateDataByIndexs(this.state.matchcode, [
							{ index: index, data: res.data[this.state.matchcode].rows[0] }
						]);
						showMatch.call(this);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(this.state.matchcode, index, key, changedrows[0].oldvalue);
				}
			});

			break;
		case 'ncurstocksettlenum':
			ajax({
				method: 'post',
				url: URL.matchAferEdit,
				data: editInfo,
				async: false,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(this.state.matchcode, res.data[this.state.matchcode]);
						props.editTable.updateDataByIndexs(this.state.matchcode, [
							{ index: index, data: res.data[this.state.matchcode].rows[0] }
						]);
						showMatch.call(this);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(this.state.matchcode, index, key, changedrows[0].oldvalue);
				}
			});
			break;
		case 'nreasonwastenum':
			ajax({
				method: 'post',
				url: URL.matchAferEdit,
				data: editInfo,
				async: false,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(this.state.matchcode, res.data[this.state.matchcode]);
						props.editTable.updateDataByIndexs(this.state.matchcode, [
							{ index: index, data: res.data[this.state.matchcode].rows[0] }
						]);
						showMatch.call(this);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(this.state.matchcode, index, key, changedrows[0].oldvalue);
				}
			});
			break;
		case 'nprice':
			ajax({
				method: 'post',
				url: URL.matchAferEdit,
				data: editInfo,
				async: false,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(this.state.matchcode, res.data[this.state.matchcode]);
						props.editTable.updateDataByIndexs(this.state.matchcode, [
							{ index: index, data: res.data[this.state.matchcode].rows[0] }
						]);
						showMatch.call(this);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(this.state.matchcode, index, key, changedrows[0].oldvalue);
				}
			});
			break;
		case 'ncurseetlemny':
			ajax({
				method: 'post',
				url: URL.matchAferEdit,
				data: editInfo,
				async: false,
				success: (res) => {
					if (res && res.data) {
						//props.editTable.setTableData(this.state.matchcode, res.data[this.state.matchcode]);
						props.editTable.updateDataByIndexs(this.state.matchcode, [
							{ index: index, data: res.data[this.state.matchcode].rows[0] }
						]);
						showMatch.call(this);
					}
				},
				error: (res) => {
					toast({ content: res.message, color: 'danger' });
					props.editTable.setValByKeyAndIndex(this.state.matchcode, index, key, changedrows[0].oldvalue);
				}
			});
			break;
		default:
			break;
	}
}
