angular.module('pvcloudApp').controller('_mycloud_widgetsdef', function ($scope, UtilityService, AppRegistryService, sessionService, $routeParams, $location) {
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
        $location.path("/apps/" + $scope.AppID + "/tab_pages");
    };

    $scope.SaveWidget = function () {

        $scope.ValidationError_Name = "";
        $scope.ValidationError_Description = "";


        var pageToSave = {
            page_id: $scope.PageID,
            app_id: $scope.AppID,
            title: $scope.PageTitle,
            description: $scope.PageDescription,
            visibility_type_id: $scope.PageVisibility
        };

        console.log("PAGE TO SAVE");
        console.log(pageToSave);

        if (pageToSave.page_id !== undefined && pageToSave.page_id > 0) {
            updateWidget(pageToSave);
        } else {
            createWidget(pageToSave);
        }


        console.log(pageToSave);

    };

    $scope.RemoveWidget = function () {

        var page_id = $scope.PageID;
        var confirmation = confirm("¿De verdad quiere eliminar esta página?\n Todos sus widgets serán eliminados también.");
        if (confirmation) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            AppRegistryService.DeletePage(account_id, token, page_id).$promise.then(function (response) {
                UtilityService.ProcessServiceResponse(response,
                        function success(response) {
                            alert("Page " + response.data.title + " fue removida satisfactoriamente");
                            $scope.Cancelar();
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

    $scope.SwitchToTab = function (tab) {
        $scope.CurrentTab = tab;
    };

    checkForDevelopmentRedirection();

    initialize();

    function createWidget(pageToSave) {
        if (pageToSave.app_id !== undefined && pageToSave.app_id > 0) {
            if (pageToSave.title !== undefined && pageToSave.title !== "") {
                if (pageToSave.description !== undefined && pageToSave.description !== "") {

                    var account_id = sessionService.GetCurrentAccountID();
                    var token = sessionService.GetCurrentToken();

                    AppRegistryService.CreatePage(
                            account_id,
                            token,
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
                $scope.ValidationError_Name = "El nombre de la página es requerido y está vacío";
            }
        } else {
            $scope.ValidationError_Name = "Se requiere una aplicación relacionada, y el ID suministrado es inválido.";
        }
    }

    function updateWidget(pageToSave) {
        console.log("PAGE TO SAVE IN updatePage");
        console.log(pageToSave);
        if (pageToSave.title !== undefined && pageToSave.title !== "") {
            if (pageToSave.description !== undefined && pageToSave.description !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();

                AppRegistryService.UpdatePage(
                        account_id,
                        token,
                        pageToSave.page_id,
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
            $scope.ValidationError_Name = "El título de la página es requerido y está vacío";
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
        $scope.AppID = $routeParams.p1;
        $scope.PageID = $routeParams.p2;


        getDataFromServer();


        $scope.CurrentTab = $scope.Tabs.Basics;


    }

    function getDataFromServer() {
        var account_id = sessionService.GetCurrentAccountID();
        var token = sessionService.GetCurrentToken();
        var app_id = $routeParams.p1;
        var page_id = $routeParams.p2;

        AppRegistryService.GetAppByID(account_id, token, app_id).$promise.then(function (appResponse) {
            var app = appResponse.data;

            if (page_id === "new") {
                var page = {
                    page_id: "new",
                    app_id: app_id,
                    title: "",
                    description: "",
                    visibility_type_id: 1
                };
                loadDataToForm(app, page);
            } else {
                AppRegistryService.GetPageByID(account_id, token, page_id).$promise.then(function (pageResponse) {
                    var page = pageResponse.data;
                    loadDataToForm(app, page);
                });
            }
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
        var path = window.location.pathname;

        if (port === 9000) {
            $scope.URLBegin = protocol + "//" + window.location.hostname + ":8080" + path;
        } else {
            $scope.URLBegin = protocol + "//" + hostname + path;
        }
    }
});

