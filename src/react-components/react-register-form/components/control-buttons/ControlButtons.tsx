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
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      {/* "Register" button */}
      <button
        type="submit"
        onClick={onRegister}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-disabled={disabled || isLoading}
        className="h-11 w-full rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:bg-slate-400 sm:w-44">
        {isLoading ? "Probíhá načítání..." : "Registrovat"}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isLoading}
        aria-disabled={isLoading}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:bg-slate-100 sm:w-44">
        Resetovat hodnoty
      </button>
    </div>
  );
};
