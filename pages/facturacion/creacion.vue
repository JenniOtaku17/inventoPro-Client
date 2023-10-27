<template>

    <v-container class="px-6 py-0 pageFacturacion">
        <v-form ref="form">
            <v-row class="px-4">
                <v-col cols="12" sm="6" class="text-left">
                    <h3 class="primary--text moduleTitle">
                        <v-icon color="primary" class="mb-1">mdi-cash-register</v-icon>&nbsp;&nbsp;Facturación
                    </h3>
                </v-col>
                <v-col cols="12" sm="3" class="text-right">
                    <v-select v-model="facturacion.clienteId" :rules="inputRules" dense outlined class="textFieldCustom" color="secondary" :items="clientes" item-text="nombre" item-value="id" append-icon="mdi-chevron-down" label="Seleccionar Cliente"></v-select>
                </v-col>
                <v-col cols="12" sm="3" class="text-right">
                    <v-select v-model="facturacion.almacenId" :rules="inputRules" dense outlined class="textFieldCustom" color="secondary" :items="almacenes" item-text="nombre" item-value="id" append-icon="mdi-chevron-down" label="Seleccionar Almacén"></v-select>
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
                    
                    <v-data-table :headers="headers" :items="facturacion.detalles" dense hide-default-footer
                        class="customTable mx-4 mt-4" no-data-text="Sin productos agregados"
                        :items-per-page="facturacion.detalles.length"
                    >
                        <template v-slot:body="{ items }" v-if="facturacion.detalles && facturacion.detalles.length > 0">
                        <tbody>
                            <tr v-for="item in items" class="puntero" :key="item.id">
                                <td>{{ item.nombre }}</td>
                                <td align="right">
                                    <formatNumber :value="item.precio" />
                                </td>
                                <td align="center">{{ item.impuesto }}%</td>
                                <td align="center">
                                    <v-text-field  v-model="item.descuento" type="number"  hide-details dense outlined class="textFieldCustom fixedWidth" color="secondary" append-icon="mdi-percent-outline" :rules="numberRules" ></v-text-field>
                                </td>
                                <td align="center">
                                    <div class="cantidadDiv">
                                        <v-btn :disabled="item.cantidad <= 1" icon @click="item.cantidad = item.cantidad - 1" color="error">
                                            <v-icon >mdi-minus</v-icon>
                                        </v-btn>
                                        <v-text-field  v-model="item.cantidad" type="number" hide-details dense outlined class="cantidadInput" :rules="numberRules"></v-text-field>
                                        <v-btn icon @click="item.cantidad = item.cantidad + 1" color="success">
                                            <v-icon >mdi-plus</v-icon>
                                        </v-btn>
                                    </div>
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
                            <v-textarea v-model="facturacion.notas" hide-details rows="4" label="Notas" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                            <h3 class="secondary--text mt-6">
                                {{ this.facturacion.detalles.length }} 
                                {{ this.facturacion.detalles.length == 1? 'Producto agregado' : 'Productos agregados' }}
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

                            <v-btn elevation="0" color="primary" block class="mt-4" @click="guardar">Guardar</v-btn>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
            <popup v-if="dialog" :activador="dialog" @actualizar="actualizar"/>
        </v-form>
    </v-container>
  </template>
  
  <script>
  import popup from "~/components/producto/popup";
  import formatNumber from "~/components/utils/formatNumber";
  
  export default {

    middleware: "auth-facturador",

    components: {
      popup,
      formatNumber
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.userDetails;
        this.getAlmacenes();
        this.getClientes();
        this.getProductos();
    },
  
    data() {
        return {
            isNew: false,
            isLoading: false,
            almacenes: [],
            productos: [],
            filterText: '',
            user: null,
            headers: [
                { text: "Producto", value: 'nombre' },
                { text: "Costo", value: "precio", align: "center", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
                { text: "Acción", align:'center', sortable: false }
            ],
            inputRules: [
                v => !!v || '',
            ],
            numberRules: [
                v => !!v || '',
                v => v > 0 || ''
            ],
            facturacion: {
                almacenId: null,
                subtotal: 0,
                impuestos: 0,
                descuentos: 0,
                total: 0,
                fecha: new Date(),
                notas: null,
                detalles: []
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
        async getAlmacenes() {
            try{
                let almacenes = await this.$api.get(`api/almacen`);
                this.almacenes = await almacenes.data;
                this.$print(this.almacenes);

            }catch(error){
                this.$print(error)
            }   
        },

        async getClientes() {
            try{
                let clientes = await this.$api.get(`api/cliente`);
                this.clientes = await clientes.data;
                this.$print(this.clientes);

            }catch(error){
                this.$print(error)
            }   
        },
        
        async getProductos() {
            try{
                let productos = await this.$api.get(`api/producto`);
                this.productos = await productos.data;
                this.$print(this.productos);

            }catch(error){
                this.$print(error)
            }   
        },

        getTotalProducto(item) {
            let total = (
                this.parse(item.precio) - (this.parse(item.precio) * this.parse(item.descuento)/100) 
                + ( (this.parse(item.precio) - (this.parse(item.precio) * this.parse(item.descuento)/100)) 
                * (item.impuesto/100))) * item.cantidad;
            item.total = total;
            return total;
        },

        parse( value ){
            return parseFloat(value) || 0;
        },

        async addProduct( id ) {
            let found = this.facturacion.detalles.find( x=> x.id == id);

            if(found){
                found.cantidad = found.cantidad + 1;
            }else{
                let producto = this.productos.find( x=> x.id == id);
                producto.productoId = producto.id;
                this.$set(producto, 'cantidad', 1);
                this.facturacion.detalles.push(producto);
            }

            this.filterText = '';
        },

        deleteProducto( id ) {
            let index = this.facturacion.detalles.findIndex(
                p => p.id == id
            );
            this.facturacion.detalles.splice(index, 1);
        },

        actualizar( toEdit, product) {
            if(toEdit){
                this.$set(product, 'cantidad', 1);
                product.productoId = product.id;
                this.facturacion.detalles.push(product);
            }
            this.dialog = false;
        },

        verDetalle( id ){
            let isCreating = true;
            this.$router.push({ path: '/facturacion/detalle', query: { id, isCreating } })
        },

        async guardar(){
            //testing
            this.isNew = true;
            this.$router.push({ path: '/facturacion/detalle', query: { id: 6, isNew: this.isNew } });
            return;
            if (this.$refs.form.validate()) {
                try {
                    this.$print(this.facturacion);
                    this.isNew = true;
                    if(this.facturacion.total < 0){
                        this.$alert('error', 'Facturación', 'El total no puede ser un valor negativo', null);

                    }else{
                        this.facturacion.usuarioId = this.user.id;
                        await this.facturacion.detalles.map((facturacion)=> { facturacion.id = 0});
                        let response = await this.$api.post("api/factura", this.facturacion);
                        this.verDetalle(response.data.id);
                        this.$print(response);
                        
                    }

                } catch (error) {
                    this.$print(error);
                    let text = "Ocurrió un error";
                    if (error.response) {
                        text = error.response.data.error;
                    }
                    this.$alert("error", "Facturación", text, 3000);

                } finally {
                    this.isNew = false;
                }
            }
        }
  
    },
  
    computed: {

        getSubTotal() {
            if (this.facturacion.detalles.length === 0) return 0;

            let result = this.facturacion.detalles ? this.facturacion.detalles.reduce((total, product) => {
                return total + (this.parse(product.precio) * product.cantidad)
            }, 0) : 0;

            this.facturacion.subtotal = result;
            return result;
        },

        getImpuestos() {
            if (this.facturacion.detalles.length === 0) return 0;

            let result = this.facturacion.detalles ? this.facturacion.detalles.reduce((total, product) => {

                let impuesto = (this.parse(product.precio) - (this.parse(product.descuento) / 100) * this.parse(product.precio)) * (product.impuesto / 100);
                return total + (impuesto * product.cantidad);

            }, 0) : 0;

            this.facturacion.impuestos = result;
            return result;
        },

        getDescuentos() {
            if (this.facturacion.detalles.length === 0) return 0;

            let result = this.facturacion.detalles ? this.facturacion.detalles.reduce((total, product) => {
                return total + ( ( (this.parse(product.descuento) / 100) * this.parse(product.precio) ) * product.cantidad )
            }, 0) : 0;

            this.facturacion.descuentos = result;
            return result;
        },

        getTotal() {
            let result = this.getSubTotal + this.getImpuestos - this.getDescuentos;

            this.facturacion.total = result;
            return result;
        },
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageFacturacion{

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

    .cantidadDiv{
        display: flex;

        .cantidadInput{
            width: 0px!important;

            .v-input__slot{
                padding:0px!important;

                fieldset{
                    border:none!important;
                }

                input{
                    text-align: center;
                    font-size: 14px!important;
                }

            }
        
        }

    }

  }

  </style>