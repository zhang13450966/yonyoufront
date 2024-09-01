import { Col, Row } from 'bee-layout';
require('bee-layout/build/Layout.css');

const functionList = {
	'#month(0)#': '本月',
	'#day(0)#': '今日'
};

function selectDateFunction(e, callback, item) {
	pickerState(e, false);
	callback({ value: item });
}
function pickerState(e, flag) {
	let pickerDOM = document.getElementsByClassName('rc-calendar-picker')[0];
	if (pickerDOM) {
		pickerDOM.style.display = flag ? 'block' : 'none';
	}
}

export const checkFuntionValue = (value) => {
	// document.getElementsByClassName('rc-calendar-picker')[0];
	return Object.keys(functionList).indexOf(value) !== -1;
};
export const getTimeFunctionLabel = (value, show) => {
	let label = functionList[value] || '';
	return show && label ? (
		<div className="date-picker-mask" onClick={(e) => pickerState(e, true)}>
			{label}
		</div>
	) : null;
};
// value = 选择的时间 callback = 单击回调 show  = 是否显示时间函数
export const getDateFunNode = (value, callback, show) => {
	if (!show) return;
	let spen = 4;
	return (
		<Row>
			{Object.keys(functionList).map((item, index) => (
				<Col
					className="fun-plan-area"
					lg={spen}
					md={spen}
					sm={spen}
					xs={spen}
					onClick={(e) => selectDateFunction(e, callback, item)}
				>
					<span>{functionList[item]}</span>
				</Col>
			))}
		</Row>
	);
};
