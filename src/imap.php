<?php
require_once(__DIR__ . './app/application.php');

getTodayEmails();
function getTodayEmails()
{
    $mailConn = imap_open("{".EMAIL_SERVER.":".EMAIL_SERVER_PORT."/pop3/ssl/novalidate-cert}", EMAIL_ADDRESS, EMAIL_PASSWORD);
    $search = 'ON ' . date('d-M-Y'); // search for today's email only
    $emails = imap_search($mailConn, $search);

    if ($emails) {
        foreach ($emails as $emailID) {
            $overview = imap_fetch_overview($mailConn, $emailID, 0);
            $emailSubject = $overview[0]->subject;
            echo $emailSubject;
            try {
                $pos = strpos($emailSubject, 'Reservation confirmed');
                if ($pos !== false) {
                    $emailMsgNumber = $overview[0]->msgno;

                    $bodyText = imap_fetchbody($mailConn, $emailMsgNumber, 1);
                    if (! strlen($bodyText) > 0) {
                        echo 'body is empty';
                        $bodyText = imap_fetchbody($mailConn, $emailMsgNumber, 1);
                    }
                    $bodyText = quoted_printable_decode($bodyText);

                    $guestName = trim(getStringByBoundary($emailSubject, 'Reservation confirmed - ', ' arrives '));
                    $confirmationCode = trim(getStringByBoundary($bodyText, 'Confirmation code', 'View itinerary'));

                    $result = updateGuestName($confirmationCode, $guestName);
                    $temporary1 = array(
                        'result_code' => 0,
                        'result_description' => $result
                    );
                    echo json_encode($temporary1);
                }
            } catch (\Throwable $e) {
                $temporary1 = array(
                    'result_code' => 1,
                    'result_description' => "Exception occurred"
                );

                echo json_encode($temporary1);
                print_r($e);
            }
        }
    } else {
        $temporary1 = array(
            'result_code' => 0,
            'result_description' => "no emails found"
        );

        echo json_encode($temporary1);
    }
}

function getStringByBoundary($string, $leftBoundary, $rightBoundary){
    preg_match('~'.$leftBoundary.'([^{]*)'.$rightBoundary.'~i', $string, $match);
    var_dump($match[1]); // string(9) "123456789"
    return $match[1];
}

function updateGuestName($confirmationCode, $guestName): bool|string
{
    $url = API_SERVER . "/api/guests/airbnbname/".$confirmationCode."/" .urlencode($guestName);
    echo $url;
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $resp = curl_exec($curl);
    curl_close($curl);
    var_dump($resp);
    return true;
}

?>