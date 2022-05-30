import Vue from 'vue';
import Vuex from 'vuex';

import monitoringEquip from "./MonitoringEquipState/index";

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        count:1,
    },
    mutations: {
    },
    actions: {},
    modules: {
        monitoringEquip,
    }
})