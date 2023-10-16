import { zprint } from '~/plugins/config';

export default async function ({ store, redirect }) {

    if(store.state.userManager.user){ 
        redirect('/cliente');
    }else{
        zprint('Access granted');
    }
}