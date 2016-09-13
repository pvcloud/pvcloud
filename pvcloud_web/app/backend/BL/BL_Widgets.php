<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BL_Widgets
 *
 * @author janunezc
 */
class BL_Widgets {

    public static function AddWidget() {

        $responseData = new simpleResponse();
        try {
            $parameters = BL_Widgets::collectParameters();
            $parametersErrors = BL_Widgets::validateParameters($parameters);

            if (count($parametersErrors) == 0) {
                $savedWidget = BL_Widgets::saveWidget($parameters);
                if ($savedWidget->widget_id > 0) {
                    $responseData->message = "Widget guardado satisfactoriamente";
                    $responseData->status = "OK";
                    $responseData->data = $savedWidget;
                }
            } else {
                $responseData->message = "Parámetros Inválidos";
                $responseData->status = "ERROR";
                $responseData->data = $parametersErrors;
            }
        } catch (Exception $ex) {
            $responseData->message = $ex->getMessage();
            $responseData->status = "EXCEPTION";
            $responseData->data = NULL;
        }

        return $responseData;
    }

    private static function collectParameters() {

        $rawPOSTContent = file_get_contents('php://input');
        $decodedPOSTParams = json_decode($rawPOSTContent);

        $parameters = new stdClass();
        $parameters->page_id = $decodedPOSTParams->page_id;
        $parameters->widget_type_id = $decodedPOSTParams->widget_type_id;
        $parameters->title = $decodedPOSTParams->title;
        $parameters->description = $decodedPOSTParams->description;
        $parameters->order = $decodedPOSTParams->order;
        $parameters->refresh_frequency_sec = $decodedPOSTParams->refresh_frequency_sec;

        return $parameters;
    }

    private static function validateParameters($parameters) {
        $errorsFound = [];

        if (!is_numeric($parameters->page_id) || !$parameters->page_id > 0) {
            $errorsFound[] = "ID de la página es inválido.";
        }

        if (!is_numeric($parameters->widget_type_id) || !$parameters->widget_type_id > 0) {
            $errorsFound[] = "Tipo de widget es inválido.";
        }

        if (!is_string($parameters->title) || $parameters->title == "") {
            $errorsFound[] = "Título del widget es inválido.";
        }

        if (!is_string($parameters->description) || $parameters->description == "") {
            $errorsFound[] = "Descripción del widget es inválido.";
        }

        if (!is_numeric($parameters->order) || !($parameters->order >= 1)) {
            $errorsFound[] = "Orden del Widget es inválido.";
        }

        if (!is_numeric($parameters->refresh_frequency_sec) || !($parameters->refresh_frequency_sec >= 1)) {
            $errorsFound[] = "Frecuencia es inválida.";
        }

        return $errorsFound;
    }

    private static function saveWidget($parameters) {
        return da_widgets::AddWidget($parameters);
    }

}
