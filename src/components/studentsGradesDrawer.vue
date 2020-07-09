<template>
      <v-navigation-drawer
      style="margin-top:120px;margin-bottom:120px;padding:20px;z-index:1;padding-bottom:100px;"
      v-if="!$route.path.includes('/dashboard') && $route.path!=='/'"
        right
        v-model="drawer2"
        overlay-opacity=".5"
        app
        fixed
        width="230"
      >
          <div class="">
            <h3 style="color:#3f6a94;font-weight:bold;" class="text-center">Results</h3>
            <v-card
                style="margin-top:20px;"
                v-for="(grade, g) in grades"
                :key="g"
                :v-card-subtitle="grade.mark+ '/' + grade.fullMark"
                :color="grade.userId === userId?'#7abfbb6e':'#dee2e875'"
              >
              <v-card-subtitle style="color:#463333;font-weight:bolder">{{grade.username}}</v-card-subtitle>
              <v-card-text>{{grade.mark+ '/' + grade.fullMark}}</v-card-text>
              <v-progress-linear
                :value="(grade.mark/grade.fullMark)*100"
                height="17"
              >
                <strong>{{ Math.ceil((grade.mark/grade.fullMark)*100) }}%</strong>
              </v-progress-linear>
            </v-card>
          </div>
      </v-navigation-drawer>
</template>

<script>
import axios from 'axios';
export default {
    created() {
      axios.get('/getUsersExam/'+localStorage.getItem('stage')).then(res => {
        this.users = res.data.users;
        [...this.users].forEach(user => {
          axios.get('/getStudentExams/'+user._id).then(res => {
            const userMarks = {username: user.fullname, userId: user._id, mark: 0, fullMark: 0}
            res.data.exams.forEach(exam => {
               exam.solution.sections.forEach(section => {
                 section.questions.forEach(question => {
                   userMarks.mark += +question.degree;
                   userMarks.fullMark += +question.fullDegree;
                })
              })
            });
            this.grades.push(userMarks);
          });
        });
        this.grades = [...this.grades].sort((a, b) => {
          console.log(a.mark, b.mark)
          return (a.mark > b.mark)?1: -1;
        });
      });
    },
    data() {
      return {
        users: [],
        grades: []
      }
    },
    computed: {
      drawer2() {
        return this.$store.getters.drawer2;
      },
      userId() {
        return this.$store.getters.userId;
      }
    }
}
</script>