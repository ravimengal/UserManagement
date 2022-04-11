// Common filters
var app= angular.module("app.filters", [])

//Number or null
app.filter('numberOrNull', function($filter) {
  return function(input) {
    return input == null ? '0.00' : $filter('number')(input, 2);
  };
});

//Number or blank
app.filter('numberOrBlank', function($filter,$rootScope) {
  return function(input) {
    return input == null  ? '  ' : $rootScope.currencyValue+' '+$filter('number')(input, 2) ;
  };
});

//Number or NAN
app.filter('numberOrNaN', function($filter) {
  return function(input) {
    return input == null || NaN ? 0 : parseFloat(input);
  };
});

//data or null
app.filter('dataOrBlank', function($filter) {
  return function(input) {
    return input == null ? '' : input;
  };
});

// if empty default value
app.filter('ifEmpty', function() {
    return function(input, defaultValue) {
        if (angular.isUndefined(input) || input === null || input === '') {
            return defaultValue;
        }

        return input;
    }
});


