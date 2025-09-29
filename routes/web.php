<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AuthController;

// Authentication routes
Route::get('/', [AuthController::class, 'showLoginForm'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/check-auth', [AuthController::class, 'checkAuth'])->name('check.auth');
Route::get('/login-data', [AuthController::class, 'getLoginData'])->name('login.data');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return view('home'); // loads resources/views/home.blade.php with Dashboard component
    })->name('dashboard');

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

Route::get('/role-management', function () {
    return view('role-management');
})->name('role-management');

Route::get('/users', function () {
    return view('users');
})->name('users');

Route::get('/control-panel', function () {
    return view('control-panel');
})->name('control-panel');

Route::get('/reports', function () {
    return view('reports');
})->name('reports');
