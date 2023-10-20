import { zprint, zconfig } from '~/plugins/config';

export default async function ({ store, redirect, $axios }) {

    if(store.state.userManager.user){ 

        let user = store.state.userManager.user;
        let token = user.stsTokenManager.accessToken;
        let userApi = await $axios.get(`${zconfig.host}/api/usuario/firebaseId/${user.uid}`,{ headers: { Authorization: `Bearer ${token}` } });
        store.commit("userManager/setUserDetails", userApi.data);

        if(userApi.data.roleId == 2){
            redirect('/usuario');
        }else{
            redirect('/cliente');
        }

    }else{
        redirect('/login');
    }
}