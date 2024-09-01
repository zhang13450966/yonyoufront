import { extend } from "jquery";
import ModelContentSon from "./indexBox";

export default class ModelContent extends ModelContentSon{
    constructor(props){
        super(props);
        //console.log("继承---",this);
        // this.leftDom = function(){
        //     console.log("继承---1",this);
        //     return <div>
    
        //         继承实现左侧区域
        //     </div>
        // }
    }
    
}
