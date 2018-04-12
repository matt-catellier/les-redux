var WorkFlowController = require('./services/workflowController')
var workFlowController = new WorkFlowController()

const fetchAllproductLookupAPI = async () => await workFlowController.findWhere("productLookup", {}) 
const fetchAllinventoryitemLookupAPI = async () => await workFlowController.findWhere("inventoryitemLookup", {}) 
const fetchAllcatalogueitemLookupAPI = async () => await workFlowController.findWhere("catalogueitemLookup", {}) 
const fetchAllorderLookupAPI = async () => await workFlowController.findWhere("orderLookup", {}) 
const fetchAllorderItemLookupAPI = async () => await workFlowController.findWhere("orderItemLookup", {}) 

const fetchproductLookupAPI = async productId => await workFlowController.findOne("productLookup", {productId}) 
const fetchinventoryitemLookupAPI = async inventoryitemId => await workFlowController.findOne("inventoryitemLookup", {inventoryitemId}) 
const fetchcatalogueitemLookupAPI = async catalogueitemId => await workFlowController.findOne("catalogueitemLookup", {catalogueitemId}) 
const fetchorderLookupAPI = async orderId => await workFlowController.findOne("orderLookup", {orderId}) 
const fetchorderItemLookupAPI = async orderitemId => await workFlowController.findOne("orderItemLookup", {orderitemId}) 

const createProductAPI = async (productId, name) => await workFlowController.create("product", {productId, name})
const createProduct = async (productId, name) => {
  try {
    const handledCommand = await createProductAPI(productId, name)
    const entity = await fetchProductAPI(handledCommand.productId)
    return entity
  } catch (err) {
    throw(err)
  }
}
