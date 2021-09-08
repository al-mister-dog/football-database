<template>
  <div>
    <div class="nav-bar__wrapper">
      <div 
        @click="onSelectPlayers()"
        class="nav-bar__logo"
      >
        <h1 class="logo">Footy Base</h1>
      </div>
      <div>
        <ul class="list-items">
          <li 
            @click="onSelectPlayers()"
            class="main"
          >Players</li>
          <li 
            @click="setSelectedSubNav('leagues-to-teams-nav')"
            class="main"
          >Teams</li>
          <li 
            @click="setSelectedSubNav('league-tables-nav')"
            class="main"
          >Leagues</li>
          <li
            @click="setSelectedSubNav('stats-nav')"
            class="main"
          >Stats</li>
        </ul>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  methods: {
    onSelectPlayers() {
      this.$emit('select-players')
    },
    setSelectedSubNav(selectedNav) {
      this.$emit('set-selected-sub-nav', selectedNav)
    }
  }
}
</script>

<style>
.nav-bar__logo {
  margin-top: 5px;
  padding: 0 1.5rem;
  cursor: pointer;
}

.main {
  font-size: 1.2rem;
  color:#2c3e50;
  display: block;
  float: left;
  padding: 1rem 3rem;
  position: relative;
  text-decoration: none;
  font-weight: bold;
  background: var(--main-bg-color);
  font-size: 1rem;
  border-left: 5px solid white;

}

.main:hover {
  background: var(--main-bg-hover);
  color: white;
  cursor: pointer;
}
</style>