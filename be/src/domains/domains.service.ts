import { Injectable } from '@nestjs/common';
import { DomainRepository } from './domain.repository';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(private readonly domainRepository: DomainRepository) { }

  /**
   *
   * @param createDomainDto object to create domain
   * @returns object save in the database
   */
  async create(createDomainDto: CreateDomainDto) {
    try {
      return await this.domainRepository.create(createDomainDto);
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @returns  array the domains to database
   */
  async findAll() {
    try {
      return await this.domainRepository.find({});
    } catch (error) {
      return [];
    }
  }

  /**
   *
   * @param link domain to search
   * @returns  one domains to database
   */
  async findOne(link: string) {
    try {
      return await this.domainRepository.find({
        domain: { $regex: link, $options: 'i' },
      });
    } catch (error) {
      return undefined;
    }
  }

  async find(id: string) {
    try {
      return await this.domainRepository.find({
        _id: id
      });
    } catch (err) {
      return undefined;
    }
  }

  /**
   *
   * @param updateDomainDto domain to update
   * @returns updated domain
   */
  async update(updateDomainDto: UpdateDomainDto) {
    try {
      return await this.domainRepository.findOneAndUpdate(
        { _id: updateDomainDto._id },

        updateDomainDto,
      );
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   * @param id domain to remove
   * @returns true or false as eliminated
   */
  async remove(id: string) {
    try {
      return await this.domainRepository.deleteMany({ _id: id });
    } catch (error) {
      return undefined;
    }
  }
}
