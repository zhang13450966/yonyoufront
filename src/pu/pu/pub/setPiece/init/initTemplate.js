/*
 * @Author: jiangfw
 * @PageInfo: 成套件
 * @Date: 2018-06-28 09:15:54 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-12-10 13:59:23
 */
import { APPCODE, PAGECODE } from '../constance/constance';

export default function(props) {
	props.createUIDom(
		{
			appcode: APPCODE.setPiece, //应用编码
			pagecode: PAGECODE.setPieceCard //页面编码
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
				}
			}
		}
	);
}
