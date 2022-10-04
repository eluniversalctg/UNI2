import { Injectable } from '@nestjs/common';
import { Page } from './entities/page.entity';
import { PageRepository } from './pages.repository';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly pageRepository: PageRepository) {}

  /**
   * save to database page
   */
  async create(createPageDto: CreatePageDto): Promise<Page | undefined> {
    try {
      return await this.pageRepository.create(createPageDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   * get all to database page
   */
  async findAll(): Promise<Page[]> {
    try {
      return await this.pageRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   * get all to database page
   */
  async findAllReplace(): Promise<Page[]> {
    try {
      const response = await new Promise<any[]>((resolve) => {
        resolve(this.pageRepository.find({}));
      });
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      return [];
    }
  }

  /**
   * get to database one page
   */

  async findOne(id: string): Promise<Page | undefined> {
    try {
      return await this.pageRepository.findOne({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update page
   */
  async update(updatePageDto: UpdatePageDto): Promise<Page | undefined> {
    try {
      return await this.pageRepository.findOneAndUpdate(
        { _id: updatePageDto._id },
        updatePageDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   * delete to database page
   */
  async remove(id: string): Promise<boolean> {
    try {
      return await this.pageRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }

  /**
   * update Many pages
   */
  async updateMany(updatePageDto: UpdatePageDto): Promise<boolean | undefined> {
    try {
      return await this.pageRepository.updateMany(updatePageDto);
    } catch (error) {
      return undefined;
    }
  }
}
