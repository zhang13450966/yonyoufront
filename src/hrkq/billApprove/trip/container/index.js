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

    const {trip} = props;

    return (
        <div>
            <AddPage
                {...props}
            />
            <If condition={trip.fileManagerModalVisible}>
                <FileManager
                    language={trip.language}
                    billId={trip.fileManagerBillId}
                    onClose={action.mainAct.hideFileUploader.bind(this, 'fileManagerModalVisible')}
                />
            </If>
        </div>
    );
})

export default createPage({})(HomePage);