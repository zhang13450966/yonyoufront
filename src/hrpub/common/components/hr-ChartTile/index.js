import React from "react";
import DonutChart from "src/hrpub/common/components/hr-ChartTile/components/DonutChart";
import './index.less';
import ico_refresh from 'src/hrpub/common/components/hr-ChartTile/public/img/refresh.png';
import {isBlackBg} from 'src/hrpub/common/utils/utils';

export default class HRChartTile extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         platformTheme: undefined, //'light', 'dark'
      }
   }

   componentDidMount() {
      this.probeAppliedTheme();
   }

   componentDidUpdate(prevProps, prevState, snapshot) {
   }

   componentWillUnmount() {
   }

   calcBoxSize = (size) => {
      const calc = span => span * 176 + (span - 1) * 9;
      return {
         height: calc(size.row),
         width: calc(size.col),
      }
   };

   probeAppliedTheme = () => {
      this.setState({
         platformTheme: isBlackBg() ? 'dark' : 'light'
      });
   };

   render() {
      return (
          <If condition={this.state.platformTheme}>
             <div
                 /*style={this.calcBoxSize(this.props.size)}*/
                 className={`hr-chartTile-${this.state.platformTheme}`}
             >
                <span className='hr-chartTile-title'>{this.props.title}</span>
                <If condition={this.props.chartData !== null}>
                   <DonutChart data={this.props.chartData}
                               revealMore={this.props.revealMore}
                               placeholder = {this.props.placeholder}
                               morepalceholder = {this.props.morepalceholder}
                               onMoreClick={this.props.onMoreClick}
                               //style={{margin: '8px 32px 0 30px'}}
                               theme={this.state.platformTheme}
                   />
                </If>
                 <span onClick={this.props.onRefreshClick}
                       className="hr-chartTile-ico-refresh hrfont">
                           &#xe61e;
                  </span>
                            
             </div>
          </If>
      );
   }
}