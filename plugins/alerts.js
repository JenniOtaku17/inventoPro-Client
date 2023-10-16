import Vue from 'vue';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
  

function alert( icon, title, text, timer ){
    if(timer != null){
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: timer
        })
    }else{
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#144659'
        })
    }
}


function toast( icon,  text ){

    Toast.fire({
        icon: icon,
        title: text
    })
}

function confirm(title, text){
    return Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#24A645',
        cancelButtonColor: '#144659',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    })
}

 
Vue.prototype.$confirm = confirm;
Vue.prototype.$alert = alert;
Vue.prototype.$toast = toast;

export const zalert = alert;