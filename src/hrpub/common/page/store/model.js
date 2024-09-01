
import proFetch from '../../../public/functions/project-fetch';

export default {
    data: {
        context: {},
        language: {},
        pageIns: null
    },
    sync: {
        update: (state, payload) => {
            return {
                ...state,
                ...payload
            }
        }
    },
    async: {
    }
};