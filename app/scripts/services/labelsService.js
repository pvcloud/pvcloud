'use strict';

angular.module('pvcloudApp').factory('LabelsService', function ($resource, UtilityService) {
    var baseURL = UtilityService.GetBackendBaseURL();
    var currentLanguageCode = "";
    var currentLabels = undefined;

    function getLanguageLabels(langCode, callback) {
        if (langCode === currentLanguageCode && currentLabels !== undefined) {
            callback(currentLabels);
        } else {
            currentLanguageCode = langCode;
            var jsonFileName = "page_labels_" + currentLanguageCode + ".json";
            var labelsResource = $resource(jsonFileName, {});
            labelsResource.get().$promise.then(function (response) {
                currentLabels = response;
                callback(currentLabels);
            });
        }
    }

    function getLabels(callback) {
        console.log("GET LABELS");
        console.log(currentLabels);
        console.log(currentLanguageCode);
        if (!currentLabels) {
            getLanguageLabels('ES', callback);
        } else {
            callback(currentLabels);
        }
    }

    return {
        GetLanguageLabels: getLanguageLabels,
        GetLabels: getLabels
    };
});