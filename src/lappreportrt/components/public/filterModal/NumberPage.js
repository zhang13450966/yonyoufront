import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    Fragment,
    useEffect,
} from "react";
import { base } from "nc-lightapp-front";
const { NCButton } = base;
import Operator from "./Operator";
import ValueComponent from "./ValueComponent";
import Utils from "@public/utils";
const { langCheck } = Utils;

const defaultItem = {
    relationOper: "8",
    firstValue: "",
    secondValue: "",
    betweenFirstRelationOper: "6",
    betweenSecondRelationOper: "7",
};

export default forwardRef(function NumberPage(params, ref) {
    const [list, setList] = useState([]);

    useEffect(() => {
        setList(params.operValues);
    }, []);

    useImperativeHandle(ref, () => ({
        getInfo: () => {
            return list;
        },
    }));

    const options = getOptions();

    //操作符修改
    function onSelectChange(index, e) {
        const copyList = [...list];
        copyList[index].relationOper = e;
        setList(copyList);
    }

    //值 输入框修改事件
    function onInputChange(index, value, way = "firstValue") {
        const copyList = [...list];
        copyList[index][way] = value;
        setList(copyList);
    }

    //清空筛选条件
    function onEmpty() {
        setList([{ ...defaultItem }]);
    }

    //删除某一项
    function removeItem(i) {
        const copyList = [...list];
        copyList.splice(i, 1);
        setList(copyList);
    }

    function addItem() {
        const copyList = [...list];
        copyList.push({ ...defaultItem });
        setList(copyList);
    }

    return (
        <Fragment>
            <div className="number-box">
                {list.map((item, index) => {
                    return (
                        <div className="number-item" key={index}>
                            <div className="number-item-front">
                                <Operator
                                    options={options}
                                    record={item}
                                    onSelectChange={(e) =>
                                        onSelectChange(index, e)
                                    }
                                />
                            </div>
                            <ValueComponent
                                record={item}
                                options={options}
                                onInputChange={(value, way) =>
                                    onInputChange(index, value, way)
                                }
                            />
                            <i
                                className="iconfont nc-theme-icon-font-c icon-shanchu"
                                onClick={() => removeItem(index)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="add-btn-container">
                <div className="add-btn nc-theme-area-split-bc" onClick={addItem}>
                    +{langCheck("reportMultiLang", "100301-000268")}
                </div>
                <NCButton onClick={onEmpty}>
                    {langCheck("reportMultiLang", "100301-000251")}
                </NCButton>
            </div>
        </Fragment>
    );
});

//获取操作符下拉数据
const getOptions = () => {
    return [
        {
            value: "0",
            display: langCheck("reportMultiLang", "100301-000050"),
        },
        {
            value: "2",
            display: langCheck("reportMultiLang", "100301-000051"),
        },
        {
            value: "4",
            display: langCheck("reportMultiLang", "100301-000052"),
        },
        {
            value: "6",
            display: langCheck("reportMultiLang", "100301-000053"),
        },
        {
            value: "5",
            display: langCheck("reportMultiLang", "100301-000054"),
        },
        {
            value: "7",
            display: langCheck("reportMultiLang", "100301-000055"),
        },
        {
            value: "8",
            display: langCheck("reportMultiLang", "100301-000260"),
        },
    ];
};
