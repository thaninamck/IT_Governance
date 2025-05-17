import { useState, useEffect, useMemo } from "react";

import { toast } from "react-toastify";
import { api } from "../Api";

const usePasswordPolicySettings = () => {
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

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialForm),
    [form, initialForm]
  );

  const handleInput = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

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

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    form,
    handleInput,
    handleSave,
    isDirty,
    saving,
    loading,
  };
};

export default usePasswordPolicySettings;
