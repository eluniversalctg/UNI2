/*
                    This file is an Generic Crud for MONGODB
*/
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}
  async find(
    entityFilterQuery: FilterQuery<T>,
    populateQuery?: string,
  ): Promise<T[] | null> {
    if (populateQuery) {
      return this.entityModel.find(entityFilterQuery).populate(populateQuery);
    } else {
      return this.entityModel.find(entityFilterQuery);
    }
  }

  async findOne(
    entityFilterQuery: FilterQuery<T>,
    projection?: Record<string, unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOne(entityFilterQuery, {
      __v: 0,
      ...projection,
    });
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }

  async updateMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
    try {
      for (let i = 0; i < entityFilterQuery.length; i++) {
        const updateResult = await this.entityModel.findOneAndUpdate(
          { _id: entityFilterQuery[i]._id },
          entityFilterQuery[i],
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );
      }
      return true;
    } catch (error) {
      return undefined;
    }
  }

  async createMany(createEntityData: T[]): Promise<T[]> {
    return await this.entityModel.insertMany(createEntityData);
  }
}
