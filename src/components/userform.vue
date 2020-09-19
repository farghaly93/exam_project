<template>
  <div class="container register-wrapper m-auto shadow p-0">
    <div class="row">
      <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img src="../../src/img/study.jpg" alt="" width="600" height="auto"/>
      </div>
      <div class="col-md-6" style="background: #fbfbfb;">
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
                  <p>بالرجاء ادخال بياناتك صحيحة والتأكد منها وسيتم فى اول مرة يتم التسجيل فيها انتظار موافقة الاستاذ المشرف</p>
                  <div class="row register-form">
                      <div class="col-md-6">
                          <div v-if="mode==='signup' || way==='update'" class="form-group">
                              <label>الإسم بالكامل</label>
                              <input
                                class="form-control"
                                v-model="fullname"
                                :counter="10"
                                placeholder="الإسم بالكامل"
                                required
                                @input="$v.fullname.$touch()"
                                @blur="$v.fullname.$touch()"
                              />
                              <p class="error-msg" v-for="err in fullnameErrors" :key="err">{{err}}</p>
                          </div>
                          <div v-if="mode==='signup' || way==='update'" class="form-group">
                            <label>السنة الدراسية</label>
                              <select
                                id="stage"
                                class="form-control"
                                  v-model="stage"
                                  :counter="10"
                                  required
                                  @input="$v.stage.$touch()"
                                  @blur="$v.stage.$touch()"
                                >
                                <option selected disabled>السنة الدراسية</option>
                                <option selected value="one">الصف الأول الثانوي</option>
                                <option selected value="two">الصف الثاني الثانوي</option>
                                <option selected value="three">الصف الثالث الثانوي</option>
                              </select>
                              <p class="error-msg" v-for="err in stageErrors" :key="err">{{err}}</p>
                          </div>
                          <div v-if="mode==='signup' || way==='update'" class="form-group">
                            <label>رقم التليفون</label>
                              <input
                                class="form-control"
                                v-model="phone"
                                placeholder="رقم التليفون"
                                required
                                @input="$v.phone.$touch()"
                                @blur="$v.phone.$touch()"
                              />
                              <p class="error-msg" v-for="err in phoneErrors" :key="err">{{err}}</p>
                          </div>
                          <div v-if="mode==='signup' || way==='update'" class="form-group">
                            <label>العنوان</label>
                              <input
                                class="form-control"
                                v-model="address"
                                placeholder="العنوان"
                                required
                                @input="$v.email.$touch()"
                                @blur="$v.address.$touch()"
                              />
                              <p class="error-msg" v-for="err in addressErrors" :key="err">{{err}}</p>
                          </div>
                      </div>
                      <div :class="mode==='signin'?'col-md-12':'col-md-6'">
                          <div class="form-group">
                            <label>البريد الإلكتروني</label>
                              <input
                                class="form-control"
                                type="email"
                                v-model="email"
                                placeholder="البريد الإلكتروني"
                                required
                                @input="$v.email.$touch()"
                                @blur="$v.email.$touch()"
                              />
                              <p class="error-msg" v-for="err in emailErrors" :key="err">{{err}}</p>
                          </div>
                          <div class="form-group">
                              <label>كلمة المرور</label>
                              <input type="password"
                                class="form-control"
                                v-model="password"
                                placeholder="كلمة المرور"
                                required
                                @input="$v.password.$touch()"
                                @blur="$v.password.$touch()"
                              />
                              <p class="error-msg" v-for="err in passwordErrors" :key="err">{{err}}</p>
                          </div>
                          <div v-if="mode==='signup' || way==='update'" class="form-group">
                            <label>تأكيد كلمة المرور</label>
                              <input 
                                type='password'
                                class="form-control"
                                v-model="confirm"
                                placeholder="تأكيد كلمة المرور"
                                required
                                @input="$v.confirm.$touch()"
                                @blur="$v.confirm.$touch()"
                              />
                              <p class="error-msg" v-for="err in confirmErrors" :key="err">{{err}}</p>
                          </div>
                          <app-loading v-if="authLoading"/>
                          
                      </div>
                      <div class="col-12">
                        <button
                          :disabled="$v.$anyError" 
                          class="btn btn-primary ml-2 btn-block" 
                          @click.prevent="() => {way==='update'?update():mode==='signin'?signin():signup()}">
                          {{ mode==='signin'?'تسجيل الدخول' : 'انشاء حساب'}}
                        </button>

                        <button
                          class="btn btn-link btn-block"
                          v-if="way==='register'"
                          @click="switchMode">
                          {{ mode==='signin' ? 'ليس لديك حساب اضغط هنا لانشاء حساب جديد' : 'لديك حساب اضغط هنا لتسجيل الدخول' }}
                        </button>
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
              !this.$v.fullname.required && errors.push('الاسم بالكامل مطلوب')
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
              !this.$v.email.required && errors.push('البريد الإلكتروني مطلوب')
              !this.$v.email.email && errors.push('البريد الإلكتروني غير صالح')
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
.form-group {
  .error-msg {
    color: #dc3545;
    margin-top: 5px;
    &::before {
      content: "\f06a";
      font: normal normal normal 14px/1 FontAwesome;
      font-size: 14px;
      font-size: inherit;
      text-rendering: auto;
      -moz-osx-font-smoothing: grayscale;
      margin-left: 5px;
    }
  }
}
</style>
