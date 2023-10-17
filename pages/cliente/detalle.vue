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
  
      <v-row class="mt-2">
        <v-col>
          <v-card flat class="px-4 pb-6">
            <v-tabs
                v-model="tabs"
            >
                <v-tabs-slider></v-tabs-slider>
                <v-tab>
                    Información<v-icon right>mdi-text-box-search-outline</v-icon>
                </v-tab>

                <v-tab>
                    Préstamos<v-icon right>mdi-file-sign</v-icon>
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tabs">
                <v-tab-item>
                    <v-row class="mt-4">
                    <v-col>
                        <v-card flat color="back" class="py-8 px-8">
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Código: </span>
                                        <span class="descriptionText">{{ cliente.id }}</span>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Nombre: </span>
                                        <span class="descriptionText">{{ cliente.nombre }} {{ cliente.apellido }}</span>
                                    </v-col>
                                </v-row>

                                <v-row >
                                    <v-col cols="12" md="6">
                                        <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Cédula: </span>
                                        <span class="descriptionText">{{ cliente.cedula }}</span>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Fecha de Nacimiento: </span>
                                        <span class="descriptionText">
                                            <span v-if="cliente.fechaNacimiento">{{ formatDate(cliente.fechaNacimiento, false) }}</span>
                                            <span v-else>Sin registrar</span>
                                        </span>
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
                                            <span v-if="cliente.direccion">{{ cliente.direccion }}</span>
                                            <span v-else>Sin registrar</span>
                                        </span>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <span :class="$vuetify.theme.dark == true? 'titleText primary--text': 'titleText secondary--text'">Observaciones: </span>
                                        <span class="descriptionText">
                                            <span v-if="cliente.observaciones">{{ cliente.observaciones }}</span>
                                            <span v-else>No hay ninguna observación</span>
                                        </span>
                                    </v-col>
                                </v-row>

                            </v-card-text>
                        </v-card>
                    </v-col>
                    </v-row>
                </v-tab-item>
                <v-tab-item class="pt-8">
                    <v-card-text class="px-0" v-if="cliente">
                        <v-data-table :headers="headers" :items="prestamos" :loading="isLoading" dense hide-default-footer
                        loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                        :page="page" :items-per-page="itemsPerPage"
                        >
                        <template v-slot:body="{ items }" v-if="prestamos && prestamos.length > 0">
                            <tbody>
                            <tr v-for="item in items" class="puntero" :key="item.prestamoId">
                                <td>{{ item.prestamoId }}</td>
                                <td>{{ item.concepto }}</td>
                                <td align="end">{{ numberFormat(item.monto) }}</td>
                                <td align="end">{{ item.interes }}%</td>
                                <td align="end">{{ numberFormat(item.total) }}</td>
                                <td align="center">{{ formatDate(item.fecha, false) }} - {{ formatDate(item.fechaFin, false) }}</td>
                                <td align="center" style="white-space: pre;">
                                <v-btn class="elevation-0" color="primary" icon small @click="goToPrestamo(item.prestamoId)"><v-icon>mdi-file-eye</v-icon></v-btn>
                                </td>
                            </tr>
                            </tbody>
                        </template>
                        </v-data-table>
                    </v-card-text>
                    <v-row class="px-5">
                        <v-pagination
                            v-model="page"
                            class="my-4"
                            :length="paginationLength"
                            circle
                            :total-visible="6"
                        ></v-pagination>
                    </v-row>
                </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <loading v-else/>

  </template>
  
  <script>

  import loading from "~/components/utils/loading";
  
  export default {

    middleware: "auth-this",
  
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
            tabs: null,
            headers: [
                { text: "Código", value: 'prestamoId' },
                { text: "Concepto", value: 'concepto' },
                { text: "Monto", value: 'monto', align: 'end' },
                { text: "Interés", value: 'interes', align: 'end' },
                { text: "Total", value: 'total', align: 'end' },
                { text: "Rango de fecha", value: 'fecha', align: 'center' },
                { text: "Acciones", align:'center', sortable: false }
            ],
            prestamos: [],
            itemsPerPage: 5,
            page: 1,
            paginationLength: 1,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;
                let id = this.$route.query.id;
                let cliente = await this.$api.get(`api/cliente/${id}`);

                this.cliente = await cliente.data;
                this.prestamos = await cliente.data.prestamos.filter((p)=>p.estado == true);

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

        numberFormat(amount){
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });
            return formatter.format(amount);

        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

        goToPrestamo( id ) {
          this.$router.push({ path: '/prestamo/detalle', query: { id } })
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