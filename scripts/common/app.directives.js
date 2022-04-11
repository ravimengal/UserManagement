"use strict";
angular.module("app.directives", [])

.directive("imgHolder", [
  function() {
    return {
      restrict: "A",
      link: function(scope, ele, attrs) {
        return Holder.run({
          images: ele[0]
        });
      }
    };
  }
])

.directive("panelToggle", [
  function() {
    return {
      restrict: "A",
      link: function(scope, element) {
        element.click(function() {
           $(this).parent().parent().next().slideToggle("fast"), $(this).toggleClass("fa-chevron-down fa-chevron-up")
        });
      }
    };
  }
])

.directive("widgetClose", [
  function() {
    return {
      restrict: "A",
      link: function(scope, element) {
        element.click(function() {
          $(this).parent().parent().parent().fadeOut();
        });
      }
    };
  }
])

.directive("toggleProfile", [
  function() {
    return {
      restrict: 'A',
      template: '<a href="javascript:void(0)" ng-click="toggleProfile()"> <i class="fa fa-user"></i> </a>',
      controller: function($scope, $element) {
        $scope.toggleProfile = function() {
          $('#settings').slideToggle();
        };
      }
    };
  }
])
  
.directive("customPage", function() {
  return {
    restrict: "A",
    controller: [
      "$scope", "$element", "$location", function($scope, $element, $location) {
        var addBg, path;
        path = function() {
          return $location.path();
        };
        addBg = function(path) {
          $element.removeClass("body-wide body-lock");
          switch (path) {
             case "/404":
            case "/components/common/views/404":
            case "/components/common/views/500":
            case "/components/common/views/signin":
            //case "/components/common/views/change-password":
            case "/components/common/views/forgot-password":
		    case "/components/common/views/two-step-verification":
			//case "/components/common/views/organization-list":
              return $element.addClass("body-wide");
            case "/pages/lock-screen":
              return $element.addClass("body-wide body-lock");
          }
        };
        addBg($location.path());
        return $scope.$watch(path, function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }
          return addBg($location.path());
        });
      }
    ]
  };
})

.directive("rightSidebar", [
function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                if ($(this).hasClass('open')) {
                    $('.rsidebar').animate({
                        "right": "-250px"
                    }, 150);
                    $(this).removeClass('open').addClass('closed');
                } else {
                    $(".rsidebar").animate({
                        "right": "0px"
                    }, 150);
                    $(this).removeClass('closed').addClass('open');
                }
            });
         }
      }
   }
])

.directive("toggleSettings", [
function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.click(function() {
                if ($(this).hasClass('open')) {
                    $('#config').animate({
                        "right": "-300px"
                    }, 150);
                    $(this).removeClass('open').addClass('closed');
                } else {
                    $("#config").animate({
                        "right": "0px"
                    }, 150);
                    $(this).removeClass('closed').addClass('open');
                }
            });
        }
    }
  }
])

.directive("goBack", [
  function() {
    return {
      restrict: "A",
      controller: [
        "$scope", "$element", "$window", function($scope, $element, $window) {
          return $element.on("click", function() {
            return $window.history.back();
          });
        }
      ]
    };
  }
]);



// Another `$drag` usage example:
app.directive('uiRequired', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.required = function(modelValue, viewValue) {
          return !((viewValue && viewValue.length === 0 || false) && attrs.uiRequired === 'true');
        };

        attrs.$observe('uiRequired', function() {
          ctrl.$setValidity('required', !(attrs.uiRequired === 'true' && ctrl.$viewValue && ctrl.$viewValue.length === 0));
        });
      }
    };
  });
  
  
//Javascript execution
app.directive('script', function() {
     return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
                var code = elem.text();
                /*jslint evil: true */
                var f = new Function(code);
                f();
            }
        }
    }
});

//Email Validation
app.directive('validateEmail', function() {

 var EMAIL_REGEXP = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
 
  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});
 

//Email,mobile or custom name Validation
app.directive('validateEmailMobileCustomName', function() {

   var EMAIL_REGEXP = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
   var MOBILE_REGEXP =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
   var CUSTOMNAME_REGEXP = /^[s|S]{1}[0-9]+(-[a-zA-Z0-9]+)+/;

  return {
    require: 'ngModel',
   restrict: 'A',
    link: function(scope, elm, attrs, ctrl) {
      
	       ctrl.$validators.email = function(modelValue) {   	 
              var result=false;		   
		              if( (ctrl.$isEmpty(modelValue)  || EMAIL_REGEXP.test(modelValue))){
						  result=true
					  }else if((ctrl.$isEmpty(modelValue) || MOBILE_REGEXP.test(modelValue))){
						  result=true
						  
					  }else if((ctrl.$isEmpty(modelValue) || CUSTOMNAME_REGEXP.test(modelValue))){
						  result=true
						  
					  }
					//  console.log('validate custom '+CUSTOMNAME_REGEXP.test(modelValue))
                return result; 
            }
			
	     /*  ctrl.$validators.mobile = function(modelValue) {      
                return ctrl.$isEmpty(modelValue) || MOBILE_REGEXP.test(modelValue);       
            }
     
		  ctrl.$validators.customID = function(modelValue) {  				 
		     return ctrl.$isEmpty(modelValue)  ||CUSTOMNAME_REGEXP.test(modelValue);
		   }	 */
	 
    }
  };
});


// Reset password validation	
app.directive('nxEqual', function() {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqual) {
                console.error('nxEqual expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqual, function (value) {
                model.$setValidity('nxEqual', value === model.$viewValue);
            });
            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.nxEqual);
                model.$setValidity('nxEqual', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});
 




app.directive('uiTreeSelect', [
  'groupFactory',
  '$timeout',
  function (groupFactory, $timeout) {
    return {
      restrict: 'E',
      scope: { model: '=' },
      link: function (scope, el) {
        scope.breadcrumbs = [{"id":0,"title":"All"}];
        scope.groups = groupFactory.load(0);

        scope.loadChildGroupsOf = function(group, $select) {
          $select.search = '';
          
          scope.breadcrumbs.push(group);
          scope.groups = groupFactory.load(group.id);
          scope.$broadcast('uiSelectFocus');
        };

        scope.navigateBackTo = function (crumb, $select) {    
          $select.search = '';
          var index = _.findIndex(scope.breadcrumbs, {id: crumb.id});

          scope.breadcrumbs.splice(index + 1, scope.breadcrumbs.length);
          scope.groups = groupFactory.load(_.last(scope.breadcrumbs).id);
          $select.open = false;
          scope.$broadcast('uiSelectFocus');
        };
      },
      templateUrl: '/ui-tree-select.html'
    };
  }
]);

// Couldn't get on-focus to work, so wrote my own
app.directive('uiSelectFocuser', function ($timeout) {
  return {
    restrict: 'A',
    require: '^uiSelect',
    link: function (scope, elem, attrs, uiSelect) {
      scope.$on('uiSelectFocus', function () {
        $timeout(uiSelect.activate);
      });
    }
  };
});








//Format number in ng-model
app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue,2)
            });

            elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
            });
        }
    };
}]);

//Route loading indicator
app.directive('routeLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: "<div ng-show='isRouteLoading' class='loading-indicator'>" +
    "<div class='loading-indicator-body'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='spinner'><rotating-plane-spinner></rotating-plane-spinner></div>" +
    "</div>" +
    "</div>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isRouteLoading = false;
 
      $rootScope.$on('$routeChangeStart', function() {
        scope.isRouteLoading = true;
      });
      $rootScope.$on('$routeChangeSuccess', function() {
        scope.isRouteLoading = false;
      });
    }
  };
});

//UI grid dropdown 
 app.directive('myCustomDropdown', function() {
  return {
    template: '<select class="form-control" style="font-size:11px" ng-model="colFilter.term" ng-options="option.id as option.value for option in colFilter.options"  ng-change="grid.appScope.changedValue(colFilter.term)" ></select>'
  };
});

 
//disable button on second click
app.directive('disableDoubleClick', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind('click', function(){
                $timeout(function(){
                    elem.attr('disabled','disabled');
                }, 20);

                $timeout(function(){
                    elem.removeAttr('disabled');
                }, 500);
            });
        }
    };
});
	


//Google button
app.directive('googleSignInButton', function() {
        return {
          scope: {
            buttonId: '@',
            options: '&'
          },
          template: '<div ></div>',
          link: function(scope, element, attrs) {
            var div = element.find('div')[0];
            div.id = attrs.buttonId;
            gapi.signin2.render(div.id, scope.options()); //render a google button, first argument is an id, second options
          }
        };
      });
	  
	  


/*Set focus on load page*/
app.directive('ngSetFocus', ['$timeout' ,function ($timeout) {
  	return {
  	  restrict: 'A',
  	  link: function(scope, element, attrs) {
        
        var delay= 300;
        
        // set focus on broadcast
        scope.$on(attrs.ngSetFocus, function(e) {
          $timeout(function(){
            element[0].focus();
          }, delay);

        });   
        
        // apply default focus after other events have complete
  	    $timeout(function(){          
          if(attrs.hasOwnProperty('setFocusDefault')){
            element[0].focus();
          }
        }, delay);
        
        // fix for default focus on iOS. Does not show keyboard
        element.on('touchstart', function(event) {
          element[0].blur();
        });

  	  }	  
  	};
  }]);
  
  
app.directive("uiNotCloseOnClick", [
   function() {
     return {
       restrict: "A",
       compile: function(ele) {
          return ele.on("click", function(event) {
            return event.stopPropagation()
           })
         }
      }
   }
])
		
app.directive("slimScroll", [
  function() {
    return {
      restrict: "A",
      link: function(scope, ele, attrs) {
        return ele.slimScroll({
          height: attrs.scrollHeight || "100%"
        });
      }
    };
  }
]);



//grid directive
// UI grid date picker
app.directive('uiGridEditDatepicker', ['$timeout', '$document', 'uiGridConstants', 'uiGridEditConstants', function($timeout, $document, uiGridConstants, uiGridEditConstants) {
    return {
        template: function(element, attrs) {
            var html = '<div class="datepicker-wrapper" ><input uib-datepicker-popup is-open="isOpen" ng-model="' + attrs.rowField + '" ng-change="changeDate($event)" on-open-focus="false" disabled/></div>';
            return html;
        },
        require: ['?^uiGrid', '?^uiGridRenderContainer'],
        scope: true,
        compile: function() {
            return {
                pre: function($scope, $elm, $attrs) {

                },
                post: function($scope, $elm, $attrs, controllers) {
                    var setCorrectPosition = function() {
                        var gridElement = $('.ui-grid-viewport');
                        var gridPosition = {
                            width: gridElement.outerWidth(),
                            height: gridElement.outerHeight(),
                            offset: gridElement.offset()
                        };

                        var cellElement = $($elm);
                        var cellPosition = {
                            width: cellElement.outerWidth(),
                            height: cellElement.outerHeight(),
                            offset: cellElement.offset()
                        };

                        var datepickerElement = $('ul', cellElement);
                        var datepickerPosition = {
                            width: datepickerElement.outerWidth(),
                            height: datepickerElement.outerHeight()
                        };
                        var newOffsetValues = {};

                        var isFreeOnRight = (gridPosition.width - (cellPosition.offset.left - gridPosition.offset.left) - cellPosition.width) > datepickerPosition.width;
                        if (isFreeOnRight) {
                            newOffsetValues.left = cellPosition.offset.left + cellPosition.width;
                        } else {
                            newOffsetValues.left = cellPosition.offset.left - datepickerPosition.width;
                        }

                        var freePixelsOnBottom = gridPosition.height - (cellPosition.offset.top - gridPosition.offset.top) - cellPosition.height;
                        var freePixelsOnTop = gridPosition.height - freePixelsOnBottom - cellPosition.height;
                        var requiredPixels = (datepickerPosition.height - cellPosition.height) / 2;
                        if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop >= requiredPixels) {
                            newOffsetValues.top = cellPosition.offset.top - requiredPixels + 10;
                        } else if (freePixelsOnBottom >= requiredPixels && freePixelsOnTop < requiredPixels) {
                            newOffsetValues.top = cellPosition.offset.top - freePixelsOnTop + 10;
                        } else {
                            newOffsetValues.top = gridPosition.height - datepickerPosition.height + gridPosition.offset.top - 20;
                        }

                        datepickerElement.offset(newOffsetValues);
                        datepickerElement.css("visibility", "visible");
                    };

                    $timeout(function() {
                       // setCorrectPosition();
                    }, 0);

                    $scope.isOpen = true;

                    var uiGridCtrl = controllers[0];
                    var renderContainerCtrl = controllers[1];

                    var onWindowClick = function (evt) {
                        var classNamed = angular.element(evt.target).attr('class');
                        var inDatepicker = (classNamed.indexOf('datepicker-calendar') > -1);
                        if (!inDatepicker && evt.target.nodeName !== "INPUT") {
                            $scope.stopEdit(evt);
                        }
                    };

                    var onCellClick = function (evt) {
                        console.log('click')
                        angular.element(document.querySelectorAll('.ui-grid-cell-contents')).off('click', onCellClick);
                        $scope.stopEdit(evt);
                    };

                    $scope.changeDate = function (evt) {
                        $scope.stopEdit(evt);
                    };

                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function () {
                        if (uiGridCtrl.grid.api.cellNav) {
                            uiGridCtrl.grid.api.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                                $scope.stopEdit();
                            });
                        } else {
                            angular.element(document.querySelectorAll('.ui-grid-cell-contents')).on('click', onCellClick);
                        }
                        angular.element(window).on('click', onWindowClick);
                    });

                    $scope.$on('$destroy', function () {
                        angular.element(window).off('click', onWindowClick);
                    });

                    $scope.stopEdit = function(evt) {
                        $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                    };

                    $elm.on('keydown', function(evt) {
                        switch (evt.keyCode) {
                            case uiGridConstants.keymap.ESC:
                                evt.stopPropagation();
                                $scope.$emit(uiGridEditConstants.events.CANCEL_CELL_EDIT);
                                break;
                        }
                        if (uiGridCtrl && uiGridCtrl.grid.api.cellNav) {
                            evt.uiGridTargetRenderContainerId = renderContainerCtrl.containerId;
                            if (uiGridCtrl.cellNav.handleKeyDown(evt) !== null) {
                                $scope.stopEdit(evt);
                            }
                        } else {
                            switch (evt.keyCode) {
                                case uiGridConstants.keymap.ENTER:
                                case uiGridConstants.keymap.TAB:
                                    evt.stopPropagation();
                                    evt.preventDefault();
                                    $scope.stopEdit(evt);
                                    break;
                            }
                        }
                        return true;
                    });
                }
            };
        }
    };
}]);


angular.module('ui.grid.custom.rowSelection', ['ui.grid'])
.directive('uiGridCell', function ($timeout, uiGridSelectionService) {
  return {
    restrict: 'A',
    require: '^uiGrid',
    priority: -200,
    scope: false,
    link: function ($scope, $elm, $attr, uiGridCtrl) {
      if ($scope.col.isRowHeader) {
        return;
      }
      
      var touchStartTime = 0;
      var touchTimeout = 300;
      
      registerRowSelectionEvents();
      
      function selectCells(evt) {
        // if we get a click, then stop listening for touchend
        $elm.off('touchend', touchEnd);
        
        if (evt.shiftKey) {
          uiGridSelectionService.shiftSelect($scope.grid, $scope.row, evt, $scope.grid.options.multiSelect);
        }
        else if (evt.ctrlKey || evt.metaKey) {
          uiGridSelectionService.toggleRowSelection($scope.grid, $scope.row, evt, $scope.grid.options.multiSelect, $scope.grid.options.noUnselect);
        }
        else {
          uiGridSelectionService.toggleRowSelection($scope.grid, $scope.row, evt, ($scope.grid.options.multiSelect && !$scope.grid.options.modifierKeysToMultiSelect), $scope.grid.options.noUnselect);
        }
        $scope.$apply();
        
        // don't re-enable the touchend handler for a little while - some devices generate both, and it will
        // take a little while to move your hand from the mouse to the screen if you have both modes of input
        $timeout(function() {
          $elm.on('touchend', touchEnd);
        }, touchTimeout);
      };

      function touchStart(evt) {
        touchStartTime = (new Date()).getTime();

        // if we get a touch event, then stop listening for click
        $elm.off('click', selectCells);
      };

      function touchEnd(evt) {
        var touchEndTime = (new Date()).getTime();
        var touchTime = touchEndTime - touchStartTime;

        if (touchTime < touchTimeout ) {
          // short touch
          selectCells(evt);
        }
        
        // don't re-enable the click handler for a little while - some devices generate both, and it will
        // take a little while to move your hand from the screen to the mouse if you have both modes of input
        $timeout(function() {
          $elm.on('click', selectCells);
        }, touchTimeout);
      };

      function registerRowSelectionEvents() {
        $elm.addClass('ui-grid-disable-selection');
        $elm.on('touchstart', touchStart);
        $elm.on('touchend', touchEnd);
        $elm.on('click', selectCells);
      }
    }
  };
});
		
	
	

