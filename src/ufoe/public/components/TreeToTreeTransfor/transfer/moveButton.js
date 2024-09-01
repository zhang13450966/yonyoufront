/*
 * @Author: bbqin
 * @Date: 2021-07-09 14:07:54
 * @LastEditTime: 2022-04-24 14:26:59
 * @LastEditors: Please set LastEditors
 * @Description: 垂直移动 水平移动 主要来控制事件回调和按钮状态
 * @FilePath: \Platform_Front\src\platform\components\Transfer\moveButton.js
 * 这锅我不背
 */
import React, { Component } from 'react';

import {base} from 'nc-lightapp-front'

let { NCTooltip:Tooltip, NCButton:Button }  = base;
import PropTypes from 'prop-types';

function noop() {
}

const propTypes = {
    className: PropTypes.string,
    leftArrowText: PropTypes.string,
    rightArrowText: PropTypes.string,
    moveToLeft: PropTypes.func,
    moveToRight: PropTypes.func,
    leftActive: PropTypes.boolean,
    rightActive: PropTypes.boolean,
}

const defaultProps = {
    leftArrowText: '',
    rightArrowText: '',
    hiddenAllMoveBtns: false,
    moveToLeft: noop,
    moveToRight: noop,
};

class MoveButton extends Component {
    render() {
        const {
            left = {},
            allLeft = {},
            right = {},
            allRight = {},
            up = {},
            top = {},
            down = {},
            bottom = {},
            className = '',
            renderOperation,
            langJson = {},
            direction = 'horizontal',
            hiddenAllMoveBtns,
        } = this.props;

        let buttonGroup = null;

        if (direction === 'horizontal') {

            this.rightVisible = right.active ? (this.rightVisible || {}) : { visible: false };
            const moveToRightButton =
                <Button size="sm" className="transfer-operation-button to-right" disabled={!right.active} onClick={right.move}>
                    <Tooltip
                        placement="top"
                        overlay={langJson['container-transfer-right'] || 'right'}
                        delayHide={1}
                        delayShow={1000}
                        trigger={'hover'}
                        {...this.rightVisible}
                    >
                        {<span
                            onMouseEnter={e => {
                                this.rightVisible.delay = setTimeout(() => {
                                    right.active && (this.rightVisible = { visible: true });
                                    this.forceUpdate();
                                }, 1000);
                            }}
                            onClick={() => {
                                clearTimeout(this.rightVisible.delay);
                            }}
                            onMouseLeave={e => {
                                clearTimeout(this.rightVisible.delay);
                                this.rightVisible = { visible: false };
                                this.forceUpdate();
                            }}
                        >{right.text}&gt;{/* <i className="iconfont icon-chuansuo-you"></i> */}</span>}
                        </Tooltip>
                </Button>;

            this.allRightVisible = allRight.active ? (this.allRightVisible || {}) : { visible: false };
            const moveAllToRightButton = hiddenAllMoveBtns ? null :
                <Button size="sm" className="transfer-operation-button all-to-right" disabled={!allRight.active} onClick={allRight.move}>
                    <Tooltip
                        placement="top"
                        overlay={langJson['container-transfer-right-all'] || 'all to right'}
                        delayHide={1}
                        delayShow={1000}
                        trigger={'hover'}
                        {...this.allRightVisible}
                    >
                        {<span
                            onMouseEnter={e => {
                                this.allRightVisible.delay = setTimeout(() => {
                                    allRight.active && (this.allRightVisible = { visible: true });
                                    this.forceUpdate();
                                }, 1000);
                            }}
                            onClick={() => {
                                clearTimeout(this.allRightVisible.delay);
                            }}
                            onMouseLeave={e => {
                                clearTimeout(this.allRightVisible.delay);
                                this.allRightVisible = { visible: false };
                                this.forceUpdate();
                            }}
                        >{allRight.text}&gt;&gt;{/* <i className="iconfont icon-chuansuo-quanbuyou"></i> */}</span>}</Tooltip>
                </Button>;

            this.leftVisible = left.active ? (this.leftVisible || {}) : { visible: false };
            // to-left
            const moveToLeftButton = <Button size="sm" className="transfer-operation-button " disabled={!left.active} onClick={left.move}>
                <Tooltip
                    placement="top"
                    overlay={langJson['container-transfer-left'] || 'left'}
                    delayHide={1}
                    delayShow={1000}
                    trigger={'hover'}
                    {...this.leftVisible}
                >
                    {<span
                        onMouseEnter={e => {
                            this.leftVisible.delay = setTimeout(() => {
                                left.active && (this.leftVisible = { visible: true });
                                this.forceUpdate();
                            }, 1000);
                        }}
                        onClick={() => {
                            clearTimeout(this.leftVisible.delay);
                        }}
                        onMouseLeave={e => {
                            clearTimeout(this.leftVisible.delay);
                            this.leftVisible = { visible: false };
                            this.forceUpdate();
                        }}
                    >{left.text}&lt;{/* <i className="iconfont icon-chuansuo-you"></i> */}</span>}
                </Tooltip>
            </Button>;

            this.allLeftVisible = allLeft.active ? (this.allLeftVisible || {}) : { visible: false };
            const moveAllToLeftButton = hiddenAllMoveBtns ? null :
                // all-to-left
                <Button size="sm" className="transfer-operation-button " disabled={!allLeft.active} onClick={allLeft.move}>
                    <Tooltip
                        placement="top"
                        overlay={langJson['container-transfer-left-all'] || 'all to left'}
                        delayHide={1}
                        delayShow={1000}
                        trigger={'hover'}
                        {...this.allLeftVisible}
                    >
                        {<span
                            onMouseEnter={e => {
                                this.allLeftVisible.delay = setTimeout(() => {
                                    allLeft.active && (this.allLeftVisible = { visible: true });
                                    this.forceUpdate();
                                }, 1000);
                            }}
                            onClick={() => {
                                clearTimeout(this.allLeftVisible.delay);
                            }}
                            onMouseLeave={e => {
                                clearTimeout(this.allLeftVisible.delay);
                                this.allLeftVisible = { visible: false };
                                this.forceUpdate();
                            }}
                        >{allLeft.text}&lt;&lt;{/* <i className="iconfont icon-chuansuo-quanbuyou"></i> */}</span>}
                    </Tooltip>
                </Button >;

            buttonGroup = <div className={' transfer-operation-button-group ' + className}>
                {/* <div className={' transfer-operation-button-container '}> */}
                {moveToRightButton}
                {moveAllToRightButton}
                {moveToLeftButton}
                {moveAllToLeftButton}
                {renderOperation && renderOperation()}
                {/* </div> */}
            </div>;
        } else {

            this.upVisible = up.active ? (this.upVisible || {}) : { visible: false };
            const moveUpButton = <Button size="sm" className="transfer-operation-button to-up upmargin" disabled={!up.active} onClick={up.move}>
                <Tooltip
                    placement="top"
                    overlay={langJson['container-transfer-up'] || 'up'}
                    delayHide={1}
                    delayShow={up.active ? 1000 : 1}
                    trigger={'hover'}
                    {...this.upVisible}
                >
                    {<span
                        onMouseEnter={e => {
                            this.upVisible.delay = setTimeout(() => {
                                up.active && (this.upVisible = { visible: true });
                                this.forceUpdate();
                            }, 1000);
                        }}
                        onClick={() => {
                            clearTimeout(this.upVisible.delay);
                        }}
                        onMouseLeave={e => {
                            clearTimeout(this.upVisible.delay);
                            this.upVisible = { visible: false };
                            this.forceUpdate();
                        }}
                    >{up.text}<i className="iconfont icon-chuansuo-you"></i></span>}</Tooltip>
            </Button>;

            this.topVisible = top.active ? (this.topVisible || {}) : { visible: false };
            const moveAllToTopButton = <Button size="sm" className="transfer-operation-button upmargin all-to-top" disabled={!top.active} onClick={top.move}>
                <Tooltip
                    placement="top"
                    overlay={langJson['container-transfer-up-top'] || 'all to top'}
                    delayHide={1}
                    delayShow={1000}
                    trigger={'hover'}
                    {...this.topVisible}
                >
                    {<span
                        onMouseEnter={e => {
                            this.topVisible.delay = setTimeout(() => {
                                top.active && (this.topVisible = { visible: true });
                                this.forceUpdate();
                            }, 1000);
                        }}
                        onClick={() => {
                            clearTimeout(this.topVisible.delay);
                        }}
                        onMouseLeave={e => {
                            clearTimeout(this.topVisible.delay);
                            this.topVisible = { visible: false };
                            this.forceUpdate();
                        }}
                    >{top.text}<i className="iconfont icon-chuansuo-quanbuyou"></i></span>}</Tooltip>
            </Button>;

            this.downVisible = down.active ? (this.downVisible || {}) : { visible: false };
            const moveDownButton = <Button size="sm" className="transfer-operation-button upmargin to-down" disabled={!down.active} onClick={down.move}>
                <Tooltip
                    placement="top"
                    overlay={langJson['container-transfer-down'] || 'down'}
                    delayHide={1}
                    delayShow={down.active ? 1000 : 1}
                    trigger={'hover'}
                    {...this.downVisible}
                >
                    {<span
                        onMouseEnter={e => {
                            this.downVisible.delay = setTimeout(() => {
                                down.active && (this.downVisible = { visible: true });
                                this.forceUpdate();
                            }, 1000);
                        }}
                        onClick={() => {
                            clearTimeout(this.downVisible.delay);
                        }}
                        onMouseLeave={e => {
                            clearTimeout(this.downVisible.delay);
                            this.downVisible = { visible: false };
                            this.forceUpdate();
                        }}
                    >{down.text}<i className="iconfont icon-chuansuo-you"></i></span>}</Tooltip>
            </Button>;

            this.bottomVisible = bottom.active ? (this.bottomVisible || {}) : { visible: false };
            const moveAllToBottomButton = <Button size="sm" className="transfer-operation-button upmargin all-to-bottom" disabled={!bottom.active} onClick={bottom.move}>
                <Tooltip
                    placement="top"
                    overlay={langJson['container-transfer-down-bottom'] || 'all to bottom'}
                    delayHide={1}
                    delayShow={bottom.active ? 1000 : 1}
                    trigger={'hover'}
                    {...this.bottomVisible}
                >
                    {<span
                        onMouseEnter={e => {
                            this.bottomVisible.delay = setTimeout(() => {
                                bottom.active && (this.bottomVisible = { visible: true });
                                this.forceUpdate();
                            }, 1000);
                        }}
                        onClick={() => {
                            clearTimeout(this.bottomVisible.delay);
                        }}
                        onMouseLeave={e => {
                            clearTimeout(this.bottomVisible.delay);
                            this.bottomVisible = { visible: false };
                            this.forceUpdate();
                        }}
                    >{bottom.text}<i className="iconfont icon-chuansuo-quanbuyou"></i></span>}</Tooltip>
            </Button>;

            buttonGroup = <div className={' transfer-operation-button-group ' + className}>
                {/* <div className={' transfer-operation-button-container '}> */}
                {moveAllToTopButton}
                {moveUpButton}
                {moveDownButton}
                {moveAllToBottomButton}
                {renderOperation && renderOperation()}
                {/* </div> */}
            </div>;
        }

        return buttonGroup;
    }
}

MoveButton.propsType = propTypes;
MoveButton.defaultProps = defaultProps;

export default MoveButton;