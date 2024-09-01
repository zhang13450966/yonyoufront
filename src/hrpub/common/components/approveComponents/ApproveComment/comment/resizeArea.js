import React from 'react';
import { getSysFieldid } from 'nc-lightapp-front';
import { EditModal } from './editModal';

export default class ResizableTextArea extends React.Component{
    constructor(props){
        super(props);
        // 设置展开后的最小宽高
        this.minWidth = props.minWidth || 380;
        this.minHeight = props.minHeight || 75;

        // 初始化宽高
        let areaWidth, areaHeight;
        if(props.enableInput){
            areaWidth = props.minWidth || 115;
            areaHeight = 30;
        }else{
            areaWidth = this.minWidth;
            areaHeight = this.minHeight;
        }

        this.state={
            inputMode: !!props.iniInput,
            isMoving: false,
            areaWidth: areaWidth,
            areaHeight: areaHeight,
            areaLeft: 0,
            content: '',
            commonList: this.props.commonList || [],
            showCommonList: false, // 显示常用列表
            showEdit: false, // 显示编辑弹框
        };

        this.lastX = 0;
        this.lastY = 0;

        this.dragHot = null;
        this.area = null;
        this.comspot = null;
        this.comlist = null;

        this.onEnableDrag = this.onEnableDrag.bind(this);
        this.onDisableDrag = this.onDisableDrag.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.switchCommonList = this.switchCommonList.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.renderCommonList = this.renderCommonList.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.hideCommonList = this.hideCommonList.bind(this);
    }

    componentDidMount(){
        if(this.dragHot){
            this.dragHot.addEventListener('pointerdown', this.onEnableDrag);
            this.comspot.addEventListener('mousedown', this.preventDefault);
            this.comlist.addEventListener('mousedown', this.preventDefault);
            document.addEventListener('click', this.hideCommonList, false);
            if(!this.props.isDetail) return;
            let timer = setTimeout(() => {
                if(window.frames['detailIframe']){
                    // console.log('check-test')
                    window.frames['detailIframe'].contentWindow.document.addEventListener('click', this.hideCommonList);
                    if(this.props.autoFocus){
                        this.textarea.focus();
                        this.onFocus();
                    }
                    clearTimeout(timer);
                }
            }, 2500);
            // console.log('area', this.area.offsetLeft)
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.id != this.props.id){
            this.setState({ content: ""});
        }
        this.setState({
            commonList: nextProps.commonList
        })
        // this.setState({
        //     areaWidth: nextProps.width,
        //     areaHeight: nextProps.height
        // })
    }

    componentWillUnmount(){
        this.dragHot.removeEventListener('pointerdown', this.onEnableDrag);
        this.comspot.removeEventListener('mousedown', this.preventDefault);
        this.comlist.removeEventListener('mousedown', this.preventDefault);
        // this.removeEventListener();
        if( this.props.isDetail && window.frames['detailIframe']){
            window.frames['detailIframe'].contentWindow.document.removeEventListener('click', this.hideCommonList);
        }
    }

    removeEventListener(elem){
        elem.removeEventListener('pointermove', this.onMouseMove);
        elem.removeEventListener('pointerup', this.onDisableDrag);
        // document.removeEventListener('click', this.hideCommonList);
    }

    preventDefault(e){
        if(e && e.preventDefault) e.preventDefault();
        else window.event.returnValue = false;
        return false;
    }

    onEnableDrag(e){
        let elem = e.currentTarget;
        // console.log('target', e, e.currentTarget)
        elem.setPointerCapture(e.pointerId);
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        elem.addEventListener('pointermove', this.onMouseMove);
        elem.addEventListener('pointerup', this.onDisableDrag);

        this.setState({
            areaHeight: this.area.offsetHeight,
            areaWidth: this.area.offsetWidth,
            isMoving: true
        });
        e.preventDefault();
    }

    onDisableDrag(e){
        let elem = e.currentTarget;
        elem.releasePointerCapture(e.pointerId);
        this.removeEventListener(elem);
        this.setState({ isMoving: false});
    }

    onMouseMove(e){
        let dx = e.clientX - this.lastX, dy = e.clientY - this.lastY;
        this.setState({
            areaWidth: Math.max(this.state.areaWidth - dx, this.minWidth),
            areaHeight: Math.max(this.state.areaHeight + dy, this.minHeight),
        })
        this.lastX = e.clientX;
        this.lastY = e.clientY;
    }

    // 点击空白隐藏列表
    hideCommonList(e){
        // console.log('target', e.target, 'comspot', this.comspot, this.comspot == e.target)
        // console.log('hide')
        if(e.target != this.comspot){
            if(this.state.showCommonList){
                this.setState({showCommonList: false});
            }
        }
    }

    onBlur(e){
        if(!this.props.enableInput) return;
        if(!this.state.isMoving){
            this.setState({
                inputMode: true,
                areaWidth: this.props.minWidth || 115,
                areaHeight: 30,
                areaLeft: 0,
                showCommonList: false
            });
        }
    }

    onFocus(){
        if(!this.props.enableInput) return;
        this.setState({ 
            inputMode: false,
            areaWidth: 380,
            areaHeight:  68,
            areaLeft: 0,
            showCommonList: false
        });
    }

    changeContent(e){
        let value = e.target.value;
        this.props.setComment(value);
        this.setState({ content: value });
    }

    selectComValue(value){
        let content = this.state.content + value;
        this.setState({
            content,
            showCommonList: false
        });
        this.props.setComment(content);
    }   

    renderCommonList(searchValue){
        let list = this.state.commonList;
        return list.map((item, index) => {
            index += 1;
            return <li onClick={this.selectComValue.bind(this, item)}><span className="nc-theme-sp-common-font-c">{index}.</span><span className="con nc-theme-sp-common-font-c">{'"' + item + '"'}</span></li>
        });
    }

    switchCommonList(e){
        // e.nativeEvent.stopImmediatePropagation();
        this.setState({showCommonList: !this.state.showCommonList});
        e.preventDefault()
    }

    showEditModal(){
        this.setState({
            showEdit: !this.state.showEdit,
        });
    }

    finishEdit = list => {
        // this.setState({
        //     commonList: list
        // });
        this.props.update(list);
        this.showEditModal();
    }


    render(){
        let { areaHeight, areaWidth, inputMode, isMoving, showCommonList, showEdit, commonList, content } = this.state;
        let { noShadow, json } = this.props;
        let transition = isMoving ? 'none' : '';
        return (
            <div ref={area => this.area = area} style={{height: areaHeight, width: areaWidth, transition}} className={`dragTextArea nc-theme-from-input-bgc nc-theme-form-input-c ${inputMode ? 'disableDrag' : ''} ${inputMode ? 'fold' : 'unfold'} ${noShadow ? 'noShadow' : ''}`}>
                <div className="dragSpot" ref={hot => this.dragHot = hot}><i className="iconfont icon-tuozhuaijiaobiao"></i></div>
                {/* commonlist_001 审批意见 */}
                <textarea fieldid={getSysFieldid('input-comment')} ref={area => this.textarea = area } value={content} rows="1" placeholder={json['commonlist_001']} onChange={this.changeContent} onFocus={this.onFocus}  onBlur={this.onBlur} style={{width: "calc(100% - 15px)", height: inputMode ? areaHeight-3 : areaHeight-14, transition}} className={`text-area nc-theme-from-input-bgc nc-theme-form-input-c`}/>
                <div className="commonSpot nc-theme-from-input-bgc" ><i className="iconfont icon-shenpixiangqing" onClick={this.switchCommonList} ref={comspot => this.comspot = comspot}></i></div>
                <div className={`commonList nc-theme-sp-line-area-bgc ${!showCommonList ? 'hide' : ''}`} style={{top: areaHeight}}  ref={comlist => this.comlist = comlist}>
                    <div className="listul">
                        <ul>
                            {this.renderCommonList(this.state.content)}
                        </ul>
                    </div>
                    {/* commonlist_012 自定义 */}
                    <p className="self-define" onClick={this.showEditModal}>+&nbsp;{json['commonlist_012']}</p>
                </div>
                {showEdit && <EditModal finishEdit={this.finishEdit} commonList={commonList} showEdit={showEdit} showEditModal={this.showEditModal} json={json}/>}
            </div>
        );
    }
}