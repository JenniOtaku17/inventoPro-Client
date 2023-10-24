<template>

    <v-container class="px-6 pb-10 pageAlmacen">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Almacenes &nbsp;<v-icon color="primary" class="mb-1">mdi-domain</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todos los almacenes de tu empresa, puedes añadir uno nuevo o modificar o eliminar alguno existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openAlmacen(false, null)">
                <v-icon left>mdi-plus</v-icon>Agregar Almacén
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
              <v-data-table :headers="headers" :items="filteredAlmacenes" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredAlmacenes && filteredAlmacenes.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.ubicacion }}</td>
                        <td align="center">
                          <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(true, item)"><v-icon>mdi-eye-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="secondary" icon small @click="openAlmacen(true, item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="error" icon small @click="deleteAlmacen(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
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
      <popup v-if="dialog" :activador="dialog" @actualizar="actualizar" :editable="editable" :verDetalles='verDetalles' />
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/almacen/popup";
  
  export default {

    middleware: "auth-admin",
  
    components: {
      popup
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getAll();
    },
  
    data() {
        return {
            isLoading: false,
            almacenes: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "Nombre", value: "nombre", align: "start" },
                { text: "Ubicación", value: "ubicacion", align: "start" },
                { text: "Acciones", align:'center', sortable: false }
            ],
            dialog: false,
            verDetalles: false,
            editable: null,
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
                let almacenes = await this.$api.get(`api/almacen`);

                this.almacenes = await almacenes.data;
                this.paginationLength = Math.ceil(this.almacenes.length/this.itemsPerPage);
                this.$print(this.almacenes);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        verDetalle( toDetails, obj ){
            // this.$router.push({ path: '/almacen/detalle', query: { id } })
            if(toDetails){
                this.editable = obj;
                this.verDetalles = true
            }
            this.dialog = true;
        },
    
        openAlmacen( toEdit, obj){
            if(toEdit){
                this.editable = obj;
            }
            this.dialog = true;
        },
    
        actualizar( toUpdate ) {
            if(toUpdate){
                this.getAll();
            }
            this.dialog = false;
            this.verDetalles = false
            this.editable = null;
        },
    
        async deleteAlmacen(almacen){
            try{

                let result = await this.$confirm('Va a emilinar un almacén', `Está seguro que desea eliminar al almacén ${almacen.nombre}?`)
                if(result.isConfirmed){
                    await this.$api.put("api/almacen/changestatus/"+almacen.id );
                    this.getAll();
                }

            }catch(error){
                this.$print(error);

                let text = "Ocurrió un error al eliminar almacén"
                if(error.response.data.error){
                    text = error.response.data.error;
                }
                this.$alert('error', 'Almacén', text, null);
            }
        },
    
        filtro(almacenes,textoFiltro){
            try{
                if(!almacenes) return [];
        
                return almacenes
                .filter(
                    e => e.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) 
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredAlmacenes(){
            return this.filtro(this.almacenes, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageAlmacen{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>