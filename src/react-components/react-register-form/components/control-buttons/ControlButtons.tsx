import React from "react";

type RegisterResetButtonsProps = {
  onRegister: () => void;
  onReset: () => void;
  isLoading?: boolean;
  disabled?: boolean;
};

export const ControlButtons: React.FC<RegisterResetButtonsProps> = ({
  onRegister,
  onReset,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-2 justify-center space-x-4">
      {/* "Register" button */}
      <button
        type="submit"
        onClick={onRegister}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        className="btn text-white rounded h-10 w-44 bg-cyan-700 
                   hover:bg-cyan-400 disabled:bg-gray-600">
        {isLoading ? "Probíhá načítání..." : "Registrovat"}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isLoading}
        aria-disabled={isLoading}
        className="btn text-white rounded h-10 w-44 bg-red-400 
                   hover:bg-gray-400 disabled:bg-gray-600">
        Resetovat hodnoty
      </button>
    </div>
  );
};
