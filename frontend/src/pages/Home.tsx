import { auth, googleProvider } from '../utils/firebase';
import { signInWithPopup, type UserCredential } from 'firebase/auth';
import api from '../utils/axios';
import type { User } from '../types/auth';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

const Home = () => {

    const { userData } = useSelector((state: any) => state.user);
    const dispatch=useDispatch();
    const handleLogin = async (token: string): Promise<void> => {
        try {
            const { data } = await api.post<User>('/api/auth/login', { token });
            dispatch(setUserData(data));
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const googleLogin = async (): Promise<void> => {
        try {
            const data: UserCredential = await signInWithPopup(auth, googleProvider);
            const token: string = await data.user.getIdToken();
            console.log('Firebase auth data:', data);
            await handleLogin(token);
        } catch (error) {
            console.error('Error during Google sign-in:', error);
        }
    };

    return (
        <div className='h-screen flex bg-[#0a0f14] text-white overflow-hidden'>
            <SideBar/>
            <ChatArea/>
            <Artifact/>
            {!userData && <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur'>
                <div className='w-[340px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5'>
                    <div className='flex flex-col gap-1'>
                        <h2 className='text-[17px] font-semibold text-slate-100 tracking-tight'>Welcome to CortexAI</h2>
                        <p className='text-[13px] text-slate-500'>Please login to continue using the app.</p>
                    </div>

                    <button
                        onClick={googleLogin}
                        className='w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black/90 bg-white hover:bg-gray-200 transition-all duration-150 cursor-pointer'
                    >
                        <FcGoogle size={15} />
                        Continue With Google
                    </button>
                </div>
            </div>}
        </div>
    );
};

export default Home;