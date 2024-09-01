import React, {Component} from 'react';
import './index.less';
import {base} from 'nc-lightapp-front';
import {paperConfig} from '../../printUtil';

const {NCSelect, NCInputNumber, NCModal, NCButton} = base;
const {Header: NCModalHeader, Body: NCModalBody, Footer: NCModalFooter} = NCModal;
const NCOption = NCSelect.NCOption;

class BaseSetModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paper: props.paper,
            maxCol: props.maxCol,
            direct: props.direct,
            margin: props.margin,
            marginTop: props.marginTop || 10,
            marginRight: props.marginRight || 10,
            marginBottom: props.marginBottom || 10,
            marginLeft: props.marginLeft || 10,
            visible: true
        };
        this.itemChange = this.itemChange.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.beSure = this.beSure.bind(this);
    }

    beSure() {
        this.closeModal();
        this.props.onSure(this.state);
    }

    closeModal() {
        this.setState({
            visible: false
        })
    }

    itemChange(data) {
        this.setState(data);
    }

    render() {
        const {
            paper, visible, maxCol, direct, margin,
            marginTop, marginRight, marginBottom, marginLeft
        } = this.state;
        return (
            <NCModal
                visible={visible}
                size="lg"
                onCancel={this.closeModal}
                mask={'static'}
            >
                <NCModalHeader
                    closeButton={true}
                >
                    打印设置
                </NCModalHeader>
                <NCModalBody>
                    <div className='lightapp-component-form my-form'>
                        <div className="form-item my-form-item" style={{width: '100%', marginBottom: '12px'}}>
                            <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                每行显示列数
                            </div>
                            <div className={"form-item-control"}>
                                <div className={"form-component-item-wrapper edit select-wrapper"}>
                                    <NCInputNumber
                                        iconStyle="one"
                                        precision={0}
                                        min={0}
                                        value={maxCol}
                                        onChange={(value) => {
                                            if (value < 0) return;
                                            this.itemChange({maxCol: value});
                                        }
                                        }
                                    />
                                </div>
                            </div>
                            <div className={'memo'}>
                                <span className="u-mast">*</span>0为不分行
                            </div>
                        </div>
                        <div className="form-item my-form-item" style={{width: '100%'}}>
                            <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                纸张尺寸
                            </div>
                            <div className={"form-item-control"}>
                                <div className={"form-component-item-wrapper edit select-wrapper"}>
                                    <NCSelect
                                        showClear={false}
                                        value={paper}
                                        onChange={(v) => this.itemChange({'paper': v})}
                                    >
                                        {paperConfig && Object.keys(paperConfig).map(option => (
                                            <NCOption value={option}>
                                                {option}
                                            </NCOption>
                                        ))}
                                    </NCSelect>
                                </div>
                            </div>
                            <div className={'memo'}>
                                <span className="u-mast">*</span>请手动更改打印设置中的纸张尺寸与此处保持一致
                            </div>
                        </div>
                        <div className="form-item" style={{width: '50%'}}>
                            <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                打印方向
                            </div>
                            <div className={"form-item-control"}>
                                <div className={"form-component-item-wrapper edit select-wrapper"}>
                                    <NCSelect
                                        showClear={false}
                                        value={direct}
                                        onChange={(v) => this.itemChange({'direct': v})}
                                    >
                                        <NCOption value={'landscape'}>
                                            横向
                                        </NCOption>
                                        <NCOption value={'portrait'}>
                                            纵向
                                        </NCOption>
                                    </NCSelect>
                                </div>
                            </div>
                        </div>
                        <div className="form-item" style={{width: '50%'}}>
                            <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                边距
                            </div>
                            <div className={"form-item-control"}>
                                <div className={"form-component-item-wrapper edit select-wrapper"}>
                                    <NCSelect
                                        showClear={false}
                                        value={margin}
                                        onChange={(v) => this.itemChange({margin: v})}
                                    >
                                        <NCOption value={'default'}>
                                            默认
                                        </NCOption>
                                        <NCOption value={'none'}>
                                            无
                                        </NCOption>
                                        <NCOption value={'min'}>
                                            最小值
                                        </NCOption>
                                        <NCOption value={'custom'}>
                                            自定义
                                        </NCOption>
                                    </NCSelect>
                                </div>
                            </div>
                        </div>
                        {
                            margin === 'custom' ? <React.Fragment>
                                <div className="form-item" style={{width: '50%'}}>
                                    <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                        上边距(mm)
                                    </div>
                                    <div className={"form-item-control"}>
                                        <div className={"form-component-item-wrapper edit select-wrapper"}>
                                            <NCInputNumber
                                                iconStyle="one"
                                                precision={0}
                                                min={0}
                                                value={marginTop}
                                                onChange={(value) => {
                                                    if (value < 0) return;
                                                    this.itemChange({marginTop: value});
                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-item" style={{width: '50%'}}>
                                    <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                        右边距(mm)
                                    </div>
                                    <div className={"form-item-control"}>
                                        <div className={"form-component-item-wrapper edit select-wrapper"}>
                                            <NCInputNumber
                                                iconStyle="one"
                                                precision={0}
                                                min={0}
                                                value={marginRight}
                                                onChange={(value) => {
                                                    if (value < 0) return;
                                                    this.itemChange({marginRight: value});
                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-item" style={{width: '50%'}}>
                                    <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                        下边距(mm)
                                    </div>
                                    <div className={"form-item-control"}>
                                        <div className={"form-component-item-wrapper edit select-wrapper"}>
                                            <NCInputNumber
                                                iconStyle="one"
                                                precision={0}
                                                min={0}
                                                value={marginBottom}
                                                onChange={(value) => {
                                                    if (value < 0) return;
                                                    this.itemChange({marginBottom: value});
                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-item" style={{width: '50%'}}>
                                    <div className="form-item-label" style={{color: 'rgb(85, 85, 85)'}}>
                                        左边距(mm)
                                    </div>
                                    <div className={"form-item-control"}>
                                        <div className={"form-component-item-wrapper edit select-wrapper"}>
                                            <NCInputNumber
                                                iconStyle="one"
                                                precision={0}
                                                min={0}
                                                value={marginLeft}
                                                onChange={(value) => {
                                                    if (value < 0) return;
                                                    this.itemChange({marginLeft: value});
                                                }
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment> : null
                        }
                    </div>
                </NCModalBody>
                <NCModalFooter>
                    <NCButton
                        onClick={this.beSure}
                        colors="primary"
                    >
                        确认
                    </NCButton>
                    <NCButton
                        shape="border"
                        onClick={this.closeModal}
                    >
                        取消
                    </NCButton>
                </NCModalFooter>
            </NCModal>
        );
    }
}

export default BaseSetModal;
