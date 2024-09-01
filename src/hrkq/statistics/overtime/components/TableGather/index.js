import React, {Component} from 'react';

import {connect} from 'src/hrpub/common/store';
import {base} from 'nc-lightapp-front';
import {formatDate} from 'src/hrpub/common/utils/utils.js'
import config from '../../config/index';
// css
import './index.less';
// components

let {NCTable} = base;

export default class extends Component {
    constructor(props) {
        super(props);
    }

    getTableHeight = () => {
        const mainTable = document.getElementsByClassName('container-wrap');
        let tableHeight = 0;
        if (mainTable[0]) {
            tableHeight = mainTable[0].clientHeight - 140
        }
        return tableHeight;
    }

    render() {
        const {
            props: {
                editTable: {createEditTable},
                onRowDoubleClick
            }
        } = this;

        return (<div className="table flex-container" style={{height: this.getTableHeight()}}>
            {
                createEditTable('gather_list', {
                    height: this.getTableHeight(),
                    onRowDoubleClick: onRowDoubleClick,
                    cancelCustomRightMenu: true
                })
            }
        </div>);
    }
}
