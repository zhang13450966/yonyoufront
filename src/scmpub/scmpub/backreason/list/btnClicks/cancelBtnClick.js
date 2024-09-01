import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	showWarningDialog(getLangByResId(this, '4001BACKREASON-000000'), getLangByResId(this, '4001BACKREASON-000001'), {
		/* 国际化处理： 取消,确定要取消吗?*/
		beSureBtnClick: () => {
			props.editTable.cancelEdit(PAGEAREA.list);
			viewController.call(this, props, UISTATE.browse);
		}
	});
}
