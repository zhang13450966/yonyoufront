/**
 * Created by wanghongxiang on 2019/2/19.
 */
import React, {Component} from 'react';
// import '../../static/fonts/iconfont.css';
import './index.less'

export default class HRBack extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let {onClick, className = '', title = '请输入名称', ...other} = this.props;
        return (
            <div className="ncc-hr-back" {...other}>
                <span
                    className={`icon hrfont hr-left ${className}`}
                    onClick={() => {
                        if (onClick && typeof onClick === 'function') {
                            onClick();
                        }
                    }}
                />
                {/*<span className="hr-back-title">{title}</span>*/}
            </div>
        )
    }
}