export default class ButtonAction {
    constructor(comp) {
        this.action = comp.action;
        this.comp = comp;
    }

    // 附件管理
    fileManager = () => {
        const { dispatch } = this.comp.props;
        dispatch({
            type: 'outside/update',
            payload: {
                fileManagerModalVisible: true
            }
        });
    }
}