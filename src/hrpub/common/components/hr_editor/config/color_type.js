const COLOR_STYLES = [
	{ key: 1, label: 'T', styleName: 'color-red', title: '红色', iconClassName: 'color-red' },
	{ key: 2, label: 'T', styleName: 'color-orange', title: '橙色', iconClassName: 'color-orange' },
	{ key: 3, label: 'T', styleName: 'color-yellow', title: '黄色', iconClassName: 'color-yellow' },
	{ key: 4, label: 'T', styleName: 'color-green', title: '绿色', iconClassName: 'color-green' },
	{ key: 5, label: 'T', styleName: 'color-blue', title: '蓝色', iconClassName: 'color-blue' },
	{ key: 6, label: 'T', styleName: 'color-indigo', title: '藏青色', iconClassName: 'color-indigo' },
	{ key: 7, label: 'T', styleName: 'color-violet', title: '紫色', iconClassName: 'color-violet' }
];
const ColorStyleMap = {
	'color-red': {
		color: 'rgba(255, 0, 0, 1.0)'
	},
	'color-orange': {
		color: 'rgba(255, 127, 0, 1.0)'
	},
	'color-yellow': {
		color: 'rgba(180, 180, 0, 1.0)'
	},
	'color-green': {
		color: 'rgba(0, 180, 0, 1.0)'
	},
	'color-blue': {
		color: 'rgba(0, 0, 255, 1.0)'
	},
	'color-indigo': {
		color: 'rgba(75, 0, 130, 1.0)'
	},
	'color-violet': {
		color: 'rgba(127, 0, 255, 1.0)'
	}
};
export { COLOR_STYLES, ColorStyleMap };
