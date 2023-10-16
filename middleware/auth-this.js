import { zprint } from '~/plugins/config';

export default async function ({ store, redirect }) {

    if(store.state.userManager.user){ 
        zprint('Access granted');
    }else{
        redirect('/login');
    }
}