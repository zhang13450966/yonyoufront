
export default class ButtonAction {
    constructor(comp) {
        this.action = comp.action;
        this.comp = comp;
    }

    didAllInstance = () => {
        this.setBtnHandleMap();
    }

    // 生成按钮map
    setBtnHandleMap = () => {
        this.buttonHandleMap = {
            // 打印
            'print': this.printTable,
            // 输出
            'output': this.outputTable
        }
    }


    // 第一次进页面的按钮状态
    initPageButton = () => {
        const {props} = this.comp;
        const {
            button
        } = props;
        button.setButtonVisible({
            approveinfo: false,
            cardrpt: false,
            file: false
        });
    }

    // 按钮点击回调
    headerClick = (props, btnCode) => {
        console.log(btnCode);
        if(typeof this.buttonHandleMap[btnCode] === 'function') {
            this.buttonHandleMap[btnCode]();
        }
    }

    // 打印
    printTable = () => {
        const {props} = this.comp;
        const {attendance, editTable, meta} = props;

        let tableWrapper = document.getElementById('mainTable');

        this.print(tableWrapper, {
            title: attendance.language['gx6008-000067'], // 录用办理
            maker: attendance.language['gx6008-000068'], // 制作者
            date: attendance.language['gx6008-000069'], // 制作日期
            tableInfo: {
                data: editTable.getAllRows('list'),
                tableTmp: meta.getMeta()['list']
            },
            beforeAppend: (data) => {
                data[0].map((item, rowIndex) => {
                    delete item[0];
                });
                data[1].map((item) => {
                    item.length = item.length - 1;
                });
                return data;
            }
        });
    }

    // 输出
    outputTable = () => {
        const {
            props: {
                editTable,
                attendance: {
                    language
                },
                meta
            }
        } = this.comp;
        let tableWrapper = document.getElementById('mainTable');
        let tableData = editTable.getAllData('list');

        this.exportHtml(tableWrapper, {
            fileName: language['gx6008-000067'] // '录用办理'
        }, {
            meta: meta.getMeta()['list'],
            data: tableData.rows,
            showIndex: false
        });
    }

    // 附件管理
    fileManager = (selectedRows) => {
        let billId = selectedRows[0].values['bill_code'].value;

        this.update({
            fileManagerBillId: billId,
            fileManagerModalVisible: true
        });
    }
}