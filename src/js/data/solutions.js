import { SOLUTIONS_DATA } from './solutions-data.js';

export let solutions = [...SOLUTIONS_DATA];

export function getSolutions() {
    return solutions;
}

export function getSolutionById(id) {
    return solutions.find(solution => solution.id === id);
}

export function searchSolutions(query, category = 'all') {
    const normalizedQuery = query.toLowerCase().trim();
    
    return solutions.filter(solution => {
        // Filter by category if not 'all'
        if (category !== 'all' && solution.category !== category) {
            return false;
        }
        
        // Search in title, description, and tags
        return (
            solution.title.toLowerCase().includes(normalizedQuery) ||
            solution.description.toLowerCase().includes(normalizedQuery) ||
            solution.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
        );
    });
}

export function filterSolutionsByCategory(category) {
    if (category === 'all') {
        return solutions;
    }
    return solutions.filter(solution => solution.category === category);
}

export function addSolution(newSolution) {
    const solutionWithId = {
        ...newSolution,
        id: Date.now().toString(),
        timeAgo: 'Just now',
        likes: 0,
        comments: 0
    };
    solutions.unshift(solutionWithId);
    return solutionWithId;
}