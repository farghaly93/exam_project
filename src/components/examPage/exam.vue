<template>
    <div>
        <v-alert
            style="text-align:center"
            v-if="notFound"
            dense
            type="info"
        >
        <strong>لا يوجد امتحان لك الان</strong>
        </v-alert>
        <div v-if="!examDone&&!notFound" class="startQuiz">
            <button @click="()=>{startExamHandler()}" class="btn btn-primary startExam" v-if="!startExam">ابدأ الأمتحان</button>
        </div>
        <section v-if="startExam" class="exam">
            <v-system-bar/>
            <div style="text-align:center;margin-bottom:30px;color:#6b364a;font-weight:bold">
                <h2 class="timer" :class="timerAlert?'timerAlert': 'timerRegular'">{{timer}}</h2>
                <h3>({{exam.number}})امتحان رقم </h3>

                <h4 v-if="exam.stage==='one'"> المرحلة <strong> الأولى </strong></h4>
                <h4 v-if="exam.stage==='two'"> المرحلة <strong> الثانية </strong></h4>
                <h4 v-if="exam.stage==='three'"> المرحلة <strong> الثالثة </strong></h4>

                <h4><Strong>({{exam.year+'/'+(exam.year+1)}})</strong> العام الدراسي</h4>
            </div>
            <div v-for="(section, s) in exam.sections" :key="s" class="section">
                <h4 style="margin:20px;text-decoration:underline;color:#555">{{section.type}}</h4>
                <div style="margin-left: 40px;margin-top:10px;" v-for="(question, q) in section.questions" :key="q"  class="question">
                    <div class="examResultsQuestionAndDegree">
                        <h5>{{q+1}}-{{question.question}}?</h5>
                        <v-textarea
                        v-if="question.choices.length===0"
                        v-model="solutionModel.sections[s].questions[q].answer"
                        label="The Answer"
                        auto-grow
                        outlined
                        rows="3"
                        row-height="25"
                        shaped
                        ></v-textarea>
                        <v-radio-group v-if="question.choices.length>0" v-model="solutionModel.sections[s].questions[q].answer">
                            <v-radio
                            style="margin-left: 20px;font-weight:bolder;color:#555;"
                                v-for="(choice, c) in question.choices"
                                :key="c"
                                :label="choice"
                                :value="choice"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                </div>
            </div>
            <button @click="submitAnswers" type="button" class="btn btn-primary">Submit answers</button>
            <v-divider/>
        </section>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: ['number', 'getUserPreviousExams', 'refreshExamsList'],
    data() {
        return {
            exam: {},
            solutionModel: {},
            timer: '00:00',
            timerAlert: false,
            examTime: 0,
            examDone: true,
            notFound: true,
            startExam: false,
            userId: '',
            stage: ''
        }
    },
    copmputed: {
    },
    created() {
        this.stage = localStorage.getItem('stage');
        this.userId = localStorage.getItem('userId');
            axios.get('/fetchExamForUser/'+this.stage+'/'+this.userId+'/'+this.number).then(res => {
                if(res.data.exam) {
                    this.exam = res.data.exam;
                    const examModel = {...this.exam};
                    this.examTime = this.exam.timer;
                    const solutionModelSections = examModel.sections.map(section => {
                            return {type: section.type, questions: section.questions.map(question => {
                                return {question: question.question, answer: '', degree: 0, fullDegree: question.fullDegree, correction: ''}
                            })}
                        });
                    this.solutionModel = {
                        year: this.exam.year,
                        stage: this.exam.stage, 
                        number: this.exam.number,
                        sections: solutionModelSections
                    };
                    this.notFound = false;
                    
                    axios.get('/testedOrNot/'+this.exam.stage+'/'+this.exam.number+'/'+this.userId).then(res => {
                        console.log(res.data);
                        if(res.data.tested) {
                            this.examDone = true;
                        } else {
                            this.examDone = false;
                        }
                    });
                } else {
                    this.notFound = true;
                }
            });
    },
    methods: {
        submitAnswers() {
            let completed = true;
            this.solutionModel.sections.forEach(sec => {
                sec.questions.map(ques => {
                    if(ques.answer === '') completed = false;
                })
            })
            if(completed) {
                this.sendAnswers();
            } else {
                this.$store.dispatch('writemessage', 'Complete your answers...')
            }
        },
        sendAnswers() {
            if(this.examDone) return;
            this.examDone = true;
            axios.post('/sendSolution', {
                userId: this.userId,
                examId: this.exam._id,
                year: this.solutionModel.year,
                number: this.solutionModel.number,
                stage: this.solutionModel.stage,
                sections: this.solutionModel.sections
            }).then(res => {
                if(res.data.done) {
                    this.examDone = true;
                    localStorage.removeItem('timer');
                    this.getUserPreviousExams();
                    this.refreshExamsList();
                    this.$store.dispatch('writemessage', 'You sent your answers successfully...')
                } else {
                    this.examDone = false;
                }
            })
        },
        startExamHandler() {
            if(!localStorage.getItem('timer')) {
                localStorage.setItem('timer',new Date(new Date().getTime()+this.examTime*60000));
            }
            this.setTimer();
            this.startExam = true;
        },
        
        setTimer() {
            console.log(new Date(localStorage.getItem('timer')).getTime()- new Date().getTime());
            setTimeout(() => {
                localStorage.removeItem('timer');
                this.sendAnswers();
                clearInterval(counter);

            }, new Date(localStorage.getItem('timer')).getTime()- new Date().getTime() )
            
            const counter = setInterval(() => {
                const time = Math.ceil(new Date(localStorage.getItem('timer')).getTime()- new Date().getTime());
                let minutes = Math.floor(time / 60000);
                minutes = minutes < 1?0: parseFloat(minutes).toFixed(0);
                let seconds = Math.floor((time%60000)/1000).toFixed(0);
                if(seconds < 10) seconds = '0'+seconds;
                this.timer = `${minutes}:${seconds}`;
                if(minutes < 1 && seconds < 60) {
                    this.timerAlert = !this.timerAlert;
                }
            }, 1000);
        },
    }
}
</script>

<style lang="scss" scoped>
    .exam {
        .timer {
            width: 120px;
            border-radius: 30px;
            padding: 4px 12px;
            margin-top: 3px;
            color: #fff;
            position:fixed;
            left:72%;
            right:0;
            text-shadow: 2px 2px 4px #666;
            border: solid 1px rgba(21, 70, 28, 0.733);
            box-shadow: #555;
        }
        .timerAlert {
            background-image: radial-gradient(rgb(151, 14, 14), rgb(212, 64, 64), rgb(221, 80, 80));
            font-size: 39;
        }
        .timerRegular {
            background-image: radial-gradient(rgb(5, 95, 95), rgb(13, 105, 133), rgb(49, 158, 185));
            font-size: 32;
        }
    }
    
    .startQuiz {
        text-align: center;
        button {
            width: 200px;
            height: 200px;
            border-radius: 100px;
            margin-top: 20%;
            font-size: 22px;
            box-shadow:3px 2px 4px #555;
        }
    }
</style>