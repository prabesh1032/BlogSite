import { toast } from 'react-toastify';
import { Check, AlertCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const baseToast = {
  autoClose: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: true,
  bodyClassName: 'p-0',
  className:
    'flex items-center gap-4 rounded-xl bg-white px-5 py-4 max-w-sm shadow-lg border',
};


export const showSuccessToast = (message) => {
  toast(
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">All good!</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-green-500">
        <Check className="w-5 h-5 text-white" />
      </div>
    </div>,
    {
      ...baseToast,
      className: `${baseToast.className} border-green-400`,
      progressClassName:
        'bg-gradient-to-r from-green-400 via-green-500 to-green-400',
    }
  );
};

export const showErrorToast = (message) => {
  toast(
    <div className="flex items-center gap-4 w-full">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">Error</p>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-500">
        <AlertCircle className="w-5 h-5 text-white" />
      </div>
    </div>,
    {
      ...baseToast,
      className: `${baseToast.className} border-red-400`,
      progressClassName:
        'bg-gradient-to-r from-red-400 via-red-500 to-red-400',
    }
  );
};

