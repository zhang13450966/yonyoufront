import React from 'react';
import { getMultiLang } from 'nc-lightapp-front';
import ResizableTextArea from './resizeArea';
import './index.less';

export default class Comment extends React.Component{
    constructor(props){
        super(props);
        this.state={
            json: {},
            inlt: null
        };
    }

    componentWillMount(){
        let callback = (json, status, inlt) => {
            if(status){
                this.setState({json, inlt});
            }else{
                console.log('未加载 containers_commonlist.json 多语文件');
            }
        }
        getMultiLang({moduleId: 'containers_commonlist', domainName: 'uap', callback});
    }

    render(){
        let { commonList, iniInput, enableInput, minWidth, minHeight, noShadow, setComment, update, isDetail, autoFocus } = this.props;
        return (
            <div className="areaWrapper nc-theme-from-input-bgc nc-theme-from-input-bc">
                {/* iniInput 是否初始化为input形态   enableInput 是否开启可收起状态 */}
                <ResizableTextArea 
                commonList={commonList} 
                update={update} // 更新方法
                minHeight={minHeight} // 设置可拖拽区域的最小高度
                minWidth={minWidth} // 设置可拖拽区域的最小宽度
                iniInput={iniInput} 
                enableInput={enableInput}
                noShadow={noShadow}
                isDetail={isDetail}
                setComment={setComment}
                json={this.state.json}
                autoFocus={autoFocus}
                />
            </div>
        );
    }
}