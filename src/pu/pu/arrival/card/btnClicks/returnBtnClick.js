import { showWarningDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { AREA } from '../../constance';

export default function(props) {
	let _this = this;
	let allprocess = props.transferTable.getTransformFormStatus(AREA.leftarea);
	if (allprocess === false) {
		showWarningDialog(getLangByResId(_this, '4004ARRIVAL-000022'), getLangByResId(_this, '4004ARRIVAL-000023'), {
			/* 国际化处理： 提示,有未处理完的单据，是否退出转单?*/
			beSureBtnClick: () => {
				history.go(-1);
			}
		});
	} else {
		history.go(-1);
	}
	//
}
