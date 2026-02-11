
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, User, ArrowRight, X, Loader2 } from 'lucide-react';

interface AuthFormProps {
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        // युजरनेम अपडेट गर्ने
        await updateProfile(userCredential.user, {
          displayName: formData.username
        });
        // Force refresh if needed or just handle via onAuthStateChanged
        window.location.reload(); 
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-10 relative border border-slate-100">
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 font-medium">
            {isLogin ? 'Log in to manage your career path.' : 'Join Nepal\'s premier talent network today.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center group disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <>
                {isLogin ? 'Log In' : 'Sign Up'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 font-bold hover:text-indigo-600 transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
