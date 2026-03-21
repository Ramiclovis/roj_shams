<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';

    protected $fillable = [
        'title_ar',
        'title_en',
        'excerpt_ar',
        'excerpt_en',
        'date',
        'images',
        'videos',
        'active',
    ];

    protected $casts = [
        'images' => 'array',
        'videos' => 'array',
        'date'   => 'date',
        'active' => 'boolean',
    ];

    /* ── Scopes ── */

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('date', 'desc');
    }
}
