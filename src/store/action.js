import {
  getMenuList,
  getroleList,
  getuserlist,
  getcateList,
  getspecList
} from '../util/axios'

export default {
  //封装一个获取菜单列表
  getActionMenuList({
    commit
  }) {
    getMenuList({
        istree: 1
      })
      .then(res => {
        if (res.data.code == 200) {
          commit('reqMenuList', res.data.list)
        }
      })
  },
  //封装一个获取角色列表
  getActionRoleList({
    commit
  }) {
    getroleList()
      .then(res => {
        if (res.data.code == 200) {
          commit('reqRoleList', res.data.list)
        }
      })
  },
  //封装一个获取管理员列表的方法
  getActionUserList({
    commit
  },pageInfo) {
    getuserlist(pageInfo)
      .then(res => {
        if (res.data.code == 200) {
          //针对返回的结果进行转化，目的就是转化null
          let list = [];
          list = res.data.list == null ? [] : res.data.list
          commit('reqUserList', list)
        }
      })
  },
  //封装一个获取商品列表的方法
  getActionCateList({
    commit
  }) {
    getcateList({istree:1})
      .then(res => {
        if (res.data.code == 200) {
          commit('reqCateList', res.data.list)
        }
      })
  },
  //封装一个获取商品规格的方法
  getActionSpecsList({
    commit
  }, pageInfo) {
    getspecList(pageInfo)
      .then(res => {
        if (res.data.code == 200) {
          //针对返回的结果进行转化，目的就是转化null
          let list = []
          list = res.data.list == null ? [] : res.data.list;
          commit('reqSpecsList', list)
        }
      })
  },
}
