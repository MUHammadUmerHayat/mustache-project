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
    $scope.template = '{{#searsRecapData}} {{#recommendations}} <md-card ><img style="max-width:100%;"src="{{imageURL}}" alt="{{name}}"><md-card-content><h2 class="md-title">{{name}}</h2></md-card-content></md-card>{{/recommendations}}{{/searsRecapData}}';
    $scope.createdTabs = [];
    $scope.selectedProduct;
    $scope.selectedTheme;
    $scope.selectedMode;
    $scope.initialState = false;
    $scope.currentIndex = 0;
    $scope.themes = ['twilight', 'ambiance', 'chaos', 'clouds', 'mono_industrial', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'terminal', 'vibrant_ink', 'xcode'];
    $scope.modes = ['javascript', 'jsp', 'coffee', 'xml', 'clojure', 'coldfusion', 'csharp', 'curly', 'haskell', 'haxe', 'julia', 'latex', 'lisp ','markdown', 'mask', 'pascal', 'perl', 'php', 'xquery', 'yaml', 'jxs', 'json'];
      var templateEditor = ace.edit("template-editor");
    var editor = ace.edit("data-editor");
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
    $scope.loadThemes = function(data){
      editor.setTheme("ace/theme/" + $scope.selectedTheme);
      templateEditor.setTheme("ace/theme/" + $scope.selectedTheme);
    };

    $scope.loadModes = function(){
      editor.session.setMode("ace/mode/" + $scope.selectedMode);
      templateEditor.session.setMode("ace/mode/" + $scope.selectedMode);
    };
    var openNewTab = function() {
      var containsData = _.findWhere($scope.createdTabs, function(data) {
        return data.newTab.id === $scope.selectedProduct.id;
      });
      if (containsData === undefined) {
        $scope.createdTabs.push({
          "newTab": $scope.selectedProduct
        });
      }
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
          $scope.data = data;
          $scope.output = Mustache.render($scope.template, $scope.data);
          $scope.initialState = true;
          templateEditor.setValue($scope.template);
          editor.getSession().setValue(JSON.stringify($scope.data));
          $timeout(function() {
            $scope.currentIndex = $scope.selectedProduct.id - 1;
          });
        });
      }
    });

    
    templateEditor.setTheme("ace/theme/kuroir");
    templateEditor.getSession().setTabSize(2);
    templateEditor.getSession().setUseWrapMode(true);
    templateEditor.session.setMode("ace/mode/markdown");
 
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/markdown");
    editor.getSession().setTabSize(2);
    editor.getSession().setUseWrapMode(true);
    

    templateEditor.getSession().on("change", function() {
      var edittdTemplate = templateEditor.getSession().getValue();
      var editedData = editor.getSession().getValue();
      previewUpdate(edittdTemplate, editedData);
    });

    editor.getSession().on("change", function() {
      var edittdTemplate = templateEditor.getSession().getValue();
      var editedData = editor.getSession().getValue();
      previewUpdate(edittdTemplate, editedData);
    });

    var previewUpdate = function(template, data) {
      var newData, newTemplate;
      if(data && template){
        if(data.trim()) {
         newData = JSON.parse(data);
        newTemplate = template;
      }
      else{
        newData = $scope.data;
        newTemplate = $scope.template;
      }
      $scope.output = Mustache.render(newTemplate, newData);
        var previewFrame = document.getElementById('preview');
        var datPreview = previewFrame.contentDocument || previewFrame.contentWindow.document;
        datPreview.open();
        datPreview.write($scope.output);
        datPreview.close();
        $timeout(function(){})
      }
    }
    $timeout(function(){
      previewUpdate(), 300});


  }]);
