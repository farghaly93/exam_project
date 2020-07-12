<template>
<form class="section" ref="form">
    <div style="display:flex;flex-direction:column;justify-content:start">
      <label><strong>Question address</strong></label>
      <input calss="form-control" v-model="fetchedQuestions.type" type="text" placeholder="Question address"/>
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
      <div v-for="q in numberOfQuestions" :key="q" class="question">
        <div class="row">
          <div class="col-md-8">
            <label><strong>Question</strong></label>
            <input class="form-control" v-model="fetchedQuestions.questions[q-1]['question']" type="text" :placeholder="'question'"/>
          </div>
          <div class="col-md-1">
            <label><strong>Degree</strong></label>
            <input class="form-control" v-model.number="fetchedQuestions.questions[q-1]['fullDegree']" type="number" :placeholder="'full degree'"/>
          </div>
        </div>
        <div v-if="type===1">
          <div>
            <label><strong>Number of choices</strong></label>
            <input class="form-control" v-model.number="questionsNumberOfChoices[q-1]" type="number" min="2" max="6" value="2"/> 
          </div>
          <div class="row">
            <div class="col-md-3" v-for="(ch, i) in questionsNumberOfChoices[q-1]" :key="ch"><input class="form-control" v-model="fetchedQuestions.questions[q-1].choices[ch-1]" type="text" :placeholder="'Choice'+(i+1)"/></div>
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
      console.log('this.section');
      this.fetchedQuestions = this.section;
      if(this.fetchedQuestions.questions[0].choices.length > 0) this.type = 1;
      this.numberOfQuestions = this.fetchedQuestions.questions.length;
      const questions = this.section.questions.map(q => {
        return q.choices.length
      })
      this.questionsNumberOfChoices = questions;
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
      fetchedQuestions: {}
    }
  },
  watch: {
    numberOfQuestions(val) {
      for(let i=0;i<val; i++) {
        this.fetchedQuestions.questions[i] = this.fetchedQuestions.questions[i] || {question: '', choices: [], fullDegree: 0};
      }
    }
  },
    methods: {
      doSubmit() {
        this.$emit('concatArraysOfQuestions', this.fetchedQuestions);
      }
    }
  }
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



