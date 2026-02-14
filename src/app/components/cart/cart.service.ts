import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from './cart-item.models';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _items = signal<CartItem[]>([]);

  items = computed(() => this._items());

  total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addProduct(product: CartItem) {
    const current = this._items();
    const index = current.findIndex(p => p.id === product.id);

    if (index >= 0) {
      current[index].quantity += 1;
    } else {
      current.push({ ...product, quantity: 1 });
    }

    this._items.set([...current]);
    localStorage.setItem('cart', JSON.stringify(this._items()));
  }

  removeProduct(id: number) {
    const filtered = this._items().filter(p => p.id !== id);
    this._items.set(filtered);
    localStorage.setItem('cart', JSON.stringify(filtered));
  }

  clearCart() {
    this._items.set([]);
    localStorage.removeItem('cart');
  }

  updateQuantity(id: number, quantity: number) {
    const current = this._items();
    const index = current.findIndex(p => p.id === id);

    if (index >= 0) {
      current[index].quantity = quantity;
      if (quantity <= 0) {
        current.splice(index, 1);
      }
      this._items.set([...current]);
      localStorage.setItem('cart', JSON.stringify(this._items()));
    }
  }

  loadFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this._items.set(JSON.parse(saved));
    }
  }
}
