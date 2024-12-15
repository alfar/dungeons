<?php
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $postedData = file_get_contents("php://input");

        file_put_contents("./gamestate.json", $postedData);
    }
    else
    {
        $ifmodded = strtotime($_SERVER["HTTP_IF_MODIFIED_SINCE"]);
        $modded = filemtime("./gamestate.json");
        if ($modded > $ifmodded) {
            header("Last-Modified: " . date("D, d M Y H:i:s T", $modded));
            echo(file_get_contents("./gamestate.json"));
        }
        else
        {
            header("HTTP/1.0 304 Not modified");
        }
    }
?>