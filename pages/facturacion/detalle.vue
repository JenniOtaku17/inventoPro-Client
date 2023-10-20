<template>

    <v-container class="px-6 pb-10 pageFacturacion" v-if="facturacion">
      <v-row class="px-4">
        <v-col cols="12" sm="5" class="text-left">
            <h3 class="primary--text moduleTitle">
                Códido de Factura: &nbsp;{{ facturacion.id }}
            </h3>
            <h5 class="text--secondary">
                Administra todas las facturaciones de tu empresa, puedes añadir una nueva o verificar alguna existente.
            </h5>
        </v-col>
      </v-row>
  
      <v-row class="mt-4">
        <v-col>
          <v-card flat>
            <v-card-text>
              <v-data-table :headers="headers" :items="facturacion.detalles" :loading="isLoading" dense hide-default-footer
                loading-text="Buscando registros..." class="customTable" no-data-text="No se han encontrado resultados"
                :items-per-page="facturacion.detalles.length"
              >
                <template v-slot:body="{ items }" v-if="facturacion.detalles && facturacion.detalles.length > 0">
                  <tbody>
                    <tr v-for="item in items" class="puntero" :key="item.id">
                        <td>{{ item.producto?.nombre }}</td>
                        <td align="right"><formatNumber :value="item.producto?.precio" /></td>
                        <td align="center">{{ item.producto?.impuesto }}%</td>
                        <td align="center">{{ item.descuento }}%</td>
                        <td align="center">{{ item.cantidad }}</td>
                        <td align="right"><formatNumber :value="item.total" /></td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="px-4 mt-8">

        <v-col cols="12" sm="4" > 
            <div v-if="facturacion.notas">
                <b>Notas:</b>{{ facturacion.notas }}
            </div>
            <div v-else>
                No hay notas registradas
            </div>
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
                                <formatNumber :value="facturacion.subtotal" />
                            </td>
                        </tr>
                        <tr>
                            <td class="text-left">
                                Impuestos
                            </td>
                            <td class="text-right">
                                <formatNumber :value="facturacion.impuestos" />
                            </td>
                        </tr>
                        <tr class="finalDetail">
                            <td class="text-left">
                                Descuento
                            </td>
                            <td class="text-right">
                                <formatNumber :value="facturacion.descuentos" />
                            </td>
                        </tr>
                        <tr >
                            <td class="text-left">
                                Total
                            </td>
                            <td class="text-right">
                                <formatNumber :value="facturacion.total" />
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
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
            user: null,
            headers: [
                { text: "Producto", value: 'nombre' },
                { text: "Precio", value: "precio", align: "end", sortable: false },
                { text: "Impuesto", value: "impuesto", align: "center", sortable: false },
                { text: "Descuento", value: "descuento", align: "center", sortable: false },
                { text: "Cantidad", value: "cantidad", align: "center", sortable: false },
                { text: "Total", value: "total", align: "end", sortable: false },
            ],
            facturacion: null,
        };
    },
  
    methods: {
        async getAll() {
            try{
                this.isLoading = true;

                let id = this.$route.query.id;
                let facturacion = await this.$api.get(`api/factura/${id}`);
                this.facturacion = await facturacion.data;
                this.$print(this.facturacion);

                this.isLoading = false;

            }catch(error){
                this.$print(error)
            }
            
        },

        formatDate( date, hours){
            return this.$formatDate(date, hours);
        },
        
  
    },

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