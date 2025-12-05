import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const laborService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('labor_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "hourly_rate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "total_hours_worked_c"}},
          {"field": {"Name": "current_tasks_c"}},
          {"field": {"Name": "certifications_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        role: item.role_c,
        email: item.email_c,
        phone: item.phone_c,
        hourlyRate: item.hourly_rate_c,
        status: item.status_c,
        skills: item.skills_c ? item.skills_c.split(',').map(s => s.trim()) : [],
        hireDate: item.hire_date_c,
        totalHoursWorked: item.total_hours_worked_c,
        currentTasks: item.current_tasks_c ? item.current_tasks_c.split(',').map(s => s.trim()) : [],
        certifications: item.certifications_c ? item.certifications_c.split(',').map(s => s.trim()) : [],
        emergencyContact: item.emergency_contact_c ? {
          name: item.emergency_contact_c.split(' - ')[0] || '',
          phone: item.emergency_contact_c.split(' - ')[1] || ''
        } : { name: '', phone: '' }
      }));
    } catch (error) {
      console.error("Error fetching labors:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('labor_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "hourly_rate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "total_hours_worked_c"}},
          {"field": {"Name": "current_tasks_c"}},
          {"field": {"Name": "certifications_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ]
      });

      if (!response.success || !response.data) {
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        role: item.role_c,
        email: item.email_c,
        phone: item.phone_c,
        hourlyRate: item.hourly_rate_c,
        status: item.status_c,
        skills: item.skills_c ? item.skills_c.split(',').map(s => s.trim()) : [],
        hireDate: item.hire_date_c,
        totalHoursWorked: item.total_hours_worked_c,
        currentTasks: item.current_tasks_c ? item.current_tasks_c.split(',').map(s => s.trim()) : [],
        certifications: item.certifications_c ? item.certifications_c.split(',').map(s => s.trim()) : [],
        emergencyContact: item.emergency_contact_c ? {
          name: item.emergency_contact_c.split(' - ')[0] || '',
          phone: item.emergency_contact_c.split(' - ')[1] || ''
        } : { name: '', phone: '' }
      };
    } catch (error) {
      console.error(`Error fetching labor ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(laborData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const emergencyContactStr = laborData.emergencyContact?.name || laborData.emergencyContact?.phone 
        ? `${laborData.emergencyContact.name} - ${laborData.emergencyContact.phone}` 
        : '';

      const params = {
        records: [{
          Name: laborData.name,
          role_c: laborData.role,
          email_c: laborData.email,
          phone_c: laborData.phone,
          hourly_rate_c: laborData.hourlyRate,
          status_c: laborData.status || "available",
          skills_c: Array.isArray(laborData.skills) ? laborData.skills.join(', ') : laborData.skills,
          hire_date_c: laborData.hireDate,
          total_hours_worked_c: laborData.totalHoursWorked || 0,
          current_tasks_c: Array.isArray(laborData.currentTasks) ? laborData.currentTasks.join(', ') : laborData.currentTasks,
          certifications_c: Array.isArray(laborData.certifications) ? laborData.certifications.join(', ') : laborData.certifications,
          emergency_contact_c: emergencyContactStr
        }]
      };

      const response = await apperClient.createRecord('labor_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} labor records:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newLabor = successful[0].data;
          return {
            Id: newLabor.Id,
            name: newLabor.Name,
            role: newLabor.role_c,
            email: newLabor.email_c,
            phone: newLabor.phone_c,
            hourlyRate: newLabor.hourly_rate_c,
            status: newLabor.status_c,
            skills: newLabor.skills_c ? newLabor.skills_c.split(',').map(s => s.trim()) : [],
            hireDate: newLabor.hire_date_c,
            totalHoursWorked: newLabor.total_hours_worked_c,
            currentTasks: newLabor.current_tasks_c ? newLabor.current_tasks_c.split(',').map(s => s.trim()) : [],
            certifications: newLabor.certifications_c ? newLabor.certifications_c.split(',').map(s => s.trim()) : [],
            emergencyContact: newLabor.emergency_contact_c ? {
              name: newLabor.emergency_contact_c.split(' - ')[0] || '',
              phone: newLabor.emergency_contact_c.split(' - ')[1] || ''
            } : { name: '', phone: '' }
          };
        }
      }

      throw new Error("Failed to create labor record");
    } catch (error) {
      console.error("Error creating labor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, laborData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const emergencyContactStr = laborData.emergencyContact?.name || laborData.emergencyContact?.phone 
        ? `${laborData.emergencyContact.name} - ${laborData.emergencyContact.phone}` 
        : '';

      const params = {
        records: [{
          Id: parseInt(id),
          Name: laborData.name,
          role_c: laborData.role,
          email_c: laborData.email,
          phone_c: laborData.phone,
          hourly_rate_c: laborData.hourlyRate,
          status_c: laborData.status,
          skills_c: Array.isArray(laborData.skills) ? laborData.skills.join(', ') : laborData.skills,
          hire_date_c: laborData.hireDate,
          total_hours_worked_c: laborData.totalHoursWorked || 0,
          current_tasks_c: Array.isArray(laborData.currentTasks) ? laborData.currentTasks.join(', ') : laborData.currentTasks,
          certifications_c: Array.isArray(laborData.certifications) ? laborData.certifications.join(', ') : laborData.certifications,
          emergency_contact_c: emergencyContactStr
        }]
      };

      const response = await apperClient.updateRecord('labor_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} labor records:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedLabor = successful[0].data;
          return {
            Id: updatedLabor.Id,
            name: updatedLabor.Name,
            role: updatedLabor.role_c,
            email: updatedLabor.email_c,
            phone: updatedLabor.phone_c,
            hourlyRate: updatedLabor.hourly_rate_c,
            status: updatedLabor.status_c,
            skills: updatedLabor.skills_c ? updatedLabor.skills_c.split(',').map(s => s.trim()) : [],
            hireDate: updatedLabor.hire_date_c,
            totalHoursWorked: updatedLabor.total_hours_worked_c,
            currentTasks: updatedLabor.current_tasks_c ? updatedLabor.current_tasks_c.split(',').map(s => s.trim()) : [],
            certifications: updatedLabor.certifications_c ? updatedLabor.certifications_c.split(',').map(s => s.trim()) : [],
            emergencyContact: updatedLabor.emergency_contact_c ? {
              name: updatedLabor.emergency_contact_c.split(' - ')[0] || '',
              phone: updatedLabor.emergency_contact_c.split(' - ')[1] || ''
            } : { name: '', phone: '' }
          };
        }
      }

      throw new Error("Failed to update labor record");
    } catch (error) {
      console.error("Error updating labor:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('labor_c', {
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
          console.error(`Failed to delete ${failed.length} labor records:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting labor:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByRole(role) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('labor_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "hourly_rate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "total_hours_worked_c"}},
          {"field": {"Name": "current_tasks_c"}},
          {"field": {"Name": "certifications_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ],
        where: [{
          "FieldName": "role_c",
          "Operator": "Contains",
          "Values": [role]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        role: item.role_c,
        email: item.email_c,
        phone: item.phone_c,
        hourlyRate: item.hourly_rate_c,
        status: item.status_c,
        skills: item.skills_c ? item.skills_c.split(',').map(s => s.trim()) : [],
        hireDate: item.hire_date_c,
        totalHoursWorked: item.total_hours_worked_c,
        currentTasks: item.current_tasks_c ? item.current_tasks_c.split(',').map(s => s.trim()) : [],
        certifications: item.certifications_c ? item.certifications_c.split(',').map(s => s.trim()) : [],
        emergencyContact: item.emergency_contact_c ? {
          name: item.emergency_contact_c.split(' - ')[0] || '',
          phone: item.emergency_contact_c.split(' - ')[1] || ''
        } : { name: '', phone: '' }
      }));
    } catch (error) {
      console.error("Error fetching labors by role:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getAvailableWorkers() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('labor_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "hourly_rate_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "skills_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "total_hours_worked_c"}},
          {"field": {"Name": "current_tasks_c"}},
          {"field": {"Name": "certifications_c"}},
          {"field": {"Name": "emergency_contact_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": ["available"]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        role: item.role_c,
        email: item.email_c,
        phone: item.phone_c,
        hourlyRate: item.hourly_rate_c,
        status: item.status_c,
        skills: item.skills_c ? item.skills_c.split(',').map(s => s.trim()) : [],
        hireDate: item.hire_date_c,
        totalHoursWorked: item.total_hours_worked_c,
        currentTasks: item.current_tasks_c ? item.current_tasks_c.split(',').map(s => s.trim()) : [],
        certifications: item.certifications_c ? item.certifications_c.split(',').map(s => s.trim()) : [],
        emergencyContact: item.emergency_contact_c ? {
          name: item.emergency_contact_c.split(' - ')[0] || '',
          phone: item.emergency_contact_c.split(' - ')[1] || ''
        } : { name: '', phone: '' }
      }));
    } catch (error) {
      console.error("Error fetching available workers:", error?.response?.data?.message || error);
      return [];
    }
  }
};