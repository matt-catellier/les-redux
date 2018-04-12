function addProduct(productId ,name) {
    return {
        type : "ADDPRODUCT",
        payload: { productId ,name }
    }
  }
  