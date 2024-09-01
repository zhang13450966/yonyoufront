/**
 * Created by wanghongxiang on 2018/10/19.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {base, ajax, toast} from 'nc-lightapp-front';
const {NCButton, NCRow} = base

const propTypes = {
    // btnConfig: PropTypes.object
};
const defaultProps = {
    btnConfig: []
};
class FormulaBtns extends Component {
    static contextTypes = {
        ctx: PropTypes.object
    }
    constructor(props) {
        super(props)
        this.state = {
            // btnConfig: this.props.btnConfig
            btnConfig: []
        }
        this.onclick = this.onclick.bind(this)
    }
    componentDidMount() {
        this.setState({
            btnConfig: this.props.btnConfig
        })
    }
    onclick(item) {
        let inputSig = item.pos === 'top'? ' '+item.value+' ': item.value
        this.context.ctx.handleState({
            inputSig: inputSig,
            switchDefined: item.value.length
        })
    }
    render() {
        let topArr = [], bottomArr = []
        this.state.btnConfig.forEach(item=>{
            let type = item.pos === 'top' ? 'item-content-btns-top' : 'item-content-btns-bottom'

            if (item.pos === 'top') {
                topArr.push(
                    <NCButton
                        className={`${type} ${this.props.btnClass}`}
                        onClick = {this.onclick.bind(this, item)}
                    >
                        {item.name}
                    </NCButton>
                )
            } else {
                bottomArr.push(
                    <NCButton
                        className={`${type} ${this.props.btnClass}`}
                        onClick = {this.onclick.bind(this, item)}
                    >
                        {item.name}
                    </NCButton>
                )
            }
        })
        return (
            <React.Fragment>
                <div>
                    {
                        topArr
                    }
                </div>
                <div>
                    {
                        bottomArr
                    }
                </div>
            </React.Fragment>
        )
    }
}
FormulaBtns.defaultProps = defaultProps
export default FormulaBtns;

