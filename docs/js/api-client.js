// Portfolio API Client
class PortfolioAPI {
  constructor() {
    this.baseURL = 'http://localhost:3001/api';
    this.cachedData = {
      projects: null,
      skills: null
    };
    this.lastFetch = {
      projects: 0,
      skills: 0
    };
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Check if cache is valid
  isCacheValid(type) {
    return this.cachedData[type] && 
           (Date.now() - this.lastFetch[type] < this.cacheTimeout);
  }

  // Projects API
  async getProjects(forceRefresh = false) {
    if (!forceRefresh && this.isCacheValid('projects')) {
      return this.cachedData.projects;
    }

    try {
      const projects = await this.fetch('/projects');
      this.cachedData.projects = projects;
      this.lastFetch.projects = Date.now();
      return projects;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async getFeaturedProjects() {
    try {
      return await this.fetch('/projects?featured=true');
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return [];
    }
  }

  async getProject(id) {
    try {
      return await this.fetch(`/projects/${id}`);
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  // Skills API
  async getSkills(forceRefresh = false) {
    if (!forceRefresh && this.isCacheValid('skills')) {
      return this.cachedData.skills;
    }

    try {
      const skills = await this.fetch('/skills');
      this.cachedData.skills = skills;
      this.lastFetch.skills = Date.now();
      return skills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  }

  async getSkillsByCategory(category) {
    try {
      return await this.fetch(`/skills?category=${encodeURIComponent(category)}`);
    } catch (error) {
      console.error('Error fetching skills by category:', error);
      return [];
    }
  }

  async getSkillCategories() {
    try {
      return await this.fetch('/skills/categories');
    } catch (error) {
      console.error('Error fetching skill categories:', error);
      return [];
    }
  }

  // Contact API
  async submitContactForm(formData) {
    try {
      return await this.fetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }

  // Blog API
  async getBlogPosts(options = {}) {
    try {
      const params = new URLSearchParams();
      if (options.published !== undefined) {
        params.append('published', options.published);
      }
      if (options.limit) {
        params.append('limit', options.limit);
      }
      if (options.offset) {
        params.append('offset', options.offset);
      }

      const endpoint = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
      return await this.fetch(endpoint);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPost(slugOrId) {
    try {
      return await this.fetch(`/blog/${slugOrId}`);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }
  }

  // Utility methods
  clearCache() {
    this.cachedData = {
      projects: null,
      skills: null
    };
    this.lastFetch = {
      projects: 0,
      skills: 0
    };
  }

  async checkHealth() {
    try {
      return await this.fetch('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }
}

// Initialize API client
const portfolioAPI = new PortfolioAPI();

// Make it available globally
window.portfolioAPI = portfolioAPI;