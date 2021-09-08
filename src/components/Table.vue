<template>
  <div class="table-wrapper">    
    <div 
      v-if="stat === ''"
      class="table-header"
    >
        <div class="table-menu">
          <h3 class="table-menu__title">Filter Mode</h3>
          <h3 
            @click="onToggleFilterMode(false)" 
            :class="{'filter-one': filterOneSelected}"
            class="filter-option one"
          >
            One
          </h3>
          <h3 
            @click="onToggleFilterMode(true)" 
            :class="{'filter-many': filterTwoSelected}"
            class="filter-option many"
          >
            Many
          </h3>
        </div>
      </div>  
    <div class="table">
      <div class="row__fields">
        <div
          class="row fields"  
          v-for="(value, field, index) in objectArray[0]" 
          :key="index"
        >
          <p
            @click="onSort(field)"
          >
            {{ field }}
          </p>
        </div>
      </div>
      <div
        class="row__values"
        v-for="object, index in objectArray"
        :key="index"
      > 
        <div
          class="row"
          v-for="(value, field, index) in object"
          :key="index"
        >
          <p 
            @click="onClickCell(field, value, index)"
            :class="[{'filtered-column': fieldsToFilter[index][1]}, {'sorted-column': fieldsToSort[index][1]}]"
            class="row-cell"
          >{{value}}</p>
        </div>            
      </div>  
    </div>
  </div>
</template>

<script>
export default {
  props: ['teamId', 'stat', 'componentKey'],
  data() {
    return {
      objectArray: {},

      selected: [],
      manyFiltered: false,
      tableIsFiltered: false,
      fieldIsSelected: false,
      filterOneSelected: false,
      filterTwoSelected: false,
      direction: false,
      statsId: '',
      query: '',
      selectedFieldToSort: '',
      selectedValueToSort: '',
    }
  },
  computed: {
    fieldsToFilter() {
      return []
    },
    fieldsToSort() {
      return []
    }
  },
  methods: {
    async getData() {  
      await fetch('http://localhost:4000/get-data', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.teamId,
        })
      })
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.objectArray = data
        this.makeArray()
      });
    },
    makeArray() {
      let object = this.objectArray[0];
      this.fieldsToFilter.splice(0, this.fieldsToFilter.length)
      this.fieldsToSort.splice(0, this.fieldsToSort.length)
      for (const key in object) {
        this.fieldsToFilter.push([`${key}`, false]);
        this.fieldsToSort.push([`${key}`, false])
      }
    },
    async getStats() {   
      await fetch('http://localhost:4000/get-stats', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stat: this.stat,
        })
      })
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.objectArray = data
        this.makeArray()
      });
    },
    resetSelected() {
      this.selected = []
    },
    clearFieldClasses() {
      this.fieldsToFilter.map(field => field[1] = false);
      this.fieldsToSort.map(field => field[1] = false);
    },
    toggleFilterOptions(filterOption) {
      this.manyFiltered = filterOption;
    },
    toggleFilterOptionClasses(filterOption) {
      filterOption ? 
      (this.filterOneSelected = false, this.filterTwoSelected = true) : 
      (this.filterOneSelected = true, this.filterTwoSelected = false);
    },
    setTableToFiltered() {
      this.tableIsFiltered = true;
    },
    setTableToUnfiltered() {
      this.tableIsFiltered = false;
    },
    pushSelected(selectedField, selectedValue) {
      if (!this.manyFiltered) {
       this.selected = []; 
      }
      this.selected.push({field: selectedField, value: selectedValue});
    },
    onToggleFilterMode(filterOption) {
      this.toggleFilterOptions(filterOption);
      this.toggleFilterOptionClasses(filterOption);
      this.setTableToUnfiltered();
      this.resetSelected();
      this.clearFieldClasses();
      this.getData();
    },
    async onClickCell(selectedField, selectedValue) {
      this.setTableToFiltered();
      this.toggleFilteredColumnClass(selectedField);
      this.pushSelected(selectedField, selectedValue);
      await this.filter();
      this.setValuesForSortFilteredResults();
    },
    setValuesForSortFilteredResults(selectedField, selectedValue) {
      this.selectedValueToSort = selectedValue;
      this.selectedFieldToSort = selectedField;
    },
    async filter() {
      await fetch('http://localhost:4000/filter', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selected: this.selected,
          id: this.teamId,
        })
      })
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.objectArray = data;
        console.log(this.fieldsToFilter)
      });
    },
    onSort(selectedField) {
      this.toggleArrangementOrder();
      this.toggleSortedColumnClass(selectedField);
      this.sendFieldsToSort(selectedField);
    },
    toggleArrangementOrder() {
      this.direction = !this.direction
    },
    sendFieldsToSort(selectedField) {
      if (this.tableIsFiltered) {
        this.sortFilteredResults(selectedField);
      } else {
        this.sortByField(selectedField);
      }
    },
    async sortByField(selectedField) {
      await fetch('http://localhost:4000/sort', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          field: selectedField,
          selected: this.selected,
          direction: this.direction,
          id: this.teamId
        })
      })
      .then(results => {
      return results.json()
      })
      .then(data => {
      this.objectArray = data
      })
    },
    async sortFilteredResults(selectedField) {
      await fetch('http://localhost:4000/sort-filtered', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          direction: this.direction,
          id: this.teamId,
          selected: this.selected,
          fieldToOrderBy: selectedField,
        })
      })
      .then(results => {
        return results.json()
      })
      .then(data => {
        this.objectArray = data
      });
    },
    toggleFilteredColumnClass(selectedField) {
      if (this.manyFiltered) {
      this.fieldsToFilter.map(field => {
        if (field[0] === selectedField) {
          field[1] = true
        }
      }) 
      } else {
        this.fieldsToFilter.map(field => field[0] === selectedField ? field[1] = true : field[1] = false);
      }
      const filteredField = this.fieldsToFilter.filter(field => field[1] === true);
      this.fieldsToSort.map(field => {
        if (field[1] !== filteredField[1]) {
          field[1] = false
        } 
      });
    },
    toggleSortedColumnClass(selectedField) {
      this.fieldsToSort.map(field => field[0] === selectedField ? field[1] = true : field[1] = false);
    },
  },
  created() {
    this.stat === '' ?
    this.getData():
    this.getStats()
  }
}
</script>

<style>
.table-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table-header {
  display: flex;
  flex-direction: row;
  border-top: 10px solid white;
  border-bottom: 5px solid white;
}

.table-menu {
  display: flex;
  flex-direction: row;
  background: var(--second-bg-color)
}

.table-menu__title {
  cursor: default;
  min-width:80%;
}

.filter-option {
  background: #EB6E80;
  cursor: pointer;
  min-width: 50%;
  border-left: 3px solid white;
}

.filter-option:hover {
  background: var(--main-bg-hover);
  color: white;
}

.table {
  display: table;
  margin: auto;
  font-weight: bold
} 

.row__fields {
  display: table-row;
  font-weight: bold;
  background: var(--second-bg-color);
}

.row__values {
  display: table-row;
  border-top: none;
  background: #0090953a;
}

.row {
  display: table-cell;
  min-width: 50px;
  border: 1px solid white;
}

.row-value {
  padding: 0 5px;
}

.row:hover {
  background: var(--main-bg-hover);
  color: white;
  cursor: pointer;
}

.field__name:hover {
  border-top-left-radius: 8px;
  cursor: pointer;
} 

.filter-one {
  background: var(--main-bg-hover);
  color: white;
}

.filter-many {
  background: var(--main-bg-hover);
  color: white;
}

.filtered-column {
  background: var(--main-bg-hover);
  color: white;
  font-weight: bold;
}

.sorted-column {
  background: var(--second-bg-hover);
  color: white;
  font-weight: bold;
}
</style>


    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/user-event": "^13.2.1",
    "@testing-library/vue": "^6.4.2",
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/compiler-sfc": "^3.0.0",
    "babel-eslint": "^10.1.0",
    "babel-jest": "^26.6.3",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^7.0.0",
    "jest": "^26.6.3",
    "vue-jest": "^5.0.0-alpha.10"