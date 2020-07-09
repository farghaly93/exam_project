<template>
<body style="margin-top:30px" class="">
      <div class=" panel panel-header panel-header-lg">
          <div class="small">
            <line-chart v-if="ready"  :width="300" :height="160" :chart-data="datacollection"></line-chart>
          </div>
      </div>
      <!--<div class="row tools">
        <div class="card text-white bg-info mb-3 col" style="">
          <div class="card-header">Categories</div>
          <div class="card-body">
            <h5 class="card-title">Control categories</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.cats}}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-white bg-primary mb-3 col" style="">
          <div class="card-header">Videos</div>
          <div class="card-body">
            <h5 class="card-title">Control videos</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.items}}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-white bg-secondary  mb-3 col " style="">
          <div class="card-header">Users</div>
          <div class="card-body">
            <h5 class="card-title">Control users</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.users}}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-white bg-danger mb-3 col" style="">
          <div class="card-header">Ads</div>
          <div class="card-body">
            <h5 class="card-title">Control ads</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.ads}}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row tools">
        <div class="card text-white bg-dark  mb-3 col" style="">
          <div class="card-header">Chat room</div>
          <div class="card-body">
            <h5 class="card-title">Chat with users</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.chats}}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="card text-white bg-success  mb-3 col" style="">
          <div class="card-header">Carts</div>
          <div class="card-body">
            <h5 class="card-title">Control carts</h5>
            <div class=" desc row">
              <div class="col-md-6">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="col-md-6">
                <strong>{{dashData.carts}}</strong>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <v-container :fluid="true" class="grey lighten-5">
      <v-row
        class='mb-6'
        no-gutters
      >
        <v-col
          v-for="item in items"
          :key="item.title"
          :md="4"
          :sm="12"
          style="padding: 5px;"
        >
          
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


        </v-col>
      </v-row>
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
            title: 'Categories',
            num: 0
          },
          {
            color: '#952175',
            icon: 'mdi-view-list',
            title: 'Items',
            num: 0
          },
          {
            color: '#384d8a',
            icon: 'mdi-layers',
            title: 'Ads', 
            num: 0
          },
          {
            color: '#35e06e',
            icon: 'mdi-account-multiple',
            title: 'Users',
            num: 0
          },
          {
            color: '#4e564d',
            icon: 'mdi-wechat',
            title: 'Chats',
            num: 0
          },
          {
            color: '#c0cc4d',
            icon: 'mdi-cart',
            title: 'Carts',
            num: 0
          },
    ],
       
      }
    },
    async mounted () {
      const visits = await axios.get('/getVisits');
      const data = await axios.get('/getDashboardData');
      this.items[0].num = data.data.cats;
      this.items[1].num = data.data.items;
      this.items[2].num = data.data.ads;
      this.items[3].num = data.data.users;
      this.items[4].num = data.data.chats;
      this.items[5].num = data.data.carts;
      console.log(visits)
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

