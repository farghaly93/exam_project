<template>
  <div>
    <div class="search">
      <input @input="search" class="form-control" type="text" placeholder="search"/>
      <i class="fa fa-search"/>
    </div>
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      class="elevation-1"
    >
      <template v-slot:item.controls="row">
          <div class="controls">
            <button @click="()=>remove(row.item._id)" type="button" class="btn btn-outline-danger btn-xs">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
            <button @click="()=>toggleRole(row.item._id)" type="button" class="btn btn-outline-danger btn-xs">
                <i class="fa fa-user" aria-hidden="true"></i>
            </button>
            <button @click="()=>confirmUser(row.item._id)" type="button" class="btn btn-outline-danger btn-xs">
                <i class="fa fa-check" aria-hidden="true"></i>
            </button>
          </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    mounted() {
        axios.get('/getUsers').then(res => {
            const users = res.data.users;
            const userData = users.map((user) => {
                return {
                    _id: user._id,
                    studentName: user.fullname,
                    email: user.email,
                    role: user.role===0?'User': 'Admin',
                    phone: user.phone,
                    address: user.address,
                    stage: user.stage,
                    confirmed: user.confirmed==1?'Confirmed': 'Not confirmed'  
                }
            });
            this.users = userData;
            this.filteredUsers = userData;
        })
    },
    data () {
      return {
        users: [],
        filteredUsers: [],
        headers: [
          {
            text: 'Student name',
            align: 'start',
            sortable: false,
            value: 'studentName',
          },
          { text: 'Email',
            align: 'start',
            sortable: false, value: 'email' },
          { text: 'Role',
            align: 'start',
            sortable: false, value: 'role' },
          { text: 'Phone',
            align: 'start',
            sortable: false, value: 'phone' },
          { text: 'Address',
            align: 'start',
            sortable: false, value: 'address' },
          { text: 'Stage',
            align: 'start',
            sortable: false, value: 'stage' },
          { text: 'Confirmed',
            align: 'start',
            sortable: false, value: 'confirmed' },
          { text: 'Controls',
            align: 'start',
            sortable: false, value: 'controls' },
        ],
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
                const users = res.data.users;
                const userData = users.map((user) => {
                return {
                    _id: user._id,
                    studentName: user.fullname,
                    email: user.email,
                    role: user.role===0?'User': 'Admin',
                    phone: user.phone,
                    address: user.address,
                    stage: user.stage,
                    confirmed: user.confirmed==1?'Confirmed': 'Not confirmed'  
                }
            });
                this.filteredUsers = userData;
                //this.filterRoles(this.show);

            });
        },
        confirmUser(id) {
            axios.get('/confirmUser/'+id).then(res => {
                const users = res.data.users;
                const userData = users.map((user) => {
                return {
                    _id: user._id,
                    studentName: user.fullname,
                    email: user.email,
                    role: user.role===0?'User': 'Admin',
                    phone: user.phone,
                    address: user.address,
                    stage: user.stage,
                    confirmed: user.confirmed==1?'Confirmed': 'Not confirmed'  
                }
            });
                this.filteredUsers = userData;

            });
        },
        search(event) {
           const filteredUsers = this.users.filter(user => 
               user.studentName.includes(event.target.value) ||
               user.phone.includes(event.target.value) ||
               user.address.includes(event.target.value) ||
               user.email.includes(event.target.value) 
               );
            this.filteredUsers = filteredUsers;
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
        .search {
          margin: 15px;
          position: relative;
          display:flex;
          flex-direction:row;
          justify-content:right;
          align-items:center;
          width:40%;
          i {
            position: absolute;
            right: 2%;
          }
        }
        .controls {
            display: flex;
            flex-direction: row;
            justify-items: center;
            align-content: center;
            button {
                          margin:2px;

            }
        }
</style>