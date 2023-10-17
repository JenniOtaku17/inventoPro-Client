<template>

    <v-container class="px-6 py-0 pageRecepcion">
      <v-row class="px-4">
        <v-col cols="12" sm="8" class="text-left">
            <h3 class="primary--text moduleTitle">
                <v-icon color="primary" class="mb-1">mdi-package-variant-closed-plus</v-icon>&nbsp;&nbsp;Recepción de Mercancia
            </h3>
        </v-col>
        <v-col cols="12" sm="4" class="text-right">
            <v-select v-model="recepcion.id" :rules="inputRules" dense outlined class="textFieldCustom" color="secondary" :items="proveedores" item-text="nombre" item-value="id" append-icon="mdi-chevron-down" placeholder="Seleccionar Proveedor"></v-select>
        </v-col>
      </v-row>
  
      <v-row class="mt-2">
        <v-col>

            <v-row class="px-4">
                <v-col cols="12" sm="4" class="text-right">
                    <v-autocomplete class="textFieldCustom" 
                    v-model="filterText" :items="productos"
                    append-icon="mdi-magnify" item-text="nombre"
                     flat  item-value="id" hide-details
                    label="Buscar Producto" dense outlined
                    ></v-autocomplete>
                </v-col>
                <v-btn elevation="0" fab color="primary" small style="border-radius:50%" 
                class="mt-3" @click="dialog = true;"><v-icon>mdi-plus</v-icon></v-btn>
            </v-row>
            
              <v-data-table :headers="headers" :items="recepcion.productos" dense hide-default-footer
                class="customTable mx-4 mt-4" no-data-text="Sin productos agregados"
                :items-per-page="recepcion.productos.length"
              >
                <template v-slot:body="{ items }" v-if="recepcion.productos && recepcion.productos.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.nombre }}</td>
                        <td align="center">
                            <v-text-field  v-model="item.costo" type="number" hide-details dense outlined class="textFieldCustom fixedWidth" color="secondary" :rules="inputRules"></v-text-field>
                        </td>
                        <td align="center">{{ item.impuesto }}%</td>
                        <td align="center">
                            <v-text-field  v-model="item.descuento" type="number" hide-details dense outlined class="textFieldCustom fixedWidth" color="secondary" append-icon="mdi-percent-outline" ></v-text-field>
                        </td>
                        <td align="center">
                            <v-btn :disabled="item.cantidad == 1" icon @click="item.cantidad = item.cantidad - 1" color="error">
                                <v-icon >mdi-minus</v-icon>
                            </v-btn>
                            {{ item.cantidad }}
                            <v-btn icon @click="item.cantidad = item.cantidad + 1" color="success">
                                <v-icon >mdi-plus</v-icon>
                            </v-btn>
                        </td>
                        <td align="right">
                            <formatNumber :value="getTotalProducto(item)" />
                        </td>
                        <td align="center">
                            <v-btn class="elevation-0" color="error" icon small @click="deleteProducto(item.id)"><v-icon>mdi-close-circle-outline</v-icon></v-btn>
                        </td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>

            <v-row class="px-4 mt-8">

                <v-col cols="12" sm="4" >
                    <v-textarea v-model="recepcion.notas" hide-details rows="4" label="Notas" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                    <h3 class="secondary--text mt-6">
                        {{ this.recepcion.productos.length }} 
                        {{ this.recepcion.productos.length == 1? 'Producto agregado' : 'Productos agregados' }}
                    </h3>
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
                                        <formatNumber :value="getSubTotal" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-left">
                                        Impuestos
                                    </td>
                                    <td class="text-right">
                                        <formatNumber :value="getImpuestos" />
                                    </td>
                                </tr>
                                <tr class="finalDetail">
                                    <td class="text-left">
                                        Descuento
                                    </td>
                                    <td class="text-right">
                                        <formatNumber :value="getDescuentos" />
                                    </td>
                                </tr>
                                <tr >
                                    <td class="text-left">
                                        Total
                                    </td>
                                    <td class="text-right">
                                        <formatNumber :value="getTotal" />
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
  import formatNumber from "~/components/utils/formatNumber";
  
  export default {

    middleware: "auth-this",

    components: {
      popup,
      formatNumber
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.user;
        this.getProveedores();
    },
  
    data() {
        return {
            isLoading: false,
            proveedores: [],
            productos: [
                {
                    id: 1,
                    nombre: 'ahshda',
                    precio: 100,
                    impuesto: 18,
                    descuento: 0,
                    costo: 0,
                },
                {
                    id: 2,
                    nombre: 'djkas',
                    precio: 200,
                    impuesto: 18,
                    descuento: 0,
                    costo: 0,
                },
                {
                    id: 3,
                    nombre: 'bhjwe',
                    precio: 300,
                    impuesto: 18,
                    descuento: 0,
                    costo: 0,
                },
            ],
            filterText: '',
            user: null,
            headers: [
                { text: "Producto", value: 'nombre' },
                { text: "Costo", value: "costo", align: "center", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
                { text: "Acción", align:'center', sortable: false }
            ],
            inputRules: [
                v => !!v || '',
            ],
            recepcion: {
                id: null,
                subtotal: 0,
                impuestos: 0,
                descuentos: 0,
                total: 0,
                fecha: new Date(),
                notas: null,
                productos: []
            },
            dialog: false,
        };
    },

    watch: {
        filterText(val) {
            if(val != ''){
                this.addProduct(val);
            }
        }
    
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

        getTotalProducto(item) {
            let total = (
                this.parse(item.costo) - (this.parse(item.costo) * this.parse(item.descuento)/100) 
                + ( (this.parse(item.costo) - (this.parse(item.costo) * this.parse(item.descuento)/100)) 
                * (item.impuesto/100))) * item.cantidad;
            return total;
        },

        parse( value ){
            return parseFloat(value) || 0;
        },

        async addProduct( id ) {
            let found = this.recepcion.productos.find( x=> x.id == id);

            if(found){
                found.cantidad = found.cantidad + 1;
            }else{
                let producto = this.productos.find( x=> x.id == id);
                this.$set(producto, 'cantidad', 1);
                this.recepcion.productos.push(producto);
            }

            this.filterText = '';
        },

        deleteProducto( id ) {
            let index = this.recepcion.productos.findIndex(
                p => p.id == id
            );
            this.recepcion.productos.splice(index, 1);
        },

        actualizar( toEdit, product) {
            if(toEdit){
                this.$set(product, 'cantidad', 1);
                this.recepcion.productos.push(product);
            }
        }
  
    },
  
    computed: {

        getSubTotal() {
            if (this.recepcion.productos.length === 0) return 0;

            return this.recepcion.productos ? this.recepcion.productos.reduce((total, product) => {
                return total + (this.parse(product.costo) * product.cantidad)
            }, 0) : 0;
        },

        getImpuestos() {
            if (this.recepcion.productos.length === 0) return 0;

            return this.recepcion.productos ? this.recepcion.productos.reduce((total, product) => {

                let impuesto = (this.parse(product.costo) - (this.parse(product.descuento) / 100) * this.parse(product.costo)) * (product.impuesto / 100);
                return total + (impuesto * product.cantidad);

            }, 0) : 0;
        },

        getDescuentos() {
            if (this.recepcion.productos.length === 0) return 0;

            return this.recepcion.productos ? this.recepcion.productos.reduce((total, product) => {
                return total + ( ( (this.parse(product.descuento) / 100) * this.parse(product.costo) ) * product.cantidad )
            }, 0) : 0;
        },

        getTotal() {
            return this.getSubTotal + this.getImpuestos - this.getDescuentos;
        },
    
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

    .fixedWidth{
        width: 80px!important;

        input{
            text-align: right;
        }
    }

  }

  </style>