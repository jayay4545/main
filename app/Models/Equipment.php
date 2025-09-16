<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Equipment extends Model
{
    protected $table = 'equipments';

    protected $fillable = [
        'name',
        'brand',
        'model',
        'specifications',
        'serial_number',
        'asset_tag',
        'status',
        'condition',
        'purchase_price',
        'purchase_date',
        'warranty_expiry',
        'notes',
        'location',
        'category_id',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'purchase_date' => 'date',
        'warranty_expiry' => 'date',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(EquipmentCategory::class);
    }

    public function requests(): HasMany
    {
        return $this->hasMany(Request::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeInUse($query)
    {
        return $query->where('status', 'in_use');
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Accessors & Mutators
    public function getFullNameAttribute()
    {
        return "{$this->brand} {$this->name} {$this->model}";
    }

    public function getIsAvailableAttribute()
    {
        return $this->status === 'available';
    }
}
