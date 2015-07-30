'use strict';

var app = angular.module('v2')

.config(function config( $stateProvider ) {
  $stateProvider
    .state('result', {
      url: '/result/:resultId',
      views: {
        'main@': {
            controller: 'ResultCtrl',
            templateUrl: 'app/result/result.html'
         }
      }
    })
})

app.controller('ResultCtrl', function ($scope, $log, Executions, Results, $q, $timeout, $stateParams) {

  $scope.id = $stateParams.resultId

  $scope.uniqueColumnCombination = {
    count: 0,
    data: [],
    query: {
      order: '',
      limit: 15,
      page: 1
    },
    selected: [],
    params: {
      type: 'Unique Column Combination',
      sort: 'Column Combination',
      from: '0',
      to: '15'
    }
  }

  $scope.functionalDependency = {
    count: 0,
    data: [],
    query: {
      order: '',
      limit: 15,
      page: 1
    },
    selected: [],
    params: {
      type: 'Functional Dependency',
      sort: 'Determinant',
      from: '0',
      to: '15'
    }
  }

  $scope.basicStatistic = {
    count: 0,
    data: [],
    query: {
      order: '',
      limit: 15,
      page: 1
    },
    selected: [],
    params: {
      type: 'Basic Statistic',
      sort: 'Statistic Name',
      from: '0',
      to: '15'
    }
  }

  $scope.inclusionDependency = {
    count: 0,
    data: [],
    query: {
      order: '',
      limit: 15,
      page: 1
    },
    selected: [],
    params: {
      type: 'Inclusion Dependency',
      sort: 'Dependant',
      from: '0',
      to: '15'
    }
  }

  $scope.onpagechange = onpagechange

  loadColumnCombination()
  loadFunctionalDependency()
  loadBasicStatistic()
  loadInclusionDependency()

  function loadColumnCombination() {
    Results.get($scope.uniqueColumnCombination.params, function(res) {
       var rows = []
       res.forEach(function(result) {
         var combinations = []
         result.result.columnCombination.columnIdentifiers.forEach(function(combination) {
           combinations.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
         })
         rows.push({
           columnCombination: '[' + combinations.join(',') + ']',
           columnRatio: result.columnRatio,
           occurrenceRatio: result.occurrenceRatio,
           uniquenessRatio: result.uniquenessRatio,
           randomness: result.randomness
         })
       })
       $scope.uniqueColumnCombination.data = rows
      $scope.uniqueColumnCombination.count = rows.length
     })
  }

  function loadFunctionalDependency() {
    Results.get($scope.functionalDependency.params, function(res) {
      var rows = []
      res.forEach(function(result) {
        var determinant = []
        result.result.determinant.columnIdentifiers.forEach(function(combination) {
          determinant.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
        })
        var extendedDependant = []
        result.extendedDependant.columnIdentifiers.forEach(function(combination) {
          extendedDependant.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
        })
        rows.push({
          determinant: '[' + determinant.join(',') + ']',
          dependant: result.dependant.tableIdentifier + '.' + result.dependant.columnIdentifier,
          extendedDependant: '[' + extendedDependant.join(',') + ']',
          determinantColumnRatio: result.determinantColumnRatio,
          dependantColumnRatio: result.dependantColumnRatio,
          determinantOccurrenceRatio: result.determinantOccurrenceRatio,
          dependantOccurrenceRatio: result.dependantOccurrenceRatio,
          generalCoverage: result.generalCoverage,
          determinantUniquenessRatio: result.determinantUniquenessRatio,
          dependantUniquenessRatio: result.dependantUniquenessRatio,
          pollution: result.pollution,
          pollutionColumn: result.pollutionColumn,
          informationGainCell: result.informationGainCell,
          informationGainByte: result.informationGainByte
        })
      })
      $scope.functionalDependency.data = rows
      console.log(rows)
      $scope.functionalDependency.count = rows.length
    })
  }

  function loadBasicStatistic() {
    Results.get($scope.basicStatistic.params, function(res) {
      var rows = []
      res.forEach(function(result) {
        var combinations = []
        result.result.columnCombination.columnIdentifiers.forEach(function(combination) {
          combinations.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
        })
        rows.push({
          statisticName: result.statisticName,
          columnCombination: '[' + combinations.join(',') + ']',
          value: result.value,
          columnRatio: result.columnRatio,
          occurenceRatio: result.occurenceRatio,
          uniquenessRatio: result.uniquenessRatio
        })
      })
      $scope.basicStatistic.data = rows
      $scope.basicStatistic.count = rows.length
    })
  }


  function loadInclusionDependency() {
    Results.get($scope.inclusionDependency.params, function(res) {
      var rows = []
      res.forEach(function(result) {
        var combinations = []
        result.result.dependant.columnIdentifiers.forEach(function(combination) {
          combinations.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
        })
        var referenced = []
        result.result.referenced.columnIdentifiers.forEach(function(combination) {
          referenced.push(combination.tableIdentifier+'.'+combination.columnIdentifier)
        })
        rows.push({
          dependant: '[' + combinations.join(',') + ']',
          referenced: '[' + referenced.join(',') + ']',
          dependantColumnRatio: result.dependantColumnRatio,
          referencedColumnRatio: result.referencedColumnRatio,
          dependantOccurrenceRatio: result.dependantOccurrenceRatio,
          referencedOccurrenceRatio: result.referencedOccurrenceRatio,
          generalCoverage: result.generalCoverage,
          dependantUniquenessRatio: result.dependantUniquenessRatio,
          referencedUniquenessRatio: result.referencedUniquenessRatio
        })
      })
      $scope.inclusionDependency.data = rows
      $scope.inclusionDependency.count = rows.length
    })
  }

  function onpagechange(page, limit) {
    var deferred = $q.defer();

    $timeout(function () {
      deferred.resolve();
    }, 2000);

    return deferred.promise;
  }

})
