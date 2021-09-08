<template>
  <div>
    <div class="nav-bar__wrapper sub-nav">
        <ul class="list-items">
          <li class="list-item" @click="onSelectLeague(1)">Premier League</li>
          <li class="list-item" @click="onSelectLeague(2)">Ligue 1</li>
          <li class="list-item" @click="onSelectLeague(3)">La Liga</li>
          <li class="list-item" @click="onSelectLeague(4)">Bundesliga</li>
          <li class="list-item" @click="onSelectLeague(5)">Serie A</li>
        </ul>
    </div>  
  </div>
</template>

<script>
export default {
  data() {
    return {
      teams: '',
      leagues: '',
      leaguesSelected: false
    }
  },
  methods: {
    async onSelectLeague(selectedLeagueId) {
      await this.selectLeague(selectedLeagueId);
      this.sendTeamData();
    },
    async selectLeague(selectedLeagueId) {
        await fetch(`http://localhost:4000/get-teams/${selectedLeagueId}`)
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.teams = data;
      });
    },
    sendTeamData() {
      this.$emit('select-league', this.teams)
    }
  }
}
</script>

