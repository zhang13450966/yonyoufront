import { PAGECODE, FIELD, BUTTON, STATUS } from '../../constance';
/**
 * 页面按钮主控
 * @param {*} props
 */
export default function togglePageShow(props, pk) {
	props.beforeUpdatePage();
	if (!pk) {
		props.form.EmptyAllFormValue(PAGECODE.cardhead);
		props.cardTable.setTableData(PAGECODE.cardbody, { rows: [] });
		props.button.setButtonVisible(
			[
				BUTTON.del,
				BUTTON.cancelToIA,
				BUTTON.file,
				BUTTON.linkQuery,
				BUTTON.output,
				BUTTON.print,
				BUTTON.sendToIA,
				BUTTON.refreash
			],
			false
		);
		props.BillHeadInfo.setBillHeadInfoVisible({
			showBillCode: true,
			billCode: ''
		});
		props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
	} else {
		//结算单编号
		props.BillHeadInfo.setBillHeadInfoVisible({
			showBillCode: true,
			billCode: props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode).value
		});
		let btoiaf = props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.btoia).value;
		if (btoiaf) {
			props.button.setButtonVisible(BUTTON.cancelToIA, true);
			props.button.setButtonVisible(BUTTON.sendToIA, false);
		} else {
			props.button.setButtonVisible(BUTTON.cancelToIA, false);
			props.button.setButtonVisible(BUTTON.sendToIA, true);
		}
	}

	//设置saga相关按钮状态
	setSagaBtnState(props, STATUS.browse);
	props.updatePage(PAGECODE.cardhead, [ PAGECODE.cardbody ]);
}

function setSagaBtnState(props, status) {
	//冻结交互
	let sagaStatus = props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.sagaStatus);
	// 第一次进入卡片页，frozen为空，取界面sags_statue的值判断冻结状态
	let frozen = sagaStatus && sagaStatus.value == '1' ? true : false;
	// 设置回退、重试按钮状态，用来是否显示
	if (status == STATUS.browse && frozen) {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: true
		});
	} else {
		props.button.toggleErrorStatus(PAGECODE.cardhead, {
			isError: false
		});
	}
}
