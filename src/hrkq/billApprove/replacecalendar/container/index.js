import React from 'react';

import './index.less';

// 页面配置信息配置
import pageConfig from './config';

const {
    components: {
        AddPage, 
        FileManager
    },
    actions,
    methods: {
        createPage,
        render
    }
} = pageConfig;


const HomePage = render({
    actions: actions
})(({props, action, state}) => {

    const {replacecalendar} = props;

    return (
        <div>
            <AddPage 
                {...props}
            />
            <If condition={replacecalendar.fileManagerModalVisible}>
                <FileManager
                    language={replacecalendar.language}
                    billId={replacecalendar.fileManagerBillId}
                    onClose={action.mainAct.closeModal.bind(this, 'fileManagerModalVisible')}
                />
            </If>
        </div>
    );
})

export default createPage({})(HomePage);