// src/api.js

import axiosInstance from './axiosInstance';

// Функция для добавления получателя в группу
export const addRecipientToGroup = async (groupId, recipientData) => {
  try {
    const response = await axiosInstance.post(`/api/recipient-groups/${groupId}/add-recipient/`, recipientData);
    return response;
  } catch (error) {
    console.error('Error adding recipient to group:', error);
    throw error;
  }
};

// Функция для получения списка групп
export const getGroups = async () => {
  try {
    const response = await axiosInstance.get('/api/recipient-groups/'); // URL API для получения групп
    return response;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
};

// Функция для создания новой группы
export const createGroup = async (groupData) => {
  try {
    const response = await axiosInstance.post('/api/recipient-groups/', groupData); // URL API для создания группы
    return response;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};