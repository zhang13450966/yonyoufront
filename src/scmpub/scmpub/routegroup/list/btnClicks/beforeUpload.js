/*
 * @Author: 王勇 
 * @PageInfo: 附件上传前校验
 * @Date: 2020-02-14 15:17:15 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2021-04-19 11:25:48
 */
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';
export default function beforeUpload(billId, fullPath, file, fileList) {
	// const isJPG = file.type === 'image/jpeg';
	// if (!isJPG) {
	//     alert('只支持jpg格式图片')
	// }
	const maxSize = 10;
	const isLimitSize = file.size / 1024 / 1024 <= maxSize;
	if (!isLimitSize) {
		showWarningInfo(null, getLangByResId(this, '4001ROUTE-000033', { 0: maxSize })); /* 上传文件大小需小于或等于10M！*/
	}
	return isLimitSize;
}
