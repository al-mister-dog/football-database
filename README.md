This football database allows you to query data very simply. Imagine you wanted to know the highest paid brazilian defender for Arsenal. On the table, click Arsenal, which leaves only Arsenal players. Then click Brazil, which whittles the list down further. Then defender, and sort by value.

You can get interactive league stats, for example where are Tottenham placed in the league in terms of goals conceded?

This database is compatible with sql and mongodb nodejs stacks, which I have also designed to compare differences in flexibility and optimization. I am working towards making a completely stateless server and table-generator-client in order to make complex data queries simple and intuitive.

The stats page makes use of more complex data queries on the back end, using aggregation, nested query statements and multiple joins. If you are an SQL or mongoDb user, the server side code dealing with these queries might be of interest, if you want to see how ORM and ODM queries compare. MySql/Node server.

Both front-end and back-end are fully tested using jest and vue test-library.
# footy-vue-github

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
