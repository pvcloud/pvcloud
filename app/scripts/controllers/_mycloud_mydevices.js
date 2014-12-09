angular.module('pvcloudApp').controller('_mycloud_mydevices', function ($scope, $location, UtilityService, $routeParams, DeviceRegistryService, sessionService) {
    console.log("This is my devices controller being invoked");
    console.log($scope);
    getListOfDevicesForAccountID();
    
    function getListOfDevicesForAccountID(){
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();
        
        DeviceRegistryService.GetDeviceListForAccountID(account_id, token).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.Devices = response.data;
                        console.log(response);
                    },
                    function error(response) {
                        console.log(response);
                    },
                    function exception(response) {
                        console.log(response);
                    });
        });        
    }
});

