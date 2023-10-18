export const state = () => ({
    user: null,
    userDetails: null,
})
  
  
export const mutations = {
    setUser (state, usert) {
      state.user = JSON.parse(JSON.stringify(usert))//Object.assign({}, usert)
    },

    setUserDetails (state, usert) {
      state.userDetails = JSON.parse(JSON.stringify(usert))//Object.assign({}, usert)
    },

}

