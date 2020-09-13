import axios from 'axios';

  const state = {
    categories: [],
    filteredItems: [],
    chars: {},
    category: '',
    filters: {},
    itemsNum: 0,
    pageData: {
      currentPage: 0,
      itemsPerPage: 2
    },
    order: '',
    itemsLoading: false,
    showModal: false,
    showConfirmModal: false,
    wishlist: [],
    wishlistItems: [],
    wishloading: false,
    ads: [],
    checked: 0,
    confirmed: 0,
    shiped: 0,
    delievered: 0,
    drawer: true,
    drawer2: true,
    tags: [],
    adminData: {}
  };



  const mutations = {
    fetchCats(state, categories) {
      state.categories = categories;
    },
    fetchFilters(state, filters) {
      state.chars = filters;
      delete state.chars['_id'];
    },
    filterItems(state, data) {
      state.filteredItems = data.filtered;
      state.itemsNum = data.count;
    },
    changePage(state, pageData) {
      state.pageData = pageData;
    },
    orderItemsby(state, order) {
      state.order = order;
    },
    search(state, results) {
      state.filteredItems = results;
    },
    closeModal(state) {
      state.showModal = false;
      console.log('hhhh')
    },
    openModal(state) {
      state.showModal = true;
    },
    closeConfirmModal(state) {
      state.showModal = false;
    },
    openConfirmModal(state) {
      state.showConfirmModal = true;
    },
    getwishlist(state, data) {
      state.wishlist = data.wishlist;
      state.checked = data.checked;
      state.confirmed = data.confirmed;
      state.shiped = data.shiped;
      state.delievered = data.delievered;
    },
    getmostvisited(state, data) {
      state.mostvisited = data.mostvisited;
    },
    getwishlistItems(state, items) {
      state.wishlistItems = items;
    },
    getads(state, data) {
      state.ads = data.ads;
    },
    getTags(state, data) {
      state.tags = data.tags
    },
    putAdminData(state, data) {
      state.adminData = data;
    }
  };



  const actions = {
    toggleDrawer() {
      state.drawer = !state.drawer;
    },
    putAdminData({commit}, adminData) {
      commit('putAdminData', adminData);
    },
    loadCats({commit}) {
      axios.get('/fetchCats').then(res => {
        const categories = res.data.cats;
        console.log(categories);
        commit('fetchCats', categories);
      });
    },
    loadFilters({commit}, cat) {
      axios.get('/fetchChars/'+cat).then(res => {
        const filtersChars = res.data.chars;
        delete filtersChars['image'];
        delete filtersChars['__v'];
        commit('fetchFilters', filtersChars, cat);
      });
    },


    filterItems({state, commit}, data) {
      if(data.mode && (data.mode==='orderBy' || data.mode==='pageChange')) {
        state.pageData.currentPage = 0;
      }
      if(data.category) state.category = data.category;
      if(data.filters && data.filters.length > 0) {
        state.filters[data.char] = data.filters
      } else {
           delete state.filters[data.char];
    }
    state.itemsLoading = true;
    axios.post('/filterItems', {
        filters: state.filters,
        category: state.category,
        pageData: state.pageData,
        order: state.order?state.order: 'newest'
      }).then(res => {
          state.itemsLoading = false;
          const filtered = [...res.data.filtered];
                console.log(filtered);
          const count = res.data.count;
          commit('filterItems', {filtered, count});
      });
    },

    pageChange({dispatch, commit}, pageData) {
      commit('changePage', pageData.pageData);
      dispatch('filterItems', {category: pageData.category});
    },
    orderBy({dispatch, commit}, order) {
      commit('orderItemsby', order);
      dispatch('filterItems', {mode: 'orderBy'});
    },
    search({dispatch, commit}, searchQuery) {
      setTimeout(() => {
        state.itemsLoading = true;
        if(!searchQuery) {
          state.itemsLoading = false;
          dispatch('filterItems', {});
          return;
        }
        axios.get('search/'+searchQuery).then(res => {
          state.itemsLoading = false;
          const results = res.data.results;
          commit('search', results);
        });
      }, 500);
    },
    closeModal({commit}) {
      console.log('lololoclose')
      commit('closeModal');
    },

    openModal({commit}) {
      commit('openModal');
    },

    addtowishlist({rootState, commit, dispatch}, data) {
      if(!rootState.usersStore.token) {
        state.showModal = true;
        return;
      }
      axios.post('/addtowishlist', {itemId: data.itemId, name: data.name,price: data.price, userId: rootState.usersStore.userId}).then(res => {
        if(res.data.event) {
          rootState.usersStore.message = res.data.event ;
          dispatch('getwishlist');
        }
      })
    },

    getwishlist({rootState, commit, dispatch}) {
      state.wishloading = true;
      axios.post('/getwishlist', {userId: rootState.usersStore.userId}).then(res => {
        if(res.data.wishlist) {
          console.log('wishlist', res.data.wishlist);
          commit('getwishlist', {
            wishlist: res.data.wishlist,
            checked: res.data.checked, 
            confirmed: res.data.confirmed, 
            shiped: res.data.shiped, 
            delievered: res.data.delievered
          });
          dispatch('getwishlistItems');
          state.wishloading = false;
        }
      })
    },
    
    getwishlistItems({rootState, commit}) {
      const items = [];
      state.wishloading = true;
      state.wishlist.forEach(item => {
        axios.get('/getitem/'+item.itemId).then(res => {
          const itemOBJ = res.data.item;
          itemOBJ['quantity'] = item.quantity;
          items.push(itemOBJ);
        });
      }),
      state.wishloading = false;
      console.log('items', items);
      commit('getwishlistItems', items);
    },

    writemessage({rootState, commit}, message) {
      console.log(message)
      rootState.usersStore.message = message;
    },

    getmostvisited({commit}, cat) {
      axios.get('/getmostvisited/'+cat).then(res => {
        commit('getmostvisited', {mostvisited: res.data.mostvisited});
      })
    },
    getads({commit}) {
      axios.get('/getads').then(res => {
        console.log( res.data.ads);

        commit('getads', {ads: res.data.ads});
      })
    },
    toggleDrawer({rootState, commit}) {
      rootState.itemsStore.drawer = !rootState.itemsStore.drawer;
    },
    toggleDrawer2({rootState, commit}) {
      rootState.itemsStore.drawer2 = !rootState.itemsStore.drawer2;
    },
    getTags({rootState, commit}) {
      axios.get('/getTags').then(res => {
        console.log(res.data)
        commit('getTags', {tags: res.data.tags});
      })
    }  
  };



  const getters = {
    cats(state) {
      return state.categories;
    },
    filteredItems(state) {
      return state.filteredItems;
    },
    chars(state) {
      delete state.chars['category'];
      return state.chars;
    },
    category(state) {
      return state.category;
    },
    allItemsNum(state) {
      return state.itemsNum;
    },
    currentPage(state) {
      return state.pageData.currentPage;
    },
    itemsPerPage(state) {
      return state.pageData.itemsPerPage;
    },
    itemsToFilters(state) {
      return state.itemsToFilters;
    },
    itemsLoading(state) {
      return state.itemsLoading;
    },
    showModal(state) {
      return state.showModal;
    },
    showConfirmModal(state) {
      return state.showConfirmModal;
    },
    wishlist(state) {
      return state.wishlist;
    },
    mostvisited(state) {
      return state.mostvisited;
    },
    wishlistItems(state) {
      return state.wishlistItems;
    },
    wishloading() {
      return state.wishloading;
    },
    ads() {
      return state.ads;
    },
    checked() {
      return state.checked;
    },
    confirmed() {
      return state.confirmed;
    },
    shiped() {
      return state.shiped;
    },
    delievered() {
      return state.delievered;
    },
    drawer() {
      return state.drawer;
    },
    drawer2() {
      return state.drawer2;
    },
    tags() {
      return state.tags;
    },
    adminData() {
      return state.adminData;
    }
  }



  export default {
    state,
    mutations,
    actions,
    getters
  }
