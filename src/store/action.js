import {
  getMenuList,
  getroleList,
  getuserlist,
  getcateList,
  getspecList,
  getgoodsList,
  getmemberList,
  getbannerList,
  getseckList,
  
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
   //封装一个获取商品管理列表
   getActionGoodsList({
    commit
  }, pageInfo) {
    
    getgoodsList(pageInfo)
      .then(res => {
        if (res.data.code == 200) {
          //针对返回的结果进行转化，目的就是转化null
          let list = []
          list = res.data.list == null ? [] : res.data.list
          commit('reqGoodsList', list)
        }
      })
  },
  //会员管理
  getActionMemberList({
    commit
  }) {
    getmemberList()
      .then(res => {
        if (res.data.code == 200) {
          commit('reqMemberList', res.data.list)
        }
      })
  },
  //轮播图
  getActionBannerList({
    commit
  }) {
    getbannerList()
      .then(res => {
        if (res.data.code == 200) {
          commit('reqBannerList', res.data.list)
        }
      })
  },
  //秒杀列表
  getActionSeckList({
    commit
  }) {
    getseckList()
      .then(res => {
        if (res.data.code == 200) {
          commit('reqSeckList', res.data.list)
        }
      })
  },


  }
