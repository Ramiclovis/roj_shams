<?php

namespace App\Http\Controllers;

use App\Models\Objective;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ObjectiveController extends Controller
{
    /**
     * GET /api/objectives
     * جلب جميع الأنشطة والبرامج
     */
    public function index(Request $request): JsonResponse
    {
        $query = Objective::ordered();

        if ($request->boolean('active_only')) {
            $query->active();
        }

        if ($search = $request->string('search')->trim()) {
            $query->where(function ($q) use ($search) {
                $q->where('title_ar', 'like', "%{$search}%")
                  ->orWhere('title_en', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    /**
     * POST /api/objectives
     * إضافة نشاط جديد
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'icon_name'      => ['nullable', 'string', 'max:60'],
            'title_ar'       => ['required', 'string', 'max:400'],
            'title_en'       => ['nullable', 'string', 'max:400'],
            'needs_ar'       => ['nullable', 'string'],
            'needs_en'       => ['nullable', 'string'],
            'work_ar'        => ['nullable', 'string'],
            'work_en'        => ['nullable', 'string'],
            'activities_ar'  => ['nullable', 'array'],
            'activities_ar.*'=> ['nullable', 'string'],
            'activities_en'  => ['nullable', 'array'],
            'activities_en.*'=> ['nullable', 'string'],
            'images'         => ['nullable', 'array'],
            'images.*'       => ['nullable', 'string'],
            'videos'         => ['nullable', 'array'],
            'videos.*'       => ['nullable', 'string'],
            'active'         => ['boolean'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        $objective = Objective::create($data);

        return response()->json($objective, 201);
    }

    /**
     * GET /api/objectives/{id}
     */
    public function show(Objective $objective): JsonResponse
    {
        return response()->json($objective);
    }

    /**
     * PUT /api/objectives/{id}
     * تحديث نشاط
     */
    public function update(Request $request, Objective $objective): JsonResponse
    {
        $data = $request->validate([
            'icon_name'      => ['nullable', 'string', 'max:60'],
            'title_ar'       => ['sometimes', 'required', 'string', 'max:400'],
            'title_en'       => ['nullable', 'string', 'max:400'],
            'needs_ar'       => ['nullable', 'string'],
            'needs_en'       => ['nullable', 'string'],
            'work_ar'        => ['nullable', 'string'],
            'work_en'        => ['nullable', 'string'],
            'activities_ar'  => ['nullable', 'array'],
            'activities_ar.*'=> ['nullable', 'string'],
            'activities_en'  => ['nullable', 'array'],
            'activities_en.*'=> ['nullable', 'string'],
            'images'         => ['nullable', 'array'],
            'images.*'       => ['nullable', 'string'],
            'videos'         => ['nullable', 'array'],
            'videos.*'       => ['nullable', 'string'],
            'active'         => ['boolean'],
            'sort_order'     => ['integer', 'min:0'],
        ]);

        $objective->update($data);

        return response()->json($objective);
    }

    /**
     * DELETE /api/objectives/{id}
     */
    public function destroy(Objective $objective): JsonResponse
    {
        $objective->delete();

        return response()->json(['message' => 'تم الحذف بنجاح']);
    }

    /**
     * PATCH /api/objectives/{id}/toggle
     * تبديل نشط / غير نشط
     */
    public function toggle(Objective $objective): JsonResponse
    {
        $objective->update(['active' => ! $objective->active]);

        return response()->json($objective);
    }

    /**
     * POST /api/objectives/reorder
     * إعادة ترتيب الأنشطة
     * Body: { "order": [2, 5, 1, ...] }
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order'   => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($request->order as $position => $id) {
            Objective::where('id', $id)->update(['sort_order' => $position]);
        }

        return response()->json(['message' => 'تم إعادة الترتيب']);
    }
}
