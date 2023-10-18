
<template>
    <v-row no-gutters class="loginContainer">
        <v-col cols="12" md="8" class="leftSide">
            <img src="~assets/images/login.svg" width="70%" />   
        </v-col>
        <v-col cols="12" md="4" class="rightSide">
            <div style="width:380px">
                <v-row justify="center">
                    <h1 class="titleLogin primary--text">
                        InventoPRO
                    </h1>
                </v-row>
                <div class="ml-15 mr-15">
                    <v-row class="mt-5">
                        <v-col cols="12" md="12" v-if="error">
                            <span class="errorMessage">{{ error }}</span>
                        </v-col>
                        <v-col cols="12" md="12" class="pb-0">
                            <span class="inputTitle">Correo</span>
                            <v-text-field type="email" v-model="form.correo" dense outlined class="textFieldCustom"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12" class="pv-0">
                            <span class="inputTitle">Contraseña</span>
                            <v-text-field v-model="form.contraseña" dense outlined 
                            class="textFieldCustom" :type="show ? 'text' : 'password'"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"  
                            @click:append="show = !show" v-on:keypress.enter="login()"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="12" class="pt-0" align="right">
                            <a v-on:click="dialogPassword = true;" class="forget">¿Olvidaste tu contraseña?</a>
                        </v-col>
                    </v-row>
                    <v-row class="mt-4">
                        <v-col cols="12" md="12" class="px-3">
                            <v-btn block color="primary" class="white--text" elevation="0" @click="login">Iniciar</v-btn>
                        </v-col>
                    </v-row>
                </div>
            </div>
        </v-col>
        <v-dialog v-model="dialogPassword" max-width="450px">
            <v-card class="pb-2">
                <v-card-title class="primary--text">
                    Cambiar clave
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogPassword = false" >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pb-0">
                    <span>Digite el correo electrónico registrado en la plataforma y en breve le estaremos enviando un correo de restablecimiento.</span>
                    <v-text-field label="Correo" outlined class="mt-5 textFieldCustom"
                    dense v-model="email" ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary white--text" class="mr-2 mb-2" elevation="0" @click="changePassword">
                        Enviar correo
                        <v-icon right>mdi-send</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { auth, signIn, sendResetEmail } from '~/plugins/firebase';

export default {
  layout: "clean",

  middleware : 'not-auth',

  data: () => ({
    show: false,
    dialogPassword: false,
    email: null,
    form: {
        empresa: null,
        correo: null,
        contraseña: null,
    },
    error: null,
    isloading: false,
  }),

  mounted(){
    this.$vuetify.theme.dark = false;
  },

  methods: {

    async login(){
        this.isloading = true;
        this.error = '';
        try{
            this.form.correo?this.form.correo = this.form.correo.trim():null;

          
            signIn(auth, this.form.correo, this.form.contraseña).then( async data => {
                this.$print(data);
                this.$router.push({ path: '/' })

            }).catch(error => {
                this.$print(error);

                switch(error.code){

                    case 400:
                        this.error = 'Contraseña incorrecta';
                        break;
                    default:
                        this.error = 'Demasiados intentos, intente nuevamente mas tarde';
                        break;
                }
                
            })

        }catch(error){
            this.$print(error);
            this.isloading = false;
            if(error.response.data.error){
                this.error = error.response.data.error;
            }

        }finally{
            this.isloading= false;
        }

    },


    changePassword(){
        sendResetEmail(auth, this.email).then(function() {
            this.$toast('success', ' Mensaje enviado exitosamente!');

        }).catch(function(error) {
            this.$print("Ocurrió un error ", error);
            this.$toast('error', 'Error al enviar mensaje');

        });
        this.dialogPassword = false;
    }

  }
}
</script>
<style lang="scss">

    .loginContainer{
        width:100%;
        height:100vh;


        .leftSide{
            display: flex;
            justify-content: center;
            align-items: center;

        }


        .rightSide{
            background: #d8ebeb;
            
            display: flex;
            justify-content: center;
            align-items: center;


            .titleLogin{
                font-weight: 700;
                font-size: 34px;
                line-height: 44px;
            }

            .inputTitle{
                font-weight: 500;
                font-size: 16px;
                line-height: 17px;
                /* identical to box height */
                color: #144659;
            }

            .forget{
                font-weight: 400;
                font-size: 14px;
                line-height: 15px;
                color: #144659;
            }

            .v-text-field__details{
                margin-bottom: 0px;
                min-height: 0px!important;
                height: 0px!important;
            }
                
        }

    }

</style>