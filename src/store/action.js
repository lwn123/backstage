import {
  getMenuList,
  getroleList,
  getuserlist
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
  }) {
    getuserlist({size:4,page:1})
      .then(res => {
        if (res.data.code == 200) {
          commit('reqUserList', res.data.list)
        }
      })
  }
}
