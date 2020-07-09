<template>
  <div class="container">
   <form>
      <v-text-field
       v-if="mode==='signup' || way==='update'"
        v-model="fullname"
        :error-messages="fullnameErrors"
        :counter="10"
        label="Full name"
        required
        @input="$v.fullname.$touch()"
        @blur="$v.fullname.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
       </v-icon>
      </v-text-field>


      <v-select
       v-if="mode==='signup' || way==='update'"
        v-model="stage"
        :items= "['one', 'two', 'three']"
        :error-messages="stageErrors"
        :counter="10"
        label="Stage"
        required
        @input="$v.stage.$touch()"
        @blur="$v.stage.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
      </v-icon>
      </v-select>


      <v-text-field
       v-if="mode==='signup' || way==='update'"
        v-model="phone"
        :error-messages="phoneErrors"
        label="Phone"
        required
        @input="$v.phone.$touch()"
        @blur="$v.phone.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
       </v-icon>
       </v-text-field>


      <v-text-field
       v-if="mode==='signup' || way==='update'"
        v-model="address"
        :error-messages="addressErrors"
        label="Address"
        required
        @input="$v.email.$touch()"
        @blur="$v.address.$touch()"
       >
          <v-icon slot="prepend" color="#555">
             mdi-account
          </v-icon>
       </v-text-field>


      <v-text-field
        type="email"
        v-model="email"
        :error-messages="emailErrors"
        label="Email"
        required
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
       </v-icon>
       </v-text-field>


      <v-text-field
      type="password"
        v-model="password"
        :error-messages="passwordErrors"
        label="Password"
        required
        @input="$v.password.$touch()"
        @blur="$v.password.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
       </v-icon>
       </v-text-field>


      <v-text-field
      type="password"
       v-if="mode==='signup' || way==='update'"
        v-model="confirm"
        :error-messages="confirmErrors"
        label="Confirm password"
        required
        @input="$v.confirm.$touch()"
        @blur="$v.confirm.$touch()"
      >
      <v-icon slot="prepend" color="#555">
          mdi-account
       </v-icon>
       </v-text-field>
      <app-loading v-if="authLoading"/>
      <v-btn :disabled="$v.$anyError" class="mr-4" @click.prevent="() => {way==='update'?update():mode==='signin'?signin():signup()}">submit</v-btn>
      <v-btn v-if="way==='register'" @click="switchMode">{{mode==='signin'?'Sign up':'Login'}}</v-btn>
    </form>
          </div>
</template>

<script>
import axios from 'axios';
    import {email, required, minLength, sameAs, requiredUnless} from 'vuelidate/lib/validators';
    import loading from './loading'
export default {
   props: ['way'],
   created() {
     if(this.way === 'update') {
       axios.post('/getuserdata', {_id: this.userId}).then(res => {
         this.email = res.data.userdata.email;
         this.fullname = res.data.userdata.fullname;
         this.phone = res.data.userdata.phone;
         this.address = res.data.userdata.address;
         this.stage = res.data.userdata.stage;
       });
     }
   },
   components: {
     appLoading: loading
   },
   data() {
            return {
            email: '',
            password: '',
            confirm: '',
            fullname: '',
            phone: '',
            address: '',
            mode: 'signin',
            stage: ''
            }
        },
        validations: {
            email: {
                required,
                email
            },
            password: {
                required,
                minLen:  minLength(6)
            },
            confirm: {
               required, //requiredUnless(() => this.mode === 'signup'), 
               sameAs: sameAs(vm => vm.password)
            },
            fullname: {
                required,
                minLen:  minLength(6)
            },
            stage: {
                required,
            },
            phone: {
                required,
                minLen:  minLength(11)
            },
            address: {
                required,
                minLen:  minLength(9)
            }
        },
        computed: {
            authLoading() {
                return this.$store.getters.authLoading;
            },
            userId() {
              return this.$store.getters.userId;
            },
            fullnameErrors () {
              const errors = []
              if (!this.$v.fullname.$dirty) return errors
              !this.$v.fullname.required && errors.push('fullname is required')
              !this.$v.fullname.minLen && errors.push('fullname is short')
              return errors
            },
            stageErrors () {
              const errors = []
              if (!this.$v.fullname.$dirty) return errors
              !this.$v.fullname.required && errors.push('stage is required')
              return errors
            },
            phoneErrors () {
              const errors = []
              if (!this.$v.phone.$dirty) return errors
              !this.$v.phone.required && errors.push('phone is required')
              !this.$v.phone.minLen && errors.push('phone is short')
              return errors
            },
            addressErrors () {
              const errors = []
              if (!this.$v.address.$dirty) return errors
              !this.$v.address.required && errors.push('address is required')
              !this.$v.address.minLen && errors.push('address is short')
              return errors
            },
            emailErrors () {
              const errors = []
              if (!this.$v.email.$dirty) return errors
              !this.$v.email.required && errors.push('address is required')
              !this.$v.email.email && errors.push('email is short')
              return errors
            },
            passwordErrors () {
              const errors = []
              if (!this.$v.password.$dirty) return errors
              !this.$v.password.required && errors.push('address is required')
              !this.$v.password.minLen && errors.push('password is short')
              return errors
            },
            confirmErrors () {
              const errors = []
              if (!this.$v.confirm.$dirty) return errors
              !this.$v.confirm.required && errors.push('confirm is required')
              !this.$v.confirm.sameAs && errors.push('password is not matched')
              return errors
            },
        },
        methods: {
            signin() {
                this.$v.email.$touch();
                this.$v.password.$touch();
                if(this.$v.$anyError) return;
                 this.$store.dispatch('signin', {email: this.email, password: this.password})
            },
            switchMode() {
                this.mode === 'signin'?this.mode = 'signup': this.mode = 'signin';
            },
            signup() {
              this.$v.email.$touch();
              this.$v.password.$touch();
              if(this.$v.$anyError) return;
                 this.$store.dispatch('signup', {email: this.email, password: this.password, fullname: this.fullname, stage: this.stage, phone: this.phone, address: this.address})
            },
            update() {
              this.$v.email.$touch();
              this.$v.password.$touch();
                this.$v.confirm.$touch();
              if(this.$v.$anyError) return;
              axios.post('/updateuserdata', {userId: this.userId, data: {email: this.email, password: this.password, fullname: this.fullname, phone: this.phone, address: this.address} }).then(res => {
                if(res.data.updated) {
                  this.$store.dispatch('writemessage', 'user data updated successfully');
                } 
              });
            }
        }
}
</script>

<style scoped>
    .container {
        box-shadow: #ccc 1px 1px 1px 1px;
        display: flex;
        flex-direction: column;
        justify-items: center;
        width: 80%;
        border: .7px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        background-image: linear-gradient(rgb(213, 213, 216), rgb(231, 231, 248), rgb(241, 245, 248))
    }
    .input {
        margin: 12px;
        display: flex;
        flex-direction: column;
        justify-items:center;
        align-items: left;
    }
    .input .insert {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-items: left;
        align-items: center
    }
    .input .insert label {
        flex: 1;
        color: rgb(75, 35, 72);
        font-weight: bold;
        box-decoration-break: clone;
    }
    .input .insert input {
        flex: 4;
        background-color: rgb(229, 229, 245);
        height: 50px;
        color: rgb(105, 104, 104);
        border-bottom-color: #888;
        border-bottom-width: 3px;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }
    .input .error {
        text-align: center;
    }
     .input .error p {
        color:rgb(199, 92, 92);
        font-weight: bolder;
    }
    .container .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    button {
        flex: 1;
        margin: 14px;
    }
    .input.invalid label{
        color: rgb(199, 92, 92);
    }
    .input.invalid input {
        background-color: rgb(236, 198, 198);
        font-size: 14px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-weight: bold;
    }
    @media screen and (max-width: 1000px){
        .container {
            width: 100%;
        }
        .input .insert label strong {
            color: transparent;
        }
        .input .insert label i {
            font-size: 20px;
        }
    }
</style>
