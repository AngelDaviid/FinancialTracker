import type { FieldError } from 'react-hook-form';

interface InputErrorHandler {
  error?: FieldError;
}

const InputErrorHandler = ({ error }: InputErrorHandler) => {
  if (!error) return null;

  return <span className={'text-red-500 text-xs mt-1'}>{error.message}</span>;
};

export { InputErrorHandler };
