<?php

namespace App\Http\Controllers;

use App\Models\Founder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class FounderController extends Controller
{
    /**
     * GET /api/founders
     * جلب جميع المؤسسين مرتّبين
     */
    public function index(Request $request): JsonResponse
    {
        $query = Founder::ordered();

        if ($request->boolean('active_only')) {
            $query->active();
        }

        return response()->json($query->get());
    }

    /**
     * POST /api/founders
     * إضافة مؤسس جديد
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name_ar'    => ['required', 'string', 'max:300'],
            'name_en'    => ['nullable', 'string', 'max:300'],
            'bio_ar'     => ['nullable', 'string'],
            'bio_en'     => ['nullable', 'string'],
            'phone'      => ['nullable', 'string', 'max:50'],
            'email'      => ['nullable', 'email', 'max:255'],
            'initials'   => ['nullable', 'string', 'max:4'],
            'color'      => ['nullable', 'string', 'max:10'],
            'active'     => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $founder = Founder::create($data);

        return response()->json($founder, 201);
    }

    /**
     * GET /api/founders/{id}
     */
    public function show(Founder $founder): JsonResponse
    {
        return response()->json($founder);
    }

    /**
     * PUT /api/founders/{id}
     * تحديث مؤسس
     */
    public function update(Request $request, Founder $founder): JsonResponse
    {
        $data = $request->validate([
            'name_ar'    => ['sometimes', 'required', 'string', 'max:300'],
            'name_en'    => ['nullable', 'string', 'max:300'],
            'bio_ar'     => ['nullable', 'string'],
            'bio_en'     => ['nullable', 'string'],
            'phone'      => ['nullable', 'string', 'max:50'],
            'email'      => ['nullable', 'email', 'max:255'],
            'initials'   => ['nullable', 'string', 'max:4'],
            'color'      => ['nullable', 'string', 'max:10'],
            'active'     => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $founder->update($data);

        return response()->json($founder);
    }

    /**
     * DELETE /api/founders/{id}
     */
    public function destroy(Founder $founder): JsonResponse
    {
        $founder->delete();

        return response()->json(['message' => 'تم الحذف بنجاح']);
    }

    /**
     * PATCH /api/founders/{id}/toggle
     * تبديل نشط / غير نشط
     */
    public function toggle(Founder $founder): JsonResponse
    {
        $founder->update(['active' => ! $founder->active]);

        return response()->json($founder);
    }

    /**
     * POST /api/founders/reorder
     * إعادة ترتيب المؤسسين
     * Body: { "order": [3, 1, 5, 2, ...] }  (مصفوفة IDs بالترتيب الجديد)
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order'   => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($request->order as $position => $id) {
            Founder::where('id', $id)->update(['sort_order' => $position]);
        }

        return response()->json(['message' => 'تم إعادة الترتيب']);
    }
}
