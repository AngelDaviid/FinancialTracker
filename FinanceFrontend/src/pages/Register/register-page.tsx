import { useRegister } from './hook/use-register.ts';
import { useForm } from 'react-hook-form';
import { Receipt } from 'lucide-react';
import { InputHandler } from '../../components/Inputs';
import { CustomButton } from '../../components/Buttons';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { handleRegister, loading } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormProps>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormProps) => {
    await handleRegister(values);
  };

  return (
    <div className="w-screen min-h-screen bg-[#151613] flex items-center justify-center p-4">
      <div className="relative flex flex-col md:flex-row">
        <div className="w-80 md:w-100 h-120 p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-[#004f39] flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#fffaca] leading-tight text-center tracking-tight">
            Control your money. <br />
            <span className="text-[#8cb79b]">Control your life.</span>
          </h1>
        </div>

        <div className="w-80 md:w-100 h-120 bg-[#fffaca] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none space-y-4 flex flex-col justify-center items-center p-6">
          <div className="flex flex-col gap-3 items-center justify-center w-full">
            <InputHandler
              name="name"
              control={control}
              type="text"
              label="Name"
            />

            <InputHandler
              name="email"
              control={control}
              type="email"
              label="Email"
            />

            <InputHandler
              name="password"
              control={control}
              type="password"
              label="Password"
            />
          </div>

          <CustomButton
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            variant={'primary'}
          >
            {loading ? 'Loading...' : 'Register'}
          </CustomButton>

          <p className="text-[#004f39] text-sm">
            You have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 underline hover:text-blue-800"
            >
              LogIn
            </Link>
          </p>
        </div>

        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#004f39] bg-[#fffaca] flex justify-center items-center shadow-lg">
            <Receipt size={32} className="md:w-10 md:h-10 text-[#151613]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { RegisterPage };
