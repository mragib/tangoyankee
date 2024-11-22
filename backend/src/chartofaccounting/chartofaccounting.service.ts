import { Injectable } from '@nestjs/common';

import { AbstractService } from 'src/common/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Chartofaccounting } from './entities/chartofaccounting.entity';
import { TreeRepository } from 'typeorm';
import * as fs from 'fs';
import * as csv from 'csv-parser';

@Injectable()
export class ChartofaccountingService extends AbstractService {
  constructor(
    @InjectRepository(Chartofaccounting)
    private readonly chartOfAccountingRepository: TreeRepository<Chartofaccounting>,
  ) {
    super(chartOfAccountingRepository);
  }

  async findAll(): Promise<any[]> {
    return await this.chartOfAccountingRepository.find({
      relations: { parent: true },
      order: { code: 'ASC' },
    });
  }

  async findOneWithDescendants(chartOfAccount: Chartofaccounting) {
    return this.chartOfAccountingRepository.findDescendants(chartOfAccount);
  }

  async calculate() {
    const results = await this.chartOfAccountingRepository
      .createQueryBuilder('gl')
      .select('gl.gl_type', 'gl_type')
      .addSelect('SUM(gl.dr_amount)', 'totalDebitAmount')
      .addSelect('SUM(gl.cr_amount)', 'totalCreditAmount')
      .groupBy('gl.gl_type')
      .getRawMany();
    return results;
  }

  async parseCsvAndInsertData(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const results = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const formattedData = {
            ...data,
            is_leaf: data.is_leaf === '1', // Convert to boolean
            parent: { id: Number(data.parentId) || null }, // Convert to number if necessary
          };
          results.push(formattedData);
        })
        .on('end', async () => {
          try {
            // Insert data into the database
            await this.chartOfAccountingRepository.save(results);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
    });
  }
}
