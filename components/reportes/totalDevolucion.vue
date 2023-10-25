<template>

    <v-container class="px-0 balancePrestamo">
        <v-row class="px-3">
            <v-col cols="12" sm="5" class="text-left">

            </v-col>
            <v-col cols="12" sm="7" class="text-right">
                <v-btn text color="primary" @click="exportToExcel">
                    Exportar <v-icon right size="25">mdi-microsoft-excel</v-icon>
                </v-btn>
            </v-col>
        </v-row>
  
        <v-data-table :headers="headers" :items="reporte.devolucion" :loading="isLoading" dense hide-default-footer
        loading-text="Buscando registros..." class="customTable mx-4" no-data-text="No se han encontrado resultados"
        :items-per-page="reporte.devolucion.length"
        >
        <template v-slot:body="{ items }" v-if="reporte.devolucion && reporte.devolucion.length > 0">
            <tbody>
            <tr v-for="item in items" class="puntero" :key="item.prestamoId">
                <td>{{ item.id }}</td>
                <td align="center">{{ formatDate(item.fecha, false) }}</td>
                <td align="center">{{ item.facturaId }}</td>
                <td align="right"><formatNumber :value="item.subtotal" /></td>
                <td align="right"><formatNumber :value="item.descuentos" /></td>
                <td align="right"><formatNumber :value="item.impuestos" /></td>
                <td align="right"><formatNumber :value="item.total" /></td>
            </tr>
            <tr>
                <td colspan="6"><b>TOTAL</b></td>
                <td align="right"><b><formatNumber :value="reporte.totalDevolucion" /></b></td>
            </tr>
            </tbody>
        </template>
        </v-data-table>
       
    </v-container>
  </template>
  
  <script>
  import toExcel from "~/components/utils/toExcel";
  import formatNumber from "~/components/utils/formatNumber";
  
  export default {
    async mounted(){
        this.user = await this.$store.state.userManager.user;
    },

    props: [
        "reporte",
        "title"
    ],

    components: {
        formatNumber,
    },
  
    data() {
        return {
            isLoading: false,
            user: null,
            frecuencias: [],
            headers: [
                { text: "Código", value: 'id' },
                { text: "Fecha", value: "fecha", align: "center" },
                { text: "Código Factura", value: "facturaId", align: "center" },
                { text: "SubTotal", value: "subTotal", align: "end" },
                { text: "Descuentos", value: "descuentos", align: "end" },
                { text: "Impuestos", value: "impuestos", align: "end" },
                { text: "Total", value: "total", align: "end" },
            ],
        };
    },
  
    methods: { 

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

        async exportToExcel(){

            const rows = [...this.reporte.devolucion];

            await rows.map((item)=>{
                item.fechaText = this.formatDate(item.fecha, false);
                item.clienteNombre = item.cliente?.nombre;
            })

            rows.push({total: this.reporte.totalDevolucion})

            let data = {
                encabezados: ['Código','Fecha', 'Código Factura', 'Subtotal', 'Descuentos', 'Impuestos', 'Total'],
                columnas: [
                    { key: "id", width:10 },
                    { key: "fechaText", width:30 },
                    { key: "facturaId", width:40 },
                    { key: "subtotal", width:20 },
                    { key: "descuentos", width:20 },
                    { key: "impuestos", width:20 },
                    { key: "total", width:20 },
                ],
                columnasNumber: [4,5,6,7],
                rows: rows
            }

            toExcel(this.title, data, true);
            },
        },
  };
  </script>
  
  <style lang='scss' >

  .balancePrestamo{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>