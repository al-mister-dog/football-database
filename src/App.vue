<template>
<div class="body">
  <MainNav
    @set-selected-sub-nav="setSelectedSubNav"
    @select-players="onSelectPlayers"
  />

    <component
    :is="selectedSubNav"
    @set-selected-component="setSelectedComponent"
    @select-league="onSelectLeague"
    @select-team="onSelectTeam"
    @select-stats="onSelectStats"
    :teams="teams"
  ></component>

  <component
    :key="componentKey"
    :componentKey="componentKey"
    :is="selectedComponent"
    :teamId="teamId"
    :stat="stat"
  >
  </component>

</div>
</template>

<script>
import MainNav from './components/navs/MainNav';
import LeaguesToTeamsNav from './components/navs/LeaguesToTeamsNav';
import LeagueTablesNav from './components/navs/LeagueTablesNav';
import TeamsNav from './components/navs/TeamsNav';
import StatsNav from './components/navs/StatsNav'
import Table from './components/Table';
import PremierLeague from './components/PremierLeague';

export default {
  name: 'App',
  components: {
    MainNav,
    LeaguesToTeamsNav,
    TeamsNav,
    LeagueTablesNav,
    StatsNav,
    Table,
    PremierLeague,
  },
  data() {
    return {
      selectedSubNav: '',
      teamId: '',
      stat: '',
      teams: '',
      selectedComponent: 'table',
      componentKey: 0,
    }
  },
  methods: {
    setSelectedSubNav(selectedSubNav) {
      this.selectedSubNav = selectedSubNav;
    },
    setSelectedComponent(selectedComponent) {
      this.selectedComponent = selectedComponent
    },
    onSelectLeague(teams) {
      this.teams = teams;
      this.selectedSubNav = 'teams-nav';
    },
    onSelectTeam(id) {
      this.teamId = id;
      this.stat = '';
      this.selectedComponent = 'table'
      this.componentKey ++
    },
    onSelectPlayers() {
      this.selectedSubNav = ''
      this.teamId = ''
      this.stat = ''
      this.selectedComponent = 'table'
      this.componentKey ++
    },
    onSelectStats(id) {
      this.stat = id
      this.selectedComponent = 'table'
      this.componentKey ++
    }
  }
}
</script>