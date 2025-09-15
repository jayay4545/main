<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EquipmentController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public Authentication Routes
Route::post('auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication Routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::put('auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('auth/change-password', [AuthController::class, 'changePassword']);

    // Equipment Routes
    Route::apiResource('equipment', EquipmentController::class);
    Route::get('equipment-statistics', [EquipmentController::class, 'statistics']);

    // Request Routes
    Route::apiResource('requests', RequestController::class);
    Route::post('requests/{id}/approve', [RequestController::class, 'approve']);
    Route::post('requests/{id}/reject', [RequestController::class, 'reject']);
    Route::get('request-statistics', [RequestController::class, 'statistics']);

    // Transaction Routes
    Route::apiResource('transactions', TransactionController::class);

    // Admin Only Routes
    Route::middleware('role:super_admin,admin')->group(function () {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::apiResource('users', UserController::class);
    });
});