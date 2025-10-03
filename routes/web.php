<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\ActivityLogController;

// Authentication routes
Route::get('/', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/check-auth', [AuthController::class, 'checkAuth'])->name('check.auth');
Route::get('/login-data', [AuthController::class, 'getLoginData'])->name('login.data');
Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
})->name('csrf.token');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    // Admin dashboard (for super_admin and admin roles)
    Route::get('/dashboard', function () {
        return view('home'); // loads resources/views/home.blade.php with Dashboard component
    })->name('dashboard');

    // Employee dashboard (for employee role)
    Route::get('/employee/dashboard', function () {
        return view('employee_dashboard');
    })->name('employee.dashboard');

    Route::get('/employee', function () {
        return view('employee_page');
    })->name('employee');

    Route::get('/viewapproved', function () {
        return view('viewapproved'); // loads resources/views/viewapproved.blade.php
    })->name('viewapproved');

    Route::get('/viewrequest', function () {
        return view('viewrequest'); // loads resources/views/viewrequest.blade.php
    })->name('viewrequest');

    Route::get('/activitylogs', function () {
        return view('activitylogs');
    })->name('activitylogs');

    // Activity Logs JSON endpoints (session-authenticated)
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/user/{userId}', [ActivityLogController::class, 'forUser']);
    Route::get('/activity-logs/model/{modelType}/{modelId?}', [ActivityLogController::class, 'forModel']);
    Route::get('/activity-logs/recent', [ActivityLogController::class, 'recent']);
    Route::get('/activity-logs/search', [ActivityLogController::class, 'search']);

    // Role management page (super_admin only)
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/role-management', function () {
            return view('role-management');
        })->name('role-management');
    });

    // Role management API (session auth + role check)
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::get('/roles/{id}', [RoleController::class, 'show']);
        Route::put('/roles/{id}', [RoleController::class, 'update']);
        Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
        Route::post('/roles/{id}/permissions', [RoleController::class, 'setPermissions']);
    });
});

Route::get('/equipment', function () {
    return view('equipment');
})->name('equipment');

Route::get('/addstocks', function () {
    return view('addstocks');
})->name('addstocks');

Route::get('/additems', function () {
    return view('addstocks');
})->name('additems');


Route::get('/users', function () {
    return view('users');
})->name('users');

Route::get('/control-panel', function () {
    return view('control-panel');
})->name('control-panel');

Route::get('/reports', function () {
    return view('reports');
})->name('reports');
