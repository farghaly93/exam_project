<template>
  <form @submit.prevent="submit">
    <input v-model="questionAddress" type="text" placeholder="Question address"/>
    <div>
      <label>Number of questions</label>
      <input class="form-control" v-model.number="numberOfQuestions" type="number" min="1" max="40"/>
      <label>Type</label>
      <select class="form-control" v-model="type">
        <option :value="0">typing</option>
        <option :value="1">mcq</option>
      </select>
    </div>
    <div calss="questions">
      <div v-for="q in questions.questions.length" :key="q" class="question">
        <input class="form-control" v-model="questions.questions[q-1]['question']" type="text" :placeholder="'question'"/>
        <input class="form-control" v-model.number="questions.questions[q-1]['fullDegree']" type="number" :placeholder="'full degree'"/>
        <div v-if="type===1">
          <input class="form-control" v-model.number="questionsNumberOfChoices[q-1]" type="number" min="2" max="6" value="2"/> 
          <input class="form-control" v-model="questions.questions[q-1].choices[ch-1]" type="text" v-for="ch in questionsNumberOfChoices[q-1]" :key="ch"/>
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
      submit(){
        //console.log(this.questions);
        this.$emit('concatArraysOfQuestions', this.questions);
      }
    }
  };
</script>
<style>
</style>
