import Vue from 'vue';
import Vuex from 'vuex';
import itemsStore from './itemsStore';
import usersStore from './usersStore';
import adminStore from './adminStore';

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        itemsStore,
        usersStore,
        adminStore
    }
});