<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    /**
     * GET /api/admin-users
     * عرض المستخدمين مع إمكانية البحث عبر ?search=
     */
    public function index(Request $request): JsonResponse
    {
        $query = AdminUser::query();

        if ($search = $request->string('search')->trim()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%")
                  ->orWhere('status', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    /**
     * POST /api/admin-users
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'   => ['required', 'string', 'max:200'],
            'email'  => ['required', 'string', 'max:190', 'email', 'unique:admin_users,email'],
            'password' => ['required', 'string', 'min:6', 'max:255'],
            'phone'  => ['nullable', 'string', 'max:50'],
            'role'   => ['required', 'string', 'max:50'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        $user = AdminUser::create($data);
        return response()->json($user, 201);
    }

    /**
     * PUT /api/admin-users/{adminUser}
     */
    public function update(Request $request, AdminUser $adminUser): JsonResponse
    {
        $data = $request->validate([
            'name'   => ['required', 'string', 'max:200'],
            'email'  => ['required', 'string', 'max:190', 'email', 'unique:admin_users,email,' . $adminUser->id],
            'password' => ['nullable', 'string', 'min:6', 'max:255'],
            'phone'  => ['nullable', 'string', 'max:50'],
            'role'   => ['required', 'string', 'max:50'],
            'status' => ['required', 'string', 'max:50'],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $adminUser->update($data);
        return response()->json($adminUser);
    }

    /**
     * DELETE /api/admin-users/{adminUser}
     */
    public function destroy(AdminUser $adminUser): JsonResponse
    {
        $adminUser->delete();
        return response()->json(['message' => 'تم الحذف بنجاح']);
    }

    /**
     * PATCH /api/admin-users/{adminUser}/toggle
     * تبديل الحالة 'نشط' <-> 'معطّل'
     */
    public function toggle(AdminUser $adminUser): JsonResponse
    {
        $adminUser->update([
            'status' => $adminUser->status === 'نشط' ? 'معطّل' : 'نشط',
        ]);

        return response()->json($adminUser);
    }

    /**
     * POST /api/admin-users/login
     * تسجيل دخول الأدمن عبر email + password
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email', 'max:190'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $user = AdminUser::where('email', $data['email'])->first();

        $passwordOk = false;
        if ($user && $user->password) {
            // Normal secure flow (bcrypt hash from API create/update)
            $passwordOk = Hash::check($data['password'], $user->password);
            // Compatibility: allow plain password if added manually in DB
            if (! $passwordOk) {
                $passwordOk = hash_equals((string) $user->password, (string) $data['password']);
            }
        }

        if (! $user || ! $passwordOk) {
            return response()->json(['message' => 'اسم المستخدم أو كلمة المرور غير صحيحة'], 422);
        }

        if ($user->status !== 'نشط') {
            return response()->json(['message' => 'هذا الحساب غير نشط'], 403);
        }

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user,
        ]);
    }
}

