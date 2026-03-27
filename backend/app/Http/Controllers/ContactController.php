<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * GET /api/contact
     * جلب جميع الرسائل (للوحة التحكم)
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactMessage::query();

        if ($search = $request->string('search')->trim()) {
            $query->where(function ($q) use ($search) {
                $q->where('name',    'like', "%{$search}%")
                  ->orWhere('email',   'like', "%{$search}%")
                  ->orWhere('subject', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderByDesc('created_at')->get()
        );
    }

    /**
     * POST /api/contact
     * حفظ رسالة جديدة من صفحة التواصل
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:300'],
            'email'   => ['nullable', 'email', 'max:300'],
            'phone'   => ['nullable', 'string', 'max:60'],
            'subject' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $msg = ContactMessage::create($data);

        return response()->json($msg, 201);
    }

    /**
     * PATCH /api/contact/{id}/read
     * تحديد الرسالة كمقروءة
     */
    public function markRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);
        return response()->json($contactMessage);
    }

    /**
     * DELETE /api/contact/{id}
     * حذف رسالة
     */
    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();
        return response()->json(['message' => 'تم الحذف']);
    }
}
