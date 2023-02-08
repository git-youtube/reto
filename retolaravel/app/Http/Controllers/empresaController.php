<?php

namespace App\Http\Controllers;
use App\Models\Cotizacion;
use App\Models\Empresa;

class empresaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }


    //todo obtener ultima cotizacion
    public function obtenerUltimaCotizacion($nombre){
        $cotizacion = Cotizacion::where('empresa', $nombre)->orderBy('fecha', 'desc')->select('var')->first();
        return $cotizacion;
    }


    //todo obtener diferencia

    public function obtenerDiferenciaCotizacion($nombre){
        $ultima=$this->obtenerUltimaCotizacion($nombre);
        $cotizacion = Cotizacion::where('empresa', $nombre)->orderBy('fecha', 'desc')->select('var')->skip(1)->first();
        if($ultima>$cotizacion){
            return 1;
        }else{
            return 0;
        }
        
    }


    //todo obtener datos empresa

    public function obtenerTodoEmpresa($nombre){
        $cotizacion = Cotizacion::where('empresa', $nombre)->orderBy('fecha', 'desc')->select('fecha','var')->get();
        return $cotizacion;
    }


    //todo devolver lista de empresas como array
    public function obtenerEmpresas(){
        $empresas = Empresa::all()->toArray();
        return $empresas;
    }
}
