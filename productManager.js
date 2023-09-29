const fs = require('fs/promises');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newProduct = {
        ...product,
        id: this.generateId(products),
      };
      products.push(newProduct);
      await this.saveProducts(products);
      return newProduct;
    } catch (error) {
      throw new Error('Error adding product: ' + error.message);
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === id);
    } catch (error) {
      throw new Error('Error getting product by ID: ' + error.message);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index] = { ...updatedProduct, id }; 
        await this.saveProducts(products);
        return products[index];
      }
      throw new Error('Product not found');
    } catch (error) {
      throw new Error('Error updating product: ' + error.message);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        await this.saveProducts(products);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw new Error('Error deleting product: ' + error.message);
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      throw new Error('Error saving products: ' + error.message);
    }
  }

  generateId(products) {
    const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }
}

// Ejemplo:
const productManager = new ProductManager('products.json');

(async () => {
  try {
    await productManager.addProduct({
      title: 'Product 1',
      description: 'Description for Product 1',
      price: 19.99,
      thumbnail: 'product1.jpg',
      code: 'P1',
      stock: 100,
    });

    const product = await productManager.getProductById(1);
    console.log('Product:', product);

    await productManager.updateProduct(1, {
      title: 'Updated Product 1',
      description: 'Updated Description',
      price: 24.99,
      thumbnail: 'updated.jpg',
      code: 'UP1',
      stock: 50,
    });

    await productManager.deleteProduct(1);
  } catch (error) {
    console.error(error.message);
  }
})();
