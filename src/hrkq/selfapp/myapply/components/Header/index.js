import React, { Component } from 'react';
import render from 'src/hrpub/common/frame/render';
import { connect } from 'src/hrpub/common/store';
import NCBackBtn from 'src/hrkq/selfapp/myapply/components/hr-back/index';
import headerAction from '../../actions/headerAction';
import DateRange from './date-range.js';
import './index.less'
import uploadAction from '../../actions/uploadAction';
// import { high } from 'nc-lightapp-front'; 
// const { NCUploader } = high; 
import NCUploader from 'uap/common/components/NCUploader';
const Header = render ({
    actions: {
        headerAction,
        uploadAction
    }
})(({props, action, state}) => {
    const { button, myLeave } = props
    const { createButtonApp } = button
    const { headerAction, uploadAction } = action
    return (
        <div className="my-leave">
            {/* 我的请假 */}
            <div className="header">
                <div className="title">
                    <NCBackBtn
                        style={{display: myLeave.showMode === 'card' ? '' : 'none',marginRight: '10px'}}
                        onClick={ headerAction.clickBackBtn }
                        title={'我的请假'}
                    />
                    <div className="attend-apply__title">{myLeave.headerTitle || myLeave.json['6040-00007']}</div>
                </div>
                <DateRange
                    { ...props }
                    visiable={myLeave.showMode === 'list'}
                    format='YYYY-MM-DD'
                    showTime={false}
                />
                <div className=" btn-group" style={{marginLeft: myLeave.showMode === 'list' ? '0' : 'auto'}}>
                    {createButtonApp({
                        area: 'head', //如果页面中的有多个区域有按钮，这里的area当做筛选条件，只渲染按钮的后台数据中area字段为这里指定值的按钮；
                        onButtonClick: (props, btncode) => {
                            headerAction.headerButtonClick(props, btncode)
                        }// 按钮的点击事件
                    })}
                </div>
                <div className="nc-faith-demo-div1">
                    <div className="nc-faith-demo-div2">
                        {/* 这里是附件上传组件的使用，需要传入三个参数 */}
                        {myLeave.showUploader && <NCUploader
                            billId={myLeave.billId}
                            // target={myLeave.target}
                            customize = {{uploadTrpe: '0'}}
                            placement={'right'}
                            getGroupList = { uploadAction.getGroupList }
                            uploadTitle = {myLeave.json["hrkq-0000129"]}
                            onHide={ uploadAction.hideUploader } // 关闭功能
                            beforeUpload={ uploadAction.beforeUpload }
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
})


export default connect(Header);