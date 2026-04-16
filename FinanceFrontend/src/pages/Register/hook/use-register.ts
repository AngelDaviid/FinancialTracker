import { useNavigate } from 'react-router-dom';
import {
  type RegisterInput,
  useRegisterMutation,
} from '../../../generated/graphql.ts';
import { ApolloError } from '@apollo/client';
import { useToast } from '../../../components/Toast/hook/use-toast.tsx';
import { useAuth } from '../../../context/hook';

const useRegister = () => {
  const navigate = useNavigate();
  const [register, { loading, error }] = useRegisterMutation();
  const { showToast } = useToast();
  const { setAuth } = useAuth();

  const handleRegister = async (formData: RegisterInput) => {
    try {
      const { data } = await register({
        variables: {
          input: {
            name: formData.name,
            password: formData.password,
            email: formData.email,
          },
        },
      });
      if (data?.register?.token && data?.register?.user) {
        setAuth({
          token: data.register.token,
          user: data.register.user,
        });
      }
      showToast('Registration successful', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      if (err instanceof ApolloError) {
        const message =
          err.graphQLErrors[0]?.message ?? err.networkError?.message ?? 'Error';

        showToast(message, 'error');
      } else {
        showToast('Error', 'error');
      }
    }
  };

  return {
    handleRegister,
    loading,
    error,
  };
};

export { useRegister };
