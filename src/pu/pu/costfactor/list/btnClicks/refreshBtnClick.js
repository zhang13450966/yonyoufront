/*
 * @Author: zhaochyu
 * @PageInfo: 刷新功能
 * @Date: 2018-07-04 16:38:23
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:12:03
 */
import { ajax, toast } from 'nc-lightapp-front';
import { PAGECODE, URL } from '../../constance';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
import { showSuccessInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
export default function(props) {
	ajax({
		url: URL.listHeadQuery,
		data: { pagecode: PAGECODE.listpagecode },
		success: (res) => {
			let { success, data } = res;
			if (success) {
				if (data && data.list_head && data.list_head.list_head) {
					this.props.editTable.setTableData(PAGECODE.headId, data.list_head.list_head);
					this.props.editTable.focusRowByIndex(PAGECODE.headId, 0);
				}
				if (data && data.list_body && data.list_body.list_body) {
					this.props.editTable.setTableData(PAGECODE.bodyId, data.list_body.list_body);
				}
				this.props.editTable.focusRowByIndex(PAGECODE.headId, 0);
				showSuccessInfo(getLangByResId(this, '4004COSTFACTOR-000015')); /* 国际化处理： 刷新成功*/
			} else {
				toast({
					color: 'warning',
					content: getLangByResId(this, '4004COSTFACTOR-000010')
				}); /* 国际化处理： 数据库无数据了！*/
			}
		}
	});
}
