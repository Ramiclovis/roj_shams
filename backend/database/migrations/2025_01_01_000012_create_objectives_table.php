<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('objectives', function (Blueprint $table) {
            $table->id();
            // اسم أيقونة FontAwesome مثل faBullseye
            $table->string('icon_name')->default('faBullseye');
            $table->string('title_ar');
            $table->string('title_en')->nullable();
            // الاحتياجات العاجلة
            $table->text('needs_ar')->nullable();
            $table->text('needs_en')->nullable();
            // عملنا
            $table->text('work_ar')->nullable();
            $table->text('work_en')->nullable();
            // قائمة الأنشطة — مصفوفة نصوص
            $table->json('activities_ar')->nullable();
            $table->json('activities_en')->nullable();
            // صور وفيديوات — مصفوفة روابط / base64
            $table->json('images')->nullable();
            $table->json('videos')->nullable();
            $table->boolean('active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('objectives');
    }
};
