import React from "react";

interface RegistrationResultMessageProps {
  registrationResult: "success" | "fail" | null;
}

export const RegistrationResultMessage: React.FC<
  RegistrationResultMessageProps
> = ({ registrationResult }) => {
  if (registrationResult === "success") {
    return (
      <div
        className="bg-green-100 border border-green-600 text-green-700 px-3 py-3 flex justify-center items-center rounded"
        role="alert">
        <p className="text-sm mr-3">Registrace proběhla úspěšně!</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-full border-green-600 border-2">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-green-600 dark:text-slate-200 icon-bold"
            astro-icon="tabler:check">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m5 12 5 5L20 7"></path>
          </svg>
        </div>
      </div>
    );
  } else if (registrationResult === "fail") {
    return (
      <div
        className="bg-red-100 border border-red-500 text-red-700 px-3 py-3 rounded"
        role="alert">
        <p className="text-sm">Registrace selhala.</p>
        <p className="text-sm">Kontaktujte 603928674</p>
      </div>
    );
  }

  return null;
};
