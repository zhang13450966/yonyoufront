/**
 * 右键适配说明
 *  createContextMenu({contentId: "gridContainer", menus: [], visible: true})
 *  contentId: 右键dom所在的父元素  menus:模板数据 visible:是否显示
 * menus模板解析
 *  {
      code: 右键选项的value,
      label: 右键选项的display,
      before: 右键选项最左侧显示的图标，例如："fuzhi"",
      after: 右键选项最右侧显示的文字，例如："Ctrl+X",
      hidden: 显示/隐藏,
      onSelect: 点击回调,
      checked: 是否选中，如果选中，会出现一个 ✔️ 的icon
      type: "separator", //区分线
      submenu: 二级菜单，数组，传入数据同上
      checkbox: checkbox选中的节点
    },

  具体可参见 报表数据中心右键样式，示例代码可参考 /ufoe/pages/dataCenter/core/gridEngine/contextMenu/index.js
 */

import React, { useRef, useState, useEffect } from "react";
import { base } from "nc-lightapp-front";
const { NCFormControl, NCCheckbox } = base;
import "./context.less";

const contextId = "simpleReport-context-menu-contanter";

const MENUHEIGHT = 29;

function CreateSubMenu(props) {
    const { targetPosition, currentParent = {}, onClose } = props;
    const { submenu = [] } = currentParent;
    const [text, setText] = useState("");
    const currentRef = useRef(null);
    const [pos, setPos] = useState({});

    useEffect(() => {
        function getCellPosition() {
            const [x, y, MENUWIDTH] = targetPosition;

            const subHeight = submenu.length * MENUHEIGHT;
            const clientHeight = window.innerHeight;
            let offsetY = y;
            if (subHeight + y > clientHeight - 20) {
                offsetY -= subHeight + y - clientHeight + 20;
            }
            let left = parseInt(x) + MENUWIDTH;
            const subWidth = currentRef.current.clientWidth;

            if (window.innerWidth <= left + subWidth) {
                //兼容超出屏幕
                left = parseInt(x) - subWidth;
            }
            return [left, offsetY];
        }

        //计算submenu坐标
        const [left, top] = getCellPosition();
        setPos({ left, top });
    }, []);

    function getLable(item) {
        return item.type === "text" ? (
            <span>
                {item.label.split("$$$$")[0]}
                <NCFormControl
                    wrapperClassName="context-wrapper"
                    className="context-text"
                    value={text}
                    // autoFocus
                    type="number"
                    min={1}
                    onChange={(val) => {
                        setText(val);
                    }}
                    onKeyDown={(e) => {
                        if (e.keyCode == 13) {
                            if (!text) return;
                            item.onSelect(text);
                            onClose();
                        }
                    }}
                    // onSearch={}
                />
                {item.label.split("$$$$")[1]}
            </span>
        ) : (
            item.label
        );
    }

    return ReactDOM.createPortal(
        <React.Fragment>
            <div ref={currentRef} className="context-submenu" style={pos}>
                {submenu.map((item) => (
                    <div
                        key={item.label}
                        className={`contextMenu--option second-menu ${
                            handleHidden(item.hidden) ? "hidden" : ""
                        }
            ${handleHidden(item.disabled) ? "disabled" : ""}
            ${item.type === "separator" ? "htSeparator" : ""}
            `}
                        onClick={(e) => {
                            if (
                                handleHidden(item.disabled) ||
                                item.type === "text"
                            )
                                return;
                            e.stopPropagation();
                            item.onSelect();
                        }}
                    >
                        <div
                            className={`menu-label submenu-label ${
                                currentParent.canChecked ? "can-checked" : ""
                            }`}
                        >
                            {item.checked && (
                                <span className="icon iconfont icon-liucheng1" />
                            )}
                            {getLable(item)}
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>,
        document.body
    );
}

class ContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            showSubMenu: false,
        };
    }

    componentDidMount() {
        const dom = document.getElementById(this.props.contentId);
        // const contanter = document.getElementById(contextId);
        if (dom) {
            dom.addEventListener("contextmenu", this._handleContextMenu);
        }
        document.addEventListener("click", this._handleClick);
        document
            .getElementsByClassName("wtHolder")[0]
            .addEventListener("scroll", this._handleScroll);
    }

    componentWillUnmount() {
        const dom = document.getElementById(this.props.contentId);
        //  const contanter = document.getElementById(contextId);
        if (dom) {
            dom.removeEventListener("contextmenu", this._handleContextMenu);
        }
        document.removeEventListener("click", this._handleClick);
        document
            .getElementsByClassName("wtHolder")[0]
            .removeEventListener("scroll", this._handleScroll);
    }

    _handleContextMenu = (event) => {
        event.preventDefault();
        if (
            (event.target.className === "label" ||
                event.target.className.indexOf("highlight") > -1 ||
                event.target.className.indexOf("current") > -1 ||
                event.currentTarget.id === "reportTable" ||
                event.currentTarget.id === "simpleTableReport") &&
            this.props.visible
        ) {
            this.setState({ visible: true, showSubMenu: false });

            const clickX = event.clientX;
            const clickY = event.clientY;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const rootW = this.root.offsetWidth;
            const rootH = this.root.offsetHeight;

            const right = screenW - clickX > rootW;
            const left = !right;
            const top = screenH - clickY > rootH;

            if (right) {
                this.root.style.left = `${clickX + 5}px`;
            }

            if (left) {
                this.root.style.left = `${clickX - rootW - 5}px`;
            }

            if (top) {
                this.root.style.top = `${clickY + 5}px`;
            } else {
                this.root.style.top = screenH - rootH - 5 + "px";
            }
        }
    };

    _handleClick = (event) => {
        const { visible } = this.state;
        const { menus } = this.props;
        if (menus.length) {
            const parentClass =
                (event.target.parentNode &&
                    event.target.parentNode.className) ||
                "";
            const targetClass = (event.target && event.target.className) || "";

            if (
                visible &&
                (!parentClass || parentClass.indexOf("context-text") < 0) &&
                (!targetClass || targetClass.indexOf("context-text") < 0)
            ) {
                if (parentClass.includes("menu-item-tree-show")) {
                    return;
                }
                // 可能会有问题，找不到className

                const wasOutside = event.target.contains !== this.root;

                if (wasOutside && visible) this.closeContext();
            }
        }
    };

    closeContext = () => {
        this.setState({ visible: false, showSubMenu: false });
    };

    _handleScroll = () => {
        const { visible } = this.state;
        if (visible) {
            if (visible) this.closeContext();
        }
    };

    render() {
        const {
            visible,
            showSubMenu,
            currentParent,
            targetPosition,
            currentHover,
        } = this.state;
        const { menus, contentId } = this.props;

        return (
            (visible || null) && (
                <div
                    m
                    ref={(ref) => {
                        this.root = ref;
                    }}
                    className="contextMenu"
                >
                    {menus.map((item) => {
                        const {
                            submenu,
                            type,
                            hidden,
                            disabled,
                            onSelect,
                            before,
                            label,
                            after,
                            isChecked,
                            code,
                        } = item;
                        return (
                            <div
                                key={code}
                                className={`contextMenu--option ${
                                    submenu ? "htSubmenu" : ""
                                } ${
                                    type === "separator" ? "htSeparator" : ""
                                } ${handleHidden(hidden) ? "hidden" : ""}
              ${handleHidden(disabled) ? "disabled" : ""} ${
                                    currentHover === code ? "hover-status" : ""
                                }
              `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                        submenu ||
                                        handleHidden(disabled) ||
                                        type === "checkbox"
                                    )
                                        return;
                                    onSelect();
                                    if (contentId === "simpleTableReport")
                                        this.closeContext();
                                }}
                                onMouseEnter={(e) => {
                                    if (!submenu) {
                                        this.setState({
                                            showSubMenu: false,
                                            currentHover: code,
                                        });
                                    } else {
                                        this.setState({
                                            showSubMenu: true,
                                            currentParent: item,
                                            currentHover: code,
                                            targetPosition: [
                                                this.root.style.left,
                                                e.currentTarget.offsetTop +
                                                    this.root.offsetTop,
                                                this.root.clientWidth,
                                            ],
                                        });
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!showSubMenu && currentHover) {
                                        this.setState({
                                            currentHover: false,
                                            showSubMenu: false,
                                        });
                                    }
                                }}
                            >
                                <div className="menu-label">
                                    {before && (
                                        <span
                                            className={`option--before icon iconfont icon-${before}`}
                                        />
                                    )}
                                    {type === "checkbox" ? (
                                        <NCCheckbox
                                            checked={isChecked}
                                            onChange={onSelect}
                                            className="menu-item-tree-show"
                                        >
                                            {label}
                                        </NCCheckbox>
                                    ) : (
                                        label
                                    )}
                                </div>
                                {submenu && (
                                    <span className="option--after sub-icon"></span>
                                )}
                                {after && (
                                    <span className="option--after">
                                        {after}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                    {(showSubMenu || null) && (
                        <CreateSubMenu
                            targetPosition={targetPosition}
                            currentParent={currentParent}
                            onClose={() => this.closeContext()}
                        />
                    )}
                </div>
            )
        );
    }
}

function handleHidden(hidden) {
    if (!hidden) return false;
    if (typeof hidden === "function") {
        return hidden();
    } else {
        return hidden;
    }
}

function createContextMenu(props) {
    const { hidden } = props;
    if (hidden) return;
    if (!document.getElementById(contextId)) {
        const dom = document.createElement("div");
        dom.id = contextId;
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(dom);
    }
    ReactDOM.render(
        <ContextMenu {...props} />,
        document.getElementById(contextId)
    );
}
export default createContextMenu;
