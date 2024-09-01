/*
 * @Author: chaiwx 
 * @PageInfo: 取消  
 * @Date: 2018-04-11 17:50:02 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2019-03-05 16:17:08
 */
import { CACHDATASOURCE } from '../../constance';
import { getCurrentLastId } from '../../../../../scmpub/scmpub/pub/cache';
import pageInfoClick from './pageInfoClick';
import { showCancelDialog } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';

export default function(props) {
	showCancelDialog({
		beSureBtnClick: () => {
			// 清除复制行缓存数据
			this.copyRowDatas = null;
			if (props.getUrlParam('status') === 'edit') {
				// 编辑取消
				pageInfoClick.call(this, props, props.getUrlParam('id'));
			} else if (props.getUrlParam('status') === 'add') {
				// 新增取消
				let pk = getCurrentLastId(CACHDATASOURCE.dataSourceList);

				pageInfoClick.call(this, props, pk);
				props.resMetaAfterPkorgEdit();
			}
		}
	});
}
