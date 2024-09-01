import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCFormControl } = base;

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
        const { placeholder, disabled, onSearch } = this.props;
        return (
            <NCFormControl
                type="search"
                value={searchVal}
                placeholder={
                    window.formatDesignMultiLang
                        ? formatDesignMultiLang["formatDesign-000646"]
                        : placeholder
                }
                onChange={this.onChange}
                onSearch={() => onSearch(searchVal)}
                disabled={disabled}
            />
        );
    }
}
