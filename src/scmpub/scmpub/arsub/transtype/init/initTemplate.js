/*
 * @Author: wangceb
 * @PageInfo: 客户费用单交易类型 模板初始化
 * @Date: 2019-02-19 15:10:01
 * @Last Modified by: wangceb
 * @Last Modified time: 2019-05-22 14:36:48
 */

export default function(props) {
	props.createUIDom(
		{
			pagecode: '400601400_transtype',
			appcode: '400601400'
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
