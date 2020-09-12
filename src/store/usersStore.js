import axios from 'axios';
import router from '../router';

  const state = {
    message: '',
    token: '',
    authLoading: false,
    userEmail: null,
    expDate: 0,
    role: 0,
    userId: '',
    stage: '',
    username: '',
  };



  const mutations = {
    signin(state, status) {
      if(status === 200) {
          console.log('signed in successfully');
          state.message = 'signed in successfully';
      }
    },
    signup(state, status) {
        if(status === 200) {
            console.log('signed up successfully');
            state.message = 'signed up successfully';
            state.itemsStore.showModal = false;
        }
      },
      holdToken(state, token) {
        state.token = token;
      }
  };



  const actions = {
    signin({dispatch, commit, rootState}, body) {
      state.authLoading = true;
      axios.post('/signin', body).then(res => {
        state.authLoading = false;
        console.log(res.data.confirmed);
        if(res.data.done && res.data.confirmed===1) {
            state.message = 'signed in successfully';
            rootState.itemsStore.showModal = false;
            state.token = res.data.token;
            state.userEmail = res.data.email;
            state.role = res.data.role;
            state.userId = res.data.userId;
            state.stage = res.data.stage;
            state.username = res.data.username;
            localStorage.setItem('token', res.data.token);
            const expDate = new Date(new Date().getTime()+6000000);
            localStorage.setItem('expDate', expDate);
            localStorage.setItem('userEmail', res.data.email);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('stage', res.data.stage);
            localStorage.setItem('username', res.data.username);
            state.expDate = expDate;
            dispatch('autoSignin');
            if(state.role==1) router.replace('/dashboard');
            if(state.role==0) router.replace('/exam');
        } else if(res.data.done && res.data.confirmed===0) {
          state.message = 'بانتظار تأكيد الطالب';
          //rootState.itemsStore.showModal = false;
          router.replace('/');
        } else {
            state.message = res.data.message;
            //router.replace('/');
        }
      })
    },

    signup({commit, rootState, dispatch}, body) {
        state.authLoading = true;
        axios.post('/signup', body).then( res => {
            state.authLoading = false;
            if(res.data.done) {
                state.message = 'بانتظار تأكيد الطالب';
                rootState.itemsStore.showModal = false;
                router.replace('/');
            }else {
                state.message = res.data.message;
            }
        })
    },
    closeMessage({commit}) {
        state.message = null;
    },
    autoSignin({dispatch, commit, rootState}) {
        const remainig = new Date(localStorage.getItem('expDate')).getTime() - new Date().getTime();
        console.log('auto Sigin', new Date(localStorage.getItem('expDate')).getTime()- new Date().getTime());
        console.log(state.username)
        if(remainig > 0) {
            commit('holdToken',  localStorage.getItem('token'));
            state.userEmail = localStorage.getItem('userEmail');
            state.role = localStorage.getItem('role');
            state.stage = localStorage.getItem('stage');
            state.userId = localStorage.getItem('userId');
            state.username = localStorage.getItem('username');

            localStorage.setItem('expDate', new Date(new Date().getTime()+remainig));
            setTimeout(()=>{
                dispatch('logout');
            }, remainig);
       } else {
        state.expDate = 0;
        state.userEmail = null;
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('stage');
        localStorage.removeItem('username');
        state.role = null;
        localStorage.removeItem('role');
        //rootState.itemsStore.showModal = true;
        router.replace('/');
       }
    },
    logout({commit, rootState}) {
        state.token = null;
        state.expDate = 0;
        state.userEmail = null;
        localStorage.removeItem('token');
        localStorage.removeItem('expDate');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('stage');
        localStorage.removeItem('username');
        state.role = null;
        //rootState.itemsStore.showModal = true;
        router.replace('/');
    }
  };



  const getters = {
    message(state) {
      return state.message;
    },
    authLoading(state) {
        return state.authLoading;
      },
    userEmail(state) {
        return state.userEmail;
    },
    token(state) {
        return state.token;
    },
    role(state) {
        return state.role;
    },
    userId(state) {
        return state.userId;
    },
    username(state) {
        return state.username;
    },
    stage(state) {
        return state.stage;
    },
   }



  export default {
    state,
    mutations,
    actions,
    getters
  }
