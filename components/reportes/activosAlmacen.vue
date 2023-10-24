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
  
        <v-card flat>
        <v-card-text>
            <v-data-table :headers="headers" :items="reporte" :loading="isLoading" dense hide-default-footer
            loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
            :items-per-page="reporte.length"
            >
            <template v-slot:body="{ items }" v-if="reporte && reporte.length > 0">
                <tbody>
                <tr v-for="item in items" class="puntero" :key="item.prestamoId">
                    <td>{{ item.id }}</td>
                    <td>{{ item.nombre }}</td>
                    <td align="right">{{ item.precio }}</td>
                    <td align="right">{{ item.impuesto }}%</td>
                    <td align="center">{{ item.existencia }}</td>
                    <td>{{ item.codigoBarra }}</td>
                    <td>{{ item.unidad }}</td>
                </tr>
                </tbody>
            </template>
            </v-data-table>
        </v-card-text>
        </v-card>
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
                { text: "Nombre", value: "nombre", align: "start" },
                { text: "Precio", value: "precio", align: "end", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "end", sortable: false },
                { text: "Existencia", value: "existencia", align: "center" },
                { text: "Código de Barra", value: 'codigoBarra' },
                { text: "Unidad", value: 'unidad' },
            ],
        };
    },
  
    methods: { 

        async exportToExcel(){

            const rows = [...this.reporte];

            await rows.map((item)=>{
                item.impuestoText = item.impuesto+'%';
            })

            let data = {
                encabezados: ['Código', 'Nombre','Precio', 'Impuesto', 'Existencia', 'Código de Barra', 'Unidad'],
                columnas: [
                    { key: "id", width:10 },
                    { key: "nombre", width:30 },
                    { key: "precio", width:20 },
                    { key: "impuestoText", width:20 },
                    { key: "existencia", width:20 },
                    { key: "codigoBarra", width:20 },
                    { key: "unidad", width:30 },
                ],
                columnasNumber: [3,5],
                rows: rows
            }

            toExcel(this.title, data, false);
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