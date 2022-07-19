<?php
$command = "git pull origin master --force";
//$command = "git clone https://github.com/benedictnkosi/propertymanager4721.git --branch master";



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

