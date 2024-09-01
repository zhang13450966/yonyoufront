/*
 * @Author: zhangshqb 
 * @PageInfo: 到货单卡片态按钮点击事件处理  
 * @Date: 2018-04-28 10:17:14 
 * @Last Modified by: zhangshqb
 * @Last Modified time: 2018-07-09 15:32:45
 */
import { AREA } from '../../constance';
export default function() {
	let pk = this.props.form.getFormItemsValue(AREA.head, 'pk_arriveorder').value;
	this.setState({
		pk: pk,
		showTrack: true
	});
}
