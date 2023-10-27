<template>

    <v-container class="px-6 py-0 pageDevolucion">
        <v-form ref="form">
            <v-row class="px-4">
                <v-col cols="12" sm="8" class="text-left">
                    <h3 class="primary--text moduleTitle">
                        <v-icon color="primary" class="mb-1">mdi-cash-refund</v-icon>&nbsp;&nbsp;Devolución
                    </h3>
                </v-col>
                <v-col cols="12" sm="4" class="text-right">
                    <v-autocomplete v-model="devolucion.facturaId" :rules="inputRules" dense outlined class="textFieldCustom" color="secondary" :items="facturas" item-text="id" item-value="id" append-icon="mdi-chevron-down" label="Seleccionar Factura" @change="loadProducts"></v-autocomplete>
                </v-col>
            </v-row>
        
            <v-row class="mt-2">
                <v-col>
                    
                    <v-data-table :headers="headers" :items="devolucion.detalles" dense hide-default-footer
                        class="customTable mx-4 mt-4" no-data-text="Debe seleccionar una factura"
                        :items-per-page="devolucion.detalles.length"
                    >
                        <template v-slot:body="{ items }" v-if="devolucion.detalles && devolucion.detalles.length > 0">
                        <tbody>
                            <tr v-for="item in items" class="puntero" :key="item.id">
                                <td><v-checkbox v-model="item.selected" hide-details></v-checkbox></td>
                                <td>{{ item.producto?.nombre }}</td>
                                <td align="center">
                                    <formatNumber :value="item.producto?.precio" />
                                </td>
                                <td align="center">{{ item.producto?.impuesto }}%</td>
                                <td align="center">{{ item.descuento }}%</td>
                                <td align="center">{{ item.cantidadFacturada }}</td>
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
                            </tr>
                        </tbody>
                        </template>
                    </v-data-table>

                    <v-row class="px-4 mt-8">

                        <v-col cols="12" sm="4" >
                            <v-textarea v-model="devolucion.notas" hide-details rows="4" label="Notas" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                            <h3 class="secondary--text mt-6">
                                {{ this.devolucion.detalles.filter(x=> x.selected).length }} 
                                {{ this.devolucion.detalles.filter(x=> x.selected).length == 1? 'Producto a devolver' : 'Productos a devolver' }}
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
  import formatNumber from "~/components/utils/formatNumber";
  
  export default {

    middleware: "auth-facturador",

    components: {
      formatNumber
    },
  
    async mounted(){
        this.user = await this.$store.state.userManager.userDetails;
        this.getFacturas();
    },
  
    data() {
        return {
            isLoading: false,
            facturas: [],
            user: null,
            headers: [
                { text: "", value: '', sortable: false },
                { text: "Producto", value: 'nombre' },
                { text: "Precio", value: "precio", align: "center", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad Facturada", value: "cantidad", align: "center", sortable: false },
                { text: "Cantidad a Devolver", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
            ],
            inputRules: [
                v => !!v || '',
            ],
            numberRules: [
                v => !!v || '',
                v => v > 0 || ''
            ],
            devolucion: {
                facturaId: null,
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
  
    methods: {
        async getFacturas() {
            try{
                let facturas = await this.$api.get(`api/factura`);
                this.facturas = await facturas.data;
                this.$print(this.facturas);

            }catch(error){
                this.$print(error)
            }   
        },

        getTotalProducto(item) {
            let total = (
                this.parse(item.producto?.precio) - (this.parse(item.producto?.precio) * this.parse(item.descuento)/100) 
                + ( (this.parse(item.producto?.precio) - (this.parse(item.producto?.precio) * this.parse(item.descuento)/100)) 
                * (item.producto?.impuesto/100))) * item.cantidad;
            item.total = total;
            return total;
        },

        parse( value ){
            return parseFloat(value) || 0;
        },

        async loadProducts(){
            let factura = await this.$api.get(`api/factura/${this.devolucion.facturaId}`);
            await factura.data.detalles.map((detalle)=> {
                detalle.cantidadFacturada = detalle.cantidad;
            });

            this.devolucion.detalles = factura.data.detalles;
        },

        verDetalle( id ){
            let isCreating = true;
            this.$router.push({ path: '/devolucion/detalle', query: { id, isCreating } })
        },

        async guardar(){
            if (this.$refs.form.validate()) {
                try {
                    this.$print(this.devolucion);
                    let devolucion = await JSON.parse(JSON.stringify(this.devolucion));
                    this.isCreating = true;

                    if(devolucion.total < 0){
                        this.$alert('error', 'Devolución', 'El total no puede ser un valor negativo', null);

                    }else if(devolucion.detalles.filter(x=> x.selected && x.cantidad > x.cantidadFacturada).length > 0){
                        this.$alert('error', 'Devolución', 'No puede devolver mas de la cantidad facturada', null);

                    }else{
                        devolucion.usuarioId = this.user.id;
                        await devolucion.detalles.map((producto)=> { producto.id = 0;producto.producto = null; producto.facturaId = devolucion.facturaId;})
                        devolucion.detalles = devolucion.detalles.filter(x => x.selected)
                        let response = await this.$api.post("api/devolucion", devolucion);
                        this.verDetalle(response.data.id);
                        this.$print(response);
                    }

                } catch (error) {
                    this.$print(error);
                    let text = "Ocurrió un error";
                    if (error.response) {
                        text = error.response.data.mensaje;
                    }
                    this.$alert("error", "Devolución", text, null);

                } finally {
                    this.isCreating = false;
                }
            }
        }
  
    },
  
    computed: {

        getSubTotal() {
            if (this.devolucion.detalles.filter(x=> x.selected).length === 0) return 0;

            let result = this.devolucion.detalles.filter(x=> x.selected) ? this.devolucion.detalles.filter(x=> x.selected).reduce((total, product) => {
                return total + (this.parse(product.producto?.precio) * product.cantidad)
            }, 0) : 0;

            this.devolucion.subtotal = result;
            return result;
        },

        getImpuestos() {
            if (this.devolucion.detalles.filter(x=> x.selected).length === 0) return 0;

            let result = this.devolucion.detalles.filter(x=> x.selected) ? this.devolucion.detalles.filter(x=> x.selected).reduce((total, product) => {

                let impuesto = (this.parse(product.producto?.precio) - (this.parse(product.descuento) / 100) * this.parse(product.producto?.precio)) * (product.producto?.impuesto / 100);
                return total + (impuesto * product.cantidad);

            }, 0) : 0;

            this.devolucion.impuestos = result;
            return result;
        },

        getDescuentos() {
            if (this.devolucion.detalles.filter(x=> x.selected).length === 0) return 0;

            let result = this.devolucion.detalles.filter(x=> x.selected) ? this.devolucion.detalles.filter(x=> x.selected).reduce((total, product) => {
                return total + ( ( (this.parse(product.descuento) / 100) * this.parse(product.producto?.precio) ) * product.cantidad )
            }, 0) : 0;

            this.devolucion.descuentos = result;
            return result;
        },

        getTotal() {
            let result = this.getSubTotal + this.getImpuestos - this.getDescuentos;

            this.devolucion.total = result;
            return result;
        },
    
    }
  };
  </script>
  
  <style lang='scss' >

  .pageDevolucion{

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

    .v-input--checkbox{
        margin: 0px;
        padding: 0px;
    }

  }

  </style>