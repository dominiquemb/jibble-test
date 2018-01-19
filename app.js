var jibbleApp = angular.module('jibbleApp', []);

jibbleApp.config(function($logProvider) {
    $logProvider.debugEnabled(true);
});

jibbleApp.controller('jibbleTableController', ['$scope', '$http', function($scope, $http) {
    var prefix = 'https://jsonplaceholder.typicode.com';

    $scope.counter = 0;
    $scope.max = 30;
    $scope.ajaxCallsDone = 0;

    $scope.dataObject = {
          posts: [],
          albums: [],
          users: []
    };

    $scope.fetchData = function() {
        $http.get(prefix + '/posts')
        .then(function(resp) {
          $scope.dataObject['posts'] = resp.data;
          $scope.ajaxCallsDone++;
        });

        $http.get(prefix + '/users')
        .then(function(resp) {
          $scope.dataObject['users'] = resp.data;
          $scope.ajaxCallsDone++;
        });

        $http.get(prefix + '/albums')
        .then(function(resp) {
          $scope.dataObject['albums'] = resp.data;
          $scope.ajaxCallsDone++;
        });
    };

    $scope.random = function(max, min) {
      return Math.floor((Math.random() * (max - min + 1)) + min);
    };

}]);

jibbleApp.directive('jibbleTable', ['$timeout', function($timeout) {
    return {
        restrict: 'ACE',
        controller: 'jibbleTableController',
        link: function($scope, element, attrs) {
            $scope.dataToDisplay = [];
            $scope.entryList = [];
            $scope.jibbleTableLoaded = false;

            $scope.populateList = function() {
              var entry, firstLevelIndex, firstLevelLength, secondLevelIndex;

              for ($scope.counter; $scope.counter < $scope.max; $scope.counter++) {
                postIndex = $scope.random($scope.dataObject['posts'].length-1, 0);
                albumIndex = $scope.random($scope.dataObject['albums'].length-1, 0);
                userIndex = $scope.random($scope.dataObject['users'].length-1, 0);
                entry = {
                  post: $scope.dataObject['posts'][postIndex],
                  album: $scope.dataObject['albums'][albumIndex],
                  user: $scope.dataObject['users'][userIndex]
                };
                $scope.entryList.push(entry);
              }
      
              $timeout(function() {
                $scope.dataToDisplay = angular.copy($scope.entryList);
                $scope.jibbleTableLoaded = true;

                /* Reset these two so that we can refresh the data later */
                $scope.ajaxCallsDone = 0;
                $scope.counter = 0;
                $scope.entryList = [];
              }, 1);
            }

            $scope.checkIfDataFetched = function() {
              if ($scope.ajaxCallsDone == 3) {
              // this means the ajax calls have finished returning the data
                $scope.populateList();
              }
              else {
                setTimeout(function() {
                   $scope.checkIfDataFetched();
                }, 300);
              }
            }

            $scope.refreshData = function() {
                $scope.fetchData();
                $scope.checkIfDataFetched();
            }

            $scope.refreshData();

        }
    }
}]);
