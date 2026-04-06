import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

const styles = {
  success: 'border-l-2 border-b-2 border-[#004f39] bg-[#8cb79b]',
  error: 'border-l-2 border-b-2 border-[#7a1f1f] bg-[#e6a8a8]',
  warning: 'border-l-2 border-b-2 border-[#7a4b00] bg-[#f0d9a7]',
  info: 'border-l-2 border-b-2 border-[#1f3a5f] bg-[#a9c3e6]',
};

const Toast = ({ message, type = 'info', onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, 2700);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [onClose]);
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-md text-white shadow-lg min-w-64 ${styles[type]} transform transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}  `}
    >
      <span className="text-md text-black">{message}</span>
      <button onClick={onClose} className={'cursor-pointer'}>
        <CircleX size={14} stroke={'#000000'} />
      </button>
    </div>
  );
};

export { Toast };
