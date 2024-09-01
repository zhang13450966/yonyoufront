/*
 * @Author: zhngzh 
 * @Date: 2019-05-07 09:42:17 
 * @Last Modified by: zhangflr
 * @Last Modified time: 2020-10-27 17:09:07
 */
export default function afterEvent(props, moduleId, key, value, changedrows, i) {
	//包装分类参照编辑后放入名称
	if (key === 'nlength' || key === 'nwidth' || key === 'nheight') {
		if (value == '') {
			clearValue(this.props, moduleId, i, [ 'nvolumn' ]);
		} else if (value <= 0) {
			switch (key) {
				case 'nlength':
					showWarningInfo(null, '长度应大于0');
					break;
				case 'nwidth':
					showWarningInfo(null, '宽度应大于0');
					break;
				case 'nheight':
					showWarningInfo(null, '高度应大于0');
					break;
			}
			clearValue(this.props, moduleId, i, [ key ]);
		} else {
			calculateNvolumn(this.props, moduleId, i);
		}
	} else if (key === 'nvolumn' && value != '') {
		if (value <= 0) {
			showWarningInfo(null, '体积应大于0');
			clearValue(this.props, moduleId, i, [ key ]);
		} else {
			let nlength = props.editTable.getValByKeyAndIndex(moduleId, i, 'nlength').value;
			let nwidth = props.editTable.getValByKeyAndIndex(moduleId, i, 'nwidth').value;
			let nheight = props.editTable.getValByKeyAndIndex(moduleId, i, 'nheight').value;
			if (!nlength && nwidth > 0 && nheight > 0) {
				let val = divide(divide(value, nwidth), nheight);
				val = val.toFixed(props.editTable.getValByKeyAndIndex(moduleId, i, 'nlength').scale);
				props.editTable.setValByKeyAndIndex(moduleId, i, 'nlength', { value: val, display: null });
			} else if (!nwidth && nlength > 0 && nheight > 0) {
				let val = divide(divide(value, nlength), nheight);
				val = val.toFixed(props.editTable.getValByKeyAndIndex(moduleId, i, 'nwidth').scale);
				props.editTable.setValByKeyAndIndex(moduleId, i, 'nwidth', { value: val, display: null });
			} else if (!nheight && nwidth > 0 && nlength > 0) {
				let val = divide(divide(value, nwidth), nlength);
				val = val.toFixed(props.editTable.getValByKeyAndIndex(moduleId, i, 'nheight').scale);
				props.editTable.setValByKeyAndIndex(moduleId, i, 'nheight', { value: val, display: null });
			}
		}
	}
}
function clearValue(props, moduleId, i, fields) {
	for (let field of fields) {
		props.editTable.setValByKeyAndIndex(moduleId, i, field, { value: null, display: null });
	}
}

function calculateNvolumn(props, moduleId, i) {
	let nlength = props.editTable.getValByKeyAndIndex(moduleId, i, 'nlength').value;
	let nwidth = props.editTable.getValByKeyAndIndex(moduleId, i, 'nwidth').value;
	let nheight = props.editTable.getValByKeyAndIndex(moduleId, i, 'nheight').value;
	if (nlength > 0 && nwidth > 0 && nheight > 0) {
		let scale = props.editTable.getValByKeyAndIndex(moduleId, i, 'nvolumn').scale;
		let value = nlength * nwidth * nheight;
		value = value.toFixed(scale);
		props.editTable.setValByKeyAndIndex(moduleId, i, 'nvolumn', {
			value: value,
			display: null
		});
	}
}

function divide(arg1, arg2) {
	let d1,
		d2,
		n1 = Number(arg1.toString().replace('.', '')),
		n2 = Number(arg2.toString().replace('.', ''));
	try {
		d1 = arg1.toString().split('.')[1].length;
	} catch (e) {
		d1 = 0;
	}
	try {
		d2 = arg2.toString().split('.')[1].length;
	} catch (e) {
		d2 = 0;
	}
	let value = n1 / n2 * Math.pow(10, d2 - d1);
	return value;
}
