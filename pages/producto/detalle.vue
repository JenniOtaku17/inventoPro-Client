<template>

    <v-container class="px-12 pb-10 pageDetalleProducto" v-if="producto">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                <v-btn color="primary" icon @click="goBack" class="mb-2 backButton">
                    <v-icon>mdi-arrow-left-top-bold</v-icon>
                </v-btn>
                {{ producto.nombre }} {{ producto.apellido }}
            </h3>
            <h4 class="text--secondary">
                Información detallada del producto
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
                                    <span class="descriptionText">{{ producto.id }}</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Nombre: </span>
                                    <span class="descriptionText">{{ producto.nombre }}</span>
                                </v-col>
                            </v-row>

                            <v-row >
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Unidad: </span>
                                    <span v-if="producto.unidad" class="descriptionText">{{ producto.unidad }}</span>
                                    <span v-else>Sin registrar</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Código de Barra: </span>
                                    <span v-if="producto.codigoBarra" class="descriptionText">{{ producto.codigoBarra }}</span>
                                    <span v-else>Sin registrar</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Almacén: </span>
                                    <span class="descriptionText">{{ producto?.almacen?.nombre }}</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Existencia: </span>
                                    <span class="descriptionText">{{ producto.existencia }}</span>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Precio: </span>
                                    <span class="descriptionText"><formatNumber :value="producto.precio" /></span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Impuesto: </span>
                                    <span class="descriptionText">{{ producto.impuesto }}%</span>
                                </v-col>
                            </v-row>

                            <v-row class="mt-15">
                                <v-col cols="12" md="12">
                                    <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Descripción: </span>
                                    <span class="descriptionText">
                                        <span v-if="producto.descripcion">{{ producto.descripcion }}</span>
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
  import formatNumber from "~/components/utils/formatNumber";
  
  
  export default {

    middleware: "auth-facturador",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },

    components:{
        loading,
        formatNumber
    },
  
    data() {
        return {
            isLoading: false,
            producto: null,
            user: null,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;

                let id = this.$route.query.id;
                let producto = await this.$api.get(`api/producto/${id}`);
                this.producto = await producto.data;
                this.$print(this.producto);
                
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        goBack() {
            this.$router.go(-1);
        },
    
  
    },

  };
  </script>
  
  <style lang='scss' >

  .pageDetalleProducto{

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