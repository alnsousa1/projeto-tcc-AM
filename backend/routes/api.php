<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\v1\PacienteController;
use App\Http\Controllers\api\v1\AgendamentosController;
use App\Http\Controllers\api\v1\ProcedimentoController;
use App\Http\Controllers\api\v1\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;

Route::group(['prefix' => 'v1'], function() {

    Route::get('/teste', function () {
        return response()->json('teste');
    });
    
    Route::post('/login', [UserController::class, 'login'])->name('login')->middleware('throttle:3,5');

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('pacientes', PacienteController::class);
        Route::apiResource('procedimentos', ProcedimentoController::class);
        Route::apiResource('agendamentos', AgendamentosController::class);
        Route::get('/pacientes/{id}/agendamentos', [PacienteController::class, 'getAgendamentos']);

        Route::get('/user/profile', [UserController::class, 'profile']);
        Route::put('/user/profile', [UserController::class, 'updateProfile']);

        Route::post('/logout', [UserController::class, 'logout'])->name('logout');
    });

    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink'])->name('password.email')->middleware('throttle:5,1');
    Route::post('/reset-password', [ForgotPasswordController::class, 'reset'])->name('password.update');

    Route::get('/password/reset', function () {
        return response()->json(['message' => 'Password reset link sent to your email.']);
    })->name('password.reset');
});
