/*
 * @Author: xiahui 
 * @PageInfo: 模板 
 * @Date: 2019-04-28 09:10:23 
 * @Last Modified by: zhr
 * @Last Modified time: 2021-03-09 15:39:13
 */

export default function(props) {
	props.createUIDom(
		{
			pagecode: props.pagecode
		},
		(data) => {
			if (data) {
				if (data.template) {
					let meta = data.template;
					props.meta.setMeta(meta);
					// 设置子表页签名称
					let bodyname = [];
					props.bodycode.map((code) => {

						bodyname.push(meta[code].name);
					});
					this.setState({
			bodyname: bodyname
		});
				}
			}
		}
	);
}
