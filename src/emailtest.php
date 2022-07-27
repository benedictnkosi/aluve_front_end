<?php
require_once(__DIR__ . './app/application.php');

$email = 'info@aluvegh.co.za';
$password = 'Nhlaka@02';

$mailConn = imap_open("{mail.aluvegh.co.za:995/pop3/ssl/novalidate-cert}", $email, $password);
$search = 'ON ' . date('d-M-Y'); // search for today's email only
$emails = imap_search($mailConn, ' SUBJECT "Reservation confirmed"');

foreach ($emails as $emailID) {
    $overview = imap_fetch_overview($mailConn, $emailID, 0);
    $emailSubject = $overview[0]->subject;
    echo $emailSubject;
    break;
}
?>