<template>
  <div>
    <div class="nav-bar__wrapper sub-nav">
      <ul 
        v-for="stat in statsArray"
        :key="stat.stat"
        class="list-items">
        <li class="list-item" @click="onSelectStat(stat.stat)">
          {{stat.label}}
        </li>
      </ul>
    </div>  
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamData: null,
      descriptor: null,
      statsArray: [
      {stat: 'teamAge', label: 'Team Age'},
      {stat: 'averageAge', label: 'Average Age'},
      {stat: 'combinedMarketValue', label: 'Combined Market Value'},
      {stat: 'homeGrownPlayers', label: 'Home Grown Players'},
      {stat: 'mostDefenders', label: 'Most Defenders'},
      {stat: 'mostForwards', label: 'Most Forwards'}
      ]
    }
  },
  methods: {
    onSelectStat(stat) {
      this.$emit('select-stats', stat)
    },
  }
}
</script>