export const hasUnLoadNode = (node) => {
	let status = false;
	const loop = (data) =>
		data.forEach((item) => {
			if (item.props.children && !status) {
				if (item.props.children.length === 0) {
					status = true;
					return;
				} else {
					loop(item.props.children);
				}
			}
		});
	loop(node);
	return status;
};

// ary数组中没有ele这个元素有则增加，有则删除，要求 ele 为基本数据类型
export const toggle = (ary, ele) => {
	if (typeof ele === 'object') {
		console.error($appRoot.state.json['public_lang-000109']);/* 国际化处理： 参数错误,要求传入的元素是基本数据类型*/
		return;
	}
	ary = JSON.parse(JSON.stringify(ary));
	let index = ary.indexOf(ele);
	if (index == -1) {
		ary.push(ele);
	} else {
		ary.splice(index, 1);
	}
	return ary;
};
