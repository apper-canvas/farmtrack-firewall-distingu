import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const equipmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('equipment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "notes_c"}}
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
        type: item.type_c,
        brand: item.brand_c,
        model: item.model_c,
        purchaseDate: item.purchase_date_c,
        status: item.status_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        cost: item.cost_c,
        notes: item.notes_c
      }));
    } catch (error) {
      console.error("Error fetching equipment:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('equipment_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error('Equipment not found');
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        type: item.type_c,
        brand: item.brand_c,
        model: item.model_c,
        purchaseDate: item.purchase_date_c,
        status: item.status_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        cost: item.cost_c,
        notes: item.notes_c
      };
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(equipmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: equipmentData.name,
          type_c: equipmentData.type,
          brand_c: equipmentData.brand,
          model_c: equipmentData.model,
          purchase_date_c: equipmentData.purchaseDate,
          status_c: equipmentData.status || "operational",
          last_maintenance_c: equipmentData.lastMaintenance,
          next_maintenance_c: equipmentData.nextMaintenance,
          cost_c: equipmentData.cost,
          notes_c: equipmentData.notes
        }]
      };

      const response = await apperClient.createRecord('equipment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} equipment:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newEquipment = successful[0].data;
          toast.success('Equipment added successfully');
          return {
            Id: newEquipment.Id,
            name: newEquipment.Name,
            type: newEquipment.type_c,
            brand: newEquipment.brand_c,
            model: newEquipment.model_c,
            purchaseDate: newEquipment.purchase_date_c,
            status: newEquipment.status_c,
            lastMaintenance: newEquipment.last_maintenance_c,
            nextMaintenance: newEquipment.next_maintenance_c,
            cost: newEquipment.cost_c,
            notes: newEquipment.notes_c
          };
        }
      }

      throw new Error("Failed to create equipment");
    } catch (error) {
      console.error("Error creating equipment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, equipmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: equipmentData.name,
          type_c: equipmentData.type,
          brand_c: equipmentData.brand,
          model_c: equipmentData.model,
          purchase_date_c: equipmentData.purchaseDate,
          status_c: equipmentData.status,
          last_maintenance_c: equipmentData.lastMaintenance,
          next_maintenance_c: equipmentData.nextMaintenance,
          cost_c: equipmentData.cost,
          notes_c: equipmentData.notes
        }]
      };

      const response = await apperClient.updateRecord('equipment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} equipment:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedEquipment = successful[0].data;
          toast.success('Equipment updated successfully');
          return {
            Id: updatedEquipment.Id,
            name: updatedEquipment.Name,
            type: updatedEquipment.type_c,
            brand: updatedEquipment.brand_c,
            model: updatedEquipment.model_c,
            purchaseDate: updatedEquipment.purchase_date_c,
            status: updatedEquipment.status_c,
            lastMaintenance: updatedEquipment.last_maintenance_c,
            nextMaintenance: updatedEquipment.next_maintenance_c,
            cost: updatedEquipment.cost_c,
            notes: updatedEquipment.notes_c
          };
        }
      }

      throw new Error("Failed to update equipment");
    } catch (error) {
      console.error("Error updating equipment:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('equipment_c', {
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
          console.error(`Failed to delete ${failed.length} equipment:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Equipment deleted successfully');
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting equipment:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('equipment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        type: item.type_c,
        brand: item.brand_c,
        model: item.model_c,
        purchaseDate: item.purchase_date_c,
        status: item.status_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        cost: item.cost_c,
        notes: item.notes_c
      }));
    } catch (error) {
      console.error("Error fetching equipment by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getDueForMaintenance() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Get current date + 30 days for maintenance due check
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const response = await apperClient.fetchRecords('equipment_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "brand_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "purchase_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "cost_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{
          "FieldName": "next_maintenance_c",
          "Operator": "LessThanOrEqualTo",
          "Values": [thirtyDaysFromNow.toISOString().split('T')[0]]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        type: item.type_c,
        brand: item.brand_c,
        model: item.model_c,
        purchaseDate: item.purchase_date_c,
        status: item.status_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        cost: item.cost_c,
        notes: item.notes_c
      }));
    } catch (error) {
      console.error("Error fetching equipment due for maintenance:", error?.response?.data?.message || error);
      return [];
    }
  }
};