"use client";

import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function CategoriesPage() {
  const { i18n, t } = useTranslation(); // можно использовать `t` для кнопок

  const langCodes = ["ru", "en", "et"];
  const langNames = {
    ru: "Русский",
    en: "English",
    et: "Eesti",
  };

  // Текущие значения по языкам
  const [categoryNames, setCategoryNames] = useState({});
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categories) => {
        setCategories(categories);
      });
  }

  function handleNameChange(lang, value) {
    setCategoryNames((prev) => ({ ...prev, [lang]: value }));
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();

    const name = {};
    langCodes.forEach((lang) => {
      if (categoryNames[lang]?.trim()) {
        name[lang] = categoryNames[lang].trim();
      }
    });

    if (!Object.keys(name).length) {
      toast.error("Введите название хотя бы на одном языке");
      return;
    }

    const data = { name };
    if (editedCategory) {
      data._id = editedCategory._id;
    }

    const creationPromise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setCategoryNames({});
      setEditedCategory(null);
      fetchCategories();

      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(
      creationPromise,
      {
        loading: editedCategory
          ? t("categoriesPage.updatingCategory")
          : t("categoriesPage.creatingCategory"),
        success: editedCategory
          ? t("categoriesPage.categoryUpdated")
          : t("categoriesPage.categoryCreated"),
        error: t("categoriesPage.error"),
      }
    );
  }

  async function handleDeleteClick(_id) {
    const promise = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/categories?_id=" + _id, {
        method: "DELETE",
      });

      if (response.ok) resolve();
      else reject();
    });

    await toast.promise(
      promise,
      {
        loading: t("categoriesPage.deleting"),
        success: t("categoriesPage.deleted"),
        error: t("categoriesPage.error"),
      }
    );

    fetchCategories();
  }

  if (profileLoading) {
    return <>{t("categoriesPage.loadingUserInfo")}</>;
  }

  if (!profileData?.admin) {
    return <>{t("categoriesPage.notAdmin")}</>;
  }

  // Вспомогательная функция для локализованного имени (ru → en → et → любой)
  const getLocalizedCategoryName = (catName) => {
    if (!catName) return "";
    const lang = i18n.language || "ru";
    return catName[lang] || catName["ru"] || catName["en"] || Object.values(catName)[0] || "";
  };

  return (
    <section className="mt-8 max-w-3xl mx-auto">
      <UserTabs isAdmin={true} />

      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="space-y-4">
          <h3 className="text-lg">
            {editedCategory
              ? t("categoriesPage.updateCategory")
              : t("categoriesPage.newCategoryName")}
            {editedCategory && (
              <>
                : <b>{getLocalizedCategoryName(editedCategory.name)}</b>
              </>
            )}
          </h3>

          {langCodes.map((lang) => (
            <div key={lang} className="flex items-center gap-2">
              <label className="w-16 text-sm">
                {langNames[lang]}:
              </label>
              <input
                type="text"
                value={categoryNames[lang] || ""}
                onChange={(ev) => handleNameChange(lang, ev.target.value)}
                className="grow px-2 py-1 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button className="border border-primary px-4 py-2 rounded" type="submit">
            {editedCategory ? t("categoriesPage.update") : t("categoriesPage.create")}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditedCategory(null);
              setCategoryNames({});
            }}
            className="border border-gray-400 px-4 py-2 rounded"
          >
            {t("categoriesPage.cancel")}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-sm text-gray-500 mb-2">
          {t("categoriesPage.existingCategories")}
        </h2>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">{t("categoriesPage.noCategories")}</p>
        ) : (
          categories.map((c) => (
            <div
              key={c._id}
              className="bg-gray-100 rounded-xl p-3 px-4 mb-2 flex flex-col sm:flex-row gap-2 items-center justify-between"
            >
              <div className="grow">
                <span className="text-sm font-medium">
                  {langCodes.map((lang) => (
                    <span key={lang} className="mr-2">
                      <strong>{lang}:</strong> {c.name?.[lang] || "—"}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(c);
                    setCategoryNames({ ...c.name });
                  }}
                  className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                >
                  {t("categoriesPage.edit")}
                </button>
                <DeleteButton
                  label={t("categoriesPage.delete")}
                  onDelete={() => handleDeleteClick(c._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}