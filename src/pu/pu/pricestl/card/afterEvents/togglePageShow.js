import { PAGECODE, BUTTON, STATUS, FIELD } from '../../constance';
export default function(props, status, billStatus) {
	let scene = props.getUrlParam('scene');
	if (status == 'edit') {
		//当为编辑态时，隐藏操作列
		props.cardTable.hideColByKey(PAGECODE.cardbody, 'opr');
		props.cardTable.hideColByKey(PAGECODE.cardbodyano, 'opr1');
		if (billStatus == '0' || billStatus == '4') {
			props.button.setButtonVisible(
				[
					BUTTON.Add,
					BUTTON.Delete,
					BUTTON.Edit,
					BUTTON.Print,
					BUTTON.PrintOut,
					BUTTON.Refresh,
					BUTTON.Commit,
					BUTTON.UnCommit
				],
				false
			);
			props.button.setButtonVisible([ BUTTON.Save, BUTTON.Save_Commit, BUTTON.Cancel ], true);
			// props.button.setDisabled([ BUTTON.Save, BUTTON.Save_Commit, BUTTON.Cancel ], false);
		}
		if (billStatus == '2' && scene != null) {
			props.button.setButtonVisible([ BUTTON.Save, BUTTON.Cancel ], true);
			props.button.setButtonVisible(
				[
					BUTTON.Add,
					BUTTON.Delete,
					BUTTON.Edit,
					BUTTON.Print,
					BUTTON.PrintOut,
					BUTTON.Refresh,
					BUTTON.Commit,
					BUTTON.UnCommit
				],
				false
			);
			// props.button.setButtonVisible([ BUTTON.Edit,BUTTON.Print ,BUTTON.Refresh], true);
		}
		if (scene == null || scene == '' || scene == undefined) {
			props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
		} else {
			props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			props.button.setButtonVisible([ BUTTON.Add, BUTTON.Commit, BUTTON.UnCommit ], false);
		}
	}
	if (status == STATUS.browse) {
		//当为编辑态时，隐藏操作列
		props.cardTable.showColByKey(PAGECODE.cardbody, 'opr');
		props.cardTable.showColByKey(PAGECODE.cardbodyano, 'opr');
		//自由
		if (billStatus == '0') {
			props.button.setButtonVisible(
				[
					BUTTON.Add,
					BUTTON.Edit,
					BUTTON.Delete,
					BUTTON.Commit,
					BUTTON.Print,
					BUTTON.PrintOut,
					BUTTON.Refresh
				],
				true
			);
			props.button.setButtonVisible([ BUTTON.Save, BUTTON.UnCommit, BUTTON.Save_Commit, BUTTON.Cancel ], false);
			props.button.setDisabled([ BUTTON.Commit ], false);
		}
		//审批不通过
		if (billStatus == '4') {
			props.button.setButtonVisible(
				[ BUTTON.Add, BUTTON.Edit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
				true
			);
			props.button.setButtonVisible(
				[ BUTTON.Save, BUTTON.UnCommit, BUTTON.Commit, BUTTON.Save_Commit, BUTTON.Cancel, BUTTON.Delete ],
				false
			);
		}
		//审批中
		if (billStatus == '2') {
			//
			props.button.setButtonVisible(
				[ BUTTON.Add, BUTTON.UnCommit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
				true
			);
			props.button.setButtonVisible(
				[ BUTTON.Save, BUTTON.Edit, BUTTON.Save_Commit, BUTTON.Commit, BUTTON.Cancel, BUTTON.Delete ],
				false
			);
			if (scene != null) {
				props.button.setButtonVisible(BUTTON.Edit, true);
			}
		}
		//审批通过
		if (billStatus == '3') {
			props.button.setButtonVisible(
				[ BUTTON.Add, BUTTON.UnCommit, BUTTON.Print, BUTTON.PrintOut, BUTTON.Refresh ],
				true
			);
			props.button.setButtonVisible(
				[
					BUTTON.Delete,
					BUTTON.Save_Commit,
					BUTTON.Commit,
					BUTTON.Edit,
					BUTTON.Save,
					BUTTON.Cancel,
					BUTTON.Delete
				],
				false
			);
			props.button.setDisabled([ BUTTON.Commit ], true);
		}
		if (scene == null || scene == '' || scene == undefined) {
			props.cardPagination.setCardPaginationVisible('cardPaginationBtn', true);
		} else {
			props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);
			props.button.setButtonVisible([ BUTTON.Add, BUTTON.Commit, BUTTON.UnCommit ], false);
		}
	}

	if (scene == null || scene == '' || scene == undefined) {
		props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: true,
			showBillCode: true,
			billCode: props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode).value //修改单据号---非必传
		});
	} else {
		props.BillHeadInfo.setBillHeadInfoVisible({
			showBackBtn: false,
			showBillCode: true,
			billCode: props.form.getFormItemsValue([ PAGECODE.cardhead ], FIELD.vbillcode).value //修改单据号---非必传
		});
	}
}
