/**
 * 行号字段前端设置的是文本，但是业务要求必须为数值，这里增加输入值的正则校验，只能输入数值
 * @param {*} rownoField 
 * @param {*} config 
 */
export default function(rownoField, config) {
	console.log(111, config);
	let inputVal = config.valueChange; //当前input框的数值
	let item = config.item;
	if (item.attrcode == rownoField) {
		let checkFloat = /^-?[0-9]*(\.\d*)?$|^-?d^(\.\d*)?$/; //过滤是否为小数的正则，不完善；
		if (inputVal.length == 0) {
			//删除时，数值为空的情况过滤
			return true;
		} else if (checkFloat.test(inputVal)) {
			if (inputVal.indexOf('-') != -1 && inputVal.substr(1, 1) == '0') {
				if (inputVal.substr(1) == '.') {
					return false;
				} else if (inputVal.length > 2 && inputVal.substr(2, 1) != '.') {
					return false;
				}
			} else if (inputVal.substr(0, 1) == '0') {
				if (inputVal.substr(0) == '.') {
					return false;
				} else if (inputVal.length > 1 && inputVal.substr(1, 1) != '.') {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
}
