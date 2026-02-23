import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { loggedIn, getClientId } from '../../signals/loginData';

interface Order {
  id: number;
  date: string;
  state: string;
  address: {
    street: string;
    city: string;
  };
  products: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

@Component({
  selector: 'app-myorders',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './myorders.html',
  styleUrls: ['./myorders.css'],
})
export class MyOrders implements OnInit {

  private http = inject(HttpClient);

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  private userId = getClientId(); // ID del usuario actual

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    if (!this.userId) {
      this.error.set('Usuario no identificado');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.http.get<{data: Order[]}>(`${environment.apiUrl}/orders/${this.userId}`)
      .subscribe({
        next: (response) => {
          this.orders.set(response.data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error cargando pedidos');
          this.loading.set(false);
        }
      });
  }

  getTotal(order: Order): number {
    return order.products.reduce((total, p) =>
      total + (p.price * p.quantity), 0);
  }

  hasOrders(): boolean {
    return this.orders().length > 0;
  }

  isLoading(): boolean {
    return this.loading();
  }

  hasError(): boolean {
    return !!this.error();
  }
}