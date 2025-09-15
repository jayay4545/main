<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return view('welcome');
});

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

 
Route::post('/login', function () {
    // Get credentials from request
    $email = request('email');
    $password = request('password');
    
    // Check if superadmin credentials
    if ($email === 'superadmin@ireply.com' && $password === 'admin123') {
        // Redirect superadmin to dashboard
        return redirect()->route('dashboard');
    }
    
    // Check if admin credentials
    if ($email === 'admin@ireply.com' && $password === 'admin123') {
        // Redirect to dashboard
        return redirect()->route('dashboard');
    }
    
    // For all other users, redirect to employee page
    return redirect()->route('employee');
})->name('login');

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
