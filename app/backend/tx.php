<?php
function byVal($arg) {
    echo 'As passed     : ', var_export(func_get_args()), PHP_EOL;
    $arg = 'baz';
    echo 'After change  : ', var_export(func_get_args()), PHP_EOL;
}

function byRef(&$arg) {
    echo 'As passed     : ', var_export(func_get_args()), PHP_EOL;
    $array = var_export(func_get_args());
    
    $array[0]="xyzx";
    $array[1]="yyyy";
    
    echo 'After change  : ', var_export(func_get_args()), PHP_EOL;
}

$arg1 = 'bar';
$arg2 = 'xyz';
byVal($arg1,$arg2);
byRef($arg1,$arg2);
echo"<br>OK:<br>$arg1";
print_r($arg1,$arg2);