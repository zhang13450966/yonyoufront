import { base } from "nc-lightapp-front";
const { NCSelect } = base;
const NCOption = NCSelect.NCOption;
import Utils from "@public/utils";
const { langCheck } = Utils;

//操作符组件
export default function Operator(props) {
    const { options, record, onSelectChange } = props;
    const { relationOper } = record;

    const handleSelectChange = item => {
        onSelectChange(item);
    };
    return (
        <NCSelect
            fieldid="num_select"
            placeholder={langCheck(
                "reportMultiLang",
                "100301-000049",
            )} /* 国际化处理： 选择操作符*/
            onChange={handleSelectChange}
            value={relationOper}
            showClear={false}
        >
            {options.map(item => (
                <NCOption key={item.value} value={item.value}>{item.display}</NCOption>
            ))}
        </NCSelect>
    );
}
