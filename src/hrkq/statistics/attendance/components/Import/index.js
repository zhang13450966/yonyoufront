import React, {Component} from 'react';
import {base, toast} from 'nc-lightapp-front';

// css
import './index.less';

// components

let {NCModal, NCLoading} = base;

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            files: []
        };

        ['onUpload'].forEach(fun => {
            if (typeof this[fun] == 'function') {
                this[fun] = this[fun].bind(this);
            }
        })
    }

    onUpload() {
        let {files} = this.state;
        let {type, onSucess} = this.props;
        if (files &&
            files.length) {
            let fromData = new FormData(),
                file = files[0],
                url = '/ncchr/attentanceUpload/uploadExcel';
            if (type === '3') {
                fromData.append('machineType', 1);
                url = '/ncchr/attentanceUpload/uploadMachineExcel';
            }
            if(type === '1'){
                url = '/ncchr/fillAttendanceRecord/uploadExcel';
            }
            fromData.append('id', `WU_FILE_${Date.now()}`);
            fromData.append('name', file.name);
            fromData.append('type', file.type);
            fromData.append('size', file.size);
            fromData.append('lastModifiedDate', file.lastModifiedDate);
            fromData.append('file', file);

            this.setState({loading: true});
            axios.post(url, fromData)
                .then(({status, data, data: {message = ''} = {}} = {}) => {
                    this.setState({loading: false});
                    if (status != 200) {
                        if (message) {
                            this.setState({
                                successText: '',
                                errorText: message
                            })
                            toast({
                                color: 'error',
                                content: message
                            });
                        }
                    } else {
                        this.setState({
                            files: [],
                            successText: message,
                            errorText: ''
                        })
                        if (message) {
                            toast({
                                color: 'success',
                                content: message
                            });
                        }
                        onSucess && onSucess(data)
                    }
                }).catch(({response: {data: {message = ''} = {}} = {}} = {}) => {
                this.setState({loading: false});
                if (message) {
                    this.setState({
                        successText: '',
                        errorText: message
                    })
                    toast({
                        color: 'error',
                        content: message
                    });
                }
            })
        }
    }

    render() {
        let {
            state: {
                files,
                loading,
                successText,
                errorText
            },
            props: {
                type = '2', //2: 原始导入 3: 考勤机导入
                lang = {},
                isShow,
                onHide,
                exportTemplate
            }
        } = this;

        if (!isShow &&
            (files.length > 1 || successText || errorText)) {
            this.setState({
                files: [],
                successText: '',
                errorText: ''
            });
        }

        return (
            <div class={`import-dialog`}>

                {/* 导入 */}
                <NCModal
                    //style={{width: 540}}
                    // size="lg" //sm/lg/xlg
                    className="import-dialog-modal"
                    show={isShow}
                    onHide={onHide}>

                    <NCModal.Header closeButton={true}>
                        <NCModal.Title>{type == 1 ? '考勤记录导入' : type == 2 ? lang['hrkq-0000086'] : lang['hrkq-0000087']}</NCModal.Title>
                    </NCModal.Header>

                    <NCModal.Body>
                        <div className="dialog-body">
                            {/* first line */}
                            <div className="row">
                                <span className="content">
                                    <i className="point"></i>
                                    {type == 2 || type == 1  ? <a href={exportTemplate} class="title highlight"
                                                    download>{lang['hrkq-0000088']}</a> :
                                        <span className="title lowlight">{lang['hrkq-0000095']}</span>}
                                    {type == 2 || type == 1 ? <span className="tip">{lang['hrkq-0000093']}</span> : null}
                                </span>
                                <span className="blank">
                                    {type != 2 && type != 1? lang['hrkq-0000096'] : ''}
                                </span>
                            </div>

                            {/* second line */}
                            <div className="row">
                                <span className="content">
                                    <i className="point"></i>
                                    <span className="title">{lang['hrkq-0000089']}</span>
                                    <span className="tip">{lang['hrkq-0000094']}</span>
                                </span>
                                <span className="blank">
                                    <div className="files">
                                        {
                                            files.map((file, index) => {
                                                return (<span>{file.name}
                                                    <i className="hrfont hr-shanchu" onClick={() => {
                                                        this.setState(() => {
                                                            files.splice(index, 1);
                                                            return {
                                                                files
                                                            }
                                                        })
                                                    }}></i>
                                                </span>);
                                            })
                                        }
                                    </div>
                                    <span className="btn">
                                        {lang['hrkq-0000091']}
                                        <input type="file"
                                               onChange={e => {
                                                   if (e.target &&
                                                       e.target.files) {
                                                       let files = Array.prototype.slice.call(e.target.files, 0);
                                                       console.log('onChange: ', files);
                                                       this.setState(() => {
                                                           return {
                                                               files: [
                                                                   ...files
                                                               ]
                                                           }
                                                       });
                                                   }
                                               }}
                                        />
                                    </span>
                                    <span className={[(files.length > 0) ? 'primary btn' : 'btn']} onClick={() => {
                                        if (files.length) {
                                            this.onUpload();
                                        }
                                    }}>{lang['hrkq-0000084']}</span>
                                </span>
                            </div>

                            {/* last line */}
                            <div className="row">
                                <span className="content">
                                    <i className="point"></i>
                                    <span className="title">{lang['hrkq-0000090']}</span>
                                </span>
                                <span className={[successText ? 'result primary' : 'result']}>
                                    {successText || errorText || ''}
                                </span>
                            </div>
                        </div>
                    </NCModal.Body>
                </NCModal>

                {/* loading */}
                <NCLoading
                    container={this}
                    show={loading}>
                </NCLoading>
            </div>
        );
    }
}
