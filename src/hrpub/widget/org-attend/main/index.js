/**
 * 部门假勤
 */
import React, { Component } from 'react';
import Img from './download.svg';
import Charts from './charts.png';
import './index.css';

import {createPage } from 'nc-lightapp-front'
import resData from './data.js'

const locale ='zh_CN'
const widgetName = "部门假勤"

class CostAnalysis extends Component {
    constructor(props) {
        super(props);
        this.state={
            data: [1,3,1,3,4,0],
            trend: {
                zh_CN: '平均工时变动趋势',
                zh_TW: '平均工時變動趨勢',
                en_US: 'Avg. Work Hrs Trend'
            },
            mounthI18n: {
                en_US: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        }
    }

	clickHandler() {
        // dispatch('openService', {
		// 	serviceCode,
        // })
        window.open('https://workbench-daily.yyuap.com/#/service/HRTD020/HRTD020')
	}
    reLoad=(e)=>{
        e.preventDefault();
        e.stopPropagation();
    }
   

  render() {
    return (
      <div className="wrap" onClick={this.clickHandler}>
          <div className="titleContainer">
              <div className="title">
                  {widgetName}
              </div>
          </div>
		  <div id ="attend_echart_line" className="echartContainer">
          <div>
              <img  src={Charts}/>
          </div>
          
		  </div>
          <div>
              <a>
                  <img className="svg" src={Img} onClick={this.reLoad} />
                  <span className="worktimeTitle">{this.state.trend[locale]}</span>
              </a>
          </div>
      </div>
    );
  }
}

// export default CostAnalysis;
let TestPage = createPage({})(CostAnalysis)
ReactDOM.render(<TestPage />, document.querySelector('#app'));