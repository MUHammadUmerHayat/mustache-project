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
  var template = '{{#searsRecapData}} {{#recommendations}} <md-card><img src="{{imageURL}}" alt="{{name}}"><md-card-content><h2 class="md-title">{{name}}</h2></md-card-content></md-card>{{/recommendations}}{{/searsRecapData}}';
  
  $scope.selectedProduct;
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
  $scope.openNewTab = function() {
    console.log('afaas');
  };

  $scope.$watch('selectedProduct', function(val) {
    if (val) {
      console.log($scope.selectedProduct);
      $.getJSON('../json/mustache.json', function(data) {
        console.log(data);

        var output = Mustache.render(template, data);
        console.log(output);
        $('#output').html(output);
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
     templateEditor.setValue("<html><p>the new text here </html>");

  var editor = ace.edit("data-editor");
     editor.setTheme("ace/theme/solarizedlight");
     editor.getSession().setMode("ace/mode/javascript");
     editor.getSession().setTabSize(2);
     editor.getSession().setUseWrapMode(true);

     templateEditor.getSession().on("change", function() {
      $timeout(previewUpdate, 300);
   });
     
   var previewUpdate = function() {
     var previewFrame = document.getElementById('preview');
     var datPreview = previewFrame.contentDocument || previewFrame.contentWindow.document;
     datPreview.open();
     datPreview.write(templateEditor.getValue());
     datPreview.close();
   }
   $timeout(previewUpdate, 300);

}]);
