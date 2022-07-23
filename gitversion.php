<?php


echo 'Current PHP version: ' . phpversion() . "<br>";

echo 'checking git....';

get();

    function get()
    {
      $gitversion = trim(exec('git version'));
       echo $gitversion;

    }


?>
