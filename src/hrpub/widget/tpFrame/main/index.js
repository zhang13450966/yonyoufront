/**
 * Created by guobaogang on 2018/12/4.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ajax, toast} from 'nc-lightapp-front';
import './index.less';

class TPFrame extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (window.location.href.match('localhost:3006')) window.location.hash = '?&c=60081010&p=60081010p&ar=0001Z700APPN60081010';
        ajax({
            url: '/nccloud/hrpub/ref/DailyOnlineUrlAction.do',
            method: 'post',
            data: {},
            success: (res) => {
                if (res.success) this.frameNode.src = res.data;
            },
            error: (err) => {
                toast({
                    color: 'danger',
                    content: err.message
                });
            }
        });
    }

    render() {
        return <iframe className='main-frame' ref={node => this.frameNode = node}/>
    }
}

ReactDOM.render(<TPFrame/>, document.querySelector('#app'));
