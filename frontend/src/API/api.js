const BASE = '/api';

export const getAllPosts = async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${BASE}/posts${query ? '?' + query : ''}`)
    return response.json();
}

export const getPostById = async (id) => {
    const response = await fetch(`${BASE}/posts/${id}`);
    return response.json();
}

export const createPost = async (data) => {
    const response = await fetch(`${BASE}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const updatePost = async (id, data) => {
    const response = await fetch(`${BASE}/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const deletePost = async (id) => {
    const response = await fetch(`${BASE}/posts/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const getAllPlatforms = async () => {
    const response = await fetch(`${BASE}/platforms`);
    return response.json();
}

export const getPlatformById = async (id) => {
    const response = await fetch(`${BASE}/platforms/${id}`);
    return response.json();
}

export const createPlatform = async (data) => {
    const response = await fetch(`${BASE}/platforms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const updatePlatform = async (id, data) => {
    const response = await fetch(`${BASE}/platforms/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

export const deletePlatform = async (id) => {
    const response = await fetch(`${BASE}/platforms/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const getAllTags = async () => {
    const response = await fetch(`${BASE}/tags`);
    return response.json();
}

export const getTagById = async (id) => {
    const response = await fetch(`${BASE}/tags/${id}`);
    return response.json();
}


export const deleteTag = async (id) => {
    const response = await fetch(`${BASE}/tags/${id}`, {
        method: 'DELETE'    
    });
    return response.json();
}

