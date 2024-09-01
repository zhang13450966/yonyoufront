/*
 * @Author: zhangchangqing 
 * @PageInfo: 新增按钮处理
 * @Date: 2018-04-19 10:34:18 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-09-11 22:23:53
 */
import { STOREREQ_LIST } from '../../siconst';

export default function clickAddBtn(props) {
	props.pushTo(STOREREQ_LIST.cardUrl, {
		status: STOREREQ_LIST.add,
		option: 'add',
		pagecode: STOREREQ_LIST.cardpageid
	});
}
