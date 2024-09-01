import React, { Component } from "react";
import { base } from "nc-lightapp-front";
const { NCMenu, NCDropdown, NCButton, NCCheckbox } = base;
const { Item } = NCMenu;
import BtnItemTip from "@public/components/BtnItemTip";

class ButtonConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onVisibleChange = (key, visible) => {
        this.setState({ [key + "Visible"]: visible });
    };

    onButtonListClick = (key, v) => {
        this.setState(
            { [key + "Visible"]: false },
            () => this.props.onButtonListClick(key, v),
        );
    };

    render() {
        const {
            showSortAndFilter,
            sortAndFilterArea,
            buttons,
            cancelDisabled,
            usedColumMap = {},
        } = this.props;

        const { coords } = cancelDisabled || {};
        const { sortColumns, filterColumns } = usedColumMap;

        return Object.entries(buttons).map(([key, group], index) => {
            let dom = null;

            let disabled = true;
            if (key === "filter" || key === "sort") {
                disabled = sortAndFilterArea ? true : false;
            } else {
                disabled = false;
            }
            let cancelSort = disabled,
                cancelFilter = disabled;
            const selectMenu = (
                <NCMenu
                    className="button-config-menu button-app-dropdown-menu-wrapper"
                    onClick={v => {
                        if (key !== "onTreeShow")
                            this.onButtonListClick(key, v);
                    }}
                >
                    {group.children
                        .filter(
                            ele =>
                                !ele.checkbox ||
                                (ele.checkbox && ele.checkbox.visible),
                        )
                        .map(ele => {
                            if (ele.value === "cancel_sort") {
                                if (coords.col && !sortColumns[coords.col])
                                    cancelSort = true;
                            } else if (ele.value === "cancel_filter") {
                                if (coords.col && !filterColumns[coords.col])
                                    cancelFilter = true;
                            }
                            const itemDisabled =
                                ele.value === "cancel_sort"
                                    ? cancelSort
                                    : ele.value === "cancel_filter"
                                        ? cancelFilter
                                        : disabled;
                            return (
                                <Item
                                    className={`dropdown-btn-item ${
                                        itemDisabled ? "disabled" : ""
                                    } nc-theme-menu-item`}
                                    disabled={itemDisabled}
                                    key={ele.value}
                                    fieldid={ele.value}
                                    title={ele.label}
                                >
                                    {ele.checkbox && ele.checkbox.visible ? (
                                        <NCCheckbox
                                            checked={ele.checkbox.isChecked}
                                            disabled={ele.checkbox.disabled}
                                            onChange={v =>
                                                this.onButtonListClick(
                                                    key,
                                                    "onTreeShow",
                                                )
                                            }
                                        >
                                            {ele.label}
                                        </NCCheckbox>
                                    ) : (
                                        <div className="dropdown-btn-item-box">
                                            <BtnItemTip overlay={ele.label}>
                                                <span className="btn-item-left">
                                                    {ele.label}
                                                </span>
                                            </BtnItemTip>

                                            {ele.after ? (
                                                <span className="btn-item-right">
                                                    {ele.after}
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                </Item>
                            );
                        })}
                </NCMenu>
            );
            dom = (
                <div className="btn-box" id={`${key}ID`}>
                    {group.type === "select" ? (
                        <NCDropdown
                            onVisibleChange={this.onVisibleChange.bind(
                                this,
                                key,
                            )}
                            trigger={["click"]}
                            overlay={selectMenu}
                            animation="slide-up"
                            fieldid={key}
                            // getPopupContainer={() =>
                            //     document.getElementById(`${key}ID`)
                            // }
                        >
                            <NCButton
                                fieldid={key}
                                is_arrow={true}
                                className="dropdown-component"
                            >
                                {group.label}
                                <span
                                    className={`arrow icon iconfont ${
                                        this.state[key + "Visible"]
                                            ? "icon-hangcaozuoxiangshang1"
                                            : "icon-hangcaozuoxiala1"
                                    }`}
                                />
                            </NCButton>
                        </NCDropdown>
                    ) : (
                        <div>
                            <NCButton
                                disabled={disabled}
                                onClick={() =>
                                    this.onButtonListClick(key, "filter")
                                }
                                className="btn left-radius"
                                fieldid={key}
                            >
                                {group.label}
                            </NCButton>
                            <NCDropdown
                                onVisibleChange={this.onVisibleChange.bind(
                                    this,
                                    key,
                                )}
                                trigger={["click"]}
                                overlay={selectMenu}
                                animation="slide-up"
                                fieldid={key}
                                // getPopupContainer={() =>
                                //     document.getElementById(`${key}ID`)
                                // }
                                //placement="bottomRight"
                            >
                                <NCButton
                                    className={"output-container"}
                                    fieldid={key}
                                    is_arrow={true}
                                >
                                    <i
                                        className={`icon iconfont ${
                                            this.state[key + "Visible"]
                                                ? "icon-hangcaozuoxiangshang1"
                                                : "icon-hangcaozuoxiala1"
                                        }`}
                                    />
                                </NCButton>
                            </NCDropdown>
                        </div>
                    )}
                </div>
            );

            if (!showSortAndFilter && (key === "filter" || key === "sort"))
                dom = null;
            return dom;
        });
    }
}

export default ButtonConfig;
