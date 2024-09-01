import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCTooltip } = base;

export default class BtnItemTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipStatus: false,
        };
        this.tipConfirm = false;
        this.dom = React.createRef();
    }

    componentDidMount() {
        //this.itemDom.clientWidth<this.itemDom.scrollWidth
        // 初始化是否显示tip
        if (this.dom) {
            let tipItem = this.dom.querySelector(".btn-item-left");
            if (tipItem && tipItem.offsetWidth > 200) {
                this.tipConfirm = true;
                this.setState({ tipStatus: true });
            }
        }
    }

    componentDidUpdate() {
        if (this.dom && !this.tipConfirm) {
            let tipItem = this.dom.querySelector(".btn-item-left");
            if (tipItem && tipItem.offsetWidth > 200) {
                this.tipConfirm = true;
                this.setState({ tipStatus: true });
            }
        }
    }

    render() {
        return (
            <NCTooltip
                overlay={this.state.tipStatus ? this.props.overlay : ""}
                inverse
                delayShow={500}
                delay={1}
            >
                <span
                    ref={(dom) => {
                        this.dom = dom;
                    }}
                >
                    {this.props.children}
                </span>
            </NCTooltip>
        );
    }
}
