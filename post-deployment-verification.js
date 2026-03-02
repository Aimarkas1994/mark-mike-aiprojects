#!/usr/bin/env node

/**
 * Post-Deployment Verification Script
 * 
 * Run this script after deploying to Render to verify everything is working correctly.
 * 
 * Usage: 
 *   node post-deployment-verification.js https://your-service.onrender.com
 * 
 * Or set the API_URL environment variable:
 *   API_URL=https://your-service.onrender.com node post-deployment-verification.js
 */

const API_BASE = process.env.API_URL || process.argv[2];

if (!API_BASE) {
  console.error('❌ Error: API URL is required');
  console.error('Usage: node post-deployment-verification.js https://your-service.onrender.com');
  console.error('Or: API_URL=https://your-service.onrender.com node post-deployment-verification.js');
  process.exit(1);
}

// Clean URL to ensure it ends with /api
const cleanApiUrl = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
const serviceUrl = API_BASE.replace('/api', '');

console.log('🚀 Starting Post-Deployment Verification');
console.log('📡 Service URL:', serviceUrl);
console.log('🔗 API Base URL:', cleanApiUrl);
console.log('');

class DeploymentVerifier {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    };
    this.testData = {
      projectId: null,
      skillId: null,
      contactId: null
    };
  }

  async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async test(name, testFn) {
    this.results.total++;
    process.stdout.write(`🧪 Testing: ${name}... `);
    
    try {
      const result = await testFn();
      if (result.success) {
        console.log('✅ PASSED');
        if (result.data) {
          console.log('   Details:', JSON.stringify(result.data, null, 2));
        }
        this.results.passed++;
      } else {
        console.log('❌ FAILED');
        if (result.error) {
          console.log('   Error:', result.error);
        }
        this.results.failed++;
      }
    } catch (error) {
      console.log('❌ FAILED');
      console.log('   Exception:', error.message);
      this.results.failed++;
    }
    
    console.log('');
  }

  async runHealthChecks() {
    console.log('🩺 Running Health Checks\n');

    await this.test('Service Health Check', async () => {
      try {
        const response = await this.fetchWithTimeout(`${serviceUrl}/health`);
        const data = await response.json();
        
        if (response.ok && data.status === 'OK') {
          return { success: true, data };
        } else {
          return { success: false, error: `Status: ${response.status}, Body: ${JSON.stringify(data)}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('API Health Check', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/health`);
        const data = await response.json();
        
        if (response.ok && data.status === 'OK') {
          return { success: true, data };
        } else {
          return { success: false, error: `Status: ${response.status}, Body: ${JSON.stringify(data)}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  }

  async runApiEndpointTests() {
    console.log('📡 Testing API Endpoints\n');

    await this.test('GET Projects', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('GET Featured Projects', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects?featured=true`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('GET Skills', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/skills`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('GET Skills by Category', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/skills?category=Frontend`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('GET Contact Messages', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/contact`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('GET Blog Posts', async () => {
      try {
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/blog`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          return { success: true, data: { count: data.length } };
        } else {
          return { success: false, error: `Expected array, got: ${typeof data}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  }

  async runDatabaseOperationTests() {
    console.log('💾 Testing Database Operations\n');

    // Test CREATE Project
    await this.test('CREATE Project', async () => {
      try {
        const projectData = {
          title: 'Deployment Test Project',
          description: 'This project was created during deployment verification',
          technologies: 'Node.js, Express, Render',
          github_url: 'https://github.com/test/test-project',
          live_url: 'https://test-project-demo.com',
          featured: false
        };

        const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });

        const data = await response.json();

        if (response.ok && data.id) {
          this.testData.projectId = data.id;
          return { success: true, data: { id: data.id } };
        } else {
          return { success: false, error: `Failed to create project: ${JSON.stringify(data)}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Test READ Project
    if (this.testData.projectId) {
      await this.test('READ Created Project', async () => {
        try {
          const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects/${this.testData.projectId}`);
          const data = await response.json();
          
          if (response.ok && data.id === this.testData.projectId) {
            return { success: true, data: { id: data.id, title: data.title } };
          } else {
            return { success: false, error: `Project not found or ID mismatch` };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    }

    // Test UPDATE Project
    if (this.testData.projectId) {
      await this.test('UPDATE Project', async () => {
        try {
          const updateData = {
            title: 'Deployment Test Project (Updated)',
            description: 'This project was updated during deployment verification',
            technologies: 'Node.js, Express, Render, Testing',
            featured: true
          };

          const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects/${this.testData.projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, data: { message: 'Project updated successfully' } };
          } else {
            return { success: false, error: `Failed to update project: ${JSON.stringify(data)}` };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    }

    // Test CREATE Skill
    await this.test('CREATE Skill', async () => {
      try {
        const skillData = {
          name: 'Deployment Testing',
          category: 'DevOps',
          proficiency_level: 5,
          description: 'Skill created during deployment verification'
        };

        const response = await this.fetchWithTimeout(`${cleanApiUrl}/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(skillData)
        });

        const data = await response.json();

        if (response.ok && data.id) {
          this.testData.skillId = data.id;
          return { success: true, data: { id: data.id } };
        } else {
          return { success: false, error: `Failed to create skill: ${JSON.stringify(data)}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Test CREATE Contact Message
    await this.test('CREATE Contact Message', async () => {
      try {
        const contactData = {
          name: 'Deployment Tester',
          email: 'test@example.com',
          subject: 'Deployment Verification',
          message: 'This message was created during deployment verification'
        };

        const response = await this.fetchWithTimeout(`${cleanApiUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });

        const data = await response.json();

        if (response.ok && data.id) {
          this.testData.contactId = data.id;
          return { success: true, data: { id: data.id } };
        } else {
          return { success: false, error: `Failed to create contact message: ${JSON.stringify(data)}` };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  }

  async runCleanupTests() {
    console.log('🧹 Cleaning Up Test Data\n');

    // Clean up: DELETE test project
    if (this.testData.projectId) {
      await this.test('DELETE Test Project', async () => {
        try {
          const response = await this.fetchWithTimeout(`${cleanApiUrl}/projects/${this.testData.projectId}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, data: { message: 'Test project deleted' } };
          } else {
            return { success: false, error: `Failed to delete project: ${JSON.stringify(data)}` };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    }

    // Clean up: DELETE test skill
    if (this.testData.skillId) {
      await this.test('DELETE Test Skill', async () => {
        try {
          const response = await this.fetchWithTimeout(`${cleanApiUrl}/skills/${this.testData.skillId}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, data: { message: 'Test skill deleted' } };
          } else {
            return { success: false, error: `Failed to delete skill: ${JSON.stringify(data)}` };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    }

    // Clean up: DELETE test contact message
    if (this.testData.contactId) {
      await this.test('DELETE Test Contact Message', async () => {
        try {
          const response = await this.fetchWithTimeout(`${cleanApiUrl}/contact/${this.testData.contactId}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, data: { message: 'Test contact message deleted' } };
          } else {
            return { success: false, error: `Failed to delete contact message: ${JSON.stringify(data)}` };
          }
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    }
  }

  async runPerformanceTests() {
    console.log('⚡ Running Performance Tests\n');

    await this.test('Response Time Test', async () => {
      try {
        const startTime = Date.now();
        const response = await this.fetchWithTimeout(`${cleanApiUrl}/health`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const data = await response.json();

        if (response.ok && responseTime < 5000) {
          return { 
            success: true, 
            data: { 
              responseTime: `${responseTime}ms`,
              status: responseTime < 1000 ? 'Excellent' : responseTime < 3000 ? 'Good' : 'Acceptable'
            } 
          };
        } else {
          return { 
            success: false, 
            error: `Response time too slow: ${responseTime}ms` 
          };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    await this.test('Concurrent Request Test', async () => {
      try {
        const requests = [];
        const concurrentCount = 5;
        
        for (let i = 0; i < concurrentCount; i++) {
          requests.push(
            this.fetchWithTimeout(`${cleanApiUrl}/health`)
              .then(res => res.json())
              .then(data => ({ success: true, data }))
              .catch(error => ({ success: false, error: error.message }))
          );
        }

        const results = await Promise.all(requests);
        const successful = results.filter(r => r.success).length;
        
        if (successful === concurrentCount) {
          return { 
            success: true, 
            data: { 
              concurrentRequests: concurrentCount,
              successful: successful,
              successRate: '100%'
            } 
          };
        } else {
          return { 
            success: false, 
            error: `${concurrentCount - successful} concurrent requests failed` 
          };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  }

  printSummary() {
    console.log('📊 Test Summary');
    console.log('================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    console.log('');

    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Your deployment is ready for production.');
      console.log('✅ The API is fully functional and ready to use.');
    } else {
      console.log('⚠️  SOME TESTS FAILED! Please review the failed tests above.');
      console.log('🔧 Fix the issues before putting the service into production.');
      process.exit(1);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Deployment Verification\n');
    console.log('📡 Target:', API_BASE);
    console.log('');

    try {
      await this.runHealthChecks();
      await this.runApiEndpointTests();
      await this.runDatabaseOperationTests();
      await this.runPerformanceTests();
      await this.runCleanupTests();
      
      this.printSummary();
    } catch (error) {
      console.error('💥 Verification failed with exception:', error.message);
      process.exit(1);
    }
  }
}

// Run the verification
const verifier = new DeploymentVerifier();
verifier.runAllTests().catch(console.error);