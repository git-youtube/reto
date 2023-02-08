<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cotizacion extends Model
{
    use HasFactory;
    public $timestamps = false;

    
        protected $table = 'cotizacion';
    
        protected $fillable = [
            'fecha', 'empresa', 'var'
        ];
    
    
}
