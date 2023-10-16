export const state = () => ({
    user: null,
})
  
  
export const mutations = {
    setUser (state, usert) {
      state.user = JSON.parse(JSON.stringify(usert))//Object.assign({}, usert)
    },

}

export const getters = {
    userPublic: state => {
      const userData = state.user;

      return userData ? {
        uid: userData.uid,
        displayName: userData.displayName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        photoURL: userData.photoURL
      } : null
    }
}
