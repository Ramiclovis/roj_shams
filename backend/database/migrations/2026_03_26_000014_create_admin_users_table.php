<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->id();

            $table->string('name', 200);
            $table->string('email', 190)->unique();
            $table->string('password');
            $table->string('phone', 50)->nullable();

            // UI expects Arabic strings: 'مدير' | 'مشرف' and 'نشط' | 'معطّل'
            $table->string('role', 50)->default('مشرف');
            $table->string('status', 50)->default('نشط');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_users');
    }
};

