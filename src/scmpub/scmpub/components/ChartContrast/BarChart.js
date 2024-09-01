/*
 * @Author: hufei 
 * @PageInfo: 图表对比柱状图  
 * @Date: 2019-01-23 14:53:35 
 * @Last Modified by: yangls7
 * @Last Modified time: 2019-08-14 10:19:24
 */
import React, { Component } from 'react';
import echarts from 'echarts';
let option = {
	// 全图默认背景
	theme: {
		backgroundColor: '#000'
	},
	grid: {
		bottom: 80,
		left: 85
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			animation: true
		},
		formatter: null
	},
	xAxis: {
		type: 'category',
		data: [],
		axisLabel: {
			interval: 0,
			rotate: 20
		}
	},
	yAxis: {
		type: 'value'
	},
	series: [
		{
			type: 'bar',
			data: [],
			barMinWidth: 20,
			barMaxWidth: 40
		}
	],
	color: [ '#E14C46' ]
};
export default class BarChart extends Component {
	constructor(props) {
		super(props);
		this.myChart = null;
	}

	componentDidMount() {
		this.myChart = echarts.init(document.getElementById('chart'));
		let { data } = this.props;
		this.setData(data);
	}

	componentDidUpdate() {
		this.myChart.resize();
	}

	setData = (data) => {
		option.xAxis.data = data.titles;
		option.series[0].data = data.nums;
		// 隐藏loading
		this.myChart.hideLoading();
		// 绘制图表
		this.myChart.setOption(option);
		// 调整浏览器窗口时重新调整图表大小
		window.onresize = () => {
			this.myChart.resize();
		};
	};

	render() {
		return <div className="bar-chart" id="chart" style={{ height: 500, width: 600 }} />;
	}
}
