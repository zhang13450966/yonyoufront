import { URL, PAGECODE } from '../../constance';

/*
 * @Author: nieqianc 
 * @PageInfo: 返回按钮单击事件 
 * @Date: 2019-04-19 15:15:53 
 */
export default function(props, id) {
	props.pushTo(URL.LIST, { pagecode: PAGECODE.LIST });
}
