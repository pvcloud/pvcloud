angular.module('pvcloudApp').controller('_mycloud_mydevices', function ($scope, $location, utilityService, $routeParams, DeviceRegistryService) {
    console.log("This is my devices controller being invoked");
    console.log($scope);
    getListOfDevicesForAccountID();
    
    function getListOfDevicesForAccountID(){
        DeviceRegistryService.GetDeviceListForAccountID(1).$promise.then(function (response) {
            utilityService.ProcessServiceResponse(response,
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

