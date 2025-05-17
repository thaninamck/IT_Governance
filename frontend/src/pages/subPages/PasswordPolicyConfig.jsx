import React from "react";
import InputForm from "../../components/Forms/InputForm";
import usePasswordPolicySettings from "../../Hooks/usePasswordPolicySettings";

function PasswordPolicyConfig() {
  const {
    form,
    handleInput,
    handleSave,
    isDirty,
    saving,
    loading,
  } = usePasswordPolicySettings();

  const fields = [
    { label: "Longueur min", field: "minPasswordLength" },
    { label: "Longueur max", field: "maxPasswordLength" },
    { label: "Expiration mot de passe (jours)", field: "passwordExpiration" },
    { label: "Notifier avant expiration (jours)", field: "notifyBeforeExpiration" },
  ];

  return (
    <div className="p-4 pl-6 relative">
      <h2 className="text-xl font-bold mb-4">
        Configuration de la politique de mot de passe
      </h2>

      {loading ? (
        <p className="pl-6 text-sm text-gray-500">Chargement…</p>
      ) : (
        fields.map(({ label, field }) => (
          <div key={field} className="mb-3 flex items-center gap-4 w-[380px]">
            <InputForm
              type="number"
              label={label}
              width="80px"
              flexDirection="flex-row"
              value={form[field]}
              onChange={handleInput(field)}
            />
          </div>
        ))
      )}

      <div className="flex flex-row justify-end">
        <button
          disabled={!isDirty || saving}
          onClick={handleSave}
          className={`px-6 py-2 mt-6 bg-[var(--blue-menu)] border-none text-white rounded-lg ${
            (!isDirty || saving) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

export default PasswordPolicyConfig;
