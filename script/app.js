var app = angular.module('app', ['ngRoute', 'ngAnimate'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'main.html',
    controller: 'mainCtrl'
  })
  .when('/about', {
    templateUrl: 'about.html'
  })
  .when('/songs', {
    templateUrl: 'songs.html',
    controller: 'songsCtrl'
  })
  .when('/contact', {
    templateUrl: 'contact.html'
  })
  .when('/venues', {
    templateUrl: 'venues.html',
    controller: 'venuesCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.hashPrefix('');
})

.controller('mainCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('json/services.json').then(function(response) {
   $scope.services = response.data;
  });
  $http.get('json/testimonials.json').then(function(response) {
   $scope.testimonials = response.data;
  });
  $http.get('json/venues.json').then(function(response) {
   $scope.venues = response.data.venues;
  });
  $http.get('json/staff.json').then(function(response) {
    $scope.staff = response.data;
  });

  // Display Services
  $scope.serviceIndex = -1;
  $scope.setServiceIndex = function(index) {
   $scope.serviceIndex = index;
  };
  $scope.isServiceIndex = function(index) {
   return $scope.serviceIndex === index;
  };
  $scope.nextServiceIndex = function() {
   $scope.serviceIndex = ($scope.serviceIndex < $scope.services.length - 1) ? ++$scope.serviceIndex : 0;
  };
  $scope.prevServiceIndex = function() {
   $scope.serviceIndex = ($scope.serviceIndex > 0) ? --$scope.serviceIndex : $scope.services.length - 1;
  };

  // Contact form
  $scope.formStep = 1;
  $scope.formNext = function() {
    $scope.formStep++;
  }
  $scope.formPrev = function() {
    $scope.formStep--;
  }
}])

.controller('songsCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('json/songs.json').then(function(response) {
    $scope.songs = response.data;
  });
  $scope.sortBy = "artist";
  $scope.filterBy = "";
  $scope.sortReverse = false;
  $scope.sorting = function(category) {
    if (category === $scope.sortBy) {
      $scope.sortReverse = !$scope.sortReverse;
    } else {
      $scope.sortBy = category;
      $scope.sortReverse = false;
    }
    return "sortBy = category; sortReverse";
  };
  $scope.customOrder = function(key) {
    return function(song) {
      switch (key) {
        case "artist":
          var s = song.artist.split(" ");
          break;
        case "title":
          var s = song.title.split(" ");
          break;
      };
      if (s[0] === "The" || s[0] === "A" || s[0] === "An") {
        s.splice(0, 1);
      }
      s = s.join(" ");
      return s;
    };
  };
}])

.controller('venuesCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('json/venues.json').then(function(response) {
   $scope.venues = response.data.venues;
   $scope.days = response.data.days;
  });
  $scope.changeDay = function(d) {
    $scope.day = d;
  };
  $scope.date = new Date();
}])

.filter('unique', function () {
  return function (items, filterOn) {
    if (filterOn === false) {
      return items;
    }
    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [];
      var extractValueToCompare = function (item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };
      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;
        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }
      });
      items = newItems;
    }
    return items;
  };
})

.filter('phoneUS', function () {
    return function(num) {
      num += '';
      return '(' + num.slice(0, 3) + ') ' + num.slice(3, 6) + '-' + num.slice(6);
    }
  });
