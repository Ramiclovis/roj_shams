<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Objective extends Model
{
    use HasFactory;

    protected $fillable = [
        'icon_name',
        'title_ar',
        'title_en',
        'needs_ar',
        'needs_en',
        'work_ar',
        'work_en',
        'activities_ar',
        'activities_en',
        'images',
        'videos',
        'active',
        'sort_order',
    ];

    protected $casts = [
        'activities_ar' => 'array',
        'activities_en' => 'array',
        'images'        => 'array',
        'videos'        => 'array',
        'active'        => 'boolean',
    ];

    /* ── Scopes ── */

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
