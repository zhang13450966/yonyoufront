/*
 * @Author: jiangfw 
 * @PageInfo: 返回添加了前缀的自定义项
 * @Date: 2018-07-23 08:46:10 
 * @Last Modified by: jiangfw
 * @Last Modified time: 2018-08-16 20:30:33
 */
export default function(prex, array) {
	let newArray = new Array();
	array.map((item) => {
		newArray.push(prex + '.' + item);
	});
	return newArray;
}
