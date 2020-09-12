<template>
<div class="page-footer">
 <v-footer
      app
      dark
      padless
      fixed
    >
      <v-card
        flat
        tile
        width="100%"
        color="#566673de"
        class="lighten-1 white--text text-center"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>
  
        <v-divider></v-divider>
  
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>Farghaly-developes</strong>
        </v-card-text>
      </v-card>
    </v-footer>
</div>
</template>

<style lang="scss" scoped>
	.page-footer {
    z-index: 1;
    margin-top: 170px;
    background-color: #ccc;
	}
</style>

<script>
export default {
    data: () => ({
    icons: [
      'mdi-facebook',
      'mdi-twitter',
      'mdi-linkedin',
      'mdi-instagram',
    ],
  }),
}
</script>