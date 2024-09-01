import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCFormControl } = base;
import Utils from "@public/utils";
const { langCheck } = Utils;

export default class TimerInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: "",
        };
    }

    onChange = (val) => {
        this.interval = new Date().getTime();
        let s = setTimeout(() => {
            if (new Date().getTime() - this.interval >= 500) {
                this.props.onSearch(val);
            }
            clearTimeout(s);
        }, 500);

        this.setState({
            searchVal: val,
        });
    };
    render() {
        const { searchVal } = this.state;
        return (
            <NCFormControl
                className="report-form-control"
                type="search"
                value={searchVal}
                placeholder={langCheck("reportMultiLang", "100301-000110")}
                onChange={this.onChange}
                onSearch={() => this.props.onSearch(searchVal)}
            />
        );
    }
}
