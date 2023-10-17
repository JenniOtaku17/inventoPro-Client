<template>
  <v-app :dark="true">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed color="back"
      app
    >
      <v-list>
        <v-list-item class="px-2 logoContainer">
          <img src="~assets/images/logo.png" :width="miniVariant?'100%':'40%'" /> 
        </v-list-item>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon :color="$vuetify.theme.dark? 'white':'secondary'">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append >
        <div class="pa-2" v-if="miniVariant == false" style="display:flex">
          <span class="version" @click="logOut" style="cursor:pointer">
            <v-icon color="white" >mdi-logout</v-icon>
            Logout 
          </span>
          <v-spacer />
          <div>
            <input type="checkbox" class="checkbox" id="checkbox" @click="$vuetify.theme.dark = !$vuetify.theme.dark" />
            <label for="checkbox" class="label">
              <v-icon color="primary" small>mdi-weather-night</v-icon>
              <v-icon color="primary" small>mdi-white-balance-sunny</v-icon>
              <div class="ball"></div>
            </label>
          </div>
        </div>
        <div class="pa-2" v-else>
          <v-icon color="white" @click="logOut" >mdi-logout</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed color="transparent"
      app elevation="0"
    >
      <v-app-bar-nav-icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ miniVariant? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-main>
      <v-container class="lg-15">
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import $ from "jquery";
import { auth } from '~/plugins/firebase';

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
      {
          icon: 'mdi-badge-account',
          title: 'Usuarios',
          to: '/usuario'
        },
        {
          icon: 'mdi-account-group',
          title: 'Clientes',
          to: '/cliente'
        },
        {
          icon: 'mdi-account-box-multiple',
          title: 'Proveedores',
          to: '/proveedor'
        },
        {
          icon: 'mdi-domain',
          title: 'Almacenes',
          to: '/almacen'
        },
        {
          icon: 'mdi-shape-plus',
          title: 'Productos',
          to: '/producto'
        },
        {
          icon: 'mdi-package-variant-closed-plus',
          title: 'Recepcion',
          to: '/recepcion'
        },
        {
          icon: 'mdi-cash-register',
          title: 'Facturacion',
          to: '/facturacion'
        },
        {
          icon: 'mdi-cash-refund',
          title: 'Devolucion',
          to: '/devolucion'
        },
        {
          icon: 'mdi-file-chart',
          title: 'Reporteria',
          to: '/reporteria'
        },
      ],
      miniVariant: false,
      title: 'Incidencias APP',
    }
  },
  mounted(){
    
  },
  methods: {

    async logOut(){
      auth.signOut().then(()=> {
        this.$router.push({ path: '/login' });
      });
    },

    toggle(){
      $('#container').toggleClass('darkmode')
    }
  
  }
}
</script>
<style>

.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox:checked + .label .ball {
  transform: translateX(20px);
}

.label {
  position: relative;
  background-color: #F7F8F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 50px;
  padding: 5px;
  height: 25px;
  width: 50px;
  cursor: pointer;
}

.ball {
  position: absolute;
  top: 3px;
  left: 4px;
  background-color: #F7F8F9;
  border-radius: 50%;
  height: 20px;
  width: 23px;
  transition: transform .2s linear;
}

.logoContainer{
  display: flex;
  justify-content: center;

  /*img{
    filter: invert(50%) sepia(47%) saturate(426%) hue-rotate(112deg) brightness(120%) contrast(95%);
  }*/
}

.v-navigation-drawer__append{
  padding-top:5px;
  background-color: #144659;
}

.v-list-item--active{

  .v-list-item__action{
    i{
      color: #24A645!important;
    }
  }

  .v-list-item__title{
    color: #24A645;
    font-weight: 600;
  }

}

.v-list-item--active::before {
    opacity: 0!important;
}

.version{
  font-size:14px; 
  margin-left:5px; 
  color:#F7F8F9;
  font-weight: 500;
  margin-top:3px;
}

</style>