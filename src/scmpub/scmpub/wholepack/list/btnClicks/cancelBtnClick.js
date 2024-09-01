import { showWarningDialog } from '../../../pub/tool/messageUtil';
import { PAGEAREA, UISTATE } from '../constance';
import { viewController } from '../viewController';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default function(props) {
	showWarningDialog(getLangByResId(this, '4001WHOLEPACK-000000'), getLangByResId(this, '4001WHOLEPACK-000001'), {/* 国际化处理： 取消,确定要取消吗?*/
		beSureBtnClick: () => {
			this.state.status = UISTATE.browse;
			props.editTable.cancelEdit(PAGEAREA.list);
			//由于新增操作增加一行，走的编辑前事件，当点击取消的时候，需要删除
			let allarr = props.editTable.getAllRows(PAGEAREA.list);
			allarr.forEach((item) => {
				if (item.status == 2) {
					props.editTable.deleteTableRowsByRowId(PAGEAREA.list, item.rowid, true);
				}
			});
			viewController.call(this, props, UISTATE.browse);
		}
	});
}
