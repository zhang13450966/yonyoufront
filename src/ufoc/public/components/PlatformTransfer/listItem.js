/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:47:25
 * @LastEditTime: 2022-04-24 14:26:06
 * @LastEditors: Please set LastEditors
 * @Description: 懒加载、单体更新
 * @FilePath: \Platform_Front\src\platform\components\Transfer\listItem.js
 * 这锅我不背
 */
import React, { Component } from 'react';
import classNames from 'classnames';
// import PureRenderMixin from './PureRenderMixin';
import Lazyload from 'react-lazy-load';
import {base} from 'nc-lightapp-front'

let { NCCheckbox:Checkbox } = base;

class Item extends Component {
    shouldComponentUpdate(...args) {
        // 更新优化，后面在做
        // return PureRenderMixin.shouldComponentUpdate.apply(this, args);
        return true;
    }

    render() {
        const { render, filter, item, lazy, checked, prefixCls, onClick, renderedText, renderedEl, showCheckbox, checkedKeys, isMultiDragSource, draggingItemId, onDoubleClick } = this.props;
        const isAttachedDraggingItem = checked && !isMultiDragSource && draggingItemId
        const className = classNames({
            [`${prefixCls}-content-item`]: true,
            [`${prefixCls}-content-item-disabled`]: item.disabled || isAttachedDraggingItem,
            [`${prefixCls}-content-item-selected`]: checked && !isAttachedDraggingItem,
        });

        const lazyProps = {
            height: 32,
            offset: 500,
            throttle: 0,
            debounce: false,
            ...lazy,
        };

        let lazyFlag = true;
        if (lazy && lazy.container == "modal") {
            lazyFlag = false
        }
        if (!lazyFlag) {
            return (
                <li
                    className={className}
                    title={renderedText}
                    onClick={item.disabled ? undefined : e => {
                        if (this.only) {
                            return;
                        }
                        const shiftKey = e.shiftKey;
                        this.only = setTimeout(() => {
                            this.only && onClick(item, shiftKey)
                            this.only && (this.only = false);
                        }, 300)
                    }}
                    onDoubleClick={item.disabled ? undefined : e => {
                        this.only = false;
                        onDoubleClick(e)
                    }}
                >
                    <Checkbox checked={checked} disabled={item.disabled} onClick={item.disabled ? undefined : e => {
                        const shiftKey = e.shiftKey;
                        onClick(item, shiftKey);
                    }} />
                    <span>{renderedEl}</span>
                </li>
            )
        } else {
            return (
                <Lazyload {...lazyProps}>
                    <li
                        className={className}
                        title={renderedText}
                        onClick={item.disabled ? undefined : e => {
                            if (this.only) {
                                return;
                            }
                            const shiftKey = e.shiftKey;
                            this.only = setTimeout(() => {
                                this.only && onClick(item, shiftKey);
                                this.only && (this.only = false);
                            }, 300)
                        }}
                        onDoubleClick={item.disabled ? undefined : e => {
                            this.only = false;
                            onDoubleClick(e);
                        }}
                    >
                        {
                            showCheckbox ?
                                <Checkbox
                                    checked={checked && !isAttachedDraggingItem}
                                    disabled={item.disabled || isAttachedDraggingItem}
                                    onClick={item.disabled ? undefined : e => {
                                        const shiftKey = e.shiftKey;
                                        onClick(item, shiftKey);
                                    }}
                                /> : ''
                        }
                        <span>{renderedEl}</span>
                        {(isMultiDragSource && checkedKeys.length > 1) && <span className="multi-drag-count">{checkedKeys.length}</span>}
                    </li>
                </Lazyload>
            );
        }

    }
}

export default Item;