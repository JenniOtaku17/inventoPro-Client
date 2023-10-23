<template>

    <v-container class="px-6 py-0 pageFacturacion" v-if="facturacion">
    <link rel="stylesheet" type="text/css" href="print.css">
      <v-row class="">
        <v-col cols="12" sm="5" class="text-left py-0 px-0">
            <h3 class="primary--text moduleTitle">
                <v-btn color="primary" icon @click="goBack" class="mb-2 backButton">
                    <v-icon>mdi-arrow-left-top-bold</v-icon>
                </v-btn>
                Detalle de Factura
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

            <h2 class="facturaTitle">
                Factura &nbsp;No.{{ facturacion.id }}
            </h2>

            <div class="infoContainer">
                <div class="cliente">
                    <div class="facturaDetails"> <b>Cliente No.{{ facturacion.cliente?.id }}</b></div>
                    <div class="facturaDetails"> <b>Nombre:</b> &nbsp;{{ facturacion.cliente?.nombre }}</div>
                    <div class="facturaDetails"> <b>Cédula:</b> &nbsp;{{ facturacion.cliente?.cedula }}</div>
                </div>
                <div class="empresa">
                    <div class="facturaDetails">{{ facturacion.almacen?.ubicacion }}</div>
                    <div class="facturaDetails">Facturado por {{ facturacion.usuario?.nombre }}</div>
                    <div class="facturaDetails">{{ formatDate(facturacion.fecha, true) }} </div>
                </div>
            </div>
        
            <v-data-table :headers="headers" :items="facturacion.detalles" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :items-per-page="facturacion.detalles.length"
            >
                <template v-slot:body="{ items }" v-if="facturacion.detalles && facturacion.detalles.length > 0">
                <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.producto?.nombre }}</td>
                        <td align="right"><formatNumber :value="item.producto?.precio" /></td>
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
                    <div v-if="facturacion.notas">
                        <b>Notas: &nbsp;</b>{{ facturacion.notas }}
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
                                        <formatNumber :value="facturacion.subtotal" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left">
                                        Impuestos
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="facturacion.impuestos" />
                                    </td>
                                </tr>
                                <tr class="finalDetail">
                                    <td align="left">
                                        Descuento
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="facturacion.descuentos" />
                                    </td>
                                </tr>
                                <tr >
                                    <td align="left">
                                        Total
                                    </td>
                                    <td align="right">
                                        <formatNumber :value="facturacion.total" />
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
                { text: "Precio", value: "precio", align: "end", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
            ],
            facturacion: null,
            url: '',
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;

                let id = this.$route.query.id;
                let facturacion = await this.$api.get(`api/factura/${id}`);
                this.facturacion = await facturacion.data;
                this.$print(this.facturacion);

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

  .pageFacturacion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 700;
    }

    .facturaDetails{
        font-size: 14px;
    }

    .finalDetail{
        td{
            border-color: #000!important;
        }
    }

    .facturaTitle{
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