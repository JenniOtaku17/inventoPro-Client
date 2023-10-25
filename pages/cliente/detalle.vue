<template>

    <v-container class="px-12 pb-10 pageDetalleCliente" v-if="cliente">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                <v-btn color="primary" icon @click="goBack" class="mb-2 backButton">
                    <v-icon>mdi-arrow-left-top-bold</v-icon>
                </v-btn>
                {{ cliente.nombre }} {{ cliente.apellido }}
            </h3>
            <h4 class="text--secondary">
                Información detallada del cliente
            </h4>
        </v-col>
      </v-row>
  
      <v-row class="mt-2 mx-1">
        <v-col>
            <v-row class="mt-4">
                <v-col>
                    <v-card flat color="back" class="py-8 px-8">
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Código: </span>
                                    <span class="descriptionText">{{ cliente.id }}</span>
                                </v-col>
                            </v-row>

                            <v-row >
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Nombre: </span>
                                    <span class="descriptionText">{{ cliente.nombre }} {{ cliente.apellido }}</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Cédula: </span>
                                    <span class="descriptionText">{{ cliente.cedula }}</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Teléfono: </span>
                                    <span class="descriptionText">
                                        <span v-if="cliente.telefono">{{ formatPhoneNumber(cliente.telefono) }}</span>
                                        <span v-else>Sin registrar</span>
                                    </span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Correo: </span>
                                    <span class="descriptionText">
                                        <span v-if="cliente.correo">{{ cliente.correo }}</span>
                                        <span v-else>Sin registrar</span>
                                    </span>
                                </v-col>
                            </v-row>

                            <v-row class="mt-15">
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Dirección: </span>
                                    <span class="descriptionText">
                                        <span v-if="cliente.ubicacion">{{ cliente.ubicacion }}</span>
                                        <span v-else>Sin registrar</span>
                                    </span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Descripción: </span>
                                    <span class="descriptionText">
                                        <span v-if="cliente.descripcion">{{ cliente.descripcion }}</span>
                                        <span v-else>Sin registrar</span>
                                    </span>
                                </v-col>
                            </v-row>

                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
                
        </v-col>
      </v-row>
    </v-container>
    
    <loading v-else/>

  </template>
  
  <script>

  import loading from "~/components/utils/loading";
  
  export default {

    middleware: "auth-facturador",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },

    components:{
        loading
    },
  
    data() {
        return {
            isLoading: false,
            cliente: null,
            user: null,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;
                let id = this.$route.query.id;
                let cliente = await this.$api.get(`api/cliente/${id}`);

                this.cliente = await cliente.data;

                this.$print(this.cliente);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatPhoneNumber( str ){
            let cleaned = ('' + str).replace(/\D/g, '');
    
            let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
            
            if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
            }
            
            return str;
        },

        goBack() {
            this.$router.go(-1);
        },
    
  
    },

  };
  </script>
  
  <style lang='scss' >

  .pageDetalleCliente{

    .v-slide-group__content{
        border-bottom: 2px solid #9ca39d;
    }

    .v-tabs-slider-wrapper{
        bottom: -2px;
    }

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }

    .titleText{
        font-size: 14px;
        font-weight: 500;
    }

    .descriptionText{
        font-size: 14px;
    }

    .backButton{
        position: absolute;
        left: 35px;
        top: 20px;
    }
  }

  </style>