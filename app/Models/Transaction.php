<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'request_id',
        'equipment_id',
        'user_id',
        'transaction_type',
        'status',
        'issued_at',
        'returned_at',
        'expected_return_date',
        'condition_on_issue',
        'condition_on_return',
        'notes',
        'processed_by',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'returned_at' => 'datetime',
        'expected_return_date' => 'date',
    ];

    // Relationships
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Accessors & Mutators
    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed';
    }

    public function getIsOverdueAttribute()
    {
        return $this->status === 'overdue';
    }

    public function getDurationAttribute()
    {
        if ($this->issued_at && $this->returned_at) {
            return $this->issued_at->diffInDays($this->returned_at);
        }
        return null;
    }
}
