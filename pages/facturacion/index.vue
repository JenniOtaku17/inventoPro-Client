<template>

    <v-container class="px-6 pb-10 pageFacturacion">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Facturaciones &nbsp;<v-icon color="primary" class="mb-1">mdi-cash-register</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todas las facturaciones de tu empresa, puedes añadir una nueva o verificar alguna existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openCreacion">
                <v-icon left>mdi-plus</v-icon>Agregar Facturación
            </v-btn>
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
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
              <v-data-table :headers="headers" :items="filteredFacturaciones" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredFacturaciones && filteredFacturaciones.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td align="center">{{ formatDate(item.fecha, false) }}</td>
                        <td align="center">{{ item.cliente?.nombre }}</td>
                        <td align="center">{{ item.almacen?.nombre }}</td>
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
            facturaciones: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "Fecha", value: "fecha", align: "center" },
                { text: "Cliente", value: "clienteId", align: "center" },
                { text: "Almacen", value: "almacenId", align: "center" },
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
                let facturaciones = await this.$api.get(`api/factura`);

                this.facturaciones = await facturaciones.data;
                this.paginationLength = Math.ceil(this.facturaciones.length/this.itemsPerPage);
                this.$print(this.facturaciones);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },

        openCreacion( ){
            this.$router.push({ path: '/facturacion/creacion' })
        },

        verDetalle( id ){
            this.$router.push({ path: '/facturacion/detalle', query: { id } })
        },
    
        filtro(facturaciones,textoFiltro){
            try{
                if(!facturaciones) return [];
        
                return facturaciones
                .filter(
                    e => e.id.toString().toLowerCase().includes(textoFiltro.toLowerCase()) 
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredFacturaciones(){
            return this.filtro(this.facturaciones, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageFacturacion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>