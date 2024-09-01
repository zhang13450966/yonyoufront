import React, {Component} from 'react';
import './index.less';



/**
 * @method 必选条件提示
 * @desc 例如：组织级节点，先选择组织的提示
 */
export class NecessaryConditionTips extends Component{
	
	constructor(props){
		super(props);
	}

	render(){
		return(
			<div className="NecessaryConditionTipsWrapper">
				<ul className="content">
					<li className="top">
						<img src={require('../../assets/images/left_top_arrow.png')}/>
					</li>
					<li className="middle">
						<span>{ this.props.tips ? this.props.tips : 'tip is null'}</span>
					</li>
				</ul>
			</div>
		)
	}
}
