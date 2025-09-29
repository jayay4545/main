<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        try {
            // Get all users with their roles
            $users = User::with('role')->get();
            
            // Separate admins and employees
            $admins = $users->filter(function ($user) {
                return $user->role && in_array($user->role->name, ['admin', 'super_admin']);
            })->values();
            
            $employees = $users->filter(function ($user) {
                return $user->role && $user->role->name === 'employee';
            })->values();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'admins' => $admins,
                    'employees' => $employees
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'accountType' => 'required|string|in:admin,super_admin,employee',
            'username' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get role ID based on account type
            $role = Role::where('name', $request->accountType)->first();
            if (!$role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid account type'
                ], 400);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $role->id,
                'employee_id' => $request->username,
                'position' => $request->position,
                'department' => $request->department,
                'phone' => $request->phone,
                'is_active' => true,
            ]);

            // Load the role relationship
            $user->load('role');

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with('role')->find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'accountType' => 'required|string|in:admin,super_admin,employee',
            'username' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get role ID based on account type
            $role = Role::where('name', $request->accountType)->first();
            if (!$role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid account type'
                ], 400);
            }

            // Update user data
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
                'role_id' => $role->id,
                'employee_id' => $request->username,
                'position' => $request->position,
                'department' => $request->department,
                'phone' => $request->phone,
            ];

            // Only update password if provided
            if ($request->password) {
                $updateData['password'] = Hash::make($request->password);
            }

            // Only update is_active if provided
            if ($request->has('is_active')) {
                $updateData['is_active'] = $request->is_active;
            }

            $user->update($updateData);
            $user->load('role');

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Prevent deleting the last admin
            if ($user->role && in_array($user->role->name, ['admin', 'super_admin'])) {
                $adminCount = User::whereHas('role', function ($query) {
                    $query->whereIn('name', ['admin', 'super_admin']);
                })->count();
                
                if ($adminCount <= 1) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot delete the last admin user'
                    ], 400);
                }
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }
}
