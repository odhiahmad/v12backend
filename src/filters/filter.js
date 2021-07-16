import Vue from "vue"
import moment from 'moment';

moment.locale('id');

Vue.filter('tanggalIndonesia', function (value) {

    var tes = value.substring(0, 10);
    return moment(tes).format('MMMM Do YYYY')
})

Vue.filter('hurufBesar', function (value) {

    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('statusMenu', function (value) {
    if (parseInt(value) === 0) {
        return "Root Menu"
    } else if (parseInt(value) === 1) {
        return "Sub Menu"
    } else if (parseInt(value) === 2) {
        return "Sub Sub Menu"
    }

})

// Vue.filter('role', function (value) {
//     if (parseInt(value) === 0) {
//         return "Root Menu"
//     } else if (parseInt(value) === 1) {
//         return "Sub Menu"
//     } else if (parseInt(value) === 2) {
//         return "Sub Sub Menu"
//     }

// })