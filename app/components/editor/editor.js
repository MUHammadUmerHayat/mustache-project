angular.module('app.process', [
    "ui.router"
  ])
  .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home', {
      url: '/home',
      templateUrl: 'components/editor/editor.html',
      controller: 'HomeController'
    });

  }])
  .controller('HomeController', ['$scope', '$timeout', '$rootScope', '$state', function($scope, $timeout, $log, $rootScope, $state) {
    $scope.template = '{{#searsRecapData}} {{#recommendations}} <md-card><img src="{{imageURL}}" alt="{{name}}"><md-card-content><h2 class="md-title">{{name}}</h2></md-card-content></md-card>{{/recommendations}}{{/searsRecapData}}';
    $scope.createdTabs = [];
    $scope.selectedProduct;
    $scope.initialState = false;
    $scope.currentIndex = 0;
    $scope.loadProducts = function() {
      $scope.products = [];
      return $timeout(function() {
        $scope.products = [
         { id: 1, name: 'First Product' },
         { id: 2, name: 'Second Product' },
         { id: 3, name: 'Third Product' },
         { id: 4, name: 'Fourth Product' }
        ];

      }, 1000);
    };
    var openNewTab = function() {
      $scope.createdTabs.push({
        "newTab": $scope.selectedProduct
      });
    };
    $scope.getIndex = function(index) {
      $scope.currentIndex = index;
    };

    $scope.removeTab = function(index) {
      $scope.createdTabs.splice(index, 1);
    };

    $scope.$watch('selectedProduct', function(val) {
      if (val) {
        openNewTab();
        $.getJSON('../json/mustache.json', function(data) {
          $scope.jsonData = JSON.stringify(data, 2);
          $scope.data = data;
          $scope.output = Mustache.render($scope.template, $scope.data);
          $('#output').html($scope.output);
          $scope.initialState = true;
          templateEditor.setValue($scope.template);
          var v = templateEditor.getValue($scope.template);
          previewUpdate(v);
          // $scope.currentIndex = $scope.currentIndex + 1;
          $timeout(function() {

          });
        });
      }
    });

    var templateEditor = ace.edit("template-editor");
    templateEditor.setTheme("ace/theme/kuroir");
    templateEditor.getSession().setTabSize(2);
    templateEditor.getSession().setUseWrapMode(true);
    templateEditor.session.setMode("ace/mode/markdown");
    // templateEditor.setValue($scope.jsonData);

    var editor = ace.edit("data-editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseWrapMode(true);
    // editor.getSession().setValue($scope.jsonData);

    templateEditor.getSession().on("change", function() {
      var a = templateEditor.getSession().getValue();
      var b = editor.getSession().getValue();
      previewUpdate(a);
    });

    editor.getSession().on("change", function() {
      var a = templateEditor.getSession().getValue();
      var b = editor.getSession().getValue();
      previewUpdate(a);
    });

    var previewUpdate = function(template, data) {
      $scope.output = Mustache.render(template, $scope.data);
      var previewFrame = document.getElementById('preview');
      var datPreview = previewFrame.contentDocument || previewFrame.contentWindow.document;
      datPreview.open();
      datPreview.write($scope.output);
      datPreview.close();
    }
    $timeout(previewUpdate, 300);

  }]);
