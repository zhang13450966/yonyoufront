/*
 * @Author: zhaochyu 
 * @PageInfo: 单据追溯
 * @Date: 2018-06-30 10:54:16 
 * @Last Modified by: zhaochyu
 * @Last Modified time: 2019-01-08 16:59:24
 */
import { FIELD, AREA } from '../../constance';
export default function LinkQuery(props) {
	let pk = props.form.getFormItemsValue(AREA.cardFormArea, FIELD.pk_initialest);
	this.setState({ pk: pk, showTrack: true });
}
