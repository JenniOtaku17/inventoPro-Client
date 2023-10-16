export default async function ({ store, redirect }) {

    if(store.state.userManager.user){ 
        redirect('/cliente');
    }else{
        redirect('/login');
    }
}