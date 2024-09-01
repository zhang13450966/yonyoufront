import { CARDBUTTONINFO } from '../../const/index';

export default function errorBtnController(props) {
	props.cardPagination.setCardPaginationVisible('cardPaginationBtn', false);

	props.button.setDisabled({
		[CARDBUTTONINFO.addBtnCode]: true,
		[CARDBUTTONINFO.editBtnCode]: true,
		[CARDBUTTONINFO.printBtnCode]: true,
		[CARDBUTTONINFO.outputBtnCode]: true,
		[CARDBUTTONINFO.refreshBtnCode]: true,

		[CARDBUTTONINFO.StartUse]: true,
		[CARDBUTTONINFO.StopUse]: true,
		[CARDBUTTONINFO.saveBtnCode]: true,
		[CARDBUTTONINFO.cancelBtnCode]: true,
		[CARDBUTTONINFO.delBtnCode]: true,
		[CARDBUTTONINFO.copyBtnCode]: true,
		[CARDBUTTONINFO.innerAddLineBtnCode]: true,
		[CARDBUTTONINFO.innerDelLineBtnCode]: true,
		[CARDBUTTONINFO.delLineBtnCode]: true
	});
}
