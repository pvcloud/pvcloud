angular.module('pvcloudApp').controller('_mycloud_myapps_edit', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams, $location) {
    console.log("This is _mycloud_myapps_edit controller being invoked");
    $scope.Tabs = {
        Basics: 'basics',
        DocsNDrivers: 'docs_n_drivers',
        Pages: 'pages',
        Data: 'data'
    };
    $scope.AccountID = sessionService.GetCurrentAccountID();
    $scope.FormIsClean = true;

    $scope.SetFormDirty = function () {
        $scope.FormIsClean = false;
    };

    $scope.Cancelar = function () {
        if (!$scope.FormIsClean) {
            if (!confirm("All your unsaved changes will be lost. Do you want to continue?")) {
                return;
            }
        }
        $location.path("/mycloud/myapps");
    };

    $scope.SaveApp = function () {

        $scope.ValidationError_Name = "";
        $scope.ValidationError_Description = "";


        var appToSave = {
            app_id: $scope.ApplicationID,
            app_nickname: $scope.AppName,
            app_description: $scope.AppDescription,
            api_key: $scope.AppAPIKEY,
            visibility_type_id: $scope.AppVisibility
        };

        if (appToSave.app_id !== undefined && appToSave.app_id > 0) {
            updateApp(appToSave);
        } else {
            createApp(appToSave);
        }


        console.log(appToSave);

    };

    $scope.DeleteApp = function () {

        var app_id = $scope.Application.app_id;
        var confirmation = confirm("De verdad quiere eliminar esta app?\n Todos sus datos relacionados serán eliminados también.");
        if (confirmation) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            AppRegistryService.DeleteApp(account_id, token, app_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("App #" + app_id + " fue removida satisfactoriamente");
                            $location.path("/mycloud/myapps");
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


        console.log(appToSave);

    };

    $scope.RecreateAPIKEY = function () {
        if (confirm("¿Está seguro que desea continuar?\nEste paso no tiene vuelta atrás. Al regenerar el API KEY todos los dispositivos y sistemas conectados a su APP dejarán de funcionar hasta que descargue nuevamente el controlador correspondiente en cada uno o actualice cada uno con el nuevo API KEY")) {

            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            var app_id = $scope.Application.app_id;

            AppRegistryService.RegenerateAPIKey(account_id, token, app_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            loadAppToForm(response.data);
                            setTimeout(function () {
                                alert("El API KEY de esta aplicación ha sido regenerado.");
                            }, 500);

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
    
    

    checkForDevelopmentRedirection();

    initialize();

    function createApp(appToAdd) {
        if (appToAdd.app_nickname !== undefined && appToAdd.app_nickname !== "") {
            if (appToAdd.app_description !== undefined && appToAdd.app_description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                AppRegistryService.RegisterNewApp(
                        account_id,
                        token,
                        appToAdd.app_nickname,
                        appToAdd.app_description,
                        appToAdd.visibility_type_id
                        ).$promise.then(function (response) {
                    UtilityService.ProcessServiceResponse(response,
                            function success(response) {
                                var app = response.data;
                                $location.path("/mycloud/myapps/" + app.app_id);
                                alert("Los datos se almacenaron satisfactoriamente.");
                            },
                            function error(response) {
                                console.log(response);
                            },
                            function exception(response) {
                                console.log(response);
                            });
                });
            } else {
                $scope.ValidationError_Description = "El campo de Descripción es requerido y está vacío.";
            }
        } else {
            $scope.ValidationError_Name = "El nombre de la applicación es requerido y está vacío";
        }
    }
    function updateApp(appToSave) {
        if (appToSave.app_nickname !== undefined && appToSave.app_nickname !== "") {
            if (appToSave.app_description !== undefined && appToSave.app_description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                AppRegistryService.UpdateApp(
                        account_id,
                        token,
                        appToSave.app_id,
                        appToSave.app_nickname,
                        appToSave.app_description,
                        appToSave.visibility_type_id
                        ).$promise.then(function (response) {
                    UtilityService.ProcessServiceResponse(response,
                            function success(response) {
                                var app = response.data;
                                loadAppToForm(app);
                                alert("Los datos se almacenaron satisfactoriamente.");
                            },
                            function error(response) {
                                console.log(response);
                            },
                            function exception(response) {
                                console.log(response);
                            });
                });
            } else {
                $scope.ValidationError_Description = "El campo de Descripción es requerido y está vacío.";
            }
        } else {
            $scope.ValidationError_Name = "El nombre de la applicación es requerido y está vacío";
        }
    }

    function initialize() {
        $scope.ArticleID = $routeParams.article_id;
        $scope.SubArticleID = $routeParams.subarticle_id;
        


        if ($routeParams.article_id !== "new") {
            var token = sessionService.GetCurrentToken();
            var account_id = sessionService.GetCurrentAccountID();
            $scope.ApplicationID = $routeParams.article_id;
            AppRegistryService.GetAppByID(account_id, token, $scope.ApplicationID).$promise.then(function (response) {
                loadAppToForm(response.data);
            });
        } else {
            $scope.ApplicationID = undefined;
            $scope.AppVisibility = 1;
        }

        switch ($scope.SubArticleID){
            case "tab_pages":
                $scope.CurrentTab = $scope.Tabs.Pages;
                break;
            default:
                $scope.CurrentTab = $scope.Tabs.Basics;
        }

        $scope.SwitchToTab = function (tab) {
            $scope.CurrentTab = tab;
        };
    }

    function loadAppToForm(app) {
        $scope.Application = app;
        $scope.ApplicationID = app.app_id;
        $scope.AppName = app.app_nickname;
        $scope.AppCurrentName = app.app_nickname;
        $scope.AppDescription = app.app_description;
        $scope.AppAPIKEY = app.api_key;
        $scope.AppVisibility = app.visibility_type_id;
        $scope.FormIsClean = true;
    }

    function checkForDevelopmentRedirection() {
        var protocol = window.location.protocol;
        //TODO: Making protocol for WGET to be HTTP until we find an easy way to install wget-ssl in Galileo
        //pvcloud_api.js driver will anyway interact ONLY with HTTPS

        protocol = "http:";
        var hostname = window.location.host;
        var port = window.location.port;
        var path = window.location.pathname;
        if (port === 9000 || port === '9000') {
            $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080" + path;
        } else {
            $scope.URLBegin = protocol + "//" + hostname + path;
        }
    }


});

