import React, { Component } from 'react';
import { base } from 'nc-lightapp-front';
let { NCButton, NCFormControl} = base;
import './treeTransfer.less';
import {THEME} from "../theme/theme";

class Treetransfer extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            leftSearchValue: '',
            rightSearchValue: '',
            disableBtns: this.props.disableBtns,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns,
            inlt: [],
            json: []
        }
    }


    onLeftSearch = (e) => {
        let trimStr = e.replace(new RegExp(`^\\s+|\\s+$`, 'g'), '');
        this.props.leftSearch(trimStr);
    }

    onLeftChange = (e) => {
        let trimStr = e.replace(new RegExp(`^\\s+|\\s+$`, 'g'), '');
        if(trimStr==''){
            this.props.leftSearch(trimStr);
        }
        this.setState({leftSearchValue: e});
    }

    leftClearSearch = () => {
        this.onLeftChange('');
    }

    onRightSearch = (e) => {
        // console.log('rightSearch',e);
        let trimStr = e.replace(new RegExp(`^\\s+|\\s+$`, 'g'), '');
        this.props.rightSearch(trimStr);
    }
    onRightChange = (e)=> {
        let trimStr = e.replace(new RegExp(`^\\s+|\\s+$`, 'g'), '');
        if(trimStr == ''){
            this.props.rightSearch(trimStr);
        }
        this.setState({rightSearchValue: e});
    }
    rightClearSearch = () => {
        this.onRightChange('');
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            disableBtns: nextProps.disableBtns,
            hiddenAllMoveBtns: nextProps.hiddenAllMoveBtns
        });
    }
    componentWillMount() {
        let callback = (json, status, inlt) => {
            if (status) {
                this.setState({json, inlt},() => {
                    this.props.searchPlaceholder = this.props.searchPlaceholder || this.state.json['jf6005-000044']/* 国际化处理： 搜索*/
// this.initTemplate(this.props) //在这里可以进行ceateUIDom
                }) // 保存json和inlt到页面state中并刷新页面
            }
        };
        this.props.MultiInit.getMultiLang({moduleId: 'hr-treetransfer', domainName: 'hrpub',callback})

    }
    render(){
        return (
            <div className = {this.props.fullscreen ? 'transfer-main fullscreen-transfer-main':'transfer-main'}>
                <div className={`left-wrapper ${THEME.bgc} ${THEME.borderC}`}>
                    <h2 className={THEME.blackHeader}>{this.props.title && this.props.title.left ? this.props.title.left : ''}</h2>
                    <div className = {this.props.fullscreen ? 'left-area fullscreen-left-area':'left-area'}>
                        <div className="search-content">
                        {
                            this.props.showSearch ?
                                <NCFormControl
                                    type="search"
                                    placeholder={this.props.searchPlaceholder}
                                    value={this.state.leftSearchValue}
                                    onChange={this.onLeftChange}
                                    onSearch={this.onLeftSearch}
                                    clearSearch={this.leftClearSearch}
                                /> : ''
                        }
                        </div>
                        <div className="tree-box">
                            {this.props.leftArea()}
                        </div>
                    </div>
                </div>
                <div className = 'button-area-self'>
                    <div className={'button-area-warp'}>
                        <div className="opr-botton">
                            <NCButton onClick= {this.props.toRight} disabled={this.state.disableBtns} className={`uf uf-arrow-right ${THEME.borderC}`}></NCButton>
                        </div>
                        {
                            !this.state.hiddenAllMoveBtns ?
                                <div>
                                    <div className= "opr-botton">
                                        <NCButton onClick={this.props.allToRight} disabled={this.state.disableBtns} className={`uf uf-2arrow-right ${THEME.borderC}`}></NCButton>
                                    </div>
                                </div> : ''
                        }

                        <div className="opr-botton">
                            <NCButton onClick= {this.props.toLeft} disabled={this.state.disableBtns} className={`uf uf-arrow-left ${THEME.borderC}`}></NCButton>
                        </div>
                        {
                            !this.state.hiddenAllMoveBtns ?
                                <div>
                                    <div className= "opr-botton">
                                        <NCButton onClick={this.props.allToLeft} disabled = {this.props.rightFixed || this.state.disableBtns ? true: false} className={`uf uf-2arrow-left ${THEME.borderC}`}></NCButton>
                                    </div>
                                </div> : ''
                        }
                    </div>
                </div>
                <div className={`right-wrapper  ${THEME.bgc} ${THEME.borderC}`}>
                    <h2 className={THEME.blackHeader}>{this.props.title && this.props.title.right ? this.props.title.right : ''}</h2>
                    <div className = {this.props.fullscreen ? 'right-area fullscreen-right-area':'right-area'}>
                        <div className="search-content">
                            {
                                this.props.showSearch ?
                                    <NCFormControl
                                        type="search"
                                        placeholder={this.props.searchPlaceholder}
                                        value={this.state.rightSearchValue}
                                        onChange={this.onRightChange}
                                        clearSearch={this.rightClearSearch}
                                        onSearch={this.onRightSearch}
                                    /> : ''
                            }
                        </div>
                        <div className="tree-box">
                            {this.props.rightArea()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Treetransfer.defaultProps = {
    showSearch: true,
}
export default Treetransfer;
