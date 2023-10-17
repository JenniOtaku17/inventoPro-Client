<template>

    <v-container class="px-6 pb-10 pageRecepcion">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Recepciones &nbsp;<v-icon color="primary" class="mb-1">mdi-account-group</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todas las recepciones de tu empresa, puedes añadir una nueva o verificar alguna existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openCreacion">
                <v-icon left>mdi-plus</v-icon>Agregar Recepción
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
              <v-data-table :headers="headers" :items="filteredRecepciones" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredRecepciones && filteredRecepciones.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.ubicacion }}</td>
                        <td align="center">
                            <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.id)"><v-icon>mdi-account-eye-outline</v-icon></v-btn>
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
  
  export default {

    middleware: "auth-this",
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },
  
    data() {
        return {
            isLoading: false,
            recepciones: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "Fecha", value: "fecha", align: "start" },
                { text: "Proveedor", value: "id", align: "start" },
                { text: "Total", value: "total", align: "start" },
                { text: "Acciones", align:'center', sortable: false }
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
                let recepciones = await this.$api.get(`api/recepcion`);

                this.recepciones = await recepciones.data;
                this.paginationLength = Math.ceil(this.recepciones.length/this.itemsPerPage);
                this.$print(this.recepciones);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        openCreacion( ){
            this.$router.push({ path: '/recepcion/creacion' })
        },

        verDetalle( id ){
            this.$router.push({ path: '/recepcion/detalle', query: { id } })
        },
    
        filtro(recepciones,textoFiltro){
            try{
                if(!recepciones) return [];
        
                return recepciones
                .filter(
                    e => e.id.toLowerCase().includes(textoFiltro.toLowerCase()) 
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredRecepciones(){
            return this.filtro(this.recepciones, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageRecepcion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>