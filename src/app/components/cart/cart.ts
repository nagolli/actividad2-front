import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

import { CartItem } from './cart-item.models';
import { CartService } from './cart.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, CardModule, AvatarModule]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  email = '';
  addressId!: number;
  protected message = signal<string>('');
  // Para evitar varios clicks...
  processing = signal(false);

  constructor(
    public cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.items = this.cartService.items();
  }

  onQuantityChange(id: number, quantity: any) {
    const qty = +quantity;
    this.cartService.updateQuantity(id, qty);
    this.loadItems();
  }

  remove(id: number) {
    this.cartService.removeProduct(id);
    this.loadItems();
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  checkout() {
  if (!this.email || !this.addressId || this.items.length === 0) {
    alert('Debes completar email, dirección y tener al menos un producto.');
    return;
  }

  // Si esta procesando algo anterior volver...
  if (this.processing()) return;

  this.processing.set(true);

  this.orderService.createOrder(this.email, this.addressId, this.items).subscribe({
    next: res => {
      console.log('Pedido creado', res);
      this.cartService.clearCart(); // vaciar carrito
      //this.items = []; // actualizar UI
      this.message.set(`Se realizo el pedido`)
      // Quitar mensaje en 3 segundos...
      setTimeout(() => this.message.set(''), 3000);
    },
    error: err => {
      if (err.status === 422) {
        console.error('Errores de validación', err.error.errors);
      } else {
        console.error('Error al crear pedido', err);
      }
    },
      complete: () => {
        this.processing.set(false);
      }
  });
}
}
