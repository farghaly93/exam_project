<template>
<body style="margin-top:30px" class="">
      <div class=" panel panel-header panel-header-lg">
          <div class="small">
            <line-chart v-if="ready"  :width="300" :height="160" :chart-data="datacollection"></line-chart>
          </div>
      </div>
      <v-container :fluid="true" class="grey lighten-5">
      <div class="row">
        <div class="col-md-4"  v-for="(item, i) in items" :key="i" style="padding: 5px;">
            <v-card
              :color="item.color"
              dark
              height="200px"
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="item.title"
                  ></v-card-title>
  
                  <v-card-title class="headline" v-text="item.num"></v-card-title>
                </div>
                  <v-icon 
                  class="ma-3"
                  size="80"
                  tile
                  >
                  {{item.icon}}
                  </v-icon>
                </div>
            </v-card>


        </div>
      </div>
    </v-container>
  </body>
</template>
<script>
  import LineChart from '../../components/admin/chart.js'
  import axios from 'axios'
  export default {
    components: {
      LineChart
    },
    data () {
      return {
        datacollection:  {
          dashData: {},
          labels: ['Jan','Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Visits',
              backgroundColor: '#ccc',
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
          ]
        },
        ready: false,
        items: [
          {
            color: '#1F7087',
            icon: 'mdi-image-filter-none',
            title: 'Exams',
            num: 0
          },
          {
            color: '#952175',
            icon: 'mdi-view-list',
            title: 'Users',
            num: 0
          },
          {
            color: '#384d8a',
            icon: 'mdi-layers',
            title: 'un Corrected exams', 
            num: 0
          },
          {
            color: '#35e06e',
            icon: 'mdi-account-multiple',
            title: 'corrected exams',
            num: 0
          },
    ],
       
      }
    },
    async mounted () {
      const visits = await axios.get('/getVisits');
      const data = await axios.get('/getDashboardData');
      console.log(data.data);
      this.items[0].num = data.data.exams;
      this.items[1].num = data.data.users;
      this.items[2].num = data.data.uncorrected;
      this.items[3].num = data.data.corrected;
      this.ready = true;
      const visitors = visits.data.visits;
      visitors.map(v => {
        this.datacollection.datasets[0].data[+v.month-1] = v.visitors;
      });
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../scss/dashboard.scss';
  .small {
    max-width: 800px;
    margin: 0px auto;
  }
  .panel {
    height: 520px;
  }
  .tools {
    margin-top: 20px;
    margin-left: 0px;
    .card {
      margin: 5px;
      padding: 0px;
      .desc {
        font-size: 50px;
      }
    }
  }
</style>

