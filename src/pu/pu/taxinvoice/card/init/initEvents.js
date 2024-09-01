/*
 * @Author: chaiwx 
 * @PageInfo: 初始化事件 
 * @Date: 2018-05-17 19:06:04 
 * @Last Modified by: chaiwx
 * @Last Modified time: 2018-12-29 15:12:31
 */
import { AREA, FIELDS } from '../../constance';
import transtypeUtils from '../../../../../scmpub/scmpub/pub/tool/transtypeUtils';
const { setValue } = transtypeUtils;

export default function(props) {
	//发布交易类型后 需设置默认交易类型 --guozhq
	setValue.call(this, AREA.cardFormId, FIELDS.ctrantypeid, FIELDS.vtrantypecode);
}
