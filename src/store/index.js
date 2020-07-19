//引入核心库
import Vue from 'vue'
//引入vuex
import Vuex from 'vuex'

Vue.use(Vuex)

//引入核心模块
import state from './state'
import getters from './getter'
import mutations from './mutaion'
import actions from './action'

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})