import { displayValidation } from "./requestValidation.js";

export async function createEntity(entityType, entityData) {
  const response = await fetch(`/api/${entityType}s`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entityData),
  });

  const responseData = await response.json();
  const { message, errors } = responseData;
  const { status } = response;

  displayValidation(message, status, errors, "dashboard");

  if (!response.ok) {
    throw new Error(message);
  }

  return responseData;
}

export async function updateEntity(entityType, entityId, entityData) {
  const response = await fetch(`/api/${entityType}s/${entityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entityData),
  });

  const responseData = await response.json();
  const { message, errors } = responseData;
  const { status } = response;

  displayValidation(message, status, errors, "dashboard");

  if (!response.ok) {
    throw new Error(message);
  }

  return responseData;
}

export async function handleGenericFormSubmit(e, entityType, action) {
  e.preventDefault();

  const modal = document.querySelector(`[data-modal="${action}-${entityType}"]`);
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    if (action === 'add') {
      await createEntity(entityType, data);
    } else {
      const entityId = modal.dataset[`${entityType}Id`];
      await updateEntity(entityType, entityId, data);
    }
    
    modal.close();
    setTimeout(() => location.reload(), 1250);
  } catch (error) {
    console.error(`Error ${action}ing ${entityType}:`, error);
  }
}
