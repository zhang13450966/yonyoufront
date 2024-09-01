/*
 * @Author: zhaochyu
 * @PageInfo: 新增按钮
 * @Date: 2018-04-02 14:38:26
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 17:01:36
 */
import { URL, UISTATE, PAGECODE } from '../../constance';
export default function(props) {
	props.pushTo(URL.cardurl, {
		from: 'list',
		status: UISTATE.add,
		billStatus: '0',
		pagecode: PAGECODE.cardpagecode
	});
}
