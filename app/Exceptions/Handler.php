<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        if ($request->wantsJson()) {
            $statusCode = 500;
            $message = 'Server Error'; // Default poruka

            if ($exception instanceof HttpException) {
                $statusCode = $exception->getStatusCode();
                $message = $exception->getMessage();
            } elseif ($exception instanceof \Illuminate\Validation\ValidationException) { // Dodato za validacione izuzetke
                return response()->json([
                    'errors' => $exception->errors(),
                    'message' => 'The given data was invalid.',
                ], 422);
            } elseif ($exception instanceof \Illuminate\Auth\AuthenticationException){
                return response()->json([
                    'message' => 'Unauthenticated',
                ], 401);
            }
            else if (config('app.debug')) {
                $message = $exception->getMessage(); // prikazuje detaljnu poruku samo u debug modu
            }

            return response()->json([
                'error' => [
                    'message' => $message,
                    'status_code' => $statusCode,
                ]
            ], $statusCode);
        }

        return parent::render($request, $exception);
    }
}