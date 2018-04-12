function addVegetableToInventory(vegetableId ,name) {
    return {
        type : "ADDVEGETABLETOINVENTORY",
        payload: { vegetableId ,name }
    }
  }
  ,function releaseVegetable(vegetableId ,amount) {
    return {
        type : "RELEASEVEGETABLE",
        payload: { vegetableId ,amount }
    }
  }
  ,function removeVegetableFromInventroy(vegetableId) {
    return {
        type : "REMOVEVEGETABLEFROMINVENTROY",
        payload: { vegetableId }
    }
  }
  