import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const fieldService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('field_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "farm_id_c"}}
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
        size: item.area_c,
        coordinates: item.coordinates_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error("Error fetching fields:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('field_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{
          "FieldName": "farm_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        size: item.area_c,
        coordinates: item.coordinates_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error("Error fetching fields by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('field_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "area_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Field not found");
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        size: item.area_c,
        coordinates: item.coordinates_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      };
    } catch (error) {
      console.error(`Error fetching field ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(fieldData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: fieldData.name,
          area_c: fieldData.size,
          coordinates_c: fieldData.coordinates,
          farm_id_c: parseInt(fieldData.farmId)
        }]
      };

      const response = await apperClient.createRecord('field_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} fields:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newField = successful[0].data;
          return {
            Id: newField.Id,
            name: newField.Name,
            size: newField.area_c,
            coordinates: newField.coordinates_c,
            farmId: newField.farm_id_c?.Id || newField.farm_id_c
          };
        }
      }

      throw new Error("Failed to create field");
    } catch (error) {
      console.error("Error creating field:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, fieldData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: fieldData.name,
          area_c: fieldData.size,
          coordinates_c: fieldData.coordinates,
          farm_id_c: parseInt(fieldData.farmId)
        }]
      };

      const response = await apperClient.updateRecord('field_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} fields:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedField = successful[0].data;
          return {
            Id: updatedField.Id,
            name: updatedField.Name,
            size: updatedField.area_c,
            coordinates: updatedField.coordinates_c,
            farmId: updatedField.farm_id_c?.Id || updatedField.farm_id_c
          };
        }
      }

      throw new Error("Failed to update field");
    } catch (error) {
      console.error("Error updating field:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('field_c', {
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
          console.error(`Failed to delete ${failed.length} fields:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting field:", error?.response?.data?.message || error);
      return false;
    }
  }
};