<template>

    <v-container class="px-6 py-0 pageRecepcion">
      <v-row class="px-4">
        <v-col cols="12" sm="8" class="text-left">
            <h3 class="primary--text moduleTitle">
                <v-icon color="primary" class="mb-1">mdi-package-variant-closed-plus</v-icon>&nbsp;&nbsp;Recepcion de Mercancia
            </h3>
        </v-col>
        <v-col cols="12" sm="4" class="text-right">
            <v-select v-model="recepcion.proveedorId" dense outlined class="textFieldCustom" color="secondary" :items="proveedores" item-text="nombre" item-value="proveedorId" append-icon="mdi-chevron-down" placeholder="Seleccionar Proveedor"></v-select>
        </v-col>
      </v-row>
  
      <v-row class="mt-2">
        <v-col>

            <v-row class="px-4">
                <v-col cols="12" sm="4" class="text-right">
                    <v-autocomplete class="textFieldCustom searchInput" 
                    v-model="filterText" :items="productos"
                    append-icon="mdi-magnify" item-text="nombre"
                     flat  item-value="productoId"
                    label="Buscar Producto" dense outlined
                    ></v-autocomplete>
                </v-col>
                <v-btn elevation="0" fab color="primary" small style="border-radius:50%" class="mt-3"><v-icon>mdi-plus</v-icon></v-btn>
            </v-row>
            
              <v-data-table :headers="headers" :items="recepcion.productos" dense hide-default-footer
                class="customTable mx-4 mt-4" no-data-text="Sin productos agregados"
                :items-per-page="recepcion.productos.length"
              >
                <template v-slot:body="{ items }" v-if="recepcion.productos && recepcion.productos.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.recepcionId">
                        <td>{{ item.recepcionId }}</td>
                        <td>{{ item.nombre }}</td>
                        <td>{{ item.ubicacion }}</td>
                        <td align="center">
                          <v-btn class="elevation-0" color="primary" icon small @click="verDetalle(item.recepcionId)"><v-icon>mdi-account-eye-outline</v-icon></v-btn>
                        </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>

            <v-row class="px-4 mt-8">

                <v-col cols="12" sm="4" >
                    <v-textarea v-model="recepcion.notas" rows="4" label="Notas" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                </v-col>

                <v-spacer></v-spacer>

                <v-col cols="12" sm="4" class="text-right">
                    <v-simple-table dense class="custom-table-less-td no-hover">
                        <template v-slot:default>
                            <tbody>
                                <tr>
                                    <td class="text-left">
                                        SubTotal
                                    </td>
                                    <td class="text-right">
                                        0.00
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-left">
                                        Impuestos
                                    </td>
                                    <td class="text-right">
                                        0.00
                                    </td>
                                </tr>
                                <tr class="finalDetail">
                                    <td class="text-left">
                                        Descuento
                                    </td>
                                    <td class="text-right">
                                        0.00
                                    </td>
                                </tr>
                                <tr >
                                    <td class="text-left">
                                        Total
                                    </td>
                                    <td class="text-right">
                                        0.00
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                    <v-btn elevation="0" color="primary" block class="mt-4">Guardar</v-btn>
                </v-col>
            </v-row>

        </v-col>
      </v-row>
      <popup v-if="dialog" :activador="dialog" @actualizar="actualizar"/>
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/producto/popup";
  
  export default {

    middleware: "auth-this",

    components: {
      popup
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getProveedores();
    },
  
    data() {
        return {
            isLoading: false,
            proveedores: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Producto", value: 'nombre' },
                { text: "Precio", value: "precio", align: "start" },
                { text: "Impuesto", value: "impuesto", align: "start" },
                { text: "Descuento", value: "descuento", align: "start" },
                { text: "Cantidad", value: "cantidad", align: "start" },
                { text: "Accion", align:'center', sortable: false }
            ],
            recepcion: {
                proveedorId: null,
                notas: null,
                productos: [

                ]
            },
        };
    },
  
    methods: {
        async getProveedores() {
            try{
                let proveedores = await this.$api.get(`api/proveedores`);
                this.proveedores = await proveedores.data;
                this.$print(this.proveedores);

            }catch(error){
                this.$print(error)
            }   
        },
        
        async getProductos() {
            try{
                let productos = await this.$api.get(`api/productos`);
                this.productos = await productos.data;
                this.$print(this.productos);

            }catch(error){
                this.$print(error)
            }   
        },
        
  
    },
  
    computed: {
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageRecepcion{

    .moduleTitle{
        font-size: 22px;
        font-weight: 500;
    }

    .finalDetail{
        td{
            border-color: #000!important;
        }
    }

    .searchInput{
        .v-text-field__details{
            display:none;
        }
    }

  }

  </style>