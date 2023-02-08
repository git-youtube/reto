<?php

$filename = "ultimaEjecucion.txt";
$host = '192.168.1.43';
$dbname = 'reto';
$username = 'reto';
$password = 'reto';

// Crea una conexión a la base de datos
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

//todo select bbdd empresas
$query = "SELECT empresa FROM empresas";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

$empresas = array();
foreach ($result as $row) {
    array_push($empresas, $row["empresa"]);
}

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
        $newDate = $now;
        for ($j = 0; $j < sizeof($empresas); $j++) {
            $empresa = $empresas[$j];
            $randomFloat = number_format(rand_float(20, 80), 2);
            // Prepara la consulta SQL
            $sql = "INSERT INTO cotizacion (fecha, var, empresa) VALUES (FROM_UNIXTIME('$newDate'), '$randomFloat', '$empresa')";
            // Ejecuta la consulta
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            echo $newDate . " " . $empresa . " " . $randomFloat . "\n";
            usleep(1);
        }

    // Cierra la conexión
    $pdo = null;
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