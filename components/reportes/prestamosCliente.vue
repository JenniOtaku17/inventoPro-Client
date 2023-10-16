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
                    <td>{{ item.prestamoId }}</td>
                    <td>{{ item.concepto }}</td>
                    <td align="center">{{ formatDate(item.fecha, false) }} - {{ formatDate(item.fechaFin, false) }}</td>
                    <td align="end">{{ numberFormat(item.monto) }}</td>
                    <td align="end">{{ item.interes }}%</td>
                    <td align="end">
                        <span v-if="frecuencias.find(x=> x.frecuenciaId == item.frecuenciaInteresId)">
                            {{ frecuencias.find(x=> x.frecuenciaId == item.frecuenciaInteresId).nombre }}
                        </span>
                    </td>
                    <td align="end">{{ numberFormat(item.total) }}</td>
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
        this.$print("here?")
        this.getFrecuencias();
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
                { text: "Código", value: 'prestamoId' },
                { text: "Concepto", value: 'concepto' },
                { text: "Rango de fecha", value: 'fecha', align: 'center' },
                { text: "Monto", value: 'monto', align: 'end' },
                { text: "Interés", value: 'interes', align: 'end' },
                { text: "Frecuencia", value: 'frecuenciaInteresId', align: 'end' },
                { text: "Total", value: 'total', align: 'end' },
            ],
        };
    },
  
    methods: { 
        
        async getFrecuencias() {
            try{
                this.isLoading = true;
                let frecuencias = await this.$api.get(`api/frecuencias`);

                this.frecuencias = await frecuencias.data;
                this.$print(this.frecuencias);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
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

        async exportToExcel(){

            const rows = [];

            await this.reporte.map((item)=>{
                let frecuencia = this.frecuencias.find(x=> x.frecuenciaId == item.frecuenciaInteresId);
                rows.push({
                    prestamoId: item.prestamoId,
                    concepto: item.concepto,
                    fecha: this.formatDate(item.fecha, false),
                    fechaFin: this.formatDate(item.fechaFin, false),
                    monto: item.monto,
                    interes: item.interes,
                    frecuencia: frecuencia.nombre,
                    total: item.total,
                })
            })

            let data = {
                encabezados: ['Código','Concepto', 'Fecha de Inicio', 'Fecha de Finalización', 'Monto', 'Interés', 'Frecuencia', 'Total'],
                columnas: [
                    { key: "prestamoId", width:10 },
                    { key: "concepto", width:40 },
                    { key: "fecha", width:30 },
                    { key: "fechaFin", width:30 },
                    { key: "monto", width:20 },
                    { key: "interes", width:15 },
                    { key: "frecuencia", width:20 },
                    { key: "total", width:20 },
                ],
                columnasNumber: [5,8],
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