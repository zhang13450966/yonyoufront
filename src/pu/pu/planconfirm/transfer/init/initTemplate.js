/*
 * @Author: yinliangc 
 * @PageInfo: 进度确认单，拉单页面初始化
 * @Date: 2021-11-19 14:44:04 
 * @Last Modified by: yinliangc
 * @Last Modified time: 2021-11-19 16:02:45
 */
import { PAGECODE } from '../../constance';

export default function(props) {
	props.createUIDom(
		{
			appcode: PAGECODE.transFrom21Appcode,
			pagecode: PAGECODE.transFrom21List //页面id
		},
		(data) => {
			if (data) {
				// 模板
				if (data.template) {
					let meta = data.template;
					meta = modifierMeta.call(this, this.props, meta);
					props.meta.setMeta(meta);
					this.pageid = data.template.pageid;
				}
				// 按钮
				if (data.button) {
					let button = data.button;
					props.button.setButtons(button);
				}
			}
		}
	);
}

/**
 * 页面扩展
 * @param {*} props 
 * @param {*} meta 
 * @returns 
 */
function modifierMeta(props, meta) {
	return meta;
}
