<template>
    <div v-if="mounted">
      <v-dialog v-model="activador" width="600" persistent>
        <v-card class="usuarioPopup">
            <v-card-title>
                <h3 class="primary--text">{{title}}</h3>
                <v-spacer></v-spacer>
                <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pt-4 pb-9 px-10">
                <v-form ref="form">
                    <v-row>
                        <v-col cols="12" md="12" class="py-0">
                            <span class="inputTitle" >Nombre</span>
                            <v-text-field  v-model="usuario.nombre"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Correo</span>
                            <v-text-field  v-model="usuario.correo" type="email" :rules="inputRules" dense outlined class="textFieldCustom" color="secondary"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Rol</span>
                            <v-select v-model="usuario.rol" dense outlined :rules="inputRules" class="textFieldCustom" color="secondary" :items="roles" item-text="nombre" item-value="id" append-icon="mdi-chevron-down"></v-select>
                        </v-col>
                    </v-row>

                    <v-row >
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Clave</span>
                            <v-text-field  v-model="usuario.clave" type="email"  dense outlined class="textFieldCustom" color="secondary"
                            :type="show ? 'text' : 'password'" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show = !show"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="py-0">
                            <span class="inputTitle" >Confirmación de clave</span>
                            <v-text-field  v-model="usuario.clave2" type="number"  dense outlined class="textFieldCustom" color="secondary" :rules="inputRules"
                            :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1"></v-text-field>
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
        usuario: {
            cedula: null,
            nombre: null,
            correo: null,
            telefono: null,
            ubicacion: null,
            descripcion: null,
            estado: true
        },
        show: false,
        show1: false,
        roles: [
            { id: 1, nombre: 'Facturador' },
            { id: 2, nombre: 'Administrador' },
        ],
        inputRules: [
            v => !!v || '⚠ Campo requerido',
        ],
        isCreating: false,
        user: null,
        title: 'Crear usuario',
        mounted: false,
    }),
    async mounted(){

      if(this.editable){
        this.title = "Editar usuario"
        this.usuario = this.editable;
      }
      this.mounted = true;

    },
    methods: {

        clean(){
            this.usuario = {
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

        close(){
            this.usuario = {
                cedula: null,
                nombre: null,
                correo: null,
                telefono: null,
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
                        response = await this.$api.post("api/usuario", this.usuario);
                    }else{
                        response = await this.$api.put("api/usuario", this.usuario);
                    }

                    this.$print(response);
                    this.close();

                }catch(error){
                    this.$print(error);
                    let text = "Ocurrió un error"
                    if(error.response){
                        text = error.response.data.error;
                    }

                    this.$alert('error', 'usuario', text, 3000);
                
                }finally{
                    this.isCreating = false;
                }
            }
            
        }
    }
}
</script>
<style lang="scss">

    .usuarioPopup{

        .inputTitle{
            font-size: 14px;
            font-weight: 500;
            
        }
    }

</style>