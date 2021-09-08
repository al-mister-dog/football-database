<template>
  <div>
    <div class="nav-bar__wrapper sub-nav">
      <ul class="list-items">
        <li class="list-item" @click="onSelectLeague('premier-league')">
          Premier League
        </li>
        <li class="list-item" @click="onSelectLeague('la-liga')">
          La Liga
        </li>
      </ul>
    </div>  
  </div>
</template>

<script>
export default {
  methods: {
    onSelectLeague(league) {
      this.$emit('set-selected-component', league)
    }
  }
}
</script>