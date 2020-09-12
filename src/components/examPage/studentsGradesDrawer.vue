<template>
      <v-navigation-drawer
      class="drawer"
      v-if="!$route.path.includes('/نتنتنتن') && $route.path!=='/'"
        right
        v-model="drawer2"
        overlay-opacity=".5"
        app
        fixed
        width="230"
      >
      <h3 style="font-weight:bolder;color:#fff;background-color:#537175" class="text-center">ترتيب الطلبة</h3>
      <div class="results">
        <ul class="list-unstyled components">
          <li v-for="(grade, g) in gradess" :key="g"  :class="grade.userId === userId?'you':''">
              <div class="res">
                <div class="rank">
                      <span  class="badge badge-pill badge-success ml-2">{{g+1}}</span>
                </div>
                <div class="infoo">
                  <div >{{grade.username}}</div>
                  <div class="progress">
                    <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="50"
                    aria-valuemin="0" aria-valuemax="100" :style="'width:'+Math.floor((grade.mark/+(grade.fullMark>0?grade.fullMark:1))*100)+'%'">
                      <div style="color:#fff;font-weight:bolder">{{Math.floor((grade.mark/+(grade.fullMark>0?grade.fullMark:1))*100)}}%</div>
                    </div>
                  </div>
                  <strong style="color:#ff5">{{grade.mark+ '/' + (grade.fullMark>0?grade.fullMark:'0')}}</strong>
              </div>
            </div>
          </li>
        </ul>
      </div>

      </v-navigation-drawer>
</template>

<script>
import axios from 'axios';
export default {
    created() {
      axios.get('/getUsersExam/'+localStorage.getItem('stage')).then(res => {
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
    },
    data() {
      return {
        users: [],
        grades: [],
        gradess: [],
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
            .infoo {
              width: 80%;
              overflow: hidden;
              flex: 3;
              .progress {
                .progress-bar {
                  color: #444;
                }
              }
              div {
                color: #fff;
                font-size: 15px;
              }
            }
          }
        }
      }
    }
  }
</style>