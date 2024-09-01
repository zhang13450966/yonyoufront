/*
 * @Author: qishy 
 * @PageInfo: 返回添加了前缀的自定义项
 * @Date: 2019-05-09 19:11:14 
 * @Last Modified by:   qishy 
 * @Last Modified time: 2019-05-09 19:11:14 
 */

export default function(prex, array) {
	let newArray = new Array();
	array.map((item) => {
		newArray.push(prex + '.' + item);
	});
	return newArray;
}
