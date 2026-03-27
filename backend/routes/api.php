<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\FounderController;
use App\Http\Controllers\ObjectiveController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminUserController;

/*
|--------------------------------------------------------------------------
| API Routes — Shams Roj
|--------------------------------------------------------------------------
|
| جميع المسارات هنا تحت بادئة /api  (مُعرَّف في bootstrap/app.php)
| لم يتم ربط هذه المسارات بالـ Frontend بعد.
|
*/

/* ── News ──────────────────────────────────────────── */
Route::prefix('news')->group(function () {
    Route::get('/',         [NewsController::class, 'index']);   // GET    /api/news
    Route::post('/',        [NewsController::class, 'store']);   // POST   /api/news
    Route::get('/{news}',   [NewsController::class, 'show']);    // GET    /api/news/{id}
    Route::put('/{news}',   [NewsController::class, 'update']);  // PUT    /api/news/{id}
    Route::delete('/{news}',[NewsController::class, 'destroy']); // DELETE /api/news/{id}
    Route::patch('/{news}/toggle', [NewsController::class, 'toggle']); // PATCH /api/news/{id}/toggle
});

/* ── Founders ──────────────────────────────────────── */
Route::prefix('founders')->group(function () {
    Route::get('/',              [FounderController::class, 'index']);   // GET    /api/founders
    Route::post('/',             [FounderController::class, 'store']);   // POST   /api/founders
    Route::post('/reorder',      [FounderController::class, 'reorder']); // POST   /api/founders/reorder
    Route::get('/{founder}',     [FounderController::class, 'show']);    // GET    /api/founders/{id}
    Route::put('/{founder}',     [FounderController::class, 'update']);  // PUT    /api/founders/{id}
    Route::delete('/{founder}',  [FounderController::class, 'destroy']); // DELETE /api/founders/{id}
    Route::patch('/{founder}/toggle', [FounderController::class, 'toggle']); // PATCH /api/founders/{id}/toggle
});

/* ── Objectives / Activities ───────────────────────── */
Route::prefix('objectives')->group(function () {
    Route::get('/',                [ObjectiveController::class, 'index']);   // GET    /api/objectives
    Route::post('/',               [ObjectiveController::class, 'store']);   // POST   /api/objectives
    Route::post('/reorder',        [ObjectiveController::class, 'reorder']); // POST   /api/objectives/reorder
    Route::get('/{objective}',     [ObjectiveController::class, 'show']);    // GET    /api/objectives/{id}
    Route::put('/{objective}',     [ObjectiveController::class, 'update']);  // PUT    /api/objectives/{id}
    Route::delete('/{objective}',  [ObjectiveController::class, 'destroy']); // DELETE /api/objectives/{id}
    Route::patch('/{objective}/toggle', [ObjectiveController::class, 'toggle']); // PATCH /api/objectives/{id}/toggle
});

/* ── Reporting Channels ─────────────────────────── */
Route::prefix('reports')->group(function () {
    Route::get('/',  [ReportController::class, 'index']); // GET  /api/reports
    Route::post('/', [ReportController::class, 'store']); // POST /api/reports
});

/* ── Admin Users (staff list) ─────────────────────── */
Route::prefix('admin-users')->group(function () {
    Route::get('/', [AdminUserController::class, 'index']); // GET /api/admin-users
    Route::post('/', [AdminUserController::class, 'store']); // POST /api/admin-users
    Route::post('/login', [AdminUserController::class, 'login']); // POST /api/admin-users/login

    Route::put('/{adminUser}', [AdminUserController::class, 'update']); // PUT /api/admin-users/{id}
    Route::delete('/{adminUser}', [AdminUserController::class, 'destroy']); // DELETE /api/admin-users/{id}

    Route::patch('/{adminUser}/toggle', [AdminUserController::class, 'toggle']); // PATCH /api/admin-users/{id}/toggle
});
