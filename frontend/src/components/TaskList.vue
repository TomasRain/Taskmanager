<template>
    <div class="task-list">
      <h2>任务列表</h2>
      <button @click="showCreateTask = true">创建任务</button>
  
      <div v-if="showCreateTask" class="create-task">
        <h3>创建新任务</h3>
        <form @submit.prevent="createTask">
          <div>
            <label>标题</label>
            <input v-model="newTask.title" required />
          </div>
          <div>
            <label>描述</label>
            <textarea v-model="newTask.description"></textarea>
          </div>
          <div>
            <label>项目</label>
            <select v-model="newTask.project" required>
              <option disabled value="">请选择项目</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
            </select>
          </div>
          <div>
            <label>分配给</label>
            <input v-model="newTask.assigned_to" placeholder="用户名" />
          </div>
          <div>
            <label>截止日期</label>
            <input type="datetime-local" v-model="newTask.due_date" />
          </div>
          <button type="submit">创建</button>
          <button type="button" @click="showCreateTask = false">取消</button>
        </form>
      </div>
  
      <ul>
        <li v-for="task in tasks" :key="task.id" class="task-item">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <p>状态: {{ task.status }}</p>
          <p>优先级: {{ task.priority }}</p>
          <p v-if="task.assigned_to">分配给: {{ task.assigned_to }}</p>
          <p v-if="task.due_date">截止日期: {{ formatDate(task.due_date) }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    name: 'TaskList',
    setup() {
      const tasks = ref([]);
      const projects = ref([]);
      const showCreateTask = ref(false);
      const newTask = ref({
        title: '',
        description: '',
        project: '',
        assigned_to: '',
        due_date: '',
      });
  
      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/tasks/');
          tasks.value = response.data;
        } catch (error) {
          console.error(error);
          alert('获取任务列表失败。');
        }
      };
  
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/projects/');
          projects.value = response.data;
        } catch (error) {
          console.error(error);
          alert('获取项目列表失败。');
        }
      };
  
      const createTask = async () => {
        try {
          await axios.post('http://localhost:8000/api/tasks/', {
            title: newTask.value.title,
            description: newTask.value.description,
            project_id: newTask.value.project,
            assigned_to: newTask.value.assigned_to || null,
            due_date: newTask.value.due_date || null,
          });
          showCreateTask.value = false;
          newTask.value = { title: '', description: '', project: '', assigned_to: '', due_date: '' };
          fetchTasks();
        } catch (error) {
          console.error(error);
          alert('创建任务失败。');
        }
      };
  
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
      };
  
      onMounted(() => {
        fetchTasks();
        fetchProjects();
      });
  
      return {
        tasks,
        projects,
        showCreateTask,
        newTask,
        fetchTasks,
        fetchProjects,
        createTask,
        formatDate,
      };
    },
  };
  </script>
  
  <style scoped>
  .task-list {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  .create-task {
    background-color: #f9f9f9;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
  }
  .create-task form div {
    margin-bottom: 10px;
  }
  .task-item {
    background-color: #ffffff;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  }
  </style>
  