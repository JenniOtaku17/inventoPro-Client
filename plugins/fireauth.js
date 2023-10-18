import { auth } from '~/plugins/firebase';
import Vue from 'vue';
import { zconfig, zprint } from '~/plugins/config';
import { zalert } from '~/plugins/alerts';

export default context => {
    const { store, $axios, redirect, app } = context;

    $axios.setBaseURL = zconfig.host;

    return new Promise((resolve, reject) => {

      auth.onIdTokenChanged( async user => {
        await store.commit('userManager/setUser', user);
        let us = await store.state.userManager.user;
        if(us){

          let token = us.stsTokenManager.accessToken;
          zprint(token);

          const api = $axios.create({
            headers: {
              common: {
                  Accept: 'text/plain, /',
                  Authorization: `Bearer ${token}` 
              }
              }
          })
      
          api.setBaseURL(zconfig.host)
          Vue.prototype.$api = await api;

        }else{
          return resolve(store.commit('userManager/setUser', null))
        }

      });

      auth.onAuthStateChanged( async (user) => {
        if (user) {

          setInterval(async () => {
            let token = await auth.currentUser.getIdToken(true);
            }, (90000)
          );
          return resolve(store.commit('userManager/setUser', user))
        }else{
          return resolve(store.commit('userManager/setUser', null))
        }
      })
    })
}