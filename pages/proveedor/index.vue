<template>

    <v-container class="px-6 pb-10 pageProveedor">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Módulo de Proveedores &nbsp;<v-icon color="primary" class="mb-1">mdi-account-group</v-icon>
            </h3>
            <h5 class="text--secondary">
                Administra todos los proveedores de tu empresa, puedes añadir uno nuevo o modificar o eliminar alguno existente.
            </h5>
        </v-col>
        <v-col cols="12" sm="7" class="text-right">
            <v-btn color="primary" elevation="0" @click="openProveedor(false, null)">
                <v-icon left>mdi-plus</v-icon>Agregar Proveedor
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
              <v-data-table :headers="headers" :items="filteredProveedores" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :page="page" :items-per-page="itemsPerPage"
              >
                <template v-slot:body="{ items }" v-if="filteredProveedores && filteredProveedores.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.departamentoId">
                        <td>{{ item.id }}</td>
                        <td>{{ item.rnc }}</td>
                        <td>{{ item.nombre }} {{ item.apellido }}</td>
                        <td>{{ formatPhoneNumber(item.telefono) }}</td>
                        <td align="center">
                          <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.id)"><v-icon>mdi-account-eye-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="secondary" icon small @click="openProveedor(true, item)"><v-icon>mdi-pencil-circle-outline</v-icon></v-btn>
                          <v-btn class="elevation-0" color="error" icon small @click="deleteProveedor(item)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
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
  import popup from "~/components/Proveedor/popup";
  
  export default {

    middleware: "auth-this",
  
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
            proveedores: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Código", value: 'id' },
                { text: "RNC", value: 'rnc' },
                { text: "Nombre", value: "nombre", align: "start" },
                { text: "Teléfono", value: "telefono", align: "start" },
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
                let proveedores = await this.$api.get(`api/Proveedor`);

                this.proveedores = await proveedores.data;
                this.paginationLength = Math.ceil(this.proveedores.length/this.itemsPerPage);
                this.$print(this.proveedores);
                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        verDetalle( id ){
            this.$router.push({ path: '/Proveedor/detalle', query: { id } })
        },
    
        openProveedor( toEdit, obj){
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

        formatPhoneNumber( str ){
            let cleaned = ('' + str).replace(/\D/g, '');
    
            let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
            
            if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
            }
            
            return str;
        },
    
        async deleteProveedor(Proveedor){
            try{

                let result = await this.$confirm('Va a emilinar un Proveedor', `Está seguro que desea eliminar al Proveedor ${Proveedor.nombre} ${Proveedor.apellido}?`)
                if(result.isConfirmed){
                    await this.$api.put("api/Proveedor/changestatus/"+Proveedor.id );
                    this.getAll();
                }

            }catch(error){
                this.$print(error);

                let text = "Ocurrió un error al eliminar Proveedor"
                if(error.response.data.error){
                    text = error.response.data.error;
                }
                this.$alert('error', 'Proveedor', text, null);
            }
        },
    
        filtro(proveedores,textoFiltro){
            try{
                if(!proveedores) return [];
        
                return proveedores
                .filter(
                    e => e.nombre.toLowerCase().includes(textoFiltro.toLowerCase()) ||
                         e.rnc.toLowerCase().includes(textoFiltro.toLowerCase())
                )
            }catch(error){
                console.log(error);
            }
    
        },
        
  
    },
  
    computed: {
    
        filteredProveedores(){
            return this.filtro(this.proveedores, this.filterText)
        }
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageProveedor{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }
  }

  </style>