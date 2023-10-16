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
                    loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados" :items-per-page="reporte.length"
                >
                    <template v-slot:body="{ items }" v-if="reporte && reporte.length > 0">
                    <tbody>
                        <tr v-for="item in items" class="puntero" :key="item.pagoId">
                            <td>{{ item.pagoId }}</td>
                            <td align="end">{{ numberFormat(item.monto) }}</td>
                            <td align="center">{{ formatDate(item.fc, false) }}</td>
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
  
  export default {
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.$print("here??");
    },

    props: [
        "reporte",
        "title"
    ],
  
    data() {
        return {
            isLoading: false,
            user: null,
            frecuencias: [],
            headers: [
                { text: "Código", value: 'pagoId' },
                { text: "Monto", value: "monto", align: 'end' },
                { text: "Fecha", value: "fc", align: 'center' }
            ],
        };
    },
  
    methods: { 

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

        async exportToExcel(){

            const rows = [];

            await this.reporte.map((item)=>{
                rows.push({
                    pagoId: item.pagoId,
                    fecha: this.formatDate(item.fc, false),
                    monto: item.monto,
                })
            })

            let data = {
                encabezados: ['Código','Monto', 'Fecha de Inicio'],
                columnas: [
                    { key: "pagoId", width:10 },
                    { key: "monto", width:20 },
                    { key: "fecha", width:30 }
                ],
                columnasNumber: [2],
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