import axios from 'axios';

const state = {
    allQuestions: []
}
const mutations = {}
const actions = {
    concatArraysOfQuestions({commit}, questions) {
        state.allQuestions= [...state.allQuestions, ...questions];
        console.log(state.allQuestions);
    }
}
const getters = {
    allQuestions() {
        return state.allQuestions;
    }
}

export default {state, mutations, actions, getters};