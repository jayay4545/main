<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TransactionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Employee routes
Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/employees/current-holders', [EmployeeController::class, 'currentHolders']);
Route::get('/employees/pending-requests', [EmployeeController::class, 'pendingRequests']);
Route::get('/employees/verify-returns', [EmployeeController::class, 'verifyReturns']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);

// Transaction routes
Route::get('/transactions', [TransactionController::class, 'index']);
Route::get('/transactions/dashboard', [TransactionController::class, 'dashboard']);
Route::put('/transactions/{id}/status', [TransactionController::class, 'updateStatus']);
