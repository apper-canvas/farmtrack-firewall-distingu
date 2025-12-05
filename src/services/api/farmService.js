import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const farmService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('farm_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "total_area_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "field_count_c"}},
          {"field": {"Name": "active_crops_c"}}
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
        location: item.location_c,
        totalArea: item.total_area_c,
        soilType: item.soil_type_c,
        fieldCount: item.field_count_c || 0,
        activeCrops: item.active_crops_c || 0
      }));
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('farm_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "total_area_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "field_count_c"}},
          {"field": {"Name": "active_crops_c"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Farm not found");
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        location: item.location_c,
        totalArea: item.total_area_c,
        soilType: item.soil_type_c,
        fieldCount: item.field_count_c || 0,
        activeCrops: item.active_crops_c || 0
      };
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: farmData.name,
          location_c: farmData.location,
          total_area_c: farmData.totalArea,
          soil_type_c: farmData.soilType,
          field_count_c: farmData.fieldCount || 0,
          active_crops_c: farmData.activeCrops || 0
        }]
      };

      const response = await apperClient.createRecord('farm_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newFarm = successful[0].data;
          return {
            Id: newFarm.Id,
            name: newFarm.Name,
            location: newFarm.location_c,
            totalArea: newFarm.total_area_c,
            soilType: newFarm.soil_type_c,
            fieldCount: newFarm.field_count_c || 0,
            activeCrops: newFarm.active_crops_c || 0
          };
        }
      }

      throw new Error("Failed to create farm");
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name,
          location_c: farmData.location,
          total_area_c: farmData.totalArea,
          soil_type_c: farmData.soilType,
          field_count_c: farmData.fieldCount || 0,
          active_crops_c: farmData.activeCrops || 0
        }]
      };

      const response = await apperClient.updateRecord('farm_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedFarm = successful[0].data;
          return {
            Id: updatedFarm.Id,
            name: updatedFarm.Name,
            location: updatedFarm.location_c,
            totalArea: updatedFarm.total_area_c,
            soilType: updatedFarm.soil_type_c,
            fieldCount: updatedFarm.field_count_c || 0,
            activeCrops: updatedFarm.active_crops_c || 0
          };
        }
      }

      throw new Error("Failed to update farm");
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('farm_c', {
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
          console.error(`Failed to delete ${failed.length} farms:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      return false;
    }
  }
};