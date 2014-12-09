angular.module('pvcloudApp').controller('_mycloud_mydevices', function ($scope, $location, UtilityService, $routeParams, DeviceRegistryService, sessionService) {
    console.log("This is my devices controller being invoked");
    console.log($scope);
    getListOfDevicesForAccountID();
    
    
    $scope.EditDevice = function (device){
        var device_id = device.device_id;
        device.device_nickname_edited = device.device_nickname;
        device.device_description_edited = device.device_description;
        device.api_key_edited = device.api_key;
        device.deviceBeingEdited = true;
    };
    
    $scope.EditDevice_Cancel = function (device){
        var device_id = device.device_id;
        
        device.deviceBeingEdited = false;
    };
    
    $scope.EditDevice_Delete = function (device){
        var device_id = device.device_id;
        var response = confirm("De verdad quiere eliminar este dispositivo? Todos sus datos relacionados serán eliminados también.");
        
        device.deviceBeingEdited = false;
    };    
    
    $scope.EditDevice_NewAPIKey = function (device){
        var response = confirm("Desear regenerar el API Key para este dispositivo?");
        if(response== true){
            device.api_key = "OK";
            device.deviceBeingEdited = false;
        }
    }
    
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

