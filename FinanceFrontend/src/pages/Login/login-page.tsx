import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="w-screen h-screen bg-[#3489db] flex items-center justify-center">
      <div className="w-100 h-120 bg-white space-y-2 flex flex-col justify-center items-center">
        <h1>Welcome to Finance Tracker</h1>
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <input
            type="text"
            placeholder={'Email'}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-80 px-3 py-2.5 shadow-xs placeholder:text-body"
            required
          />
          <input
            type="text"
            placeholder={'Password'}
            className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-80 px-3 py-2.5 shadow-xs placeholder:text-body"
          />
        </div>
        <button
          type={'submit'}
          className="p-2 w-25 mt-10 cursor-pointer bg-gray-700 rounded text-white"
        >
          LogIn
        </button>

        <p>
          You don't have an account? register now{' '}
          <a>
            <Link to="/register" style={{color: 'blue', textDecoration: 'underline'}}>Register</Link>
          </a>
        </p>
      </div>
    </div>
  );
};

export { LoginPage };
