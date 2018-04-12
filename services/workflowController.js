import Repository from "./repo";
import * as STORAGE_KEYS from "../localStorageKeys";
export default class WorkFlowController {
  constructor() {
    this.repo = new Repository();
  }

  findWhere(modelName, query) {
    return this.repo.findWhere(modelName, this._formatQuery(query));
  }

  findOne(modelName, query) {
    return this.repo.findOne(modelName, this._formatQuery(query));
  }

  create(modelName, data) {
    return this.repo.create(
      modelName,
      this._addSelectedAccountToRequestParams(data)
    );
  }

  execute(modelName, aggregateId, action, data) {
    return this.repo.execute(
      modelName,
      aggregateId,
      action,
      this._addSelectedAccountToRequestParams(data)
    );
  }

  async configureBTUMeterForNewAddress(locationId, group) {
    const addMeterAddress = await this.repo.execute(
      "location",
      null,
      "addMeterAddress",
      { locationId, group }
    );

    const addressId = addMeterAddress.addressId;
    const configureBTUMeter = await this.repo.execute(
      "btuMeter",
      null,
      "configure",
      { locationId, addressId }
    );

    const meterSerialNumber = configureBTUMeter.meterSerialNumber;
    const [meterAddress, btuMeter] = await Promise.all([
      this.findOne("meterAddress", { addressId }),
      this.findOne("btuMeter", { meterSerialNumber })
    ]);

    return { meterAddress, btuMeter };
  }

  _formatQuery(query) {
    if (query && query.where) return { where: query.where, limit: 500};
    return { where: query, limit: 500 };
  }

  _addSelectedAccountToRequestParams(data) {
    const accountId = localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT);
    return { ...data, accountId: accountId };
  }

  printInvoice(query) {
    return this.repo.getPdf('invoice', 'print', query);
  }
}
