import React, { useEffect, useState, useMemo } from "react";
import InputForm from "../../components/Forms/InputForm";
import { api } from "../../Api";
import { toast } from "react-toastify";

function PasswordPolicyConfig() {
  const [form, setForm] = useState({
    minPasswordLength: null,
    maxPasswordLength: null,
    passwordExpiration: null,
    notifyBeforeExpiration: null,
  });

  const [initialForm, setInitialForm] = useState(null);
  const [settingsIds, setSettingsIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleInput = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/getsettingsValue");

        const mapApiToState = {
          password_min_length: "minPasswordLength",
          password_max_length: "maxPasswordLength",
          password_expiration_days: "passwordExpiration",
          password_notification_before_expiration: "notifyBeforeExpiration",
        };

        const newForm = {};
        const ids = {};

        data.forEach(({ key, value, id }) => {
          const field = mapApiToState[key];
          if (field) {
            ids[field] = id;
            newForm[field] =
              value === "true" || value === "false"
                ? value === "true"
                : Number(value) || value;
          }
        });

        setForm(newForm);
        setInitialForm(newForm);
        setSettingsIds(ids);
      } catch (err) {
        toast.error("Impossible de charger les paramètres");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.keys(form).filter(
        (k) => form[k] !== initialForm[k]
      );

      await Promise.all(
        updates.map((field) => {
          const id = settingsIds[field];
          if (!id) return null;
          return api.put(`/updatesettingsValue/${id}`, {
            value: String(form[field]),
          });
        })
      );

      toast.success("Paramètres sauvegardés !");
      setInitialForm(form);
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="pl-6 text-sm text-gray-500">Chargement…</p>;

  const fields = [
    { label: "Longueur min", field: "minPasswordLength" },
    { label: "Longueur max", field: "maxPasswordLength" },
    { label: "Expiration mot de passe (jours)", field: "passwordExpiration" },
    { label: "Notifier avant expiration (jours)", field: "notifyBeforeExpiration" },
  ];

  return (
    <div className="p-4 pl-6 relative">
      <h2 className="text-xl font-bold mb-4">Configuration de la politique de mot de passe</h2>

      {fields.map(({ label, field }) => (
        <div key={field} className="mb-3 flex items-center gap-4 w-[380px]">
          <InputForm
            type="number"
            label={label}
            width="80px"
           flexDirection={'flex-row'}
            value={form[field]}
            onChange={handleInput(field)}
          />
        </div>
      ))}
<div className="flex flex-row justify-end">
      <button
        disabled={!isDirty || saving}
        onClick={handleSave}
        className={`px-6 py-2 mt-6 bg-[var(--blue-menu)] text-white rounded-lg ${
          (!isDirty || saving) && "opacity-50 cursor-not-allowed"
        }`}
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
      </div>
    </div>
  );
}

export default PasswordPolicyConfig;
