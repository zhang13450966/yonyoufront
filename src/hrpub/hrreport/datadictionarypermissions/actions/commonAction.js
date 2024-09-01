import HrPubCommon from 'src/hrpub/common/actions';

export default class CommonAction extends HrPubCommon {

    constructor(comp) {
        super(comp);
        
    }


    //本节点更新
    update = async (obj) => {
        const {props} = this.comp;
        const {dispatch} = props;

        await dispatch({
            type: 'ddp/update',
            payload: obj
        });
    }
}