<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class NewsController extends Controller
{
    /**
     * GET /api/news
     * جلب جميع الأخبار (مع دعم فلتر active وبحث نصي)
     */
    public function index(Request $request): JsonResponse
    {
        $query = News::query();

        if ($request->boolean('active_only')) {
            $query->active();
        }

        if ($search = $request->string('search')->trim()) {
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%")
                  ->orWhere('excerpt_ar', 'like', "%{$search}%");
            });
        }

        $news = $query->orderByDesc('date')->orderByDesc('id')->get();

        return response()->json($news);
    }

    /**
     * POST /api/news
     * إضافة خبر جديد
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title_ar'   => ['required', 'string', 'max:500'],
            'title_en'   => ['nullable', 'string', 'max:500'],
            'excerpt_ar' => ['nullable', 'string'],
            'excerpt_en' => ['nullable', 'string'],
            'date'       => ['nullable', 'date'],
            'images'     => ['nullable', 'array'],
            'images.*'   => ['nullable', 'string'],
            'videos'     => ['nullable', 'array'],
            'videos.*'   => ['nullable', 'string'],
            'active'     => ['boolean'],
        ]);

        $news = News::create($data);

        return response()->json($news, 201);
    }

    /**
     * GET /api/news/{id}
     * جلب خبر واحد
     */
    public function show(News $news): JsonResponse
    {
        return response()->json($news);
    }

    /**
     * PUT /api/news/{id}
     * تحديث خبر
     */
    public function update(Request $request, News $news): JsonResponse
    {
        $data = $request->validate([
            'title_ar'   => ['sometimes', 'required', 'string', 'max:500'],
            'title_en'   => ['nullable', 'string', 'max:500'],
            'excerpt_ar' => ['nullable', 'string'],
            'excerpt_en' => ['nullable', 'string'],
            'date'       => ['nullable', 'date'],
            'images'     => ['nullable', 'array'],
            'images.*'   => ['nullable', 'string'],
            'videos'     => ['nullable', 'array'],
            'videos.*'   => ['nullable', 'string'],
            'active'     => ['boolean'],
        ]);

        $news->update($data);

        return response()->json($news);
    }

    /**
     * DELETE /api/news/{id}
     * حذف خبر
     */
    public function destroy(News $news): JsonResponse
    {
        $news->delete();

        return response()->json(['message' => 'تم الحذف بنجاح']);
    }

    /**
     * PATCH /api/news/{id}/toggle
     * تبديل حالة النشر (نشط / غير نشط)
     */
    public function toggle(News $news): JsonResponse
    {
        $news->update(['active' => ! $news->active]);

        return response()->json($news);
    }
}
