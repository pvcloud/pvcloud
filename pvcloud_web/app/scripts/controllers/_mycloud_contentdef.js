angular.module('pvcloudApp').controller('_mycloud_contentdef', function ($scope, UtilityService, contentService, AppRegistryService, sessionService, $routeParams, $location) {
    console.log("This is _mycloud_contentdef controller being invoked");

    $scope.SetFormDirty = function () {
        $scope.FormIsClean = false;
    };

    $scope.Cancelar = function () {
        if (!$scope.FormIsClean) {
            if (!confirm("All your unsaved changes will be lost. Do you want to continue?")) {
                return;
            }
        }
        $location.path("/apps/");
    };

    $scope.SaveContent = function () {

        $scope.ValidationError_Title = "";
        $scope.ValidationError_Content = "";


        var contentToSave = {
            content_id: $scope.content_id,
            title: $scope.title,
            content: $scope.content
        };

        console.log("Content TO SAVE");
        console.log(contentToSave);

        if (contentToSave.content_id !== undefined && contentToSave.content_id > 0) {
            updateContent(contentToSave);
        } else {
            createContent(contentToSave);
        }


        console.log(contentToSave);

    };

    $scope.DeleteContent = function () {

        var content_id = $scope.content_id;
        var confirmation = confirm("¿De verdad quiere eliminar este contenido?");
        if (confirmation) {
            var account_id = sessionService.GetCurrentAccountID();
            var token = sessionService.GetCurrentToken();
            /* TODO: CALL Content Service to remove content
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
            });*/
        }
    };

    $scope.SwitchToTab = function (tab) {
        $scope.CurrentTab = tab;
    };

    checkForDevelopmentRedirection();

    initialize();

    function createContent(contentToSave) {
            console.log('createContent '+contentToSave);

            if (contentToSave.title !== undefined && contentToSave.title !== "") {
                if (contentToSave.content !== undefined && contentToSave.content !== "") {

                    var account_id = sessionService.GetCurrentAccountID();
                    var token = sessionService.GetCurrentToken();

                    contentToSave.content =  encodeURIComponent(contentToSave.content);
                    contentService.CreateContent(
                            account_id,
                            token,
                            contentToSave.title,
                            contentToSave.content                
                            ).then(
                                function success(response) {
                                    alert("Los datos se almacenaron satisfactoriamente.");
                                     $location.path("/apps/");
                                },
                                function error(response) {
                                    alert("Error almacenando los datos!");
                                    // $location.path("/apps/");
                                     console.log(response);

                                }//,
                              //  function exception(response) {
                                //    alert("Error almacenando los datos!");
                                  //  console.log(response);
                                //}
                                );
                   // });    

                    /** TODO: Web service to add content
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
                    });**/
                } else {
                    $scope.ValidationError_Content = "El contenido no puede estar vacío";
                }
            } else {
                $scope.ValidationError_Title = "El título del contenido es requerido y está vacío";
            }
        
    }

    function updateContent(contentToSave) {
        
        console.log(contentToSave);
        if (contentToSave.title !== undefined && contentToSave.title !== "") {
            if (contentToSave.content !== undefined && contentToSave.content !== "") {
                var account_id = sessionService.GetCurrentAccountID();
                var token = sessionService.GetCurrentToken();
                /* TODO: Call content service to update
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
                });*/
            } else {
                $scope.ValidationError_Content = "El contenido no puede estar vacío";
            }
        } else {
            $scope.ValidationError_Name = "El título del contenido es requerido y está vacío";
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



        getDataFromServer();


        $scope.CurrentTab = $scope.Tabs.Basics;


    }

    function getDataFromServer() {
        var account_id = sessionService.GetCurrentAccountID();
        var token = sessionService.GetCurrentToken();
        var content_id = $routeParams.p1;
 
        
        if(content_id === "new")
        {

            var content = {
                    content_id: "new",
                    title: "",
                    content: ""
                };
                loadDataToForm(content);

            /* TODO: load data to page
            AppRegistryService.GetAppByID(account_id, token, app_id).$promise.then(function (appResponse) {
                var app = appResponse.data;
                var page = {
                    page_id: "new",
                    app_id: app_id,
                    title: "",
                    description: "",
                    visibility_type_id: 1
                };
                loadDataToForm(app, page);
            });*/
        
        }
        else
        {
            /* TODO: Load data to page
            AppRegistryService.GetPageByID(account_id, token, page_id).$promise.then(function (pageResponse) {
                var page = pageResponse.data;
                AppRegistryService.GetAppByID(account_id, token, page.app_id).$promise.then(function (appResponse) {
                    var app = appResponse.data;
                    loadDataToForm(app, page);
                });
                
            });*/
        
        }
       

      

    }

    function loadDataToForm(content) {
        $scope.ContentObj = content;
        $scope.content_id = content.page_id;
        $scope.title = content.title;
        $scope.CurrentContentTitle = content.title;
        $scope.content = content.content;

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

