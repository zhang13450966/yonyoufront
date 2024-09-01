/*
 * @Author: bbqin
 * @Date: 2021-07-09 13:52:24
 * @LastEditTime: 2021-07-09 16:03:16
 * @LastEditors: bbqin
 * @Description: 基础的穿梭UI，基础的穿梭逻辑
 * @FilePath: \Platform_Front\src\platform\base\TransferBox\transfer.js
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