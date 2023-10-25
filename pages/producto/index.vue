<template>

    <v-container class="px-6 pb-10 pageProducto">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Productos &nbsp;<v-icon color="primary" class="mb-1">mdi-shape-plus</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todos los productos de tu empresa, puedes añadir uno nuevo o modificar o eliminar alguno existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openProducto(false, null)">
                <v-icon left>mdi-plus</v-icon>Agregar Producto
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
              <v-data-table :headers="headers" :items="filteredProductos" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredProductos && filteredProductos.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.departamentoId">
                        <td>{{ item.id }}</td>
                        <td>{{ item.nombre }}</td>
                        <td align="right">{{ item.precio }}</td>
                        <td align="right">{{ item.impuesto }}%</td>
                        <td align="center">{{ item.almacen?.nombre }}</td>
                        <td align="center">{{ item.existencia }}</td>
                        <td align="center">
                          <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.id)"><v-icon>mdi-eye-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="secondary" icon small @click="openProducto(true, item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="error" icon small @click="deleteProducto(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
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
      <popup v-if="dialog" :activador="dialog" @actualizar="actualizar" :editable="editable" />
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/producto/popup";
  
  export default {

    middleware: "auth-facturador",
  
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
            productos: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "Nombre", value: "nombre", align: "start" },
                { text: "Precio", value: "precio", align: "end", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "end", sortable: false },
                { text: "Almacén", value: "almacenId", align: "center", sortable: false },
                { text: "Existencia", value: "existencia", align: "center" },
                { text: "Acciones", align:'center', sortable: false }
            ],
            dialog: false,
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
                let productos = await this.$api.get(`api/producto`);

                this.productos = await productos.data;
                this.paginationLength = Math.ceil(this.productos.length/this.itemsPerPage);
                this.$print(this.productos);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        verDetalle( id ){
            this.$router.push({ path: '/producto/detalle', query: { id } })
        },
    
        openProducto( toEdit, obj){
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
            this.editable = null;
        },
    
        async deleteProducto(producto){
            try{

                let result = await this.$confirm('Va a emilinar un producto', `Está seguro que desea eliminar al producto ${producto.nombre}?`)
                if(result.isConfirmed){
                    await this.$api.put("api/producto/changestatus/"+producto.id );
                    this.getAll();
                }

            }catch(error){
                this.$print(error);

                let text = "Ocurrió un error al eliminar producto"
                if(error.response.data.error){
                    text = error.response.data.error;
                }
                this.$alert('error', 'Producto', text, null);
            }
        },
    
        filtro(productos,textoFiltro){
            try{
                if(!productos) return [];
        
                return productos
                .filter(
                    e => e.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) ||
                         e.apellido.toLowerCase().includes(textoFiltro.toLowerCase()) ||
                         e.cedula.toLowerCase().includes(textoFiltro.toLowerCase())
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredProductos(){
            return this.filtro(this.productos, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageProducto{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>