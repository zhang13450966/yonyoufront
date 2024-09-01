/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:52:24
 * @LastEditTime: 2021-07-09 14:14:20
 * @LastEditors: bbqin
 * @Description: 任意源和任意结果
 * @FilePath: \Platform_Front\src\platform\base\TransferBox\sourceToTarget.js
 * 这锅我不背
 */
import React, { Component } from 'react';

export default class Transfer extends Component {
    render() {
        let { className } = this.props
        // vertical // horizontal
        return <div className={`transfer-wrapper ${className}`} />;
    }
}