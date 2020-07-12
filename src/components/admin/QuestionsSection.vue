<template>
  <form class="section" @submit.prevent="submit">
    <div style="display:flex;flex-direction:column;justify-content:start">
      <label><strong>Question address</strong></label>
      <input calss="form-control" v-model="questionAddress" type="text" placeholder="Question address"/>
    </div>
    <div class="row">
      <div class="col-md-6">
        <label><strong>Number of questions</strong></label>
        <input class="form-control" v-model.number="numberOfQuestions" type="number" min="1" max="40"/>
      </div>
      <div class="col-md-6">
        <label><strong>Type</strong></label>
        <select class="form-control" v-model="type">
          <option :value="0">typing</option>
          <option :value="1">mcq</option>
        </select>
      </div>
    </div>
    <div calss="questions">
      <div v-for="q in questions.questions.length" :key="q" class="question">
        <div class="row">
          <div class="col-md-8">
            <label><strong>Question</strong></label>
            <input class="form-control" v-model="questions.questions[q-1]['question']" type="text" :placeholder="'question'"/>
          </div>
          <div class="col-md-1">
            <label><strong>Degree</strong></label>
            <input class="form-control" v-model.number="questions.questions[q-1]['fullDegree']" type="number" :placeholder="'full degree'"/>
          </div>
        </div>
        <div v-if="type===1">
          <div>
            <label><strong>Number of choices</strong></label>
            <input class="form-control" v-model.number="questionsNumberOfChoices[q-1]" type="number" min="2" max="6" value="2"/> 
          </div>
          <div class="row">
            <div class="col-md-3" v-for="(ch, i) in questionsNumberOfChoices[q-1]" :key="ch"><input class="form-control" v-model="questions.questions[q-1].choices[ch-1]" type="text" :placeholder="'Choice'+(i+1)"/></div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { eventBus } from '../../main.js';
export default {
  props: ['section'],
  created(){
      eventBus.$on('collectQuestions', () => {
        this.doSubmit();
      })
  },
  data() {
    return {
      numberOfQuestions: 1,
      type: 0,
      questionsNumberOfChoices: [],
      questionAddress: '',
    }
  },
  computed: {
    questions() {
      const obj = {type: this.questionAddress, questions: []}
      const arr = [];
      for(let q =0; q<this.numberOfQuestions; q++) {
        arr.push({question: '', choices: [], fullDegree: 0});
      }
      obj.questions = arr;
      return obj;
    }
  },
  watch: {
    },
    methods: {
      doSubmit() {
        console.log(this.questions);
        this.$emit('concatArraysOfQuestions', this.questions);
      }
    }
  };
</script>
<style scoped lang="scss">
  .section {
    background-color: rgb(227, 229, 231);
    border: #555 1px solid;
    padding: 20px;
    margin: 20px;
  }
  .question {
    margin: 18px;
    padding: 15px;
    background-color: rgb(240, 241, 241);
    border: #555 1px solid;
  }
  input {
    margin: 8px;
  }
</style>
