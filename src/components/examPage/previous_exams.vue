<template>
    <div class="examResults">
        <div class="header">
            <h3>({{examResult.number}})امتحان رقم </h3>

            <h4 v-if="examResult.stage==='one'"> المرحلة <strong> الأولى </strong></h4>
            <h4 v-if="examResult.stage==='two'"> المرحلة <strong> الثانية </strong></h4>
            <h4 v-if="examResult.stage==='three'"> المرحلة <strong> الثالثة </strong></h4>

            <h4><Strong>({{examResult.year+'/'+(examResult.year+1)}})</strong> العام الدراسي</h4>
            <h2 style="color:rgb(196, 26, 26);font-weight:bolder;">({{mark}} / {{fullMark}})</h2>
            <h2 v-if="!examResult.done" style="color:#60845b">(ما زال الأمتحان قيد التصحيح)</h2>
        </div>

        <div v-for="(section, s) in examResult.sections" :key="s" class="section">
            <h4 v-if="section.type.split('data').length==1" class="sectionType">{{section.type}}:</h4>
            <img v-if="section.type.split('data').length>1" :src="section.type"/>
            <div v-for="(question, q) in section.questions" :key="q" class="questions" :class="section.questions[q].correction?'wrong':''">
                <div class="examResultsQuestionAndDegree">
                    <div v-if="question.question.split('data').length==1"><strong>{{q+1}}-</strong><h5> {{question.question}}?</h5></div>
                    <strong>{{q+1}}-</strong><img v-if="question.question.split('data').length>1" :src="question.question"/>
                    <!--  -->
                    <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;">
                        <i v-if="examResult.done" :style="[question.degree < question.fullDegree?{'color':'red'}:{'color':'green'}]" style="font-size:25px;" :class="question.degree < question.fullDegree?'fa fa-times times': 'fa fa-check check'" aria-hidden="true"></i>
                        <h4>({{question.degree}}/{{question.fullDegree}})</h4>
                    </div>
                </div>
                <div class="underQuestion">
                    <p class="answer"><strong>Answer:</strong> {{question.answer}}</p>
                    <p v-if="question.correction!==''" class="correction"><strong>Correction:</strong> {{question.correction}}<p/>
                </div>
            </div>
        </div>
      </div>
</template>


<script>
export default {
    props: ['examResult'],
    computed: {
            fullMark() {
            let mark = 0;
            this.examResult.sections.forEach(sec => {
                sec.questions.forEach(ques => {
                    mark = mark + ques.fullDegree; 
                })
            })
            return mark;
            },
            mark() {
                let mark = 0;
                this.examResult.sections.forEach(sec => {
                    sec.questions.forEach(ques => {
                        mark = mark + +ques.degree; 
                    })
                })
                return mark;
            },
    }
}
</script>


<style lang="scss" scoped>
    .examResults {
        background-color:rgba(161, 180, 183, 0.07);
        border: solid 1px #999;
        padding: 30px 2px;
        border-radius: 17px;
        .header {
            text-align:center;
            margin-bottom:30px;
            color:rgb(43, 64, 114);
            text-shadow: 2px 2px 2px rgba(68, 68, 68, 0.212);
            font-weight: bolder;
            h3 {
                font-sizE: 33px;
            }
        }
        .section {
            padding: 10px;
            .sectionType {
                margin:20px;
                // text-decoration:underline;
                color:#555
            }
            .questions {
                margin-left: 20px;
                padding: 20px;
                .examResultsQuestionAndDegree {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    h5 {
                        flex: 8;
                        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
                    }
                    h4 {
                        flex: 1;
                        font-weight: bolder;
                        color:rgb(196, 26, 26);
                    }
                    i {
                        margin: 13px;
                        .check {
                            color: green;
                        }
                        .times {
                            color: red;
                        }
                    }
                }
                .underQuestion {
                    margin-left:20px;
                    font-weight:bold;
                    .answer {
                        color:rgb(75, 116, 167);
                        strong {
                            color:rgb(35, 55, 92)
                        }
                    }
                    .correction {
                        color: rgb(184, 75, 100);
                        strong {
                            color:rgb(196, 26, 26);
                        }
                    }
                }
            }
            .wrong {
                border: solid 1px red;
                border-radius: 30px;
                background-color:#db161621
            }
        }
    }
    
</style>













