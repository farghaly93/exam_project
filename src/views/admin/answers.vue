<template>
    <div class="container">
        <div class="row">
            <div class="people-list col-md-3">
                <div class="search">
                    <input @input="search" type="text" placeholder="search" />
                    <i class="fa fa-search"></i>
                </div>
                <v-select 
                    v-model="stage"
                    :items="['one', 'two', 'three']"
                />
                <ul class="list">
                    <li :class="lastExamStudents.includes(user._id)?'':'absent'" @click="() => {getExams(user._id)}" :key="i" v-for="(user, i) in filteredUsers" class="clearfix">
                    <div class="about">
                        <div class="name">{{user.fullname.split('@')[0]}}</div>
                        <div class="status">
                        <i class="fa fa-circle online"></i> ({{user.phone}})
                        </div>
                    </div>
                    </li>
                </ul>
            </div>
        
            <div class="chatt col-md-9">
                <section v-if="isStudentExam">
                    <v-system-bar/>
                    <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
                        <h3>Exam {{exam.solution.number}}</h3>
                        <h4>{{exam.solution.stage}} Stage Year {{exam.solution.year}}</h4>
                        <h2 style="color:red">{{mark}} / {{fullMark}}</h2>
                    </div>
                    <div v-for="(section, s) in exam.solution.sections" :key="s" class="section">
                        <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
                        <div style="margin-left: 40px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                            <h3>{{question.question}}?</h3>
                            <h4 style="font-weight:bold;color:#2f6b3f;margin-left:20px;">{{question.answer}}</h4>
                            <input @change="calculateMark()" type="number" v-model="question.degree" placeholder="degree" min="0" :max="question.fullDegree"><p>{{question.fullDegree}}</p>
                            <input style="color:#da4545;font-weight:bold" type="text" v-model="question.correction" placeholder="correction"/>
                        </div>
                    </div>
                    <button @click="submitCorrection" type="button" class="btn btn-primary">Submit correction</button>
                    <v-divider/>
                </section>
                <section v-if="!isStudentExam">
                    <div class="exam" :class="exam.done?'done':'toCorrect'" @click="()=>{getAnswers(exam)}" v-for="(exam, i) in exams" :key="i">
                        <h3>Stage {{exam.solution.stage}}</h3>
                        <h3>Year {{exam.solution.year}}</h3>
                    </div>
                </section>
            </div>
        </div>
    
  </div> 

</template>
<script>
import axios from 'axios';

export default {
    created() {},
    data() {
        return {
            exam: {},
            solutionId: '',
            userId: '',
            isStudentExam: false,
            exams: [],
            stage: '',
            months: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            users: [],
            filteredUsers: [],
            lastExamStudents: []
        }
    },
    computed: {
        nowDate() {
            const date = (+new Date().getDay()+1)+' '+this.months[+new Date().getMonth()]+' '+ new Date().getFullYear();
            let minutes = new Date().getMinutes();
            if(minutes < 10) minutes = '0'+minutes

            let hours = new Date().getHours();
            if(hours < 12) hours = hours + ':' + minutes + 'Am'
            else hours = hours - 12 + ':' + minutes + 'Pm'
            return date + '-' + hours;
        },
        fullMark() {
            let mark = 0;
            this.exam.solution.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + ques.fullDegree; 
                })
            })
            return mark;
        },
        mark() {
            let mark = 0;
            this.exam.solution.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + +ques.degree; 
                })
            })
            return mark;
        },
    },
    methods: {
        search(event) {
            const users = [...this.users];
            const filtered = users.filter(user => user.fullname.toLowerCase().includes(event.target.value));
            this.filteredUsers = [...filtered];
            console.log(event.target.value, filtered)
        },
        getExams(id) {
            this.userId = id;
            this.isStudentExam = false;
            axios.get('/getStudentExams/'+id).then(res => {
                this.exams = res.data.exams;
                console.log(this.exams);
            })
        },
        getAnswers(exam) {
            this.isStudentExam = true;
            this.exam = exam;
            this.solutionId = exam._id;
            console.log(this.isStudentExam);
        },
        calculateMark() {
            let mark = 0;
            this.exam.solution.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + +ques.degree; 
                })
            })
            this.mark = mark;
        },
        submitCorrection() {
              axios.post('/sendCorrection/'+this.solutionId, this.exam).then(res => {
                  if(res.data.done) {
                      this.$store.dispatch('writemessage', 'Correction saved successfully...')
                  }
              })
        }
    },
    watch: {
        stage(val) {
            axios.get('/getUsersExam/'+val).then(res => {
                this.users = res.data.users
                this.lastExamStudents = res.data.lastExamStudents
                this.filteredUsers = res.data.users
            });
        },
    }
}
</script>
<style scoped lang='scss'>
   @import '../../scss/room.scss';
   .done {
       background-color: green;
   }
   .toCorrect {
       background-color: rgb(54, 63, 92);
       cursor: pointer;
   }
   .exam {
       color: #fff;
       text-align: center;
   }
   .absent {
       background-color: rgb(243, 62, 62)
   }
</style>