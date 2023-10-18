<template>
  <div v-if="mounted">
    <v-dialog v-model="activador" width="600" persistent>
      <v-card class="usuarioPopup">
        <v-card-title>
          <h3 class="primary--text">{{ title }}</h3>
          <v-spacer></v-spacer>
          <v-btn icon @click="clean"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="pt-4 pb-9 px-10">
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="12" class="py-0">
                <span class="inputTitle">Nombre</span>
                <v-text-field
                  v-model="usuario.nombre"
                  dense
                  outlined
                  class="textFieldCustom"
                  color="secondary"
                  :rules="inputRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="py-0" v-if="editable == null">
                <span class="inputTitle">Correo</span>
                <v-text-field
                  v-model="usuario.correo"
                  type="email"
                  :rules="inputRules"
                  dense
                  outlined
                  class="textFieldCustom"
                  color="secondary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <span class="inputTitle">Rol</span>
                <v-select
                  v-model="usuario.roleId"
                  dense
                  outlined
                  :rules="inputRules"
                  class="textFieldCustom"
                  color="secondary"
                  :items="roles"
                  item-text="nombre"
                  item-value="id"
                  append-icon="mdi-chevron-down"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="editable == null">
              <v-col cols="12" md="6" class="py-0">
                <span class="inputTitle">Clave</span>
                <v-text-field
                  v-model="usuario.clave" :rules="inputRules"
                  dense outlined class="textFieldCustom" color="secondary"
                  :type="show ? 'text' : 'password'"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"  
                  @click:append="show = !show"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="py-0">
                <span class="inputTitle">Confirmación de Clave</span>
                <v-text-field
                  v-model="usuario.clave1" :rules="inputRules"
                  dense outlined class="textFieldCustom" color="secondary"
                  :type="show1 ? 'text' : 'password'"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"  
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12" sm="12" justify="end" align="end">
                <v-btn
                  class="white--text"
                  :disabled="isCreating"
                  color="primary"
                  elevation="0"
                  @click="guardar"
                >
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
  props: ["activador", "editable"],
  data: () => ({
    usuario: {
      nombre: null,
      correo: null,
      roleId: null,
      clave: null,
      clave1: null,
    },
    show: false,
    show1: false,
    roles: [
      { id: 1, nombre: "Facturador" },
      { id: 2, nombre: "Administrador" },
    ],
    inputRules: [(v) => !!v || "⚠ Campo requerido"],
    isCreating: false,
    user: null,
    title: "Crear usuario",
    mounted: false,
  }),
  async mounted() {
    if (this.editable) {
      this.title = "Editar usuario";
      this.usuario = this.editable;
    }
    this.mounted = true;
  },
  methods: {
    clean() {
      this.usuario = {
        nombre: null,
        correo: null,
        roleId: null,
      };
      this.$emit("actualizar", false);
    },

    close() {
      this.usuario = {
        nombre: null,
        correo: null,
        roleId: null,
      };
      this.$emit("actualizar", true);
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        try {
          this.isCreating = true;
          if (this.editable == null) {

            if(this.usuario.clave.length < 6){
              this.$toast('error', 'La clave debe tener almenos 6 caracteres');

            } else if(this.usuario.clave != this.usuario.clave1){
              this.$toast('error', 'Las claves no coinciden');

            }else{
              await this.$api.post("api/usuario?password="+this.usuario.clave, this.usuario);
              this.close();
            }

          } else {
            await this.$api.put("api/usuario", this.usuario);
            this.close();
          }

        } catch (error) {
          this.$print(error);
          let text = "Ocurrió un error";
          if (error.response) {
            text = error.response.data.error;
          }

          this.$alert("error", "usuario", text, 3000);
        } finally {
          this.isCreating = false;
        }
      }
    },
  },
};
</script>
<style lang="scss">
.usuarioPopup {
  .inputTitle {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
