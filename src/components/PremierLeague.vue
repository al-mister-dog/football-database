<template>
  <div>
    <div v-if="teamSelected">
      <div class="team-standings__wrapper">
        <div class="team-standings t-s__title" >
          <h4>{{teamName}}</h4>
        </div>
        <div class="team-standings">
          <div
            v-for="el in teamStandingsLabels"
            :key="el.name"
            class="team-standing t-s__label"
          >
            {{el}}
          </div>
        </div>
        <div class="team-standings">
          <div 
            v-for="el in teamStandings"
            :key="el.name"
            class="team-standing t-s__position"
          >
            {{el}}
          </div>
        </div>
      </div>
    </div>
    <div class="league-table">
      <div class="league-fields">
        <div 
          v-for="(value, field, index) in leagueTable[0]" 
          :key="index"
        >
          <h4
            :class="{'selected-field': fieldsToSort[index][1]}" 
            @click="onSort(field)"
          >
            {{ field }}
          </h4>
        </div>
      </div>
      <div
        class="league-values"
        v-for="object, index in leagueTable"
        :key="index"
        :class="[{'champions-league-color': object['#'] <= 4}, {'europa-league-color': object['#'] === 5}]"
      > 
        <div
          v-for="value, index in object"
          :key="index"
        >
          <h4 
            @click="onClickTeam(object.team)">
            {{value}}
          </h4>
        </div>            
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamId: null,
      ordinal: '',
      ordinals: {
        1: 'st',
        2: 'nd',
        3: 'rd',
        default: 'th'
      },
      teamSelected: false,
      direction: true,
      tableToParse: [],
      sportApiMapping: { 
        12400: 'Manchester City',
        2523: 'Manchester United',
        12295: 'Tottenham Hotspur',
        12424: 'Leicester City',
        2524: 'Chelsea',
        12401: 'West Ham United',
        2509: 'Liverpool',
        2516: 'Everton',
        2522: 'Arsenal',
        2520: 'Aston Villa',
        2546: 'Leeds United',
        2515: 'Crystal Palace',
        850: 'Wolverhampton Wanderers',
        12423: 'Southampton',
        2513: 'Burnley',
        2518: 'Brighton',
        849: 'Newcastle',
        12294: 'Fulham',
        2544: 'West Brom',
        2512: 'Sheffield Utd'
      },
      tableToParseLeagueTableMap:  {
        "#": 'position',
        team: 'team',
        PL: 'games_played',
        W: 'won',
        D: 'draw',
        L: 'lost',
        GF: 'goals_scored',
        GA: 'goals_against',
        GD: 'goals_diff',
        Pts: 'points',
      },
      teamName: '',
      teamStandings: [],
      teamStandingsLabels:  {
        W: 'W',
        D: 'D',
        L: 'L',
        GF: 'GF',
        GA: 'GA',
        GD: 'GD',
        Pts: 'Pts',
      },
    }
  },
  computed: {
    leagueTable() {
      return this.tableToParse.map(standing => {
        return {
          // id: this.sportApiMapping,
          "#": standing.position,
          team: this.sportApiMapping[standing.team_id],
          PL: standing.overall.games_played,
          W: standing.overall.won,
          D: standing.overall.draw,
          L: standing.overall.lost,
          GF: standing.overall.goals_scored,
          GA: standing.overall.goals_against,
          GD: standing.overall.goals_diff,
          Pts: standing.overall.points,
        };
      })
    },
    fieldsToSort() {
      return []
    },
  },
  methods: {
    async getLeagueStandings() {
      await fetch('https://app.sportdataapi.com/api/v1/soccer/standings?apikey=d00a2ae0-8e3d-11eb-8599-9f4e5a4df681&season_id=352')
      .then(results => {
        return results.json()
      })
      .then(data => {
      this.tableToParse = data.data.standings;
      });
      this.flattenTableToParse()
      this.makeClassesArray()
    },
    flattenTableToParse() {
      this.tableToParse.map(object => {
        object.overall.points = object.points
      })
      console.log(this.tableToParse)
    },
    makeClassesArray() {
      for (const key in this.tableToParseLeagueTableMap) {
        this.fieldsToSort.push([`${key}`, false])
      }
    },
    onSort(field) {
      this.toggleDirection(field);
      this.sendFieldToSort(field);
      this.toggleSortedColumnClass(field);
    },
    toggleDirection() {
      this.direction = !this.direction
    },
    sendFieldToSort(field) {
      if (this.direction === true) {
        this.sortAsc(field)
      }
      else {
        this.sortDesc(field)
      }
    },
    sortAsc(field) {
      let val = this.tableToParseLeagueTableMap[field]
      this.tableToParse.sort((a, b) => b.overall[val] > a.overall[val] ? -1 : 1)
    },
    sortDesc(field) {
      let val = this.tableToParseLeagueTableMap[field]
      this.tableToParse.sort((a, b) => b.overall[val] < a.overall[val] ? -1 : 1)
    },
    toggleSortedColumnClass(selectedField) {
      this.fieldsToSort.map(field => field[0] === selectedField ? field[1] = true : field[1] = false);
    },
    onClickTeam(team) {
      this.getTeamPositions(team)
      this.getTeamName(team)
    },
    getTeamPositions(team) {
      this.teamId = this.findTeamId(team)
      this.teamStandings = this.getStandingsArray()
      this.teamSelected = true;
    },
    findTeamId(team) {
      for (const value in this.sportApiMapping) {
        if (this.sportApiMapping[value] === team) {
          return value
        }
      }
    },
    getStandingsArray() {
      let teamStandings = []
      for (const value of Object.values(this.tableToParseLeagueTableMap)) {
        let table = [...this.tableToParse]
        table.sort((a, b) => b.overall[value] > a.overall[value] ? 1 : -1)
        let teamPosition = table.findIndex(x => x.team_id == this.teamId) + 1
        teamStandings.push(`${teamPosition}${this.ordinals[teamPosition] || this.ordinals.default}`)
      }
      teamStandings.splice(0,3);
      return teamStandings
    },
    getTeamName(team) {
      this.teamName = team;
    }
  },
  created() {
    this.getLeagueStandings()
  }
}
</script>

<style scoped>
.league-table {
  margin: auto;
  width: 50%;
} 

.league-fields {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  background: var(--second-bg-color);
  border: 1px solid white;
  cursor: pointer;
}

.league-values {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border: 1px solid white;
  border-top: none;
  background: #0090953a;
}

.champions-league-color {
  background: #008F95;
  color: white;
}

.europa-league-color {
  background: #0090957e;
  color: white;
}

.selected-field {
  background: var(--second-bg-hover);
  color: white;
}

  /* --main-bg-color: #E24E42;
  --second-bg-color: #E9B000;
  --third-bg-color: #d1a7a7;
  --main-bg-hover: #008F95;
  --second-bg-hover: #EB6E80;
  --third-bg-hover: #502c35; */
.team-standings__wrapper {
  display: flex;
  flex-direction: column;
  width: 26.8%;
  margin: auto;
}
.team-standings {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}

.t-s__title {
  background: var(--main-bg-color);
  color: white;
  border-bottom: 1px solid white;
  font-size: 1.2rem;
}

.t-s__label {
  background: var(--second-bg-color);
}

.t-s__position {
  background: var(--main-bg-hover);
  color: white;
}
.team-standing {
  min-width: 50px;
  border: 3px solid white;
  border-top: none;
  border-bottom: 1px solid white;
  text-align: center;
}

h4 {
  cursor: pointer;
}

.league-values:hover {
  background: var(--second-bg-hover);
  color: white;
}
</style>