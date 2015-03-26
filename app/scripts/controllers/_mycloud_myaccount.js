angular.module('pvcloudApp').controller('_mycloud_myaccount', function ($scope, UtilityService, sessionService, AccountService) {
    $scope.ChangePassword = function () {
        if (!$scope.OldPassword || !$scope.NewPassword1 || $scope.NewPassword1 !== $scope.NewPassword2) {
            throw "Invalid Parameters";
        } else {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            
            console.log([
                account_id, token, $scope.OldPassword, $scope.NewPassword1
            ])
            AccountService.ChangePassword(account_id, token, $scope.OldPassword, $scope.NewPassword1).$promise.then(function (response) {
                if(response.status==="OK"){
                    alert(response.message);
                    clearFields();
                } else {
                    alert(response.message);
                }
            });
        }

    };
    
    function clearFields(){
        $scope.OldPassword = "";
        $scope.NewPassword1 = "";
        $scope.NewPassword2 = "";
    }
});