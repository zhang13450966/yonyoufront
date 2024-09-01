import { base } from "nc-lightapp-front";
const { NCFormControl, NCSelect } = base;
const NCOption = NCSelect.NCOption;
import Utils from "@public/utils";
const { langCheck } = Utils;

const LEFT_OPTIONS = [
    {
        value: "4",
        display: ">",
    },
    {
        value: "6",
        display: ">=",
    },
];

const RIGHT_OPTIONS = [
    {
        value: "5",
        display: "<",
    },
    {
        value: "7",
        display: "<=",
    },
];

//输入框组件
export default function ValueComponent(props) {
    const { record, onInputChange } = props;
    const {
        relationOper,
        firstValue,
        secondValue,
        betweenFirstRelationOper,
        betweenSecondRelationOper,
    } = record;
    const handleInputChange = (value, way) => {
        onInputChange(value, way);
    };
    if (relationOper === "8") {
        return (
            <div className="item-between">
                <div className="item-between-value">
                    <NCSelect
                        fieldid="num_select"
                        placeholder={langCheck(
                            "reportMultiLang",
                            "100301-000049"
                        )} /* 国际化处理： 选择操作符*/
                        onChange={(value) =>
                            handleInputChange(value, "betweenFirstRelationOper")
                        }
                        showClear={false}
                        value={betweenFirstRelationOper}
                    >
                        {LEFT_OPTIONS.map((item) => (
                            <NCOption key={item.value} value={item.value}>
                                {item.display}
                            </NCOption>
                        ))}
                    </NCSelect>
                    <NCFormControl
                        className="report-form-control"
                        value={firstValue}
                        type="number"
                        fieldid="firstValue"
                        onChange={(value) =>
                            handleInputChange(value, "firstValue")
                        }
                    />
                </div>
                <span className="between-icon">-</span>
                <div className="item-between-value">
                    <NCSelect
                        fieldid="num_select"
                        placeholder={langCheck(
                            "reportMultiLang",
                            "100301-000049"
                        )} /* 国际化处理： 选择操作符*/
                        onChange={(value) =>
                            handleInputChange(
                                value,
                                "betweenSecondRelationOper"
                            )
                        }
                        showClear={false}
                        value={betweenSecondRelationOper}
                    >
                        {RIGHT_OPTIONS.map((item) => (
                            <NCOption key={item.value} value={item.value}>
                                {item.display}
                            </NCOption>
                        ))}
                    </NCSelect>
                    <NCFormControl
                        className="report-form-control"
                        value={secondValue}
                        type="number"
                        fieldid="secondValue"
                        onChange={(value) =>
                            handleInputChange(value, "secondValue")
                        }
                    />
                </div>
            </div>
        );
    } else {
        return (
            <div className="item-between">
                <NCFormControl
                    value={firstValue}
                    type="number"
                    fieldid="firstValue"
                    onChange={(value) => handleInputChange(value, "firstValue")}
                />
            </div>
        );
    }
}
