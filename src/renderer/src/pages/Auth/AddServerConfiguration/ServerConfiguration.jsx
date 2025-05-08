import React from 'react';
import ServerConfigurationForm from './Components/ServerConfigurationForm';
export default function AddServerConfiguration() {
  return (
    <div className="w-[500px] mt-4 border-none rounded bg-white px-6 py-5 border">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm mb-4">
        {/* <img
          className="mx-auto h-9 w-auto"
          src={blackLogo}
          alt="Your Company"
        /> */}
        <div className='text-2xl font-semibold text-center'>Logo</div>
        <h2 className="mt-1 text-center text-xl font-bold tracking-tight text-gray-900">
          Server Configuration
        </h2>
      </div>
      <ServerConfigurationForm />
    </div>
  );
}
