import axios from 'axios';

export default {
    namespaced: true,

    state: {
        scrollList: [],
        layerTextList: [],
        videoMonitorPoints: [], // 视频监测点信息
    },

    mutations:{
        UPDATE_STATES (state, payload) {
            Object.entries(payload).forEach((item) => {
                const [key, value] = item;

                state[key] = value;
            });
        },
    },

    actions:{
        // 视屏监控点
        getVideoMonitorPoints ({ commit }, payload) {
            axios.get('/data/monitorEquip/视频监控点.json').then((res) => {
                if (res.status === 200) {
                    console.log('读取到json')
                    commit('UPDATE_STATES', { videoMonitorPoints: res.data });
                }
            });
        },
    }
}