namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // login success → go to employee page
            return redirect('/employee');
        }

        // login failed → back with error
        return back()->withErrors([
            'email' => 'Invalid credentials',
        ]);
    }
}
