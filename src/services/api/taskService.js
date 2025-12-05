import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c,
        cropId: item.crop_id_c?.Id || item.crop_id_c,
        createdAt: item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCropId(cropId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "crop_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(cropId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c,
        cropId: item.crop_id_c?.Id || item.crop_id_c,
        createdAt: item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching tasks by crop:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('task_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "crop_id_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Task not found");
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c,
        cropId: item.crop_id_c?.Id || item.crop_id_c,
        createdAt: item.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority || "medium",
          completed_c: false,
          crop_id_c: parseInt(taskData.cropId)
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newTask = successful[0].data;
          return {
            Id: newTask.Id,
            name: newTask.Name,
            title: newTask.title_c,
            description: newTask.description_c,
            dueDate: newTask.due_date_c,
            priority: newTask.priority_c,
            completed: newTask.completed_c,
            cropId: newTask.crop_id_c?.Id || newTask.crop_id_c,
            createdAt: newTask.CreatedOn
          };
        }
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: taskData.completed,
          crop_id_c: parseInt(taskData.cropId)
        }]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTask = successful[0].data;
          return {
            Id: updatedTask.Id,
            name: updatedTask.Name,
            title: updatedTask.title_c,
            description: updatedTask.description_c,
            dueDate: updatedTask.due_date_c,
            priority: updatedTask.priority_c,
            completed: updatedTask.completed_c,
            cropId: updatedTask.crop_id_c?.Id || updatedTask.crop_id_c,
            createdAt: updatedTask.CreatedOn
          };
        }
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async complete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          completed_c: true
        }]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to complete ${failed.length} tasks:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const completedTask = successful[0].data;
          return {
            Id: completedTask.Id,
            name: completedTask.Name,
            title: completedTask.title_c,
            description: completedTask.description_c,
            dueDate: completedTask.due_date_c,
            priority: completedTask.priority_c,
            completed: true,
            cropId: completedTask.crop_id_c?.Id || completedTask.crop_id_c,
            createdAt: completedTask.CreatedOn,
            completedAt: new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to complete task");
    } catch (error) {
      console.error("Error completing task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('task_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
};