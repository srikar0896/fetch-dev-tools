const storageKey = "fetch-dev-tools-templates";

export const getTemplates = () => JSON.parse(window.localStorage.getItem(storageKey)) || [];

export const saveAsTemplate = (code, templateName) => {
  const templates = JSON.parse(window.localStorage.getItem(storageKey)) || [];
  window.localStorage.setItem(storageKey, JSON.stringify([
      ...templates,
      {
      id: `template-${Date.now()}`,
      name: templateName,
      code,
      }
  ]));
};


export const getTemplate = (id) => {
  return getTemplates().find(template => template.id === id);
};
