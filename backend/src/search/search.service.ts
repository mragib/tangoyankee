import { Injectable } from '@nestjs/common';
import MeiliSearch from 'meilisearch';

import { AttributeService } from 'src/attribute/attribute.service';
import { CustomerService } from 'src/customer/customer.service';
import { PurchaseService } from 'src/purchase/purchase.service';
import { SalesService } from 'src/sales/sales.service';
import { SupplierService } from 'src/supplier/supplier.service';

@Injectable()
export class SearchService {
  // private client: MeiliSearch;
  private client = new MeiliSearch({
    host: `${process.env.BACKEND_URL}:${process.env.SEARCH_SERVER_PORT}`,
  });
  constructor(
    private readonly attributeService: AttributeService,
    private readonly customerService: CustomerService,
    private readonly saleService: SalesService,
    private readonly purchaseService: PurchaseService,
    private readonly supplierService: SupplierService,
  ) {
    // this.initMeiliSearch();
  }

  private async initMeiliSearch() {
    const products = await this.attributeService.findAllForSearch();
    const sales = await this.saleService.findAllForSearch();
    const customers = await this.customerService.findAllForSearch();
    const purchases = await this.purchaseService.findAllForSearch();
    const suppliers = await this.supplierService.findAllForSearch();

    const data = [
      ...products.map((item) => ({ ...item, type: 'products' })),
      ...customers.map((item) => ({ ...item, type: 'customers' })),
      ...sales.map((item) => ({ ...item, type: 'sales' })),
      ...purchases.map((item) => ({ ...item, type: 'purchases' })),
      ...suppliers.map((item) => ({ ...item, type: 'suppliers' })),
    ];

    const index = this.client.index('global_search');
    index.update({ primaryKey: 'id' });
    await index.addDocuments(data);
  }

  public async search(query: string) {
    const index = this.client.index('global_search');
    const results = await index.search(query, {
      attributesToHighlight: ['*'],
    });
    return results.hits;
  }
}
