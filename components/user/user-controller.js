
var app=angular.module("user-controller", []);

  //User Controller
app.controller('UserController',function($rootScope,$scope,$location,$http,UserService,$base64,$uibModal,$cookies,$window,$filter,uiGridConstants ) {



	$scope.status = {
		isopen: false
	  };
	//toggle dropdown menu
	$scope.toggleDropdown = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.status.isopen = !$scope.status.isopen;
	};


	//button checking function
	$scope.checkButton = function(){
	alert("checkButton");
	}
//navigate to change password page

			$scope.changePassword = function(){
				$location.path('components/user/views/change-password');
			}
//Add User Screen	
        $scope.getCreateScreen = function () {  
	        $location.path("components/user/views/add-user");
			
	    };
//Update User Screen		
		$scope.getUpdateScreen = function (profile) { 	
			
            $location.path("components/user/views/update-user");
			$scope.profiledata={userID: profile.userID,fullName:profile.fullName,loginName:profile.loginName,mobile:profile.mobile,userRoles:profile.userRoles};
			// $window.sessionStorage.setItem('profileSessionData',angular.toJson($scope.profiledata));
			$scope.getupdateuser();
		};
		
//Get User Details

        $scope.getUserDetailsScreen = function (profile) {			
			$scope.profiledata={userID: profile.userID,fullName:profile.fullName,loginName:profile.loginName,mobile:profile.mobile,role:profile.role,appID:profile.appID};
			// $window.sessionStorage.setItem('profileSessionData',angular.toJson($scope.profiledata));
			$scope.getupdateuser();
			$scope.getUserRole(profile.userID);
			// console.log('getUserDetailsScreen function',profile)
			$scope.getAllApp(profile);
			$scope.getRoleByAppID(profile.appID)
			// console.log("getALlAPP")
		};

//GET USER ROLE AND APP ACCESS

		$scope.getUserRoleAndAppAccess = function (profile) {
			$scope.profiledata={orgID: profile.orgID,role: profile.role,appAccess: profile.appAccess};
			$window.sessionStorage.setItem('RoleAppAccess',angular.toJson($scope.profiledata));
			$scope.getupdateuser();
			$scope.getUserRole(profile.userID);
			console.log('User Role and access app getting',$scope.profiledata)
		};
		
//User list screen

		$scope.getUserScreen = function () { 
		    $location.path("components/user/views/user-profiles");
		};
		
 //Close pop up delete modal

		$scope.closeDeleteModal = function () {  
		    $scope.modalInstance.close('cancelModal');
		};



// add user pop up modal

$scope.addUserModal = function (user) { 
	$scope.modalInstance=$uibModal.open({
		size:'m', 
		backdrop: 'static', 
		templateUrl: 'components/user/views/add-user-modal.html',
		scope:$scope
	
	});
 };

//close add modal

 $scope.closePermitModal = function () {  
	$scope.modalInstance.close('cancelModal');
};

//fetch role getAll
		
		
        $scope.create= function(user) {
			$scope.getAllApp();
			 $scope.user = {
					fullName: $scope.user.fullName,
					roleID: $scope.user.roleID,
					loginID: $scope.user.loginID,
					appID: $scope.user.appID
			};
			$scope.loaderMessage = "Creating User....";
			$scope.promise = null;
			var requestData = user;
			$scope.promise=UserService.createuser(requestData,$rootScope.requestHeaders)
			.success(function(data, status, headers, config,responseData) {
				$scope.resultModal('1','Success',data.message,'getUserScreen',true,false);
				$scope.getCreateScreen();
				$rootScope.loading = false;
				//navigate to user list screen
				// $scope.getUserList();
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	             		  
		    });
			//store user data in session
			$window.sessionStorage.setItem('userSessionData',angular.toJson($scope.user));
			console.log(requestData)
			// console.log('getting details from session storage',userID)
		};

//Read all user list
        $scope.getAllprofile = function () {     
          $scope.loaderMessage = 'Fetching Users....';	
	      $scope.promise = null;
		  var profile = new Object(); 
		  var requestData={};
			$scope.promise=UserService.fetchUsers(requestData,$rootScope.requestHeaders)
	        .success(function (responseData,status,headers,config) {
			console.log('Read all user List function',responseData.data);
			$scope.profiles=responseData.data;
			})  
            .error(function (data,status,headers,config) {  
            $rootScope.resultModal('2','Error',data.message,'',true,false);	        		  
            });
        };
		  
//get individual user

           $scope.updateuser = {};
		   $scope.getupdateuser = function() {
		   var updateData = $scope.profiledata;	
		   $scope.loaderMessage = 'Fetching User details ....';	
	       $scope.promise = null;	
		//    $rootScope.requestHeaders = {headers: {'Accept': '*/*','Content-Type':'application/json','X-authToken': $window.sessionStorage.getItem('authToken')}};
                 console.log('getUpdateuser function',updateData);
                 $scope.updateuser.userID = updateData.userID;
                 $scope.updateuser.fullName=updateData.fullName;		
                //  $scope.updateuser.title=updateData.title;
		         $scope.updateuser.loginName= updateData.loginName;
				$scope.updateuser.mobile = updateData.mobile;
				$scope.updateuser.roleID = updateData.roleID;
				$scope.updateuser.appID = updateData.appID;
			}	

// update user 

        $scope.update = function(updateuser){
			$scope.updateuser ={
				"fullName": $scope.updateuser.fullName,
				"roleName": $scope.updateuser.roleName,
				"loginName": $scope.updateuser.loginName,
				"mobile": $scope.updateuser.mobile,
				"appName": $scope.updateuser.appName
			}
			$scope.loaderMessage = "Updating User....";
			$scope.promise = null;
			var requestData = updateuser;
			
			$scope.promise=UserService.updateuser(requestData,$rootScope.requestHeaders)
			.success(function(data, status, headers, config,responseData) {
				$scope.resultModal('1','Success',data.message,'getUserScreen',true,false);
				$scope.getUserDetailsScreen($scope.updateuser);
				$rootScope.loading = false;
			}).error(function(data,status)
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	              		  
		    });
			console.log('update Data',requestData)
	
		};
	
//delete modal popup/confirm screen

		$rootScope.deletepro={};
		$scope.deleteUserScreen = function () { 
		    var deleteData= angular.fromJson($window.sessionStorage.getItem("profileSessionData"));
			$rootScope.deletepro.id=deleteData.id;
		    $rootScope.deletepro.fullName=deleteData.fullName;
		    $scope.modalInstance=$uibModal.open({
				size:'m', 
				backdrop: 'static', 
				templateUrl: 'components/user/views/user-delete-modal.html',
				scope:$scope
			
			});
		 };

//delete user

		   $scope.delete = function (userID) {
	    		   
           var deleteData= angular.fromJson($window.sessionStorage.getItem("profileSessionData"));	
		   $scope.loaderMessage = 'Delete User details ....';	
	       $scope.promise = null;	
		    
			var requestData={id:deleteData.userID};
			$scope.promise=UserService.deleteUser(requestData,$rootScope.requestHeaders)
	        .success(function (responseData,status,headers,config) {  
			$scope.closeDeleteModal();
            $rootScope.resultModal('1','Success',responseData.message,'getUserScreen',true,false);
			 $scope.getAllprofile();
			$scope.getUserScreen();
			 
            })  
             .error(function (data,status,headers,config) {  
                 $rootScope.loading = false;
                 $rootScope.resultModal('2','Error',data.message,'',true,false);	  		  	  
            });
		   };	  		   
		//}

//fetch user role details 

		$scope.getUserRole = function(userID) {
			// var ProfileRoleApp= angular.fromJson($window.sessionStorage.getItem("RoleAppAccess"));
			$scope.updateuserRole = {};
			// $scope.appList =[];
			$scope.loaderMessage = 'Fetching User Role....';	
			$scope.promise = null;
			var requestData={
					userID:userID	
			}
			$scope.promise=UserService.fetchUserRoles(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status, headers, config) 
			{		
				$scope.appList = responseData.data;
				console.log('getUserRole function',responseData.data);
				$rootScope.loading = false;
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);							  
		    });
			console.log('App List for individual user Data Iterate ',$scope.appList)	
		}
//role-service : Role Managment
//GET /iam/roles/getAll

		$scope.getRoleMgt = function() {
			$scope.loaderMessage = 'Fetching Roles....';
			$scope.userRoleDetails = [];	
			$scope.promise = null;
			$scope.promise=UserService.getUserRoleList($rootScope.requestHeaders)
			.success(function(responseData, status,  headers, config) 
			{		
				$scope.availableColors = responseData.data;
				console.log('getAllRoles function',responseData.data);
				$rootScope.loading = false;
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	
						  
		    });
		}
//to add app access for individual user
		$scope.addAppAccess = function(userID,appID) {
			$scope.loaderMessage = 'Adding App Access....';
			$scope.promise = null;
			var requestData={

					userID:userID,
					appID:appID,
					roleID:roleID
			}
			$scope.promise=UserService.addAppAccess(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status,  headers, config)
			{		
				$scope.getUserRole(userID);
				$rootScope.loading = false;
			}
			).error(function(data,status)
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);							  
		    }
			);
		}



//to remove app access for individual user
		$scope.removeUserAppAccess = function(appID,userID) {

			console.log('removeAppAccess function',appID,userID);
			$scope.loaderMessage = 'Removing App Access....';
			$scope.promise = null;
			var requestData={
					appID:appID,
					userID:userID
			
			}
			$scope.promise=UserService.revokeUserAccess(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status, headers, config) 
			{		
				$scope.getUserRole(userID);
				$rootScope.loading = false;
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	
						  
		    });
		}
//get all app list /iam/secure/apps/getAllApp
		$scope.getAllApp = function() {
			$scope.loaderMessage = 'Fetching Apps....';
			$scope.appListObj = {};
			$scope.promise = null;
			var requestData={				
			};
			$scope.promise=UserService.getAllAppsList(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status, headers, config) {	
				$scope.allAppList = responseData.data;
				console.log("Getting all Available app list",responseData.data);
				$rootScope.loading = false;	
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	
						  
		    });
			console.log('All Apps available ',$scope.allAppList)
		}
//get role by app ID
		$scope.getRoleByAppID = function(appID){
			$scope.loaderMessage = 'Fetching Roles....';
			$scope.roleListObj={};
			$scope.roleList = [];
			$scope.promise = null;
			var requestData={
					//get app id
					// appID:$scope.selected.appID
			}
			$scope.promise=UserService.getAllRoleByAppID(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status, headers, config) {		
				console.log("Getting all Available role list",responseData.data);
				$rootScope.loading = false;	
				$scope.roleList = responseData.data;
				console.log('getRoleByAppID function',responseData.data);
				// $rootScope.loading = false;
			}	
			).error(function(data,status)
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);						  
		    }
			);
			console.log('All Roles available by AppID ',$scope.roleList)
		}
//update password modal	
//popup screen to give access or lock app

$scope.updatePasswordModal = function () { 
	$scope.modalInstance=$uibModal.open({
		size:'m', 
		backdrop: 'static', 
		templateUrl: 'components/user/views/update-password.html',
		scope:$scope
	
	});
 };
//close Permit modal
 $scope.closePermitModal = function () {  
	$scope.modalInstance.close('cancelModal');
};
//update password
		$scope.updatePassword = function(user) {
			$scope.user = user;
			// alert('PASSWORD UPDATED TESTING',$scope.password)
			// $scope.user = {
			// 	password:$scope.password
			// };
			// var requestData = user;
			var requestData = user;
			$scope.loaderMessage = 'Updating Password....';
			$scope.promise = null;
			// var requestData={
			// 		password:$scope.password
			// }
			$scope.promise=UserService.changePassword(requestData,$rootScope.requestHeaders)
			.success(function(responseData, status, headers, config) {
				$scope.getUserRole(userID);
				$rootScope.loading = false;
			}).error(function(data,status) 
			{				
				 $rootScope.loading = false;
				 $rootScope.resultModal('2','Error',data.message,'',true,false);	
						  
		    });
			console.log('Password updated ',$scope.user)
		}
//to create permit access for individual user using update button
//popup screen to give access or lock app
$scope.permitAccess = function () { 
	$scope.modalInstance=$uibModal.open({
		size:'m', 
		backdrop: 'static', 
		templateUrl: 'components/user/views/permit-access.html',
		scope:$scope
	
	});
 };
//close Permit modal
 $scope.closePermitModal = function () {  
	$scope.modalInstance.close('cancelModal');
};



});




