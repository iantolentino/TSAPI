import { CATEGORY_CONFIG } from './categories-config.js';

export const categories = CATEGORY_CONFIG;

export function getCategoryById(id) {
    return categories.find(cat => cat.id === id);
}

export function getCategoryColor(id) {
    const category = getCategoryById(id);
    return category ? category.color : '#3b82f6';
}