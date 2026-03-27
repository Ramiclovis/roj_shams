<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * GET /api/reports
     * جلب جميع البلاغات مرتبة بالأحدث
     */
    public function index(Request $request): JsonResponse
    {
        $query = Report::query();

        if ($search = $request->string('search')->trim()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        $reports = $query->orderByDesc('created_at')->orderByDesc('id')->get();

        return response()->json($reports);
    }

    /**
     * POST /api/reports
     * إضافة بلاغ جديد من صفحة المبادئ
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:300'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone'   => ['nullable', 'string', 'max:100'],
            'message' => ['nullable', 'string'],
        ]);

        $report = Report::create($data);

        return response()->json($report, 201);
    }
}
