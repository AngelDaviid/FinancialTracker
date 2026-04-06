import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';
import { InputErrorHandler } from './input-error-handler.tsx';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputHandlerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  type?: string;
  placeholder?: string;
  label?: string;
  className?: string;
}

const InputHandler = <T extends FieldValues>({
  name,
  control,
  type = 'text',
  placeholder,
  label,
  className,
}: InputHandlerProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isEmail = type === 'email';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const rules = {
    required: `${label ?? name} is required`,
    ...(isEmail && {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email',
      },
    }),
  };

  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className="flex flex-col">
      {label && (
        <label className="block font-medium text-[#004f39] text-lg">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...field}
          type={inputType}
          placeholder={placeholder}
          className={
            fieldState.error
              ? `w-80 h-8 border-l-2 border-b-2 rounded-md p-2 outline-none  border-red-500 ${className}`
              : `w-80 h-8 border-l-2 border-b-2 rounded-md p-2 outline-none border-[#004f39] ${className}`
          }
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <InputErrorHandler error={fieldState.error} />
    </div>
  );
};

export { InputHandler };
