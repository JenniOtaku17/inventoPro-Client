<template>
    <div v-if="mounted">
      <v-dialog v-model="activador" width="600" persistent>
        <v-card class="almacenPopup">
            <v-card-title class="px-10">
                <h3 class="primary--text">{{title}}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pt-4 pb-9 px-10">
                <div ref="form" v-if="verDetalles">
                    <v-row>
                        <v-col cols="12" md="6" class="py-2">
                            <span class="inputTitle" ><b>Nombre: </b></span>
                            <span >{{almacen.nombre}}</span>
                           
                        </v-col>
                        <v-col cols="12" md="6" class="py-2">
                            <span class="inputTitle" ><b>Cacapidad: </b></span>
                            <span>{{almacen.capacidad}}</span>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-2">
                            <span class="inputTitle" ><b>Ubicación: </b></span>
                            <span>{{almacen.ubicacion}}</span>
                        </v-col>
                        <v-col cols="12" md="6" class="py-2">
                            <span class="inputTitle" ><b>Descripción: </b></span>
                            <span>{{almacen.descripcion}}</span>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12" md="12" sm="12" justify="end" align="end">
                            <v-btn class="white--text" :disabled="isCreating" color="primary" elevation="0" @click="clean">
                                Cerrar
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
                <v-form ref="form" v-else>
                    <v-row>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Nombre</span>
                            <v-text-field  v-model="almacen.nombre" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Cacapidad</span>
                            <v-text-field  v-model="almacen.capacidad" dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Ubicación</span>
                            <v-textarea v-model="almacen.ubicacion" rows="3" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Descripción</span>
                            <v-textarea v-model="almacen.descripcion" rows="3" no-resize outlined class="textFieldCustom" color="secondary"></v-textarea>
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
        "editable", 
        "verDetalles"
    ],
    data: () => ({
        almacen: {
            nombre: null,
            capacidad: null,
            ubicacion: null,
            descripcion: null,
            estado: true
        },
        inputRules: [
            v => !!v || '⚠ Campo requerido',
        ],
        isCreating: false,
        user: null,
        title: 'Crear almacén',
        mounted: false,
    }),
    async mounted(){

      if(this.editable){
        if(this.verDetalles){
            this.title = "Visualización de almacén";
        }else{
            this.title = "Editar almacén";
        }
        this.almacen = this.editable;
      }
      this.mounted = true;

    },
    methods: {

        clean(){
            this.almacen = {
                nombre: null,
                capacidad: null,
                ubicacion: null,
                descripcion: null,
                estado: true
            };
            this.$emit("actualizar", false);
        },

        close(){
            this.almacen = {
                nombre: null,
                capacidad: null,
                ubicacion: null,
                descripcion: null,
                estado: true
            };
            this.$emit("actualizar", true);
        },

        async guardar(){

            if(this.$refs.form.validate()){
                try{
                    this.isCreating = true;
                    let response;

                    if(this.editable == null){
                        response = await this.$api.post("api/almacen", this.almacen);
                    }else{
                        response = await this.$api.put("api/almacen", this.almacen);
                    }

                    this.$print(response);
                    this.close();

                }catch(error){
                    this.$print(error);
                    let text = "Ocurrió un error"
                    if(error.response){
                        text = error.response.data.error;
                    }

                    this.$alert('error', 'Almacén', text, 3000);
                
                }finally{
                    this.isCreating = false;
                }
            }
            
        }
    }
}
</script>
<style lang="scss">

    .almacenPopup{

        .inputTitle{
            font-size: 14px;
            font-weight: 500;
            
        }
    }

</style>