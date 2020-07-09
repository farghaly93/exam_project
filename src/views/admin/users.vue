<template>
    <div class="container">
  <div class="nav">
    <div class="row btns">
      <button @click="show='all'" :class="show==='all'?'active':''" class="col-md-4">All users</button>
      <button @click="show='users'" :class="show==='users'?'active':''" class="col-md-4">Users</button>
      <button @click="show='admins'" :class="show==='admins'?'active':''" class="col-md-4">Admins</button>
    </div>
  </div>
   <div class="card shopping-cart">
            <!-- <div class="card-header bg-dark text-light row">
                <div class="col-md-9">
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                    Users
                </div>
                <div class="col-md-3 clearfix">
                    <input @input="search" class="form-control" type="text" placeholder="Search for user"/>
                </div>
            </div>
            <div class="card-body">
                    <div :key="user.fullname" v-for="user in filteredUsers" class="row">
                        <div class="col-12 col-sm-12 col-md-2 text-center">
                            <p>{{user.fullname}}</p>
                            <h4>
                                <strong>{{user.role===1?'admin':'user'}}</strong>
                            </h4>
                        </div>
                        <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                            <h4 class="product-name"><strong>{{user.email}}</strong></h4>
                        </div>
                        <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                            <div class="col-3 col-sm-3 col-md-4 text-md-right" style="padding-top: 5px">
                                <h6><strong>{{user.phone}} <span class="text-muted"></span></strong></h6>
                            </div>
                            <div class="col-4 col-sm-4 col-md-6">
                              <strong>{{user.address}}EP</strong>
                            </div>
                            <div class="col-2 col-sm-2 col-md-2 text-right">
                                <button @click="()=>remove(user._id)" type="button" class="btn btn-outline-danger btn-xs">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </button>
                                <button @click="()=>toggleRole(user._id)" type="button" class="btn btn-outline-danger btn-xs">
                                    <i class="fa fa-user" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                    </div>
        </div> -->
        <div class="container">
  <h2>Users</h2>
  <p>The .table-striped class adds zebra-stripes to a table:</p>            
  <table class="tablee table-striped">
    <thead>
      <tr>
        <th>Full name</th>
        <th>Role</th>
        <th>Email</th>
        <th>phone</th>
        <th>Address</th>
        <th>Control</th>
      </tr>
    </thead>
    <tbody>
      <tr :key="user.fullname" v-for="user in filteredUsers">
        <td>{{user.fullname}}</td>
        <td><strong>{{user.role===1?'admin':'user'}}</strong></td>
        <td>{{user.email}}</td>
        <td>{{user.phone}}</td>
        <td>{{user.address}}</td>
        <td>
            <button @click="()=>remove(user._id)" type="button" class="btn btn-outline-danger btn-xs">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
            <button @click="()=>toggleRole(user._id)" type="button" class="btn btn-outline-danger btn-xs">
                <i class="fa fa-user" aria-hidden="true"></i>
            </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
             <!-- <b-table striped hover :items="items"></b-table> -->

    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    mounted() {
        axios.get('/getUsers').then(res => {
            this.users = res.data.users;
            this.filteredUsers = res.data.users;
        })
    },
    data() {
        return {
            users: [],
            filteredUsers: [],
            show: 'all',
            items: [
                { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                { age: 38, first_name: 'Jami', last_name: 'Carney' }
            ]
        }
    },
    methods: {
        remove(id) {
            axios.get('/deleteUser/'+id).then(res => {
                this.filteredUsers = res.data.users;
            });
        },
        toggleRole(id) {
            axios.get('/toggleUserRole/'+id).then(res => {
                this.users = res.data.users;
                this.filterRoles(this.show);

            });
        },
        search(event) {
           this.filteredUsers = this.users.filter(user => 
               user.fullname.includes(event.target.value) ||
               user.phone.includes(event.target.value) ||
               user.address.includes(event.target.value) ||
               user.email.includes(event.target.value) 
               );
        },
        filterRoles(val) {
            const role = val==='admins'?1:val==='users'?0:2;
            if(role===2) {
                this.filteredUsers = this.users;
                return;
            }
            this.filteredUsers = this.users.filter(user => user.role === role);
        }
    },
    watch: {
        show(val) {
            this.filterRoles(val);
            }
        }
}
</script>

<style lang="scss" scoped>
    @import '../../scss/table.scss';
    .tablee {
        overflow: auto;
        width: 100%;
        max-width: 100%;
        thead {
            background-color:grey;
            color: #fff;
            tr {
                th {
                    padding: 10px 2px;
                }
            }
        }
    }
</style>