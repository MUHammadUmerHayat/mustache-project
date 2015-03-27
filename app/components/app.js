angular.module('app', [
    "ui.router",
    "ngMaterial",
    'app.process'
  ])
  .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
  }])
  .controller('AppController', ['$scope', '$timeout', function($scope, $timeout) {
    
  }]);
