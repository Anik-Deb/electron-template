import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import React from 'react';

const PageTitle = ({ title }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Check if it's possible to go back in history
  const isBackwardAvailable = window.history.length > 1;

  // Split the pathname into segments and filter out empty strings
  const pathArray = pathname.split('/').filter(Boolean);

  // Handle backward navigation
  const handleBackward = () => {
    if (isBackwardAvailable) {
      navigate(-1);
    }
  };

  return (
    <div>
      {/* Page Title with Backward Arrow */}
      <div className="flex items-center">
        {isBackwardAvailable ? (
          <button
            onClick={handleBackward}
            className="text-xl font-semibold flex items-center gap-1 text-primary-950"
          >
            <ChevronLeft className="h-5 w-5 stroke-primary-950 bg-white hover:bg-zinc-100 rounded border" />
            {title}
          </button>
        ) : (
          <div className="text-xl font-semibold flex items-center gap-2 text-primary-950">
            {title}
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      {pathArray.length > 0 && <Breadcrumb pathArray={pathArray} />}
    </div>
  );
};

export default PageTitle;