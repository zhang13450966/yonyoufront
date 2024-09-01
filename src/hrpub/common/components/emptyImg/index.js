/**
 * Created by weishp3
 */
import React, { Component } from 'react'
import { high, createPage, ajax, base } from 'nc-lightapp-front'
import './index.less'
// import imgurl from '../../static/images/empty.png'
class EmptyImg extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (<div style={{height: this.props.height || '100%'}} className="wrapper-empty">
             {/* <img src={imgurl} alt='数据为空'/> */}
             <span>{this.props.text}</span>
        </div>)
    }

   
    
}
export default  EmptyImg
