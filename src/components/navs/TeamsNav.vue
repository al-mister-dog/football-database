<template>
  <div>
    <div class="nav-bar__wrapper sub-nav">
      <div class="team-list">
        <div
        
        v-for="team in teams"
        :key="team.id">
            <div
            class="team__label"
            @click="onClickTeamLogo(team.id)"
            >
              <p>
                <img class="team__logo" :src="team.imageUrl" alt="team.name">
              </p>
              <p>{{team.teamName}}</p>
            </div>
          </div>  
        </div>
    </div>  
  </div>
</template>

<script>
export default {
  props: ['teams'],
  data() {
    return {
      team: '',
      players: '',
      marketValue: 0,
      selectedTeamId: ''
    }
  },
  methods: {
    onClickTeamLogo(id) {
      this.getTeamDetails(id)
    },
    async getTeamDetails(id) {
      await this.getTeam(id);
      this.sendTeamDetails(id);
    },
    sendTeamDetails(id) {
      this.$emit('select-team', id)
    },
    async getTeam(id) {
      await fetch(`http://localhost:4000/get-team/${id}`)
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.team = data[0];
        this.selectedTeamId = this.team.id
      });
    },
  }
}
</script>

<style scoped>

.list-item {
  font-size: 1rem;
}

.team-list {
  display: flex;
  flex-direction: row;
  max-width: 100vw;
  overflow: auto;
  direction: ltr;
}

.team__label {
  width: 200px;
  height: 100px;
  border: 5px solid white;
  border-top: 10px solid white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: var(--main-bg-color);
  color: #2c3e50;
  font-weight: bold;
  transition: all 0.5s ease;
}

.team__label:hover {
  background: var(--main-bg-hover);
  color: white;
  opacity: 1;
}

.team__logo {
  height: 50px;
  width: 50px;
}
</style>