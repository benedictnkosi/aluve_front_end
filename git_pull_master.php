<?php
$command = "git config --global user.email nkosi.benedict@gmail.com";
exec($command.' 2>&1', $tmp, $return_code); // Execute the command

$command = "git config --global user.name nkosibenedict";
exec($command.' 2>&1', $tmp, $return_code); // Execute the command


$command = "git pull origin main --force";
//$command = "git clone https://github.com/benedictnkosi/aluve_front_end.git --branch main";

exec($command.' 2>&1', $tmp, $return_code); // Execute the command

// Output the result

printf('
    
<span class="prompt">$</span> <span class="command">%s</span>
    
<div class="output">%s</div>
    
'
    
    , htmlentities(trim($command))
    
    , htmlentities(trim(implode("\n", $tmp)))
    
    );

$output = ob_get_contents();

echo $tmp;

echo $output;

?>

