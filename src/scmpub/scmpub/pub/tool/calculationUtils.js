/*
 * js浮点数准确运算方法
 * @Author: yangls7 
 * @Date: 2019-02-16 09:16:33 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-04-23 13:23:27
 */
function add(a, b) {
	var c, d, e;
	try {
		c = a.toString().split('.')[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split('.')[1].length;
	} catch (f) {
		d = 0;
	}
	return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}

function sub(a, b) {
	var c, d, e;
	try {
		c = a.toString().split('.')[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split('.')[1].length;
	} catch (f) {
		d = 0;
	}
	return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

function mul(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split('.')[1].length;
	} catch (f) {}
	try {
		c += e.split('.')[1].length;
	} catch (f) {}
	return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
}

function div(a, b) {
	var c,
		d,
		e = 0,
		f = 0;
	try {
		e = a.toString().split('.')[1].length;
	} catch (g) {}
	try {
		f = b.toString().split('.')[1].length;
	} catch (g) {}
	return (
		(c = Number(a.toString().replace('.', ''))),
		(d = Number(b.toString().replace('.', ''))),
		mul(c / d, Math.pow(10, f - e))
	);
}

export default function() {
	//把方法加到Number的prototype里，方便使用
	Number.prototype.add = function(arg) {
		return add(this, arg);
	};
	Number.prototype.sub = function(arg) {
		return sub(this, arg);
	};
	Number.prototype.mul = function(arg) {
		return mul(this, arg);
	};
	Number.prototype.div = function(arg) {
		return div(this, arg);
	};
}
