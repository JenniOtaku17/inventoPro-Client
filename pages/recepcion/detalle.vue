<template>

    <v-container class="px-6 py-0 pagerecepcion" v-if="recepcion">
    <link rel="stylesheet" type="text/css" href="print.css">
      <v-row class="">
        <v-col cols="12" sm="5" class="text-left py-0 px-0">
            <h3 class="primary--text moduleTitle">
                <v-btn color="primary" icon @click="goBack" class="mb-2 backButton">
                    <v-icon>mdi-arrow-left-top-bold</v-icon>
                </v-btn>
                Detalle de Recepcion
            </h3>
        </v-col>
        <v-col cols="12" sm="7" class="text-right pr-11">

            <v-btn color="primary" elevation="0" @click="imprimir" :disabled="isLoading">
                <v-icon left>mdi-printer</v-icon>Imprimir
            </v-btn>
        </v-col>
      </v-row>

      <div class="px-6">
        <div id="element-to-print">

            <h2 class="recepcionTitle">
                Recepcion &nbsp;No.{{ recepcion.id }}
            </h2>

            <div class="infoContainer">
                <div class="cliente">
                    <div class="recepcionDetails"> <b>Proveedor No.{{ recepcion.proveedor?.id }}</b></div>
                    <div class="recepcionDetails"> <b>Nombre:</b> &nbsp;{{ recepcion.proveedor?.nombre }}</div>
                    <div class="recepcionDetails"> <b>RNC:</b> &nbsp;{{ recepcion.proveedor?.rnc }}</div>
                </div>
                <div class="empresa">
                    <div class="recepcionDetails">{{ recepcion.almacen?.ubicacion }}</div>
                    <div class="recepcionDetails">Manejado por {{ recepcion.usuario?.nombre }}</div>
                    <div class="recepcionDetails">{{ formatDate(recepcion.fecha, true) }} </div>
                </div>
            </div>
        
            <v-data-table :headers="headers" :items="recepcion.detalles" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :items-per-page="recepcion.detalles.length"
            >
                <template v-slot:body="{ items }" v-if="recepcion.detalles && recepcion.detalles.length > 0">
                <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.producto?.nombre }}</td>
                        <td align="right"><formatNumber :value="item.costo" /></td>
                        <td align="center">{{ item.producto?.impuesto }}%</td>
                        <td align="center">{{ item.descuento }}%</td>
                        <td align="center">{{ item.cantidad }}</td>
                        <td align="right"><formatNumber :value="item.total" /></td>
                    </tr>
                </tbody>
                </template>
            </v-data-table>

            <div class="footerContainer" >

                <div class="notas"> 
                    <div v-if="recepcion.notas">
                        <b>Notas: &nbsp;</b>{{ recepcion.notas }}
                    </div>
                    <div v-else>
                        No hay notas registradas
                    </div>
                </div>

                <div class="totales">
                    <v-simple-table dense class="custom-table-less-td no-hover">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td align="left">
                                        SubTotal
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="recepcion.subtotal" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left">
                                        Impuestos
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="recepcion.impuestos" />
                                    </td>
                                </tr>
                                <tr class="finalDetail">
                                    <td align="left">
                                        Descuento
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="recepcion.descuentos" />
                                    </td>
                                </tr>
                                <tr >
                                    <td align="left">
                                        Total
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="recepcion.total" />
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>

        </div>
      </div>

    </v-container>
  </template>
  
  <script>
  import printJS from 'print-js';
  import formatNumber from "~/components/utils/formatNumber";

  export default {

    middleware: "auth-facturador",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },

    components: {
        formatNumber
    },

    data() {
        return {
            isLoading: false,
            user: null,
            headers: [
                { text: "Producto", value: 'nombre' },
                { text: "Costo", value: "costo", align: "end", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
            ],
            recepcion: null,
            url: '',
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;

                let id = this.$route.query.id;
                let recepcion = await this.$api.get(`api/recepcion/${id}`);
                this.recepcion = await recepcion.data;
                this.$print(this.recepcion);

                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        async imprimir(){

            this.isLoading = true;

            printJS({
                printable: 'element-to-print',
                type: 'html',
                targetStyles: ['*'],
                font_size: ''
            });
            

            this.isLoading = false;
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

        goBack() {
            this.$router.go(-1);
        },
        
  
    },

  };
  </script>
  
  <style lang='scss' >

  .pagerecepcion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 700;
    }

    .recepcionDetails{
        font-size: 14px;
    }

    .finalDetail{
        td{
            border-color: #000!important;
        }
    }

    .recepcionTitle{
        padding: 10px 5px;
        font-size: 22px;
        color: #144659;
    }

    .infoContainer{
        padding: 0px 5px;
        display: flex;
        flex-direction: row;
        width:100%;
        justify-content: space-between;

        .cliente{
            width:20%;
        }

        .empresa{
            text-align: right;
            width:40%;
        }
    }

    .footerContainer{
        padding: 30px 5px;
        display: flex;
        flex-direction: row;
        width:100%;
        justify-content: space-between;

        .notas{
            width:30%;
        }

        .totales{
            text-align: right;
            width:30%;
        }
    }

    .customTable{
        padding: 30px 0px;

        td{
            font-size: 14px!important;
        }
    }
  }

  </style>