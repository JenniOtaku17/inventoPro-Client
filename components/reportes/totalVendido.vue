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
                    <td>{{ item.prestamo.prestamoId }}</td>
                    <td>{{ item.prestamo.concepto }}</td>
                    <td align="center">{{ formatDate(item.prestamo.fecha, false) }} - {{ formatDate(item.prestamo.fechaFin, false) }}</td>
                    <td align="end">{{ numberFormat(item.prestamo.monto) }}</td>
                    <td align="end">{{ item.prestamo.interes }}%</td>
                    <td align="end">
                        <span v-if="frecuencias.find(x=> x.frecuenciaId == item.prestamo.frecuenciaInteresId)">
                            {{ frecuencias.find(x=> x.frecuenciaId == item.prestamo.frecuenciaInteresId).nombre }}
                        </span>
                    </td>
                    <td align="end">{{ numberFormat(item.prestamo.total) }}</td>
                    <td align="end">{{ numberFormat(item.balance) }}</td>
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
                { text: "Balance", value: 'balance', align: 'end' },
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
                let frecuencia = this.frecuencias.find(x=> x.frecuenciaId == item.prestamo.frecuenciaInteresId);
                rows.push({
                    prestamoId: item.prestamo.prestamoId,
                    concepto: item.prestamo.concepto,
                    fecha: this.formatDate(item.prestamo.fecha, false),
                    fechaFin: this.formatDate(item.prestamo.fechaFin, false),
                    monto: item.prestamo.monto,
                    interes: item.prestamo.interes,
                    frecuencia: frecuencia.nombre,
                    total: item.prestamo.total,
                    balance: item.balance
                })
            })

            let data = {
                encabezados: ['Código','Concepto', 'Fecha de Inicio', 'Fecha de Finalización', 'Monto', 'Interés', 'Frecuencia', 'Total', 'Balance'],
                columnas: [
                    { key: "prestamoId", width:10 },
                    { key: "concepto", width:40 },
                    { key: "fecha", width:30 },
                    { key: "fechaFin", width:30 },
                    { key: "monto", width:20 },
                    { key: "interes", width:15 },
                    { key: "frecuencia", width:20 },
                    { key: "total", width:20 },
                    { key: "balance", width:20 }
                ],
                columnasNumber: [5,8,9],
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