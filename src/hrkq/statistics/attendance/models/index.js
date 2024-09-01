import CommonModel from 'src/hrpub/common/model';

import config from '../config/index';

class Model extends CommonModel {
    constructor(props) {
        super(props);
    }

    name = config.name

    data = {
        // ...
    }

    sync = {
        ...this.sync
    }

    async = {
        
    } 
}

export default new Model()