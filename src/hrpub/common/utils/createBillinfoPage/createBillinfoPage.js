/**
 *
 * Created by shenzaifang on 2019-08-29
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {
    createPage,
} from 'nc-lightapp-front';
import {snCreateUIDom, getAppPageConfig, handleHash} from '../utils';
import {getBillinfo} from "./getBillinfo";

// 导出WraperModal的引用
export const ins = {
    ins: null
}
/**
 *
 * @param condition{
    config: {
        appcode: '60051030',
        pagecode: '60051030p'
    },
    pagecodeValues: {
        'p_deptchange': '60051030p_change',
        'p_deptpost': '60051030p_post',
        'p_deptpsn': '60051030p_psn',
        'financeorg_v': '10100ORG_financeorgversion',
        'p_StruVersion': '60051030p_StruVersion',
        'p_deptversion': '60051030p_deptversion',
        'p_deptversionQuery': '60051030p_deptversionQuery',
        'p_copy': '60051030p_copy',
    },
    defaultConfig: {
        headcode: 'om_post'
    }
 }
 * @param HomePage 节点modal
 * @returns {Promise<void>}
 */
export async function createBillinfoPage(condition = {config: null, pagecodeValues: {}, defaultConfig: {}}, HomePage, homeProps) {

    let {pagecodeValues, config, defaultConfig} = condition;
    !config && (config = getAppPageConfig());
    // 请求条件
    let reqData = [
        {
            rqUrl: '/platform/templet/querypage.do',
            rqJson: `{\n \"pagecode\": \"${config.pagecode}\",\n \"appcode\": \"${config.appcode}\"\n}`,
            rqCode: 'template'
        },
        {
            rqUrl: '/platform/appregister/queryallbtns.do',
            rqJson: `{\n \"pagecode\": \"${config.pagecode}\",\n \"appcode\": \"${config.appcode}\"\n}`,
            rqCode: 'button'
        },
        {
            rqUrl: '/platform/appregister/queryappcontext.do',
            rqJson: `{\n \"pagecode\": \"${config.pagecode}\",\n \"appcode\": \"${config.appcode}\"\n}`,
            rqCode: 'context'
        }
    ];
    for (let key in pagecodeValues) {
        let temp = {
            rqUrl: '/platform/templet/querypage.do',
            rqJson: `{\n  \"pagecode\": \"${pagecodeValues[key]}\"\n}`,
            rqCode: key
        };
        reqData.push(temp)
    }
    let domTemplate = await queryTemplate(config, reqData);
    //显示/编辑 关联项
    let billinfo = getBillinfo(
        {
            ...pagecodeValues,
            template: config.pagecode
        },
        domTemplate,
        defaultConfig
    );

    @handleHash(2019, `/ifr?page=2019&c=${config.appcode}&p=${config.pagecode}`)
    class Wraper extends Component {
        constructor(props) {
            super(props);
        }
        componentWillMount() {
            if (window.location.href.match(/(localhost|127\.0\.0\.1):3006/g)) {
                window.location.hash = `#/ifr?page=2019`;
            }
            if (!('remove' in Element.prototype)) {
                Element.prototype.remove = function () {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }
        }

        componentDidMount() {
            if (!('remove' in Element.prototype)) {
                Element.prototype.remove = function () {
                    if (this.parentNode) {
                        this.parentNode.removeChild(this);
                    }
                };
            }
        }

        render() {
            return <HomePage {...this.props}/>
        }
    }
    let WraperModal = createPage({billinfo})(Wraper);

    ReactDOM.render(<WraperModal ref={ref => ins.ins = ref} domTemplate={domTemplate} {...homeProps}/>, document.querySelector('#app'));
}

function queryTemplate (config,reqData){
    return new Promise(resolve => {
        snCreateUIDom(config, reqData, res => {
            resolve(res)
        });
    });
}
