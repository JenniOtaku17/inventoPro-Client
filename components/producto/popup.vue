<template>
    <div v-if="mounted">
      <v-dialog v-model="activador" width="600" persistent>
        <v-card class="productoPopup">
            <v-card-title>
                <h3 class="primary--text">{{title}}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pt-4 pb-9 px-10">
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Nombre</span>
                            <v-text-field  v-model="producto.nombre"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Precio</span>
                            <v-text-field  v-model="producto.precio" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Impuesto</span>
                            <v-text-field  v-model="producto.impuesto" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Unidad</span>
                            <v-text-field  v-model="producto.unidad" type="email"  dense outlined class="textFieldCustom" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Almacén</span>
                            <v-select v-model="producto.id" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="almacenes" item-text="nombre" item-value="id" append-icon="mdi-chevron-down"></v-select>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Código de Barra</span>
                            <v-text-field  v-model="producto.codigoBarra" type="email"  dense outlined class="textFieldCustom" color="secondary"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="12" class="py-0">
                            <span class="inputTitle" >Descripción</span>
                            <v-textarea v-model="producto.descripcion" rows="2" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12" justify="end" align="end">
                            <v-btn class="white--text" :disabled="isCreating" color="primary" elevation="0" @click="guardar">
                                Guardar cambios
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  <script>
  
  export default {
    props: [
        "activador",
        "editable"
    ],
    data: () => ({
        producto: {
            cedula: null,
            nombre: null,
            correo: null,
            telefono: null,
            ubicacion: null,
            descripcion: null,
            estado: true
        },
        almacenes: [],
        inputRules: [
            v => !!v || '⚠ Campo requerido',
        ],
        isCreating: false,
        user: null,
        title: 'Crear producto',
        mounted: false,
    }),
    async mounted(){

      this.getAlmacenes();

      if(this.editable){
        this.title = "Editar Producto"
        this.producto = this.editable;
      }
      this.mounted = true;

    },
    methods: {

        clean(){
            this.producto = {
                cedula: null,
                nombre: null,
                correo: null,
                telefono: null,
                ubicacion: null,
                descripcion: null,
                estado: true
            };
            this.$emit("actualizar", false);
        },

        close( product ){
            this.producto = {
                cedula: null,
                nombre: null,
                correo: null,
                telefono: null,
                ubicacion: null,
                descripcion: null,
                estado: true
            };
            this.$emit("actualizar", true, product);
        },

        async getAlmacenes() {
            try{
                this.page = 1;
                let almacenes = await this.$api.get(`api/almacen`);

                this.almacenes = await almacenes.data;
                this.paginationLength = Math.ceil(this.almacenes.length/this.itemsPerPage);
                this.$print(this.almacenes);

            }catch(error){
                this.$print(error)
            }
            
        },

        async guardar(){

            if(this.$refs.form.validate()){
                try{
                    this.isCreating = true;
                    let response;

                    if(this.editable == null){
                        response = await this.$api.post("api/producto", this.producto);
                    }else{
                        response = await this.$api.put("api/producto", this.producto);
                    }

                    this.$print(response);
                    this.close( this.producto );

                }catch(error){
                    this.$print(error);
                    let text = "Ocurrió un error"
                    if(error.response){
                        text = error.response.data.error;
                    }

                    this.$alert('error', 'Producto', text, 3000);
                
                }finally{
                    this.isCreating = false;
                }
            }
            
        }
    }
}
</script>
<style lang="scss">

    .productoPopup{

        .inputTitle{
            font-size: 14px;
            font-weight: 500;
            
        }
    }

</style>