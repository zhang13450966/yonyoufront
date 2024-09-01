/*
 * @Author: wangceb
 * @PageInfo: 暂存数据组件初始化
 * @Date: 2019-03-20 13:40:50
 * @Last Modified by: songyt13
 * @Last Modified time: 2021-10-20 10:21:58
 */
import { ajax } from 'nc-lightapp-front';
import { URL } from '../const';

export default function(props, isFirst) {
	// isFirst 是否为第一次查询，第一次查询时不设置this.isCheck 值

	//优化  如果组件传入的this.props.isQuery 有值 则不再重复查询暂存数据
	if (this.props.isQueryTemp != undefined && this.props.isQueryTemp == false) {
		return;
	}
	ajax({
		url: URL.QUERYTEMPORARY,
		data: this.props.config,
		success: (res) => {
			if (res.data && res.data.tempdata) {
				let rows = res.data.SummaryDTO.map((item) => {
					return {
						title: item
					};
				});

				this.setState({ tempDataList: res.data.tempdata.tempdata, summary: rows });

				!isFirst && (this.isCheck = true); //避免一次查询走2遍(调用setTempData方法会一直重复进入componentWillReceiveProps)
				this.props.setIsQueryTemp && this.props.setIsQueryTemp(false);
			} else {
				this.setState({ tempDataList: {}, summary: [] });
				!isFirst && (this.isCheck = true); //避免一次查询走2遍(调用setTempData方法会一直重复进入componentWillReceiveProps)
				this.props.setIsQueryTemp && this.props.setIsQueryTemp(false);
			}
		}
	});
}
