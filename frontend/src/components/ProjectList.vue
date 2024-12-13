<template>
    <div class="project-list">
      <h2>项目列表</h2>
      <button @click="showCreateProject = true">创建项目</button>
  
      <div v-if="showCreateProject" class="create-project">
        <h3>创建新项目</h3>
        <form @submit.prevent="createProject">
          <div>
            <label>项目名称</label>
            <input v-model="newProject.name" required />
          </div>
          <div>
            <label>描述</label>
            <textarea v-model="newProject.description"></textarea>
          </div>
          <button type="submit">创建</button>
          <button type="button" @click="showCreateProject = false">取消</button>
        </form>
      </div>
  
      <ul>
        <li v-for="project in projects" :key="project.id" class="project-item">
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
          <p>创建者: {{ project.created_by }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import axios from 'axios';
  
  export default {
    name: 'ProjectList',
    setup() {
      const store = useStore();
      const projects = ref([]);
      const showCreateProject = ref(false);
      const newProject = ref({
        name: '',
        description: '',
      });
  
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/projects/');
          projects.value = response.data;
        } catch (error) {
          console.error(error);
          alert('获取项目列表失败。');
        }
      };
  
      const createProject = async () => {
        try {
          await axios.post('http://localhost:8000/api/projects/', newProject.value);
          showCreateProject.value = false;
          newProject.value = { name: '', description: '' };
          fetchProjects();
        } catch (error) {
          console.error(error);
          alert('创建项目失败。');
        }
      };
  
      onMounted(() => {
        fetchProjects();
      });
  
      return {
        projects,
        showCreateProject,
        newProject,
        fetchProjects,
        createProject,
      };
    },
  };
  </script>
  
  <style scoped>
  .project-list {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  .create-project {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  .create-project form div {
    margin-bottom: 10px;
  }
  .project-item {
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  }
  </style>
  