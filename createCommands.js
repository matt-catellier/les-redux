var WorkFlowController = require('./services/workflowController')
var workFlowController = new WorkFlowController()

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
