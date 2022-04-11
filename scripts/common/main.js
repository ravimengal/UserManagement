"use strict";
//main application with name:e.g - demoapp is name of app 
angular.module("demoapp", [
      'angular-loading-bar',
      'cgBusy', 
      'ngTable',
      'ngRoute', 
	  'ngAnimate', 
	  'ngSanitize', 
	  'ui.bootstrap', 
	  'textAngular', 
	  'ngTagsInput', 
	  'slick', 	
	  'ui.select', 
	  'ui.bootstrap.contextMenu',
	  'FullscreenApp',	  
	  'app.directives', 
	  'app.localization', 
	  'app.nav', 
	  'app.services',
	  'app.filters',
	  'base64',
	  'ngCookies',
          'ui.grid',
	  'ui.grid.cellNav',
	  'ui.grid.edit',
	  'ui.grid.rowEdit',
	  'ui.grid.resizeColumns',
	  'ui.grid.selection',
	  'ui.grid.pinning',
	  'ui.grid.autoResize',
	  'ui.grid.pagination',
	  'ui.grid.validate',
	  'ui.grid.exporter',
	  'ui.grid.treeView',
	  'ui.grid.custom.rowSelection',


	  'tawani.utils',
	  'ui.tab.scroll', 	 
	  'angular-animate',
      'xeditable',
	  'dashboard-controller', 
      'user-controller', 
      'user-service',
	  'org-controller',
])

//Route paths for application pages
.config(['cfpLoadingBarProvider','$routeProvider','scrollableTabsetConfigProvider', function(cfpLoadingBarProvider,$routeProvider,scrollableTabsetConfigProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
	 var routes, setRoutes;
    routes = [
	   
		'components/dashboard/views/dashboard-v1',
		'components/common/views/organization-list',
        'components/user/views/add-user',
        'components/user/views/update-user',  	  		
	    'components/user/views/user-profiles', 
		'components/user/views/change-password',
		];
		
    setRoutes = function(route) {
      var config, url;
      url = '/' + route;
      config = {
        templateUrl: '' + route + '.html'
      };
      $routeProvider.when(url, config);
      return $routeProvider;
    };
    routes.forEach(function(route) {
      return setRoutes(route);
    });
    return $routeProvider.when('/', {
      redirectTo: 'components/dashboard/views/dashboard-v1'
    }).when('/404', {
      templateUrl: 'components/common/views/404.html'
    }).otherwise({
      redirectTo: '/404'
    });
	
	
	scrollableTabsetConfigProvider.setShowTooltips (true);
    scrollableTabsetConfigProvider.setTooltipLeftPlacement('bottom');
    scrollableTabsetConfigProvider.setTooltipRightPlacement('left');
  
  }
  ])

// loading bar default
.value('cgBusyDefaults',{
  message:'Please Wait..',
  backdrop: false,
  templateUrl: 'components/common/views/loading-template.html',
  delay: 100,
  minDuration: 300,

})
//main Controller 
.controller("AppCtrl", [ '$rootScope', '$scope', '$http','$cookies','$location','$window','$uibModal','AuthService',
  function($rootScope, $scope, $http, $cookies, $location, $window,$uibModal,AuthService) {
     
	 //app configuration
	 $rootScope.currencyValue="Rs";
     $rootScope.appID='6';
     $rootScope.gatewayRouter='/api';

	//theme configuartion
	
    $scope.admin = {
      layout: false,
      menu: false,
      fixedHeader: true,
      fixedSidebar: true,
      themeID: "33",
      navbarHeaderColor: 'bg-success',
      navbarlogo: 'bg-success',

      asideColor: 'bg-dark'
    };
    $scope.color = {
      primary: "#248AAF",
      success: "#3CBC8D",
      info: "#29B7D3",
      purple: "#7266ba",
      warning: "#FAC552",
      danger: "#E9422E",
	  white:"#FFFFFF"
    };
	
  //set headers
//   $rootScope.requestHeaders = {headers: {'Accept': '*/*','Content-Type':'application/json','X-orgID':$rootScope.orgID,'X-UserID':$rootScope.userID}};	
//set headers
  $rootScope.requestHeaders = {headers: {'Accept': '*/*','Content-Type':'application/json','X-orgID':$rootScope.orgID,'X-UserID':$rootScope.userID,'X-authToken': $window.sessionStorage.getItem('authToken'),'X-user':$window.sessionStorage.getItem('user')}};
	
	 
  
    //Check page access 
  $rootScope.initApp=function(){
	 console.log('Verifying checking token availibility');

	  if($window.localStorage.getItem("loginToken")==undefined)
	  { 
			console.log('Token not Available in local storage');
            $rootScope.logout();
		 
	  }else{
	      
		  if($window.sessionStorage.getItem('authToken')==undefined){ 
		     $window.sessionStorage.setItem('authToken',$window.localStorage.getItem("loginToken"));
		  }
		 //app session token validate    
	  
	        console.log('No session token found');
			
			$scope.appSwitch($window.sessionStorage.getItem("authToken"),$rootScope.appID);
			
	  
	  }
  
  }
  
  
  //Validate Request
	$scope.validateRequest=function(token){		 
		 $scope.loaderMessage = 'Processing....';	
	     $scope.promise = null;
		 $http.defaults.headers.common['X-AuthToken'] = token;
         var config = {headers: { 'Accept': 'application/json;','X-AuthToken':token}};
	     var data = {};		 
		 $scope.promise=LoginService.validateRequest(data,config)
			.success(function(data, status, headers, config) {   
			  $rootScope.loading = false;
				
			}).error(function(data,status) {				
				$rootScope.resultModal('2','Error',data.message,'',true,false);			       
				 $rootScope.loading = false;
				 $rootScope.logout();
							
			});	
     		
	}
	
	
	 //App Switch
	$scope.appSwitch=function(token,appID){	
         
		 $scope.loaderMessage = 'Processing....';	
	     $scope.promise = null;
		 $http.defaults.headers.common['X-AuthToken'] = token;
		 var config = {headers:  {
			 'Accept': 'application/json;','Content-Type':'application/json;',
			 'X-AuthToken':token
          }};
	     var data = {appID:appID};		 
		 $scope.promise=AuthService.appSwitch(data,config)
		   
			.success(function(data, status, headers, config) {
				 $rootScope.loading = false;
				 //console.log(data);
			    $rootScope.storeSessionData(data.data);
				
			}).error(function(data,status) {				
				 $rootScope.resultModal('2','Error',data.message,'',true,false);			       
				 $rootScope.loading = false;
				 $rootScope.logout();		
			});
	}
	
	
 //store local data in browser
	    $rootScope.storeSessionData=function(data){
		        
				console.log(data);
                $window.sessionStorage.setItem('orgName',data.orgVO.orgName);
				
			   //rootScope storage
			    $rootScope.orgName=$window.sessionStorage.getItem('orgName');	
				$rootScope.userName=$window.localStorage.getItem('userName');	
                $rootScope.useremail=$window.localStorage.getItem('useremail'); 
				
		}
  
  
  $rootScope.generateUUID= function() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  
   /* Result Modal */ 
	$rootScope.resultModal=function(resultType,resultTitle,resultMessage,resultMethod,showYesBtn,showNoBtn){
		$rootScope.result={};	
		
	   //success
		if(resultType=='1'){
		    $rootScope.result.type=resultType;
			$rootScope.result.title=resultTitle;
			$rootScope.result.message=resultMessage;
			$rootScope.result.method=resultMethod;
			$rootScope.result.showYesBtn=showYesBtn;
			$rootScope.result.showNoBtn=showNoBtn;
			$rootScope.resultIcon='fa-check-square-o';
			$rootScope.resultCss='btn-success';
			$rootScope.resultMsgCss='text-success';
			
								
		//Error	
        }else if(resultType=='2'){
			$rootScope.result.type=resultType;
			$rootScope.result.title=resultTitle;
		     if(resultMessage==undefined||resultMessage==''){
			$rootScope.result.message="Service Unavailable";
			}else{
			$rootScope.result.message=resultMessage;
			}
			$rootScope.result.method=resultMethod;
			$rootScope.result.showYesBtn=showYesBtn;
			$rootScope.result.showNoBtn=showNoBtn;
			$rootScope.resultIcon='fa-exclamation-triangle';
			$rootScope.resultCss='btn-danger';
			$rootScope.resultMsgCss='text-danger';
			
				
		//Info	
        }else if(resultType=='3'){
			$rootScope.result.type=resultType;
			$rootScope.result.title=resultTitle;
			$rootScope.result.message=resultMessage;
			$rootScope.result.method=resultMethod;
			$rootScope.result.showYesBtn=showYesBtn;
			$rootScope.result.showNoBtn=showNoBtn;
			$rootScope.resultIcon='fa-info-circle';
			$rootScope.resultCss='btn-info';
			$rootScope.resultMsgCss='text-info';
			
			
		// Access denied	
		}else if(resultType=='4'){
			$rootScope.result.type=resultType;
			$rootScope.result.title=resultTitle;
			$rootScope.result.message=resultMessage;
			$rootScope.result.method=resultMethod;
			$rootScope.result.showYesBtn=showYesBtn;
			$rootScope.result.showNoBtn=showNoBtn;
			$rootScope.resultIcon='fa-ban';
			$rootScope.resultCss='btn-danger';
			$rootScope.resultMsgCss='text-danger';
			
		}
		
		$rootScope.modalInstance=$uibModal.open({
				size:'m', 
				backdrop: 'static', 
				templateUrl: 'components/common/views/modal-result.html',
				scope:$scope
			
			});	
			
		$rootScope.result.methodCancel='cancel';
	}
	
	// modal cancel	
	 $rootScope.cancel = function () {
		$rootScope.modalInstance.close('cancel');
    };	
	
	
  
  		 //Logout function
   $rootScope.logout = function () {
	   
			 
		//goto login page	 
		$window.location.href="http://localhost/login/#/";
		//local storage clear
		$window.localStorage.removeItem('loginToken'); 
		$window.localStorage.removeItem('userName'); 
		$window.localStorage.removeItem('useremail'); 
		
		//session storage clear
		$window.sessionStorage.removeItem('orgName'); 
		$window.sessionStorage.removeItem("authToken");
		
		
		//rootScope storage clear
		$rootScope.userName ="";
	    $rootScope.orgName="";	    
	    $rootScope.useremail="";	    
      
			
        $scope.email="";
        $scope.password="";
        //$http.defaults.headers.common.Authorization = '';   
		//$http.defaults.headers.common['X-AuthToken'] = undefined; 
	
		
        // socialSignOut();
		 
    }
	
	//socialSignOut
	function socialSignOut() {
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
		  console.log('User signed out.');
		   auth2.disconnect(); 
		});
		  auth2.disconnect();
		 $window.localStorage.setItem('socialLoginStatus','false');
   }
   
   
   
}])

.controller("HeaderCtrl", ["$scope", function($scope) {	}])
.controller("NavContainerCtrl", ["$scope", function($scope) {}])
.controller("NavCtrl", [
  "$scope", function($scope, filterFilter) {}])



