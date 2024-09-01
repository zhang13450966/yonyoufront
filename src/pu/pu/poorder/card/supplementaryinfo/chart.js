import React, { Component } from 'react';
import { getTheme } from 'nc-lightapp-front';
import echarts from 'echarts';
import { initLang, getLangByResId } from '../../../../../scmpub/scmpub/pub/tool/multiLangUtil';

let getOption = async () => {
	let theme = await getTheme();
	let option = {
		grid: {
			containLabel: true
		},
		xAxis: {
			type: 'category',
			data: [ '', '' ],
			axisLabel: {
				color: function(value) {
					return theme == 'black' ? '#fff' : 'black';
				}
			},
			axisLine: {
				lineStyle: {
					color: theme == 'black' ? '#fff' : 'black'
				}
			}
		},
		yAxis: {
			name: '', //个
			type: 'value',
			nameTextStyle: {
				color: theme == 'black' ? '#fff' : 'black'
			},
			lineStyle: {
				normal: {
					width: 2
				}
			},
			axisLabel: {
				color: function(value) {
					return theme == 'black' ? '#fff' : 'black';
				}
			},
			axisLine: {
				lineStyle: {
					color: theme == 'black' ? '#fff' : 'black'
				}
			}
		},
		// 图例
		legend: {
			itemGap: 30,
			bottom: 10,
			data: [ '', '' ] //['现存量', '可用量']
		},
		// 悬浮提示
		tooltip: {
			trigger: 'axis'
		},
		series: [
			{
				data: [],
				type: 'bar',
				barWidth: 40, //柱图宽度
				// color: 'green', // 如果每个柱子的颜色相同可以在这里统一配置
				itemStyle: {
					//通常情况下：
					normal: {
						//每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
						color: function(params) {
							var colorList = [ '#4C73FF', '#FFB647', '#00C67E', '#FF7F4C', '#8A48FF', '#22D4D1' ];
							return colorList[params.dataIndex];
						}
					},
					//鼠标悬停时：
					emphasis: {
						shadowBlur: 5,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.2)'
					}
				}
			}
		]
	};
	return option;
};
export default class LineChart extends Component {
	constructor(props) {
		super(props);
		this.myChart = null;
		initLang(this, [ '4004poorder' ], 'pu');
	}

	componentDidMount() {
		this.initEChart();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.data !== this.props.data) {
			this.option.series[0].data = nextProps.data;
			this.option.yAxis.name = nextProps.supplementCunit;
			this.myChart.setOption(this.option);
		}
	}
	initEChart = async () => {
		this.myChart = echarts.init(document.getElementById('chart'));
		this.option = await getOption();
		// option多语处理
		this.option.legend.data = [
			getLangByResId(this, '4004POORDER-000126'),
			getLangByResId(this, '4004POORDER-000127')
		]; /* 国际化处理：现存量, 可用量*/
		this.option.xAxis.data = [
			getLangByResId(this, '4004POORDER-000126'),
			getLangByResId(this, '4004POORDER-000127')
		]; /* 国际化处理：现存量, 可用量*/
		//option.yAxis.name = '个'; /* 国际化处理：个*/
		this.option.series[0].data = this.props.data;
		this.myChart.setOption(this.option);
	};
	render() {
		return <div id="chart" style={{ height: 300, width: 500 }} />;
	}
}
