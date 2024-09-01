import React, { Component } from 'react';
import echarts from 'echarts';
import { pageTo, getTheme } from 'nc-lightapp-front';
import { showWarningInfo } from '../../../../../scmpub/scmpub/pub/tool/messageUtil';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

export default class ProgressCircle extends Component {
	constructor() {
		super();
		initLang(this, [ '4004milestoneboard' ], 'pu');
	}
	componentDidMount() {
		this.initChart();
		window.addEventListener('storage', this.changeFontColorByTheme);
	}

	componentWillUnmount() {
		window.removeEventListener('storage', this.changeFontColorByTheme);
	}

	initChart = async () => {
		let defaultTheme = await getTheme();
		let defaultOption = {
			title: [
				{
					text: this.props.value + '%',
					x: 'center',
					y: '30%',
					textStyle: {
						fontSize: 18,
						fontWeight: '600'
					}
				},
				{
					text: this.props.name,
					x: 'center',
					bottom: 8,
					textStyle: {
						fontSize: 12
					}
				}
			],
			//圆环位置和大小
			polar: {
				center: [ '50%', '40%' ],
				radius: '120%'
			},
			barMaxWidth: 4, // 圆环宽度
			angleAxis: {
				show: false
			},
			radiusAxis: {
				show: false,
				type: 'category'
			},
			series: [
				{
					// 背景圆环
					type: 'bar',
					animation: false, // 禁止动画
					data: [
						{
							value: 100,
							itemStyle: {
								color: '#DDDDDD',
								borderWidth: 0
							},
							emphasis: {
								itemStyle: {
									color: '#DDDDDD'
								},
								scale: true
							}
						}
					],
					coordinateSystem: 'polar',
					roundCap: true,
					z: 1
				},
				{
					// 上层圆环，显示数据
					type: 'bar',
					data: [
						{
							value: this.props.value >= 100 ? 100 : this.props.value,
							itemStyle: {
								color: this.props.value >= 100 ? '#67C23A' : '#678FDC'
							}
						}
					],
					barGap: '-100%', // 柱间距离,上下两层圆环重合
					coordinateSystem: 'polar',
					roundCap: true, // 顶端圆角
					z: 2 //圆环层级，同zindex
				}
			]
		};
		let { option = {}, clickable = true, link } = this.props;
		this.option = { ...defaultOption, ...option };
		// 文字颜色根据主题色显示
		this.option.title.forEach((item) => (item.textStyle.color = defaultTheme == 'black' ? '#D9D9D9' : '#2B2C42'));
		this.chart = echarts.init(this.dom, null, { renderer: 'svg' });
		this.chart.setOption(this.option);

		// 整个图表区域可点击跳转
		if (clickable) {
			this.chart.getZr().on('click', () => {
				if (link == undefined) {
					showWarningInfo(getLangByResId(this, '4004MILESTONEBOARD-000029')); /* 国际化处理： 无效付款时点，无法进行跳转!*/
					return;
				}
				let { url, ...rest } = link;
				pageTo.openTo(url, rest);
			});
		}
	};

	// echarts 字体颜色响应系统暗黑主题切换
	changeFontColorByTheme = (e) => {
		if (e.key == 'nccColor') {
			this.option.title.forEach((item) => {
				item.textStyle.color = e.newValue == 'black' ? '#D9D9D9' : '#2B2C42';
			});
			this.chart.setOption(this.option);
		}
	};

	render() {
		let [ width, height ] = this.props.size;
		return <div className="percent-circle" ref={(dom) => (this.dom = dom)} style={{ width, height }} />;
	}
}

export let SmallCircle = (props) => {
	let option = {
		title: [
			{
				text: props.value + '%',
				left: '35',
				y: 'center',
				textStyle: {
					fontSize: 14,
					// color: defaultTheme === 'black' ? '#D9D9D9' : '#2B2C42',
					fontWeight: '500'
				}
			}
		],
		//圆环位置和大小
		polar: {
			center: [ '20', '50%' ],
			radius: '120%'
		},
		barMaxWidth: 4 // 圆环宽度
	};

	return <ProgressCircle {...props} size={[ 100, 30 ]} option={option} clickable={false} />;
};
