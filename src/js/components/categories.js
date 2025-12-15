import { categories } from '../data/categories.js';

export class CategoriesComponent {
    constructor(onCategorySelect) {
        this.onCategorySelect = onCategorySelect;
        this.currentCategory = 'all';
    }
    
    render(container) {
        container.innerHTML = '';
        
        categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-card';
            categoryElement.style.borderColor = this.currentCategory === category.id ? category.color : '';
            categoryElement.innerHTML = `
                <div class="category-icon" style="color: ${category.color}">${category.icon}</div>
                <h3>${category.name}</h3>
                <p>Click to view ${category.name.toLowerCase()} solutions</p>
            `;
            
            categoryElement.addEventListener('click', () => {
                this.currentCategory = category.id;
                this.onCategorySelect(category.id);
                this.render(container); // Re-render to update active state
            });
            
            container.appendChild(categoryElement);
        });
    }
    
    getCurrentCategory() {
        return this.currentCategory;
    }
    
    setCategory(categoryId) {
        this.currentCategory = categoryId;
    }
}