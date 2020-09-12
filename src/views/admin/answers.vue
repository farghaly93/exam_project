<template>
    <div class="container">
        <div class="row">
            <div class="people-list col-md-3">
                <div class="search">
                    <input @input="search" type="text" placeholder="search" />
                    <i class="fa fa-search"></i>
                </div>
                <select class="form-control" style="display:block" v-model="stage">
                    <option selected value="one">الصف الأول الثانوي</option>
                    <option value="two">الصف الثاني الثانوي</option>
                    <option value="three">الصف الثالث الثانوي</option>
                </select>
                <div class="text-center" style="margin-top:30px;color:#fff;font-weight:bolder;" v-if="filteredUsers.length===0"><p v-if="stage===''"></p><p></p></div>
                <ul style="height:700px;overflow-y:scroll;">
                    <li @click="() => {getExams(user._id, user.fullname)}" :key="i" v-for="(user, i) in filteredUsers" class="clearfix">
                        <div :class="lastExamStudents.includes(user._id)?'about':'absent'">
                            <div class="name">{{user.fullname.split('@')[0]}}</div>
                            <p style="color:#fff">({{user.phone}})</p>
                        </div>
                    </li>
                </ul>
            </div>
        
            <div class="chatt col-md-9">
                <section class="examToCorrect" v-if="isStudentExam">
                    <v-system-bar/>
                    <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
                        <h3 style="color:#555;font-weight:bold;">{{username}}</h3>
                        <h3>({{exam.number}}) أمتحان رقم</h3>
                        <h4 v-if="exam.stage==='one'">الصف الأول الثانوي</h4>
                        <h4 v-if="exam.stage==='two'">الصف الثاني الثانوي</h4>
                        <h4 v-if="exam.stage==='three'">الصف الثالث الثانوي</h4>
                        <h4><strong></strong>({{exam.year}}/{{exam.year+1}}) العام الدراسي</h4>
                        <h2 style="color:red">{{mark}} / {{fullMark}}</h2>
                    </div>
                    <div v-for="(section, s) in exam.sections" :key="s" class="section">
                        <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
                        <div style="margin-left: 40px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                            <div class="left">
                                <div class="ques">{{q+1}}-{{question.question}}?</div>
                                <div class="answer"><strong style="color:#7fb68e;font-size:16px;">Answer: </strong>{{question.answer}}</div>
                                <input style="color:#da4545;font-weight:bold" type="text" v-model="question.correction" placeholder="correction"/>
                            </div>
                            <div class="degree">
                                <integer-plusminus @change="calculateMark()" v-model="question.degree" :min="0" :max="question.fullDegree" :value="0" :increment-aria-label="'increase by 1'" :decrement-aria-label="'decrease by 1'" :spin-button-aria-label="'example two'"></integer-plusminus>
                                <p>/</p>
                                <p>{{question.fullDegree}}</p>
                            </div>
                        </div>
                    </div>
                    <button @click="submitCorrection" type="button" class="btn btn-primary">Submit correction</button>
                    <v-divider/>
                </section>
                <section class="studentExams" v-if="!isStudentExam">
                    <div style="color:#555;font-size:22px;font-weight:bold;" class="text-center">{{username}}</div>
                     <div
                        class="exam"
                        :class="exam.done?'done':'toCorrect'" 
                        @click="()=>{getAnswers(exam)}" 
                        v-for="(exam, i) in exams" 
                        :key="i"
                        >
                        <p>({{exam.number}}) اجابة امتحان رقم </p>
                    </div>
                </section>
            </div>
        </div>
    
  </div> 

</template>
<script>
import axios from 'axios';
import IntegerPlusminus from '../../components/admin/IntegerPlusMinus'
export default {
    created() {},
    components: {
        IntegerPlusminus
    },
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
            lastExamStudents: [],
            username: ''
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
            this.exam.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + ques.fullDegree; 
                })
            })
            return mark;
        },
        mark() {
            let mark = 0;
            this.exam.sections.forEach(sec => {
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
        getExams(id, username) {
            this.userId = id;
            this.username = username;
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
            this.exam.sections.forEach(sec => {
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
    .clearfix {
        .absent {
            background-color: rgb(165, 75, 75);
            padding: 2px 12px;
            border-radius: 15px;
            border: solid 1px rgb(148, 25, 31);
            width: 100%;
        }
        .about {
            background-color: rgb(62, 112, 121);
            padding: 2px 12px;
            border-radius: 15px;
            border: solid 1px rgb(13, 60, 66);
             width: 100%;
        }
    }
    .studentExams {
        text-align: center;
        .exam {
            margin-left: auto;
            margin-right: auto;
            width: 80%;
            padding: auto;
            border-radius: 15px;
            color: #fff;
            margin-top: 10px;
            padding: 5px 0px;
            font-size: 20px;
            cursor: pointer;
        }
        .done {
            background-color:rgb(71, 136, 87);
            border: 1px solid rgb(7, 71, 7);
        }
        .toCorrect {
            background-color:rgb(109, 135, 207);
            border: 1px solid rgb(32, 56, 121);
        }
    }
    .examToCorrect {
        .section {
            .question {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-top: 15px;
                border-bottom: 1px  #555 solid; 
                .left {
                    flex: 7;
                    display: flex;
                    flex-direction: column;
                    justify-content: top;
                    align-items: left;
                    .ques {
                        font-size: 22px;
                        color: rgb(85, 85, 85);
                    }
                    .answer {
                        font-size: 20px;
                        font-weight: bold;
                        color: #60709f;
                    }
                    .correction {
                        font-size: 20px;
                        color: rgb(104, 41, 41);
                    }
                }
                .degree {
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: bold;
                }
            }
        }
        .degree {
            color:red;
            font-size: 22px;
            display: flex;
            flex-direction: column;
            justify-items: start;
            align-content: center;
            input p{
                flex: 1;
            }
        }
    }
</style>