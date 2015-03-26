angular.module('pvcloudApp').controller('_myappsCtrl', function ($scope, UtilityService, AppRegistryService, sessionService) {
    console.log("This is my apps controller being invoked");
    console.log($scope);
    $scope.AddingApp = false;
    $scope.AddApp_app_nickname = "";
    $scope.AddApp_app_description = "";
    $scope.SelectedApp = undefined;
    $scope.SelectedAccountID = sessionService.GetCurrentAccountID();
    $scope.LoadingListOfAppsComplete = false;
    
    var protocol = window.location.protocol;
    //TODO: Making protocol for WGET to be HTTP until we find an easy way to install wget-ssl in Galileo
    //pvcloud_api.js driver will anyway interact ONLY with HTTPS
    
    protocol = "http:";
    var hostname = window.location.host;
    var port = window.location.port;

    if (port === 9000) {
        $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080";
    } else {
        $scope.URLBegin = protocol + "//" + hostname;
    }

    getListOfAppsForAccountID();

    $scope.NewAppsMode = function () {
        $scope.AddApp_app_nickname = "";
        $scope.AddApp_app_description = "";
        $scope.AddingApp = true;
    };

    $scope.CancelNewAppsMode = function () {
        $scope.AddingApp = false;
    };

    $scope.AddApp_Save = function () {
        if (this.AddApp_app_nickname !== undefined && this.AddApp_app_nickname !== "") {
            if (this.AddApp_app_description !== undefined && this.AddApp_app_description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                AppRegistryService.RegisterNewApp(account_id, token, this.AddApp_app_nickname, this.AddApp_app_description).$promise.then(function (response) {
                    UtilityService.ProcessServiceResponse(response,
                            function success(response) {
                                var app = response.data;
                                getListOfAppsForAccountID();
                                alert("App registrada satisfactoriamente mediante el ID: " + app.app_id);
                                $scope.AddingApp = false;
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


    $scope.EditApp = function (app) {
        var app_id = app.app_id;
        app.app_nickname_edited = app.app_nickname;
        app.app_description_edited = app.app_description;
        app.api_key_edited = app.api_key;
        app.appBeingEdited = true;
    };

    $scope.EditApp_Cancel = function (app) {
        app.appBeingEdited = false;
    };

    $scope.EditApp_Delete = function (app) {
        var app_id = app.app_id;
        var confirmation = confirm("De verdad quiere eliminar esta app? Todos sus datos relacionados serán eliminados también.");
        if (confirmation) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            var app_id = app.app_id;
            AppRegistryService.DeleteApp(account_id, token, app_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("App " + app_id + "fue removida satisfactoriamente");
                            getListOfAppsForAccountID();
                        },
                        function error(response) {
                            console.log(response);
                        },
                        function exception(response) {
                            console.log(response);
                        });
            });
            app.appBeingEdited = false;
        }


    };

    $scope.EditApp_NewAPIKey = function (app) {
        var confirmation = confirm("Desear regenerar el API Key para esta app?");
        if (confirmation === true) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            var app_id = app.app_id;

            AppRegistryService.RegenerateAPIKey(account_id, token, app_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("API Key was re-generated for app" + app_id);
                            app.api_key = response.data.api_key;
                            app.appBeingEdited = false;
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

    $scope.EditApp_Save = function (app) {
        if (app.app_nickname_edited !== "" && app.app_description_edited !== "") {
            app.app_nickname = app.app_nickname_edited;
            app.app_description = app.app_description_edited;

            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();

            AppRegistryService.UpdateApp(account_id, token, app.app_id, app.app_nickname, app.app_description).$promise.then(function (response) {
                console.log("app_id");
                console.log(app.app_id);
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("Los datos se guardaron satisfactoriamente" + app.app_nickname);
                            app = response.data;
                        },
                        function error(response) {
                            console.log(response);
                        },
                        function exception(response) {
                            console.log(response);
                        });
            });

            app.appBeingEdited = false;
        } else {
            alert("El nombre del app y la descripción no pueden estar vacíos");
        }
    };

    $scope.ViewAPIReference = function (app) {
        console.log("VIEW API REFERENCE");
        $scope.SelectedApp = app;

        var date = new Date();
        var fullYear = date.getFullYear();
        var month = date.getMonth() + 1;
        var dayOfMonth = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var fulldateFormat = fullYear + '-' + month + '-' + dayOfMonth + '+' + hours + ":" + minutes + ":" + seconds;

        $scope.SelectedApp.CapturedDatetime = fulldateFormat;
    };

    $scope.CloseAPIReference = function () {
        $scope.SelectedApp = undefined;
    };

    function getListOfAppsForAccountID() {
        var token = sessionService.GetCurrentToken();
        var account_id = sessionService.GetCurrentAccountID();

        AppRegistryService.GetAppListForAccountID(account_id, token).$promise.then(function (response) {
            UtilityService.ProcessServiceResponse(response,
                    function success(response) {
                        $scope.LoadingListOfAppsComplete = true;
                        $scope.Apps = response.data;
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

