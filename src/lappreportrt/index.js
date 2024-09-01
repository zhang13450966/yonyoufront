import SimpleReport from "./components/ReportTable";
import SimpleTable from "./components/SimpleTable";
import GraphicReport from "./components/Graphic";
import Utils from "./components/public/utils";
const { changeConditionWhenSearch } = Utils;

if (NODE_ENV !== "development") {
    // eslint-disable-next-line no-undef
    console.log(
        `%c lappreportrt was built from ${BRANCH} at: ${LAPPREPORTRT_VERSION} `,
        "background:#222;color:#bada55"
    );
}

export { SimpleReport, SimpleTable, changeConditionWhenSearch, GraphicReport };
