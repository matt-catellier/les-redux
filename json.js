{
  "EmlVersion":"0.1-alpha",
  "Solution":"Solution: Inventory and Sales",
  "Contexts":
  [{
    "Name": "Solution: Inventory and Sales",
    "Streams": [{
      "Stream": "Product",
      "Commands": [{
        "Command": {
          "Name": "AddProduct",
          "Parameters": [{"Name": "productId", "Type": "string", "Rules": ["IsRequired"]}, {
            "Name": "name",
            "Type": "string",
            "Rules": []
          }],
          "Postconditions": ["ProductAddedToCatalogue"]
        }
      }],
      "Events": [{
        "Event": {
          "Name": "ProductAddedToCatalogue",
          "Properties": [{"Name": "name", "Type": "string"}, {"Name": "productId", "Type": "string"}]
        }
      }]
    }, {
      "Stream": "InventoryItem",
      "Commands": [{
        "Command": {
          "Name": "ReceiveProduct",
          "Parameters": [{
            "Name": "productId",
            "Type": "string",
            "Rules": ["MustExistIn ProductLookup"]
          }, {"Name": "description", "Type": "string", "Rules": []}, {
            "Name": "inventoryitemId",
            "Type": "string",
            "Rules": ["IsRequired"]
          }],
          "Postconditions": ["InventoryItemStocked"]
        }
      }],
      "Events": [{
        "Event": {
          "Name": "InventoryItemStocked",
          "Properties": [{"Name": "inventoryitemId", "Type": "string"}, {
            "Name": "sku",
            "Type": "string"
          }, {"Name": "description", "Type": "string"}, {
            "Name": "purchasePrice",
            "Type": "string"
          }, {"Name": "quantityAvailable", "Type": "string"}]
        }
      }, {
        "Event": {
          "Name": "InventoryItemReduced",
          "Properties": [{"Name": "inventoryitemId", "Type": "string"}, {"Name": "quantity", "Type": "string"}]
        }
      }, {"Event": {"Name": "InventoryItemOutOfStock", "Properties": [{"Name": "inventoryitemId", "Type": "string"}]}}]
    }, {
      "Stream": "CatalogueItem",
      "Commands": [{
        "Command": {
          "Name": "AddCatalogueItem",
          "Parameters": [{
            "Name": "catalogueitemId",
            "Type": "string",
            "Rules": ["IsRequired"]
          }, {
            "Name": "inventoryitemId",
            "Type": "string",
            "Rules": ["MustExistIn InventoryitemLookup"]
          }, {"Name": "salesPrice", "Type": "string", "Rules": []}],
          "Postconditions": ["CatalogueItemAdded"]
        }
      }],
      "Events": [{
        "Event": {
          "Name": "CatalogueItemAdded",
          "Properties": [{"Name": "catalogueitemId", "Type": "string"}, {
            "Name": "inventoryitemId",
            "Type": "string"
          }, {"Name": "salesPrice", "Type": "string"}]
        }
      }]
    }, {
      "Stream": "Order",
      "Commands": [{
        "Command": {
          "Name": "CreateOrderorderDate",
          "Parameters": [{"Name": "orderId", "Type": "string", "Rules": ["IsRequired"]}],
          "Postconditions": ["OrderCreated"]
        }
      }, {
        "Command": {
          "Name": "PlaceOrder",
          "Parameters": [{"Name": "orderId", "Type": "string", "Rules": ["IsRequired"]}],
          "Postconditions": ["OrderPlaced"]
        }
      }],
      "Events": [{
        "Event": {
          "Name": "OrderCreated",
          "Properties": [{"Name": "orderId", "Type": "string"}, {"Name": "orderDate", "Type": "string"}]
        }
      }, {"Event": {"Name": "OrderPlaced", "Properties": [{"Name": "orderId", "Type": "string"}]}}]
    }, {
      "Stream": "OrderItem",
      "Commands": [{
        "Command": {
          "Name": "AddOrderItem",
          "Parameters": [{"Name": "orderitemId", "Type": "string", "Rules": ["IsRequired"]}, {
            "Name": "orderId",
            "Type": "string",
            "Rules": ["MustExistIn OrderLookup"]
          }, {
            "Name": "catalogueitemId",
            "Type": "string",
            "Rules": ["MustExistIn CatalogueitemLookup"]
          }, {"Name": "quantity", "Type": "string", "Rules": []}, {"Name": "price", "Type": "string", "Rules": []}],
          "Postconditions": ["OrderItemAdded"]
        }
      }],
      "Events": [{
        "Event": {
          "Name": "OrderItemAdded",
          "Properties": [{"Name": "orderitemId", "Type": "string"}, {
            "Name": "catalogueitemId",
            "Type": "string"
          }, {"Name": "quantity", "Type": "string"}, {"Name": "price", "Type": "string"}]
        }
      }]
    }],
    "Readmodels": [{
      "Readmodel": {
        "Name": "ProductLookup",
        "Key": "productId",
        "SubscribesTo": ["ProductAddedToCatalogue"]
      }
    }, {
      "Readmodel": {
        "Name": "InventoryitemLookup",
        "Key": "inventoryitemId",
        "SubscribesTo": ["InventoryItemStocked"]
      }
    }, {
      "Readmodel": {
        "Name": "CatalogueitemLookup",
        "Key": "catalogueitemId",
        "SubscribesTo": ["CatalogueItemAdded"]
      }
    }, {
      "Readmodel": {
        "Name": "OrderLookup",
        "Key": "orderId",
        "SubscribesTo": ["OrderCreated"]
      }
    }, {
      "Readmodel": {
        "Name": "OrderItemLookup",
        "Key": "orderitemId",
        "SubscribesTo": ["InventoryItemReduced", "OrderItemAdded"]
      }
    }]
  }], "Errors"
:
  []
}