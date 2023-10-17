import Vue from 'vue';

const config = {
    version: '1.1',
    host: "https://inventopro.azurewebsites.net/",
    testEnvironment: true
}

function print( info ){
    if(config.testEnvironment == true){
        console.log( info );
    }
}

function formatDate( date, getHours ){
    let fecha = date.toString().length > 10 ? new Date(date) : new Date(date.toString()+'T00:00:00');
    let year = fecha.getFullYear().toString();
    let month = (fecha.getMonth()+ 1).toString();
    let day = fecha.getDate().toString();
    let hours = fecha.getHours().toString();
    let minutes = fecha.getMinutes().toString();
    let format;
    hours >= 12 ? format = 'pm' : format = 'am';
    hours == 13 ? hours = '01' : null;
    hours == 14 ? hours = '02' : null;
    hours == 15 ? hours = '03' : null;
    hours == 16 ? hours = '04' : null;
    hours == 17 ? hours = '05' : null;
    hours == 18 ? hours = '06' : null;
    hours == 19 ? hours = '07' : null;
    hours == 20 ? hours = '08' : null;
    hours == 21 ? hours = '09' : null;
    hours == 22 ? hours = '10' : null;
    hours == 23 ? hours = '11' : null;
    hours == 0 ? hours = '12' : null;

    if(getHours == true){
        return `${day.length == 1 ? '0'+day: day}/${month.length == 1 ? '0'+month: month}/${year} ${hours.length == 1 ? '0'+hours: hours}:${minutes.length == 1 ? '0'+minutes: minutes} ${format}`
    }else{
        return `${day.length == 1 ? '0'+day: day}/${month.length == 1 ? '0'+month: month}/${year}`
    }
}

Vue.prototype.$config = config;
Vue.prototype.$print = print;
Vue.prototype.$formatDate = formatDate;

export const zprint = print;
export const zconfig = config;
export const zformatDate = formatDate;