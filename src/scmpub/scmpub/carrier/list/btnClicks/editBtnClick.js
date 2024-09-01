/*
 * @Author: zhaochyu
 * @PageInfo: 承运商定义修改
 * @Date: 2020-02-10 12:44:52
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-12-30 16:34:05
 */
import { URL, STATUS } from '../../constance';
import { showErrorInfo } from '../../../pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export function EditBtnClick(props, record, index, flag) {
	if (record.pk_org_v.value) {
		props.pushTo(URL.gotoCard, {
			cardStatus: STATUS.edit,
			id: record.ccarrierid.value,
			from: 'list',
			update: 'update'
		});
	} else {
		showErrorInfo(getLangByResId(this, '4001CARRIER-000025')); /* 国际化处理： 组织节点不能维护集团数据！*/
	}
}
