<template>

    <v-container class="px-6 pb-10 pageDevolucion">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Devoluciones &nbsp;<v-icon color="primary" class="mb-1">mdi-cash-refund</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todas las devoluciones de tu empresa, puedes añadir una nueva o verificar alguna existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openCreacion">
                <v-icon left>mdi-plus</v-icon>Agregar Devolución
            </v-btn>
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
          <v-card flat>
            <v-row class="px-4">
                <v-col cols="12" sm="8">
                </v-col>
                <v-col cols="12" sm="4" class="text-right">
                    <v-text-field
                    v-model="filterText"
                    append-icon="mdi-magnify"
                    rounded flat outlined dense
                    label="Buscar"
                    id="id" class="not-form-input"
                    autocomplete="off"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-card-text>
              <v-data-table :headers="headers" :items="filteredDevoluciones" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredDevoluciones && filteredDevoluciones.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td align="center">{{ formatDate(item.fecha, false) }}</td>
                        <td align="center">{{ item.factura?.id }}</td>
                        <td align="right"><formatNumber :value="item.subtotal" /></td>
                        <td align="right"><formatNumber :value="item.descuentos" /></td>
                        <td align="right"><formatNumber :value="item.impuestos" /></td>
                        <td align="right"><formatNumber :value="item.total" /></td>
                        <td align="center">
                            <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.id)"><v-icon>mdi-eye-outline</v-icon></v-btn>
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
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
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
            devoluciones: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "Fecha", value: "fecha", align: "center" },
                { text: "Factura", value: "facturaId", align: "center", sortable: false },
                { text: "Subtotal", value: "subtotal", align: "end" },
                { text: "Descuentos", value: "descuentos", align: "end" },
                { text: "Impuestos", value: "impuestos", align: "end" },
                { text: "Total", value: "total", align: "end" },
                { text: "Acción", align:'center', sortable: false }
            ],
            itemsPerPage: 5,
            page: 1,
            paginationLength: 1,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;
                this.page = 1;
                let devoluciones = await this.$api.get(`api/devolucion`);

                this.devoluciones = await devoluciones.data;
                this.paginationLength = Math.ceil(this.devoluciones.length/this.itemsPerPage);
                this.$print(this.devoluciones);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

        openCreacion( ){
            this.$router.push({ path: '/devolucion/creacion' })
        },

        verDetalle( id ){
            this.$router.push({ path: '/devolucion/detalle', query: { id } })
        },
    
        filtro(devoluciones,textoFiltro){
            try{
                if(!devoluciones) return [];
        
                return devoluciones
                .filter(
                    e => e.id.toString().toLowerCase().includes(textoFiltro.toLowerCase()) 
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredDevoluciones(){
            return this.filtro(this.devoluciones, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageDevolucion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>