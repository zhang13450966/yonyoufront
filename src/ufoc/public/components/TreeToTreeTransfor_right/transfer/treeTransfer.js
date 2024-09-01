import React, {Component} from "react";
import {base} from "nc-lightapp-front";

const {NCCheckbox} = base;

let {NCButton, NCFormControl, NCDiv} = base;
import "./treeTransfer.less";

class Treetransfer extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            leftSearchValue: "",
            rightSearchValue: "",
            disableBtns: this.props.disableBtns,
            hiddenAllMoveBtns: this.props.hiddenAllMoveBtns
        };
    }


    onLeftSearch = (e) => {
        if(e.length<1000000000000){
        let trimStr = e.replace(/^\s+|\s+$/g, "");
        this.props.leftSearch(trimStr);
        }
    };

    onLeftChange = (e) => {
        if(e.length<1000000000000){
        let trimStr = e.replace(/^\s+|\s+$/g, "");
        if (trimStr == "") {
            this.props.leftSearch(trimStr);
        }
        this.setState({leftSearchValue: e});

        if (this.props.autoSearch) {
            this.onLeftSearch(e);
        }
    }
    };

    leftClearSearch = () => {
        this.onLeftChange("");
    };

    onRightSearch = (e) => {
        // console.log('rightSearch',e);
        if(e.length<1000000000000){
        let trimStr = e.replace(/^\s+|\s+$/g, "");
        this.props.rightSearch(trimStr);
        }
    };
    onRightChange = (e) => {
        if(e.length<1000000000000){
        let trimStr = e.replace(/^\s+|\s+$/g, "");
        if (trimStr == "") {
            this.props.rightSearch(trimStr);
        }
        this.setState({rightSearchValue: e});

        if (this.props.autoSearch) {
            this.onRightSearch(e);
        }
    }
    };
    rightClearSearch = () => {
        this.onRightChange("");
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            disableBtns: nextProps.disableBtns,
            hiddenAllMoveBtns: nextProps.hiddenAllMoveBtns
        });
    }

    render() {
        return (
            <NCDiv fieldid="transfer"
                   className={this.props.fullscreen ? "transfer-main fullscreen-transfer-main" : "transfer-main"}
                   areaCode={NCDiv.config.Area}>
                {/*右侧穿梭框区域*/}
                <div className="right-wrapper nc-theme-transfer-wrap-bgc">
                    <div className="content-box nc-theme-area-split-bc nc-theme-transfer-wrap-bgc">
                        <div id='myTitle'>
                            <div style={{float: "left"}}>
                                <NCCheckbox
                                    indeterminate={this.props.rightIndeterminate}
                                    checked={this.props.rightChecked}
                                    onChange={this.props.onRightCheckAllChange}
                                />
                                {this.props.rightSelectDataLength ? (this.props.rightSelectDataLength + "/") : ""}{this.props.rightDataLength}{$appRoot.state.json['public_lang-000132']}{/* 国际化处理： 条数据*/}
                            </div>
                            <div style={{float: "right"}}>
                                {this.props.title && this.props.title.right ? this.props.title.right : ""}
                            </div>
                        </div>
                        <NCDiv fieldid="right" areaCode={NCDiv.config.TREE}
                               className={this.props.fullscreen ? "right-area fullscreen-right-area nc-theme-transfer-list-body-bgc" : "right-area nc-theme-transfer-list-body-bgc"}>
                            <div className="search-content">
                                {
                                    this.props.showSearch ?
                                        <NCFormControl
                                            fieldid="search"
                                            type="search"
                                            placeholder={this.props.searchPlaceholder}
                                            value={this.state.rightSearchValue}
                                            onChange={this.onRightChange}
                                            clearSearch={this.rightClearSearch}
                                            onSearch={this.onRightSearch}
                                        /> : ""
                                }
                            </div>
                            <NCDiv className="tree-box" fieldid="right" areaCode={NCDiv.config.TreeCom}>
                                {this.props.rightArea()}
                            </NCDiv>
                        </NCDiv>
                    </div>
                </div>
                {/*右侧按钮区域*/}
                {!this.props.original && (<div className='button-area'>
                    <div className="opr-botton">
                        <NCButton id="personalBtn" colors="primary"
                                  onClick={this.props.addStyle}>{$appRoot.state.json['public_lang-000236']}</NCButton>{/* 国际化处理： 新增计算分组*/}
                    </div>
                    <div className='group_one'>
                        <div className="opr-botton">
                            <NCButton id="personalBtn" className="nc-theme-btn-secondary" disabled={this.props.moveFlag}
                                    onClick={e => this.props.moveNodes("up")}>{$appRoot.state.json['public_lang-000027']}</NCButton>{/* 国际化处理： 上移*/}
                        </div>
                        <div className="opr-botton">
                            <NCButton id="personalBtn" className="nc-theme-btn-secondary" disabled={this.props.moveFlag}
                                    onClick={e => this.props.moveNodes("down")}>{$appRoot.state.json['public_lang-000028']}</NCButton>{/* 国际化处理： 下移*/}
                        </div>
                    </div>
                    <div className='group_two'>
                        <div className="opr-botton">
                            <NCButton id="personalBtnOne" className="nc-theme-btn-secondary"
                                    onClick={e => this.props.changeReportStyle("reportedRecorded")}>{$appRoot.state.json['public_lang-000238']}</NCButton>{/* 国际化处理： 必报必录*/}
                        </div>
                        <div className="opr-botton">
                            <NCButton id="personalBtnTwo" className="nc-theme-btn-secondary"
                                    onClick={e => this.props.changeReportStyle("reported")}>{$appRoot.state.json['public_lang-000239']}</NCButton>{/* 国际化处理： 必报非必录*/}
                        </div>
                        <div className="opr-botton">
                            <NCButton id="personalBtnThree" className="nc-theme-btn-secondary"
                                    onClick={e => this.props.changeReportStyle("notReport")}>{$appRoot.state.json['public_lang-000240']}</NCButton>{/* 国际化处理： 非必报*/}
                        </div>
                    </div>
                   
                </div>)}
            </NCDiv>
        );
    }
}

Treetransfer.defaultProps = {
    showSearch: true,
    searchPlaceholder: "",
    autoSearch: false
};
export default Treetransfer;
