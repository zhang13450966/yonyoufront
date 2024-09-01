import React, { Component } from 'react';
import { base, getLangCode } from 'nc-lightapp-front';
import Utils from "@public/utils";

const { langCheck } = Utils;
import './index.less';

const { NCModal, NCButton, NCMultiLangText: MultiLangText, NCCheckbox, NCTooltip, NCHotKeys } = base;

const LANG_MAP_DATA = {
    simpchn: '1',
    tradchn: '2',
    english: '3',
}
class SaveAsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveAsType: 1, // 1: 另存为  2:重命名
            saveAsList: props.enableLangMaps || [ // 下拉内容列表
            {
                index: '1',
                languageCode: 'a',
                languageType: 'ZH'
            },
            {
                index: '2',
                languageCode: 'b',
                languageType: 'ZF'
            },
            {
                index: '3',
                languageCode: 'c',
                languageType: 'EN'
            }
        ],
            langIndex: 1, // 重命名弹窗内 当前的语言index
            saveAsValue: {
                dataViewSaveAs1: {
                    value: ''
                },
                 dataViewSaveAs2: {
                    value: ''
                },
                 dataViewSaveAs3: {
                    value: ''
                }
            }, // // 重命名 的默认值
            saveAsDefault: false, // 是否是默认视图
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show !== this.props.show) {
            this.setState({
                saveAsVisible: nextProps.show
            });
        }
        if (nextProps.renameData !== this.props.renameData) {
            const curLangValue = {  // 当前选中值需要此格式
                dataViewSaveAs1: {
                    current: nextProps.renameData.multlanguage === 1 ? true : false,
                    index: '1',
                    value: nextProps.renameData.name || '',
                },
                dataViewSaveAs2: {
                    current: nextProps.renameData.multlanguage === 2 ? true : false,
                    index: '2',
                    value: nextProps.renameData.name2 || '',
                },
                dataViewSaveAs3: {
                    current: nextProps.renameData.multlanguage === 3 ? true : false,
                    index: '3',
                    value: nextProps.renameData.name3 || '',
                },
            }
            this.setState({
                // renameData: nextProps.renameData,
                saveAsDefault: nextProps.renameData.isdefault || false,
                saveAsValue: curLangValue,
            });
        }
    }

    componentDidMount() {
        const curLang = getLangCode();
        this.setState({
            langIndex: LANG_MAP_DATA[curLang],
        })
    }

    handleCancle = () => {
        this.setState({
            saveAsVisible: false,
        })
    }

    changeMultiLangText = (value) => {
        this.setState({
            saveAsValue: value,
        });
    }

    render() {
        const { saveAsList, saveAsValue, saveAsVisible, saveAsDefault, langIndex } = this.state;
        const { saveAsType, entranceType } = this.props;
        return (
            <NCModal
                fieldid="saveAsModel"
                show={saveAsVisible}
                id="saveAsModel"
                className="report-data-view-save-modal"
                keyboard
                size='sm'
                onEscapeKeyUp={()=> {
                    this.props.onCancel();
                    this.props.resetSaveAs(); // 重置数据
                }}
                onShow={() => {
                    setTimeout(() => {
                        document.querySelector(".report-data-view-save-modal .save-as-input input").focus();
                    }, 300);
                }}
            >
                <NCModal.Header closeButton>
                    {/* '另存新视图 新增视图 '重命名' */}
                    {
                        saveAsType === 1 ? (
                            <span className='save-title'>
                                {
                                    entranceType === 'add' ? langCheck('reportMultiLang', 'dataView-100301-000242') : langCheck('reportMultiLang', 'dataView-100301-000261')
                                }
                            </span>
                        ) : (
                            <span className='save-title'>
                                {langCheck('reportMultiLang', 'dataView-100301-000239')}
                            </span>

                        )
                    }
                </NCModal.Header>
                <NCModal.Body>
                    <div className={'save-as-body-container'}>
                        <div className={'save-as-input'}>
                            <span style={{ color: 'red' }}>*</span>
                            <span style={{ marginRight: 10 }}>
                                {/* 视图名称 */}
                                {langCheck('reportMultiLang', 'dataView-100301-000262')}
                            </span>
                            {
                                saveAsVisible && (
                                    <div className='save-as-input-text'>
                                        <MultiLangText
                                            value={saveAsValue}
                                            languageMeta={saveAsList}
                                            attrcode='dataViewSaveAs'
                                            id='dataViewSaveAs'
                                            LangIndex={langIndex}
                                            // autoFocus
                                            // onSelect={(v) => { console.log(v) }}
                                            onChange={this.changeMultiLangText}
                                        />
                                    </div>

                                )
                            }
                        </div>
                        <div style={{ paddingLeft: 64 }}>
                            <NCCheckbox checked={this.state.saveAsDefault} onChange={() => { this.setState({ saveAsDefault: !this.state.saveAsDefault }) }} >
                                {langCheck('reportMultiLang', 'dataView-100301-000241')}
                                {/* 设为默认视图 */}
                            </NCCheckbox>
                        </div>
                    </div>
                </NCModal.Body>
                <NCModal.Footer>

                    <NCHotKeys
                        keyMap={{
                            confirmBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM,
                        }}
                        handlers={{
                            confirmBtnHandler: () => {
                                this.props.saveAsSubmit(saveAsValue, saveAsDefault);
                            },
                        }}
                        focused={true}
                        attach={document.body}
                        style={{ display: 'inline-block', marginRight: 8 }}
                    >

                        <NCTooltip
                            inverse
                            trigger={["hover", "focus"]}
                            placement="top"
                            className="model-helper-overlay"
                            overlay={`${langCheck(
                                "reportMultiLang",
                                "dataView-100301-000252"
                            )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CONFIRM})`}
                        >
                            <NCButton fieldid="viewDataIngTips" colors="primary" className="sure-button" onClick={() => {
                                this.props.saveAsSubmit(saveAsValue, saveAsDefault);
                            }}>
                                {/* 确定 */}
                                {langCheck('reportMultiLang', 'dataView-100301-000252')}
                                (<span className="text-decoration-underline">
                                    Y
                                </span>)
                            </NCButton>
                        </NCTooltip>
                    </NCHotKeys>

                    <NCHotKeys
                        keyMap={{
                            cancelBtnHandler: NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL,
                        }}
                        handlers={{
                            cancelBtnHandler: () => {
                                this.props.onCancel();
                                this.props.resetSaveAs(); // 重置数据
                            },
                        }}
                        focused={true}
                        attach={document.body}
                        style={{ display: 'inline-block' }}
                    >

                        <NCTooltip
                            inverse
                            trigger={["hover", "focus"]}
                            placement="top"
                            className="model-helper-overlay"
                            overlay={`${langCheck(
                                "reportMultiLang",
                                "100301-000048"
                            )}  (${NCHotKeys.USUAL_KEYS.NC_MODAL_CALCEL})`}
                        >
                            <NCButton fieldid="cancel" className="cancel-button" onClick={() => {
                                this.props.onCancel();
                                this.props.resetSaveAs(); // 重置数据
                            }}>
                                {langCheck('reportMultiLang', 'dataView-100301-000248')}
                                <span className="text-decoration-underline">
                                    (N)
                                </span>
                            </NCButton>
                        </NCTooltip>
                    </NCHotKeys>
                </NCModal.Footer>
            </NCModal>
        );
    }
}

export default SaveAsModal;
