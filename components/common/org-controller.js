
var app=angular.module("org-controller", []);

// 
  //Login Controller
  // 
app.controller('OrgController',function($rootScope,$scope,$location,$http,AuthService,$base64,$cookies,$window,$filter ) {
    
 $scope.getOrgList = function() {
				
		  $scope.loaderMessage = 'Fetching organizations ....';	
	      $scope.promise = null; 
		  $http.defaults.headers.common['X-AuthToken'] = $window.localStorage.getItem('loginToken');
		  var config = {headers: { 'Accept': 'application/json;','X-AuthToken':$window.localStorage.getItem('loginToken')}};
  	      var requestData={};	
		  $scope.promise=AuthService.getOrgList(requestData,config)

		 .success(function(data, status, headers, config) { 
			$scope.societylist = data.data;
		   	$rootScope.loading = false; 
			
		  }).error(function(data,status) {	
                   $scope.logout();		  
			  $rootScope.resultModal('2','Error',data.message,'',true,false);		
			    
		  });
		
	 
      };
	
	  
	 $rootScope.changeOrg = function(orgID,societyName,memberGroupMailID,roleID,roleName) {
		 
		  $scope.loaderMessage = 'Processing....';	
	      $scope.promise = null;
	      //console.log($cookies.get("authToken"));
		 $http.defaults.headers.common['X-AuthToken'] = $window.localStorage.getItem('loginToken');
		  var config = {headers: { 'Accept': 'application/json;','X-AuthToken':$window.localStorage.getItem('loginToken')}};
		  var requestData={orgID: orgID};	  
		 $scope.promise=AuthService.changeOrg(requestData,config)

		 .success(function(response, status, headers, config) {
                 $rootScope.resultModal('1','Success',"Your now logged into "+response.data.orgVO.orgName,'',true,false);
				 //session storage
				 $window.sessionStorage.setItem('authToken',response.data.authToken);
				 $window.sessionStorage.setItem('orgName',response.data.orgVO.orgName);
				
			    //rootScope storage
			     $rootScope.orgName=$window.sessionStorage.getItem('orgName');
				 
				 $location.path("components/dashboard/views/dashboard-v1");
	             $rootScope.loading = false;	
	 
		  }).error(function(data,status) {		
			  $rootScope.loading = false;
			  $rootScope.resultModal('2','Error',data.message,'',true,false);	
			   $rootScope.logout();
		  });
		
	 
      };
	  	
 
}); 

 