/**
 * 布局结构
 * @constructor
 * @author neo
 */
import React from 'react';
import {render, connect} from 'src/hrpub/common/frame';
import {base} from 'nc-lightapp-front';
import buttonAction from './action/buttonAction';

const {NCModal, NCButton} = base;
const Wrapper = render({
    actions: {
        buttonAction
    }
})(({props, action, state}) => {
    const {infosetmgt} = props;
    const {cancel, close, saveClose} = action.buttonAction;
    const {exconfirmShow, lang} = infosetmgt;
    return (
        <NCModal
            size={'sm'}
            visible={exconfirmShow}
            onCancel={cancel}>
            <NCModal.Header closeButton>
                <NCModal.Title>{lang['hrpub-000111']}</NCModal.Title>
            </NCModal.Header>
            <NCModal.Body>
				<span
                    className="iconfont icon-zhuyi1 warning"
                    style={{fontSize: '25px', color: '#ffbf00', float: 'left', marginRight: '20px'}}
                />
                <span style={{fontSize: '14px', color: '#111', margin: '5px 8px'}}>{lang['hrpub-000112']}</span>
            </NCModal.Body>
            <NCModal.Footer>
                <NCButton colors="primary" onClick={saveClose}>
                    {lang['hrpub-000113']}
                </NCButton>
                <NCButton colors="default" onClick={close}>
                    {lang['hrpub-000114']}
                </NCButton>
                <NCButton colors="default" onClick={cancel}>
                    {lang['hrpub-000047']}
                </NCButton>
            </NCModal.Footer>
        </NCModal>
    );
});

export default connect(Wrapper);
