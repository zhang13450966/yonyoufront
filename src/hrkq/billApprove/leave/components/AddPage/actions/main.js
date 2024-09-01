
import {
    output,
    print
} from 'nc-lightapp-front';

export default class Main {
    constructor(comp) {
        this.comp = comp;
    }

    didAllInstance = () => {
        this.setButtonHandleMap();
    }

    // 设置按钮事件map
    setButtonHandleMap = () => {
        const {action} = this.comp;

        this.buttonHandleMap = {
            'save': this.saveAddPage,
            'browse_status': {
                'callback': this.callbackFromCard,
                'print': this.printIt,
                'output': this.output,
            }
        };
    }

    // 打印
    printIt = () => {
        let formValue = this.comp.props.form.getAllFormValue('card');

        print('pdf', '/nccloud/hryf/entrymng/EntryPrintAction.do', {
            appcode: '60656046',
            nodekey: '60081010',
            oids: [formValue.rows[0].values['pk_entryapply'].value]
        });
    }

    // 输出
    output = () => {
        const {props} = this.comp;
        const {
            leave
        } = props;
        let formValue = this.comp.props.form.getAllFormValue('card');
        output({
            url: '/nccloud/hryf/entrymng/EntryPrintAction.do',
            data: {
                appcode: '60092010',
                nodekey: '60081010',
                oids: [formValue.rows[0].values['pk_entryapply'].value],
                outputType: 'output',
                filename: leave.language['gx6008-000067'] // 录用办理
            },
            callback: () => {
            }
        });
    }
}