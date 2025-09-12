<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SuperAdminController extends Controller
{
    /**
     * Display the SuperAdmin dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return view('superadmin');
    }
}