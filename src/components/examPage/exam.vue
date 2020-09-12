<template>
    <section class="exam">
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
</template>

<script>
export default {
    props: ['exam', 'solutionModel', 'submitAnswers', 'timer', 'timerAlert']
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
</style>