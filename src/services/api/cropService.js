import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const cropService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "field_id_c"}}
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
        variety: item.variety_c,
        fieldId: item.field_id_c?.Id || item.field_id_c,
        plantingDate: item.planting_date_c,
        expectedHarvestDate: item.expected_harvest_date_c,
        status: item.status_c,
        notes: item.notes_c
      }));
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByFieldId(fieldId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "field_id_c"}}
        ],
        where: [{
          "FieldName": "field_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(fieldId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        variety: item.variety_c,
        fieldId: item.field_id_c?.Id || item.field_id_c,
        plantingDate: item.planting_date_c,
        expectedHarvestDate: item.expected_harvest_date_c,
        status: item.status_c,
        notes: item.notes_c
      }));
    } catch (error) {
      console.error("Error fetching crops by field:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('crop_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "expected_harvest_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "field_id_c"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Crop not found");
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        variety: item.variety_c,
        fieldId: item.field_id_c?.Id || item.field_id_c,
        plantingDate: item.planting_date_c,
        expectedHarvestDate: item.expected_harvest_date_c,
        status: item.status_c,
        notes: item.notes_c
      };
    } catch (error) {
      console.error(`Error fetching crop ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: cropData.name,
          variety_c: cropData.variety,
          field_id_c: parseInt(cropData.fieldId),
          planting_date_c: cropData.plantingDate,
          expected_harvest_date_c: cropData.expectedHarvestDate,
          status_c: cropData.status || "planted",
          notes_c: cropData.notes
        }]
      };

      const response = await apperClient.createRecord('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newCrop = successful[0].data;
          return {
            Id: newCrop.Id,
            name: newCrop.Name,
            variety: newCrop.variety_c,
            fieldId: newCrop.field_id_c?.Id || newCrop.field_id_c,
            plantingDate: newCrop.planting_date_c,
            expectedHarvestDate: newCrop.expected_harvest_date_c,
            status: newCrop.status_c,
            notes: newCrop.notes_c
          };
        }
      }

      throw new Error("Failed to create crop");
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.name,
          variety_c: cropData.variety,
          field_id_c: parseInt(cropData.fieldId),
          planting_date_c: cropData.plantingDate,
          expected_harvest_date_c: cropData.expectedHarvestDate,
          status_c: cropData.status,
          notes_c: cropData.notes
        }]
      };

      const response = await apperClient.updateRecord('crop_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedCrop = successful[0].data;
          return {
            Id: updatedCrop.Id,
            name: updatedCrop.Name,
            variety: updatedCrop.variety_c,
            fieldId: updatedCrop.field_id_c?.Id || updatedCrop.field_id_c,
            plantingDate: updatedCrop.planting_date_c,
            expectedHarvestDate: updatedCrop.expected_harvest_date_c,
            status: updatedCrop.status_c,
            notes: updatedCrop.notes_c
          };
        }
      }

      throw new Error("Failed to update crop");
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('crop_c', {
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
          console.error(`Failed to delete ${failed.length} crops:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

return true;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      return false;
    }
  }
};