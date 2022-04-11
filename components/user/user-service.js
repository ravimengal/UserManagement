
// Common services
var app= angular.module("user-service", [])
// Data services
app.service('UserService',['$http', '$rootScope','$cookies','$window','$filter', function($http,$rootScope,$cookies,$window,$filter) {
	
	/**************User Section API **************/
	// create user
	this.createuser = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/iam/user/insert?loginID='+data.loginID	+'&fullName='+data.fullName+'&appID='+data.appID+'&roleID='+data.roleID,config);	  
	};
	// update user
	this.updateuser = function (data,config) {
        // return $http.post($rootScope.gatewayRouter+'/iam/user/update?userID='+data.id,data,config);	  
		return $http.post($rootScope.gatewayRouter+'/iam/user/update',data,config);
	};
	// fetchUsers  
	this.fetchUsers = function (data,config) {
        return $http.get($rootScope.gatewayRouter+'/iam/user/userList',data,config);	  
	};	
	// fetch Single User  
	this.fetchIndividualUser = function (data,config) {
        return $http.post($rootScope.gatewayRouter+'/iam/user/getUserDetails?userID='+data.id,data,config);
	};
	
    // delete user 
	this.deleteUser = function (data,config) {
        return $http.delete($rootScope.gatewayRouter+'/iam/user/delete?userID='+data.id,data,config);	  
	};
	// fetch user roles by userid
	// this.fetchUserRoles = function (data,config) {
	// 	return $http.get($rootScope.gatewayRouter+'/iam/user/userRoles/'+data.id,data,config);	  
	// };
	//fetch user role passing dynamic userID
	this.fetchUserRoles = function (data,config) {
		return $http.get($rootScope.gatewayRouter+'/iam/roles/getByUser/'+data.userID,data,config);	  
	}
	//get user role list 
	this.getUserRoleList = function (data,config) {
		return $http.get($rootScope.gatewayRouter+'/iam/roles/getAll',data,config);	  
	}
	//get my all apps list GET /iam/secure/apps/getMyApps
	this.getAllAppsList = function (data,config) {
		return $http.get($rootScope.gatewayRouter+'/iam/secure/apps/getAllApps',data,config);	  
	}

	//get role by app ID GET /iam/roles/getByApp/{appID}
	this.getAllRoleByAppID = function (data,config) {
		return $http.get($rootScope.gatewayRouter+'/iam/roles/getByApp/'+data.appID,data,config);	  
	}  
	//change password POST /iam/user/changePassword
	this.changePassword = function (data,config) {
		return $http.post($rootScope.gatewayRouter+'/iam/user/changePassword?password='+data.password,data,config);	  
	}
	// // POST /iam/permissions/revokeAppPermission
	// this.revokeAppPermission = function (data,config) {
	// 	return $http.post($rootScope.gatewayRouter+'/iam/permissions/revokeAppPermission?userID='+data.userID+'&appID='+data.appID,data,config);	  
	// }


	//POST /iam/authorize/revokeUserAccess/{appID}/{userID}
	this.revokeUserAccess = function (data,config) {
		return $http.post($rootScope.gatewayRouter+'/iam/authorize/revokeUserAccess/'+data.appID+'/'+data.userID,data,config);	  
	}

	//POST /iam/authorize/permitUserAccess/{appID}/{roleID}/{userID}
	this.permitUserAccess = function (data,config) {
		return $http.post($rootScope.gatewayRouter+'/iam/authorize/permitUserAccess/'+data.appID+'/'+data.roleID+'/'+data.userID,data,config);	  
	}

}]);
