<?php
use mysqli;

$filename = "ultimaEjecucion.txt";
// Crea una conexión a la base de datos
$conn = new mysqli("127.0.0.1", "root", "", "reto");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//todo select bbdd empresas
$query = "SELECT empresa FROM empresas";
$result = mysqli_query($conn, $query);
$empresas = array();
while($row = mysqli_fetch_array($result)){
    array_push($empresas, $row["empresa"]);
}


//$empresas = ['BBVA', 'FERRO', 'CELL', 'IBE', 'NAT', 'REP', 'SANT', 'TELF'];
$frecuencia = 60;
$ultimaEjecucion;
function rand_float($st_num = 0, $end_num = 1, $mul = 1000000)
{
    if ($st_num > $end_num)
        return false;
    return mt_rand($st_num * $mul, $end_num * $mul) / $mul;
}


if (file_exists($filename)) {
    $file = fopen($filename, "r");

    if ($file == false) {
        echo ("Error in opening file");
        exit();
    }

    $filesize = filesize($filename);
    $filetext = fread($file, $filesize);
    fclose($file);
    date_default_timezone_set('UTC');
    $ultimaEjecucion = date($filetext);
    echo $filetext;
    echo "leido: " . $ultimaEjecucion;
    $now = time();
    echo "u: " . $ultimaEjecucion . " n: " . $now;
    for ($i = $ultimaEjecucion+60; $i < $now; $i = $i + $frecuencia) {
        $newDate = $i;
        for ($j = 0; $j < sizeof($empresas); $j++) {
            $empresa = $empresas[$j];
            $randomFloat = number_format(rand_float(20, 80), 2);
            // Prepara la consulta SQL
            $sql = "INSERT INTO cotizacion (fecha, var, empresa) VALUES (FROM_UNIXTIME('$newDate'), '$randomFloat', '$empresa')";
            // Ejecuta la consulta
            if (mysqli_query($conn, $sql)) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $sql . "<br>" . mysqli_error($conn);
            }


            //todo insert variable empresa valor fake date timestamp
            echo $newDate . " " . $empresa . " " . $randomFloat . "\n";
            usleep(1);
        }

    }
    // Cierra la conexión
    $conn->close();
    $ultimaEjecucion = $newDate;
} else {
    date_default_timezone_set('UTC');
    $now = time();
    $ultimaEjecucion = $now;
    echo $ultimaEjecucion;
}


$file = fopen($filename, "w");

if ($file == false) {
    echo ("Error in opening new file");
    exit();
}
fwrite($file, $ultimaEjecucion);
fclose($file);