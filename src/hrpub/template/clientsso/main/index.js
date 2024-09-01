/*
 * @Author: sunzhijun 
 * @Date: 2020-04-22 16:38:19 
 * @Last Modified by: sunzhijun
 * @Last Modified time: 2020-04-22 17:00:21
 */

import React, {Component} from 'react';
import ReactDom from 'react-dom';
import {createPage, base, ajax, toast} from 'nc-lightapp-front';

class ClientSso extends Component {
    constructor(props) {
        super(props);
        this.openClient = this.openClient.bind(this);
    }

    openClient(data) {
        ajax({
            url: '/nccloud/hrpub/ssoclient/NCCSSOClientAction.do',
            // data: {},
            success: res => {
                if (res.success && res.data) {
                    let location = window.location
                    location.port ? window.open("uclient://start/http://"+location.hostname+":"+location.port+res.data):window.open("uclient://start/http://"+location.hostname+res.data)
                }
            }
        })
    }

    componentDidMount() {
        this.openClient();
    }

    render() {
        return (
            <div></div>
        );
    }
}
let Wrapper = createPage({})(ClientSso);
ReactDom.render(<Wrapper/>, document.getElementById('app'));