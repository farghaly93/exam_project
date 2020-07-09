<template>
  <form @submit.prevent="submit">
    <input v-model="fetchedQuestions.type" type="text" placeholder="Question address"/>
    <div>
      <label>Number of questions</label>
      <input v-model.number="numberOfQuestions" type="number" min="1" max="40"/>
      <label>Type</label>
      <select v-model="type">
        <option :value="0">typing</option>
        <option :value="1">mcq</option>
      </select>
    </div>
    <div calss="questions">
      <div v-for="q in numberOfQuestions" :key="q" class="question">
        <input v-model="fetchedQuestions.questions[q-1]['question']" type="text" :placeholder="'question'"/>
        <input v-model="fetchedQuestions.questions[q-1]['fullDegree']" type="number" :placeholder="'full degree'"/>
        <div v-if="type===1">
          <input v-model.number="questionsNumberOfChoices[q-1]" type="number" min="2" max="6" value="2"/> 
          <input v-model="fetchedQuestions.questions[q-1].choices[ch-1]" type="text" v-for="ch in questionsNumberOfChoices[q-1]" :key="ch"/>
        </div>
      </div>
    </div>
    <button>Submit</button>
  </form>
</template>
<script>
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
      submit(){
        console.log(this.fetchedQuestions);
        this.$emit('concatArraysOfQuestions', this.fetchedQuestions);
      }
    }
  }
</script>
<style>
</style>



