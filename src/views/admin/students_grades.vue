<template>
    <div>
        <select style="background-color:rgb(222, 212, 212);font-weight:bolder;" @change="getByStage" class="form-control" v-model="stage">
            <option value="one">الصف الأول الثانوي</option>
            <option value="two">الصف لثاني الثانوي</option>
            <option value="three">الصف الثالث الثانوي</option>
        </select>
        <br>
      <h3 style="font-weight:bolder;color:#fff;background-color:#537175" class="text-center">ترتيب الطلبة</h3>
      <div style="margin-right:20px;" class="results">
        <ul class="list-unstyled components">
          <li v-for="(grade, g) in gradess" :key="g" style="background-color:#5555;padding:5px 20px;">
              <div class="res">
                <div class="infoo">
                    <span  class="badge badge-pill badge-success ml-2">{{g+1}}</span>
                  <div class="username">{{grade.username}}</div>
                  <div class="progress">
                    <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50"
                    aria-valuemin="0" aria-valuemax="100" :style="'width:'+Math.floor((grade.mark/+(grade.fullMark>0?grade.fullMark:1))*100)+'%'">
                      <div style="color:#fff;font-weight:bolder">{{Math.floor((grade.mark/+(grade.fullMark>0?grade.fullMark:1))*100)}}%</div>
                    </div>
                  </div>
                  <strong class="degree" style="color:rgb(59, 62, 106)">({{grade.mark+ '/' + (grade.fullMark>0?grade.fullMark:'0')}})</strong>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    created() {
        this.getByStage();
    },
    data() {
      return {
        users: [],
        grades: [],
        gradess: [],
        stage: 'two'
      }
    },
    computed: {
      drawer2() {
        return this.$store.getters.drawer2;
      },
      userId() {
        return localStorage.getItem('userId');
      }
    },
    methods: {
        getByStage() {
            this.gradess = [];
            this.grades = [];
            axios.get('/getUsersExam/'+this.stage).then(res => {
                this.users = res.data.users;
                console.log(this.users);
                [...this.users].forEach(user => {
                axios.get('/getCorrectedStudentExams/'+user._id).then(res => {
                    const userMarks = {username: user.fullname, userId: user._id, mark: 0, fullMark: 0}
                    res.data.exams.forEach(exam => {
                    exam.sections.forEach(section => {
                        section.questions.forEach(question => {
                        userMarks.mark += +question.degree || 0;
                        userMarks.fullMark += +question.fullDegree || 0;
                        })
                    })
                    });
                    console.log(userMarks);
                    this.grades.push(userMarks);
                });
                });
            });
        }
    },
    watch: {
      grades(val) {
        this.gradess = [...val].sort((a, b) => {
          console.log(a.mark, b.mark)
          return (a.mark < b.mark)?1: -1;
        });
      }
    }
}
</script>

<style scoped lang="scss">
  .drawer {
    margin-top:65px;
    z-index:1;
    background-color:#6e7a7cbf;
    padding-right: 10px;
    padding-left: 0px;
    
    .results {
      height: 72%;
      overflow-y: auto;
      overflow-x: hidden;
      ::-webkit-scrollbar {
        display: none;
      }
      ul {
        .you {
          background-color: #0a708c59;
        }
        li {
          width: 100%;
          border-radius: 10px;
          padding: 1px;
          padding-right: 10px;
          margin-top: 13px;
          .res {
            display: flex;
            flex-direction: row;
            align-items: center;
            .rank {
              flex: 1;
              font-size: 22px;
            }
          }
        }
      }
    }
  }
  
            .infoo {
              width: 100%;
              overflow: hidden;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin: 10px;
              .rank {
                  flex: 4;
              }
              .username {
                  flex: 4;
                  font-weight: bolder;
                  color: #000;
              }
              .progress {
                  flex:8;
                .progress-bar {
                  color: #444;
                }
              }
              .degree {
                  flex: 4
              }
              div {
                color: #fff;
                font-size: 15px;
              }
            }
</style>