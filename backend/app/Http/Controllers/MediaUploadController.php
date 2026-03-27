<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaUploadController extends Controller
{
    /**
     * POST /api/uploads/media
     * رفع ملف صورة/فيديو وإرجاع الرابط العام.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:512000'], // 500 MB
            'type' => ['required', 'in:image,video'],
        ]);

        $file = $data['file'];
        $type = $data['type'];

        if ($type === 'image' && !str_starts_with($file->getMimeType() ?? '', 'image/')) {
            return response()->json(['message' => 'الملف ليس صورة صالحة'], 422);
        }

        if ($type === 'video' && !str_starts_with($file->getMimeType() ?? '', 'video/')) {
            return response()->json(['message' => 'الملف ليس فيديو صالح'], 422);
        }

        $dir = $type === 'image'
            ? 'uploads/news/images'
            : 'uploads/news/videos';
        $path = $file->store($dir, 'public');
        $relativeUrl = Storage::url($path);
        $requestOrigin = $request->getSchemeAndHttpHost();

        return response()->json([
            'url' => $requestOrigin.$relativeUrl,
            'path' => $path,
        ], 201);
    }
}
