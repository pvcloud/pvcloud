angular.module('pvcloudApp').controller('_mycloud_pagesdef', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams, $location) {
    console.log("This is _mycloud_pagesdef controller being invoked");

    $scope.SetFormDirty = function () {
        $scope.FormIsClean = false;
    };

    $scope.Cancelar = function () {
        if (!$scope.FormIsClean) {
            if (!confirm("All your unsaved changes will be lost. Do you want to continue?")) {
                return;
            }
        }
        $location.path("/mycloud/myapps/" + $scope.AppID + "/tab_pages");
    };

    $scope.SavePage = function () {

        $scope.ValidationError_Name = "";
        $scope.ValidationError_Description = "";


        var pageToSave = {
            page_id: $scope.PageID,
            app_id: $scope.AppID,
            title: $scope.AppName,
            description: $scope.Page,
            visibility_type_id: $scope.PageVisibility
        };

        if (pageToSave.page_id !== undefined && pageToSave.page_id > 0) {
            updatePage(pageToSave);
        } else {
            createApp(pageToSave);
        }


        console.log(pageToSave);

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

    $scope.SwitchToTab = function (tab) {
        $scope.CurrentTab = tab;
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

    function updatePage(pageToSave) {
        if (pageToSave.title !== undefined && pageToSave.title !== "") {
            if (pageToSave.description !== undefined && pageToSave.description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                AppRegistryService.UpdatePage(
                        account_id,
                        token,
                        pageToSave.page_id,
                        pageToSave.app_id,
                        pageToSave.title,
                        pageToSave.description,
                        pageToSave.visibility_type_id
                        ).$promise.then(function (response) {
                    UtilityService.ProcessServiceResponse(response,
                            function success(response) {
                                var page = response.data;
                                loadDataToForm($scope.App, page);
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
        $scope.Tabs = {
            Basics: 'basics',
            Widgets: 'widgets',
            WidgetConfig: 'widgetconfig'
        };

        $scope.FormIsClean = true;

        $scope.AccountID = sessionService.GetCurrentAccountID();
        $scope.ArticleID = $routeParams.article_id;
        $scope.SubArticleID = $routeParams.subarticle_id;

        if ($routeParams.article_id !== "new") {
            data = getDataFromServer();

        } else {
            $scope.ApplicationID = undefined;
            $scope.AppVisibility = 1;
        }

        $scope.CurrentTab = $scope.Tabs.Basics;


    }

    function getDataFromServer() {
        var account_id = sessionService.GetCurrentAccountID();
        var token = sessionService.GetCurrentToken();
        var app_id = $routeParams.article_id;
        var page_id = $routeParams.subarticle_id;

        AppRegistryService.GetAppByID(account_id, token, app_id).$promise.then(function (appResponse) {
            var app = appResponse.data;
            AppRegistryService.GetPageByID(account_id, token, page_id).$promise.then(function (pageResponse) {
                var page = pageResponse.data;
                loadDataToForm(app, page);
            });
        });
    }

    function loadDataToForm(app, page) {
        $scope.Page = page;
        $scope.PageID = page.page_id;
        $scope.PageTitle = page.title;
        $scope.CurrentPageTitle = page.title;   
        $scope.PageDescription = page.description;
        $scope.PageVisibility = page.visibility_type_id;
        
        $scope.App = app;
        $scope.AppID = app.app_id;
        $scope.AppName = app.app_nickname;
        $scope.AppDescription = app.app_description;
        $scope.AppAPIKEY = app.api_key;
        $scope.AppVisibility = app.visibility_type_id;
        $scope.FormIsClean = true;

    }

    function checkForDevelopmentRedirection() {
        var protocol = window.location.protocol;
        var hostname = window.location.host;
        var port = window.location.port;

        if (port === 9000 || port === '9000') {
            $scope.BackendURLBegin = protocol + "//" + window.location.hostname + ":8080";
        } else {
            $scope.BackendURLBegin = protocol + "//" + hostname;
        }
    }
});

