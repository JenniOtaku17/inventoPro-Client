import Vue from 'vue';
import { auth } from '~/plugins/firebase';
import { zconfig } from '~/plugins/config';
import { zalert } from '~/plugins/alerts';

export default async function ({ route,store,$axios, redirect, app }, inject) {

    if(store.state.userManager.user != null){
        let token = await auth.currentUser.getIdToken(true);
        
        const api = $axios.create({
            headers: {
                common: {
                    Accept: 'text/plain, /',
                    Authorization: `Bearer ${token}` 
                }
            }

        })

        api.setBaseURL(zconfig.host)


        api.onResponseError( async (response) => {

            if(response.response.status === 401) {
                auth.signOut().then(()=> {
                    redirect('/')
                });
  
            }else{
              return response;
            }
            
        })

        api.onError( async (error) => {

            if(error === 401) {
                auth.signOut().then(()=> {
                    redirect('/')
                });
  
            }else{
                if(error.response){
                    let text = error.response.data.error;
                    zalert('error', 'Solicitud no procesada', text, null);
                }
                return error;
            }
            
        })

        Vue.prototype.$api = await api;
    }
}