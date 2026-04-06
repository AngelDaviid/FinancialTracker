import { useNavigate } from 'react-router-dom';
import {
  type LoginInput,
  useLoginMutation,
} from '../../../generated/graphql.ts';
import { ApolloError } from '@apollo/client';
import { useToast } from '../../../components/Toast/hook/use-toast.tsx';
import { useAuth } from '../../../context/hook';

const useLogin = () => {
  const navigate = useNavigate();
  const [login, { loading, error }] = useLoginMutation();
  const { showToast } = useToast();
  const { setAuth } = useAuth();

  const handleLogin = async (formData: LoginInput) => {
    try {
      const { data } = await login({
        variables: {
          input: { email: formData.email, password: formData.password },
        },
      });

      if (data?.login?.token && data?.login?.user) {
        setAuth({
          token: data.login.token,
          user: data.login.user,
        });
        showToast('Login successful', 'success');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
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
    handleLogin,
    loading,
    error,
  };
};

export { useLogin };
