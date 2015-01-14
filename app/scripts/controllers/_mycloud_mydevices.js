angular.module('pvcloudApp').controller('_mycloud_mydevices', function ($scope, $location, UtilityService, $routeParams, DeviceRegistryService, sessionService) {
    console.log("This is my devices controller being invoked");
    console.log($scope);
    $scope.AddingDevice = false;
    $scope.AddDevice_device_nickname = "";
    $scope.AddDevice_device_description = "";
    $scope.SelectedDevice = undefined;
    $scope.SelectedAccountID = sessionService.GetCurrentAccountID();
    $scope.LoadingListOfDevicesComplete = false;
    
    var protocol = window.location.protocol;
    var hostname = window.location.host;
    var port = window.location.port;

    if (port == 9000) {
        $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080";
    } else {
        $scope.URLBegin = protocol + "//" + hostname;
    }

    getListOfDevicesForAccountID();

    $scope.NewDevicesMode = function () {
        $scope.AddDevice_device_nickname = "";
        $scope.AddDevice_device_description = "";
        $scope.AddingDevice = true;
    };

    $scope.CancelNewDevicesMode = function () {
        $scope.AddingDevice = false;
    };

    $scope.AddDevice_Save = function () {
        if (this.AddDevice_device_nickname !== undefined && this.AddDevice_device_nickname !== "") {
            if (this.AddDevice_device_description !== undefined && this.AddDevice_device_description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                DeviceRegistryService.RegisterNewDevice(account_id, token, this.AddDevice_device_nickname, this.AddDevice_device_description).$promise.then(function (response) {
                    UtilityService.ProcessServiceResponse(response,
                            function success(response) {
                                var device = response.data;
                                getListOfDevicesForAccountID();
                                alert("Dispositivo registrado satisfactoriamente mediante el ID: " + device.device_id);
                                $scope.AddingDevice = false;
                            },
                            function error(response) {
                                console.log(response);
                            },
                            function exception(response) {
                                console.log(response);
                            });
                });

            } else {
                alert("El campo Descripción es requerido y está vacío");
            }
        } else {
            alert("El campo Nombre es requerido y está vacío");
        }
    };


    $scope.EditDevice = function (device) {
        var device_id = device.device_id;
        device.device_nickname_edited = device.device_nickname;
        device.device_description_edited = device.device_description;
        device.api_key_edited = device.api_key;
        device.deviceBeingEdited = true;
    };

    $scope.EditDevice_Cancel = function (device) {
        device.deviceBeingEdited = false;
    };

    $scope.EditDevice_Delete = function (device) {
        var device_id = device.device_id;
        var confirmation = confirm("De verdad quiere eliminar este dispositivo? Todos sus datos relacionados serán eliminados también.");
        if (confirmation) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            var device_id = device.device_id;
            DeviceRegistryService.DeleteDevice(account_id, token, device_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("Dispositivo " + device_id + "fue removido satisfactoriamente");
                            getListOfDevicesForAccountID();
                        },
                        function error(response) {
                            console.log(response);
                        },
                        function exception(response) {
                            console.log(response);
                        });
            });
            device.deviceBeingEdited = false;
        }


    };

    $scope.EditDevice_NewAPIKey = function (device) {
        var confirmation = confirm("Desear regenerar el API Key para este dispositivo?");
        if (confirmation === true) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            var device_id = device.device_id;

            DeviceRegistryService.RegenerateAPIKey(account_id, token, device_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("API Key was re-generated for device" + device_id);
                            device.api_key = response.data.api_key;
                            device.deviceBeingEdited = false;
                        },
                        function error(response) {
                            console.log(response);
                        },
                        function exception(response) {
                            console.log(response);
                        });
            });
        }
    };

    $scope.EditDevice_Save = function (device) {
        if (device.device_nickname_edited != "" && device.device_description_edited != "") {
            device.device_nickname = device.device_nickname_edited;
            device.device_description = device.device_description_edited;

            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();

            DeviceRegistryService.UpdateDevice(account_id, token, device.device_id, device.device_nickname, device.device_description).$promise.then(function (response) {
                console.log("device_id");
                console.log(device.device_id);
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("Los datos se guardaron satisfactoriamente" + device.device_nickname);
                            device = response.data;
                        },
                        function error(response) {
                            console.log(response);
                        },
                        function exception(response) {
                            console.log(response);
                        });
            });

            device.deviceBeingEdited = false;
        } else {
            alert("El nombre del dispositivo y la descripción no pueden estar vacíos");
        }
    };

    $scope.ViewAPIReference = function (device) {
        console.log("VIEW API REFERENCE");
        $scope.SelectedDevice = device;

        var date = new Date();
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var fulldateFormat = fullYear + '-' + month + '-' + dayOfMonth + '+' + hours + ":" + minutes + ":" + seconds;

        $scope.SelectedDevice.CapturedDatetime = fulldateFormat;
    };

    $scope.CloseAPIReference = function () {
        $scope.SelectedDevice = undefined;
    };

    function getListOfDevicesForAccountID() {
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();

        DeviceRegistryService.GetDeviceListForAccountID(account_id, token).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoadingListOfDevicesComplete = true;
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

