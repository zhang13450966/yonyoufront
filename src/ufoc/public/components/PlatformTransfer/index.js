/*
 * @Author: bbqin
 * @Date: 2021-07-09 11:10:14
 * @LastEditTime: 2021-07-19 15:12:26
 * @LastEditors: bbqin
 * @Description: 功能出口
 * @FilePath: \Platform_Front\src\platform\base\TransferBox\index.js
 * 这锅我不背
 */

import React, { Component } from 'react';

import ListToListTransfer from './listToList';
import TreeToListTransfer from './treeToList';

export { ListToListTransfer, TreeToListTransfer };
export default class Transfer extends Component {
    render() {
        let { treeType, ...others } = this.props;
        return treeType ? <TreeToListTransfer {...others} /> : <ListToListTransfer {...others} />;
    }
}
