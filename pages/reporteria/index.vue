<template>

    <v-container class="px-6 pb-10 pageReporteria">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Modulo de Reporteria &nbsp;<v-icon color="primary" class="mb-1">mdi-file-chart</v-icon>
            </h3>
            <h5 class="text--secondary">
                Genera reportes para visualizar de forma sencilla la información que se encuentra registrada en el sistema.
            </h5>
        </v-col>
      </v-row>

      <v-row class="px-4 mt-8" align="center">
        <v-col cols="12" md="4" class="py-0">
            <span class="inputTitle" >Tipo de Reporte</span>
            <v-select v-model="tipoReporte" dense outlined class="textFieldCustom" color="secondary" :items="reportes" item-text="nombre" item-value="id" append-icon="mdi-chevron-down"></v-select>
        </v-col>
        <v-col cols="12" md="2" class="py-0" v-if="tipoReporte == 'balancePrestamos'">
            <span class="inputTitle" >Desde</span>
            <v-menu
                ref="menuDesde"
                v-model="menuDesde"
                :close-on-content-click="false"
                :return-value.sync="desde"
                transition="scale-transition"
                offset-y  
                min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    v-model="desde" 
                    outlined readonly append-icon="mdi-calendar"
                    dense class="textFieldCustom fechaCustom" color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="desde"
                    no-title
                    scrollable
                >
                    <v-spacer></v-spacer>
                    <v-btn elevation="0" text color="secondary white--text" @click="menuDesde = false"
                    >Cancelar</v-btn
                    >
                    <v-btn
                    text elevation="0" 
                    color="primary white--text"
                    @click="$refs.menuDesde.save(desde)"
                    >Guardar</v-btn
                    >
                </v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" md="2" class="py-0" v-if="tipoReporte == 'balancePrestamos'">
            <span class="inputTitle" >Hasta</span>
            <v-menu
                ref="menuHasta"
                v-model="menuHasta"
                :close-on-content-click="false"
                :return-value.sync="hasta"
                transition="scale-transition"
                offset-y  
                min-width="290px"
                >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    v-model="hasta" 
                    outlined readonly append-icon="mdi-calendar"
                    dense class="textFieldCustom fechaCustom" color="secondary"
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker
                    v-model="hasta"
                    no-title
                    scrollable
                >
                    <v-spacer></v-spacer>
                    <v-btn elevation="0" text color="secondary white--text" @click="menuHasta = false"
                    >Cancelar</v-btn
                    >
                    <v-btn
                    text elevation="0" 
                    color="primary white--text"
                    @click="$refs.menuHasta.save(hasta)"
                    >Guardar</v-btn
                    >
                </v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" md="3" class="py-0" v-if="tipoReporte == 'prestamosCliente'">
            <span class="inputTitle" >Cliente</span>
            <v-select v-model="cliente" dense outlined class="textFieldCustom" color="secondary" :items="clientes" :item-text="nombreCompleto" item-value="clienteId" append-icon="mdi-chevron-down"></v-select>
        </v-col>
        <v-col cols="12" md="3" class="py-0" v-if="tipoReporte == 'pagosPrestamo'">
            <span class="inputTitle" >Prestamo</span>
            <v-select v-model="prestamo" dense outlined class="textFieldCustom" color="secondary" :items="prestamos" :item-text="nombrePrestamo" item-value="prestamoId" append-icon="mdi-chevron-down"></v-select>
        </v-col>
        <v-col cols="12" md="1" class="py-0">
            <v-btn fab elevation="0" :disabled="isLoading" style="border-radius: 50%;" small color="primary white--text" id="generar" @click="getReport()">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
        </v-col>
      </v-row>
  
      <div v-if="reporte">
        <balancePrestamos v-if="tipoReporte == 'balancePrestamos'" :reporte="reporte" :title="title"/>
        <pagosPrestamo v-if="tipoReporte == 'pagosPrestamo'" :reporte="reporte" :title="title"/>
        <prestamosCliente v-if="tipoReporte == 'prestamosCliente'" :reporte="reporte" :title="title"/>
      </div>

    </v-container>
  </template>
  
  <script>
  import balancePrestamos from "~/components/reportes/balancePrestamos";
  import pagosPrestamo from "~/components/reportes/pagosPrestamo";
  import prestamosCliente from "~/components/reportes/prestamosCliente";
  
  export default {

    middleware: "auth-this",
  
    components: {
        balancePrestamos,
        pagosPrestamo,
        prestamosCliente
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getClientes();
        this.getPrestamos();
    },

    watch: {
        tipoReporte(){
            this.reporte = null;
            this.title = null;
        }
    },
  
    data() {
        return {
            isLoading: false,
            user: null,
            menuDesde: false,
            menuHasta: false,
            reportes: [
                { id:'balancePrestamos', nombre:'Reporte de Balance de Prestamos'},
                { id:'pagosPrestamo', nombre:'Reporte de Pagos de un Prestamo'},
                { id:'prestamosCliente', nombre:'Reporte de Prestamos de un cliente'},
            ],
            clientes: [],
            prestamos: [],
            tipoReporte: null,
            desde: null,
            hasta: null,
            cliente: null,
            prestamo: null,
            reporte: null,
            title: null,
        };
    },
  
    methods: {
        nombreCompleto: item => item.nombre + ' ' + item.apellido,

        nombrePrestamo: item => item.prestamoId + ' - ' + item.concepto,

        async getReport() {
            try{
                this.isLoading = true;

                if(this.tipoReporte == 'balancePrestamos'){
                    let data = {
                        desde: this.desde,
                        hasta: this.hasta
                    }
                    let reporte = await this.$api.post(`api/report/balance_prestamos`, data);
                    this.reporte = reporte.data;
                    this.title = `Balance de préstamos desde ${this.formatDate(this.desde,false).replaceAll("/","-")} hasta ${this.formatDate(this.hasta,false).replaceAll("/","-")}`;

                }else if(this.tipoReporte == 'pagosPrestamo'){
                    let reporte = await this.$api.get(`api/report/pagos_prestamos/${this.prestamo}`);
                    this.reporte = reporte.data?.prestamo?.pagos.filter(x=> x.estado == true);
                    this.title = `Pagos del préstamo ${reporte.data?.prestamo?.prestamoId}`;

                }else if(this.tipoReporte == 'prestamosCliente'){
                    let reporte = await this.$api.get(`api/report/prestamos_cliente/${this.cliente}`);
                    this.reporte = reporte.data?.cliente?.prestamos;
                    this.title = `Préstamos de ${reporte.data?.cliente?.nombre} ${reporte.data?.cliente?.apellido}`;

                }
                this.$print(this.reporte);

            }catch(error){
                this.$print(error);
                let text = "Ocurrió un error"
                if(error.response){
                    text = error.response.data.error;
                }

                this.$alert('error', 'Reporteria', text, 3000);

            }finally{
                this.isLoading = false;
            }
            
        },

        async getClientes() {
            try{
                this.isLoading = true;
                let clientes = await this.$api.get(`api/cliente`);

                this.clientes = await clientes.data;
                this.$print(this.clientes);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        async getPrestamos() {
            try{
                this.isLoading = true;
                let prestamos = await this.$api.get(`api/prestamo`);

                this.prestamos = await prestamos.data.filter((p)=>p.estado == true);
                this.$print(this.prestamos);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

  
    },
  };
  </script>
  
  <style lang='scss' >

  .pageReporteria{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }

    .inputTitle{
        font-size: 14px;
    }  
  }

  </style>