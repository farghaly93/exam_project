<template>
<div class="container register">
                <div class="row">
                    <div class="col-md-3 register-left">
                        <img src="https://i7.pngguru.com/preview/811/233/212/computer-icons-user-login-desktop-wallpaper-others.jpg" alt=""/>
                        <h3 style="color:#ff9">مرحبا</h3>
                        <p style="color:#fff">مرحبا بكم فى موقع القائد لامتحانات وتقييم اللغة الالمانية بالرجاء ادخال بياناتك صحيحة والتأكد منها وسيتم فى اول مرة يتم التسجيل فيها انتظار موافقة الاستاذ المشرف</p>
                        <input v-if="way==='register'" type="submit" @click="switchMode" name="" :value="mode==='signin'?'Sign up':'Login'"/><br/>
                    </div>
                    <div class="col-md-9 register-right">
                        <!-- <ul class="nav nav-tabs nav-justified" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Employee</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Hirer</a>
                            </li>
                        </ul> -->
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                <h3 class="register-heading">{{way==='update'?'تعديل بيانات الطالب':mode==='signin'?'تسجيل الدخول':'انشاء حساب'}}</h3>
                                <div class="row register-form">
                                    <div class="col-md-6">
                                        <div v-if="mode==='signup' || way==='update'" class="form-group">
                                            <label>الأسم بالكامل</label>
                                            <input
                                              class="form-control"
                                              v-model="fullname"
                                              :counter="10"
                                              placeholder="Full name"
                                              required
                                              @input="$v.fullname.$touch()"
                                              @blur="$v.fullname.$touch()"
                                            />
                                            <p v-for="err in fullnameErrors" :key="err">{{err}}</p>
                                        </div>
                                        <div v-if="mode==='signup' || way==='update'" class="form-group">
                                          <label>السنة الدراسية</label>
                                            <select
                                              id="stage"
                                              class="form-control"
                                                v-model="stage"
                                                :counter="10"
                                                placeholder="Stage"
                                                required
                                                @input="$v.stage.$touch()"
                                                @blur="$v.stage.$touch()"
                                              >
                                              <option selected value="one">الصف الأول الثانوي</option>
                                              <option selected value="two">الصف الثاني الثانوي</option>
                                              <option selected value="three">الصف الثالث الثانوي</option>
                                            </select>
                                            <p v-for="err in stageErrors" :key="err">{{err}}</p>
                                        </div>
                                        <div v-if="mode==='signup' || way==='update'" class="form-group">
                                          <label>رقم التليفون</label>
                                            <input
                                              class="form-control"
                                              v-model="phone"
                                              placeholder="Phone"
                                              required
                                              @input="$v.phone.$touch()"
                                              @blur="$v.phone.$touch()"
                                            />
                                            <p v-for="err in phoneErrors" :key="err">{{err}}</p>
                                        </div>
                                        <div v-if="mode==='signup' || way==='update'" class="form-group">
                                          <label>العنوان</label>
                                            <input
                                              class="form-control"
                                              v-model="address"
                                              placeholder="Address"
                                              required
                                              @input="$v.email.$touch()"
                                              @blur="$v.address.$touch()"
                                            />
                                            <p v-for="err in addressErrors" :key="err">{{err}}</p>
                                        </div>
                                    </div>
                                    <div :class="mode==='signin'?'col-md-12':'col-md-6'">
                                        <div class="form-group">
                                          <label>الايميل</label>
                                            <input
                                              class="form-control"
                                              type="email"
                                              v-model="email"
                                              placeholder="Email"
                                              required
                                              @input="$v.email.$touch()"
                                              @blur="$v.email.$touch()"
                                            />
                                            <p v-for="err in emailErrors" :key="err">{{err}}</p>
                                        </div>
                                        <div class="form-group">
                                            <label>كلمة المرور</label>
                                            <input type="password"
                                              class="form-control"
                                              v-model="password"
                                              placeholder="Password"
                                              required
                                              @input="$v.password.$touch()"
                                              @blur="$v.password.$touch()"
                                            />
                                            <p v-for="err in passwordErrors" :key="err">{{err}}</p>
                                        </div>
                                        <div v-if="mode==='signup' || way==='update'" class="form-group">
                                          <label>تأكيد كلمة المرور</label>
                                            <input 
                                              type='password'
                                              class="form-control"
                                              v-model="confirm"
                                              label="Confirm password"
                                              required
                                              @input="$v.confirm.$touch()"
                                              @blur="$v.confirm.$touch()"
                                            />
                                            <p v-for="err in confirmErrors" :key="err">{{err}}</p>
                                        </div>
                                        <app-loading v-if="authLoading"/>
                                        <input 
                                          type="submit"
                                          :disabled="$v.$anyError" 
                                          class="btnRegister" 
                                          @click.prevent="() => {way==='update'?update():mode==='signin'?signin():signup()}"
                                          value="تسجيل"
                                         />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
</template>

<script>
import axios from 'axios';
    import {email, required, minLength, sameAs, requiredUnless} from 'vuelidate/lib/validators';
    import loading from './loading'
export default {
   created() {
     this.way = this.$route.params.way;
     if(this.way === 'update') {
       this.mode='register';
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
              !this.$v.fullname.required && errors.push('الأسم بالكامل مطلوب')
              !this.$v.fullname.minLen && errors.push('الاسم قصير')
              return errors
            },
            stageErrors () {
              const errors = []
              if (!this.$v.fullname.$dirty) return errors
              !this.$v.fullname.required && errors.push('المرحلة الدراسية مطلوبة')
              return errors
            },
            phoneErrors () {
              const errors = []
              if (!this.$v.phone.$dirty) return errors
              !this.$v.phone.required && errors.push('رقم التليفون مطلوب')
              !this.$v.phone.minLen && errors.push('رقم التليفون غير صحيح')
              return errors
            },
            addressErrors () {
              const errors = []
              if (!this.$v.address.$dirty) return errors
              !this.$v.address.required && errors.push('العنوان مطلوب')
              !this.$v.address.minLen && errors.push('العنوان قصير')
              return errors
            },
            emailErrors () {
              const errors = []
              if (!this.$v.email.$dirty) return errors
              !this.$v.email.required && errors.push('الأيميل مطلوب')
              !this.$v.email.email && errors.push('الايميل غير صالح')
              return errors
            },
            passwordErrors () {
              const errors = []
              if (!this.$v.password.$dirty) return errors
              !this.$v.password.required && errors.push('كلمة المرور مطلوبة')
              !this.$v.password.minLen && errors.push('كلمة المرور قصيرة')
              return errors
            },
            confirmErrors () {
              const errors = []
              if (!this.$v.confirm.$dirty) return errors
              !this.$v.confirm.required && errors.push('تأكيد كلمة المرور مطلوب')
              !this.$v.confirm.sameAs && errors.push('كلمة المرور ليست متطابقة')
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
                  this.$store.dispatch('writemessage', 'تم تحديث بيانات الطالب بنجاح');
                } 
              });
            }
        }
}
</script>

<style lang="scss" scoped>
.register{
    p {
      color: #dc5959;
      font-weight: bolder;
    }
    label {
      color: #106c90;
      font-weight: bolder;
    }
    background: -webkit-linear-gradient(left, #3931af, #00c6ff);
    margin-top: 20%;
    padding: 3%;
    @media(max-width: 1000px) {
      .register {
        margin-top: 30%;
      }
    }
}
.register-left{
    text-align: center;
    color: #fff;
    margin-top: 4%;
}
.register-left input{
    border: none;
    border-radius: 1.5rem;
    padding: 2%;
    width: 60%;
    background: #f8f9fa;
    font-weight: bold;
    color: #383d41;
    margin-top: 30%;
    margin-bottom: 3%;
    cursor: pointer;
}
.register-right{
    background: #f8f9fa;
    border-top-left-radius: 10% 50%;
    border-bottom-left-radius: 10% 50%;
}
.register-left img{
    margin-top: 15%;
    margin-bottom: 5%;
    width: 25%;
    -webkit-animation: mover 2s infinite  alternate;
    animation: mover 1s infinite  alternate;
}
@-webkit-keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
}
@keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
}
.register-left p{
    font-weight: lighter;
    padding: 12%;
    margin-top: -9%;
}
.register .register-form{
    padding: 10%;
    margin-top: 10%;
}
.btnRegister{
    float: right;
    margin-top: 10%;
    border: none;
    border-radius: 1.5rem;
    padding: 2%;
    background: #0062cc;
    color: #fff;
    font-weight: 600;
    width: 50%;
    cursor: pointer;
}
.register .nav-tabs{
    margin-top: 3%;
    border: none;
    background: #0062cc;
    border-radius: 1.5rem;
    width: 28%;
    float: right;
}
.register .nav-tabs .nav-link{
    padding: 2%;
    height: 34px;
    font-weight: 600;
    color: #fff;
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
}
.register .nav-tabs .nav-link:hover{
    border: none;
}
.register .nav-tabs .nav-link.active{
    width: 100px;
    color: #0062cc;
    border: 2px solid #0062cc;
    border-top-left-radius: 1.5rem;
    border-bottom-left-radius: 1.5rem;
}
.register-heading{
    text-align: center;
    margin-top: 8%;
    margin-bottom: -15%;
    color: #495057;
}
</style>
